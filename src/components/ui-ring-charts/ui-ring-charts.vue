<template>
  <canvas canvas-id="ringCanvas" class="ring-canvas" @touchstart="touchHandler"></canvas>
</template>

<script>
import WxCharts from '@/uni_modules/wx-charts'

export default {
  name: 'ui-ring-charts',
  data() {
    return {}
  },
  methods: {
    touchHandler: function (e) {
      console.log(this.ringChart.getCurrentDataIndex(e))
    },
    updateData: function () {
      this.ringChart.updateData({
        title: {
          name: '80%'
        },
        subtitle: {
          color: '#ff0000'
        }
      })
    },
    initRingCharts() {
      this.ringChart = new WxCharts({
        animation: true,
        canvasId: 'ringCanvas',
        type: 'ring',
        extra: {
          ringWidth: 22,
          pie: {
            offsetAngle: -45
          }
        },
        series: [
          {
            name: '成交量1',
            data: 105,
            stroke: false,
            color: '#326DF8'
          },
          {
            name: '成交量2',
            data: 35,
            stroke: false,
            color: '#06BCFF'
          },
          {
            name: '成交量3',
            data: 78,
            stroke: false,
            color: '#FF06E1'
          },
          {
            name: '成交量4',
            data: 63,
            stroke: false,
            color: '#FFA820'
          },
          {
            name: '成交量5',
            data: 63,
            stroke: false,
            color: '#FE584C'
          },
          {
            name: '成交量6',
            data: 63,
            stroke: false,
            color: '#0ACEBE'
          }
        ],
        disablePieStroke: true,
        width: 130,
        height: 130,
        dataLabel: false,
        legend: false,
        background: '#fff',
        padding: 0
      })
      // this.ringChart.addEventListener('renderComplete', () => {
      //   console.log('renderComplete')
      // })
      // setTimeout(() => {
      //   ringChart.stopAnimation()
      // }, 500)
    }
  },
  mounted() {
    // this.initRingCharts()
  }
}
</script>

<style lang="scss">
.ring-canvas {
  width: 130px;
  height: 130px;
}
</style>
