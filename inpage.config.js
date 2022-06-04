const path = require('path');

module.exports = {
    entry: './src/inpage.js',
    output: {
        path: path.join(__dirname, 'dist/js'),
        filename: 'inpage.js'
    }
}
