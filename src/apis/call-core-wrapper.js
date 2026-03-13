/**
 * Call-Core API Wrapper for callmaskv3
 * Provides compatibility layer between call-core-lib and legacy call-lib API
 */

import EventEmitter from 'events';

// CallCore is loaded as a global variable via script-loader
const { WebSocketClient, RpcClient, Wallet, parseBalanceChanges } = window.CallCore || {};

const S3_URL = 'wss://s3.callchain.cc:443';

/**
 * CallAPI - WebSocket-based API client compatible with legacy call-lib API
 */
export class CallAPI extends EventEmitter {
  constructor(options = {}) {
    super();
    this.server = options.server || S3_URL;
    this.wsClient = null;
    this.rpcClient = null;
    this._isConnected = false;
    this._ledgerVersion = 0;
  }

  /**
   * Connect to the Call-Core server
   */
  async connect() {
    if (this._isConnected) return;

    // Create WebSocket client
    this.wsClient = new WebSocketClient({
      url: this.server,
      reconnect: true,
      reconnectDelay: 5000,
      maxReconnectAttempts: 10,
    });

    // Set up event handlers
    this.wsClient.ws.onopen = () => {
      this._isConnected = true;
      this.emit('connected');
    };

    this.wsClient.ws.onclose = () => {
      this._isConnected = false;
      this.emit('disconnected');
    };

    this.wsClient.ws.onerror = (error) => {
      this.emit('error', 'websocket', error.message);
    };

    await this.wsClient.connect();

    // Subscribe to ledger stream
    this.wsClient.onLedger((message) => {
      this._ledgerVersion = message.ledger_index;
      this.emit('ledger', this._formatLedger(message));
    });

    // Subscribe to transaction stream
    this.wsClient.onTransaction((message) => {
      this.emit('transactions', this._formatTransaction(message));
    });

    // Create RPC client for REST calls
    const rpcUrl = this.server.replace(/^ws/, 'http');
    this.rpcClient = new RpcClient({ server: rpcUrl });
  }

  /**
   * Disconnect from the server
   */
  async disconnect() {
    if (this.wsClient) {
      await this.wsClient.disconnect();
      this._isConnected = false;
    }
  }

  /**
   * Check if connected
   */
  async isConnected() {
    return this._isConnected && this.wsClient?.isConnected();
  }

  /**
   * Get server info
   */
  async getServerInfo() {
    return this.rpcClient.serverInfo();
  }

  /**
   * Get account info
   */
  async getAccountInfo(address) {
    return this.rpcClient.accountInfo({ account: address });
  }

  /**
   * Get balances
   */
  async getBalances(address) {
    const result = await this.rpcClient.accountLines({ account: address });
    const balances = [{ currency: 'CALL', value: '0', counterparty: '' }];

    if (result.lines) {
      result.lines.forEach(line => {
        balances.push({
          currency: line.currency,
          counterparty: line.account,
          value: line.balance,
        });
      });
    }

    return balances;
  }

  /**
   * Get transactions for an account
   */
  async getTransactions(address, options = {}) {
    const result = await this.rpcClient.accountTx({
      account: address,
      limit: options.limit || 20,
      marker: options.marker,
    });

    return {
      results: result.transactions.map(tx => this._formatTxResult(tx)),
      marker: result.marker,
    };
  }

  /**
   * Get transaction by hash
   */
  async getTransaction(hash) {
    const result = await this.rpcClient.tx({ transaction: hash });
    return this._formatTxResult(result);
  }

  /**
   * Get account issues (if supported by server)
   */
  async getAccountIssues(address) {
    try {
      return await this.rpcClient.accountObjects({
        account: address,
        type: 'issue',
      });
    } catch (error) {
      console.error('getAccountIssues not supported:', error);
      return [];
    }
  }

  /**
   * Prepare trustline transaction
   */
  async prepareTrustline(address, trustline) {
    const txJSON = {
      TransactionType: 'TrustSet',
      Account: address,
      LimitAmount: {
        currency: trustline.currency,
        issuer: trustline.counterparty,
        value: trustline.limit,
      },
    };

    return { txJSON };
  }

  /**
   * Prepare payment transaction
   */
  async preparePayment(address, payment) {
    const amount = payment.destination.amount;
    const txJSON = {
      TransactionType: 'Payment',
      Account: address,
      Destination: payment.destination.address,
      Amount: amount.currency === 'CALL'
        ? amount.value
        : {
            currency: amount.currency,
            issuer: amount.issuer,
            value: amount.value,
          },
    };

    if (payment.memos && payment.memos.length > 0) {
      txJSON.Memos = payment.memos.map(memo => ({
        Memo: {
          MemoData: Buffer.from(memo.data).toString('hex'),
        },
      }));
    }

    return { txJSON };
  }

  /**
   * Sign transaction locally
   */
  sign(txJSON, secret) {
    const wallet = Wallet.fromSeed(secret);
    const signed = wallet.sign(txJSON);

    return {
      id: signed.hash,
      txJSON: JSON.stringify(txJSON),
      txBlob: signed.tx_blob,
    };
  }

  /**
   * Submit signed transaction
   */
  async submit(signedTx) {
    const result = await this.rpcClient.submit({ tx_blob: signedTx.txBlob });

    return {
      resultCode: result.engine_result || 'tesSUCCESS',
      resultMessage: result.engine_result_message || '',
      tx_json: result.tx_json,
    };
  }

  /**
   * Format ledger message
   */
  _formatLedger(message) {
    return {
      ledgerVersion: message.ledger_index,
      ledgerHash: message.ledger_hash,
      closeTime: message.close_time,
      txnCount: message.txn_count,
    };
  }

  /**
   * Format transaction message from WebSocket
   */
  _formatTransaction(message) {
    return {
      transaction: {
        hash: message.transaction?.hash || message.transaction?.tx_id,
        account: message.transaction?.account,
        type: message.transaction?.transaction_type,
      },
      meta: message.meta || message.metadata,
      ledger_index: message.ledger_index,
      validated: message.validated,
    };
  }

  /**
   * Format transaction result from RPC
   */
  _formatTxResult(result) {
    const tx = result.tx || result.transaction || result;
    const meta = result.meta || result.metadata || {};

    // Parse balance changes
    const balanceChanges = parseBalanceChanges(meta);

    return {
      id: tx.hash,
      address: tx.account,
      type: (tx.transaction_type || 'unknown').toLowerCase(),
      outcome: {
        result: meta.TransactionResult || 'tesSUCCESS',
        ledgerVersion: result.ledger_index || tx.ledger_index,
        indexInLedger: meta.TransactionIndex,
        timestamp: new Date((tx.date || Date.now()) * 1000).toISOString(),
        fee: tx.fee || tx.Fee || '0',
        balanceChanges: balanceChanges,
      },
      specification: this._extractSpecification(tx),
    };
  }

  /**
   * Extract transaction specification
   */
  _extractSpecification(tx) {
    const type = tx.transaction_type;

    switch (type) {
      case 'Payment':
        return {
          source: {
            address: tx.account,
            maxAmount: tx.amount ? this._formatAmount(tx.send_max || tx.amount) : undefined,
          },
          destination: {
            address: tx.destination,
            amount: tx.amount ? this._formatAmount(tx.amount) : undefined,
          },
          paths: tx.paths,
          memos: tx.memos,
        };

      case 'TrustSet':
        return {
          currency: tx.limit_amount?.currency,
          counterparty: tx.limit_amount?.issuer,
          limit: tx.limit_amount?.value,
        };

      case 'OfferCreate':
        return {
          direction: 'buy',
          quantity: tx.taker_gets ? this._formatAmount(tx.taker_gets) : undefined,
          totalPrice: tx.taker_pays ? this._formatAmount(tx.taker_pays) : undefined,
        };

      case 'OfferCancel':
        return {
          orderSequence: tx.offer_sequence,
        };

      case 'AccountSet':
        return {
          domain: tx.domain,
          emailHash: tx.email_hash,
          messageKey: tx.message_key,
          setFlag: tx.set_flag,
          clearFlag: tx.clear_flag,
        };

      default:
        return {};
    }
  }

  /**
   * Format amount value
   */
  _formatAmount(amount) {
    if (typeof amount === 'string') {
      return { currency: 'CALL', value: amount };
    }
    return {
      currency: amount.currency,
      value: amount.value,
      counterparty: amount.issuer,
    };
  }
}

export default CallAPI;
