<template>
  <v-menu class="tool" v-model="show" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <div class="select" v-bind="attrs" v-on="on">
        <span
          class="point mr-1"
          :style="{ backgroundColor: selectObj.color }"
        />
        <span class="val">{{ selectObj.txt }}</span>
        <v-icon>mdi-chevron-down</v-icon>
      </div>
    </template>
    <div class="tool-header">
      <div class="tit">网络</div>
      <v-divider />
    </div>
    <div class="tool-cont">
      <div
        class="item py-3"
        v-for="(item, idx) in list"
        :key="idx"
        :class="{ active: idx === selIdx }"
        @click="onSelect(idx)"
      >
        <v-icon
          color="white"
          :style="{ visibility: idx === selIdx ? 'visible' : 'hidden' }"
          >mdi-check
        </v-icon>
        <span class="point mx-3" :style="{ backgroundColor: item.color }" />
        <span class="txt">{{ item.txt }}</span>
      </div>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: "Net",
  data() {
    return {
      show: false,
      selectObj: {
        txt: "Callchain Mainnet",
        val: 0,
        color: "#29b6af",
      },
      list: [
        { txt: "Callchain Mainnet", val: 0, color: "#29b6af" },
        { txt: "自定义 RPC", val: 4 },
      ],
      selIdx: 0,
    };
  },
  methods: {
    onSelect(idx) {
      this.selIdx = idx;
      this.show = false;
      this.selectObj = this.list[idx];
    },
  },
};
</script>

<style lang="scss" scoped>
.point {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #fff;
  display: inline-flex;
}

.select {
  padding: 0 10px;
  height: 40px;
  border-radius: 40px;
  border: 1px solid #bbc0c5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  .val {
    font-size: 12px;
    color: #6a737d;
  }
}

.item {
  display: flex;
}

.v-menu__content {
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 1 !important;
  padding: 20px 16px;
  min-width: 220px;

  .def {
    color: #9b9b9b;
    margin-bottom: 16px;
  }

  .item {
    .txt {
      font-size: 16px;
      color: #9b9b9b;
    }

    &.active {
      .txt {
        color: #fff;
      }
    }
  }

  .tool-header {
    color: #fff;

    .tit {
      font-size: 20px;
      text-align: center;
    }

    hr {
      background-color: #5d5d5d;
      margin: 10px 0;
    }
  }
}
</style>
