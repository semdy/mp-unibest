<route lang="json5" type="home">
{
  style: {
    navigationBarTitleText: '',
  },
}
</route>
<template>
  <view class="home-page g-page bg1 full-bg full-page">
    <view style="flex: none; height: 44px">
      <uni-status-bar />
    </view>
    <view class="page-container">
      <view class="page-title">票审结果汇总页面</view>
      <view class="page-main" id="page-main">
        <view class="page-inner">
          <view class="page-filter">
            <ui-picker
              dark
              :empty-option="null"
              v-model="quarter"
              :columns="pickerData.audit_quarters"
              @open="pickerOpen"
              placeholder="历史季度"
            />
            <ui-picker
              dark
              v-model="auditType"
              :columns="pickerData.audit_types"
              @open="pickerOpen"
              placeholder="票审类型"
            />
            <ui-picker
              dark
              v-model="dealer"
              :columns="pickerData.audit_dealers"
              searchable
              @open="pickerOpen"
              placeholder="经销商"
            />
          </view>
          <view class="page-info">
            <view class="page-info-item">
              <view class="page-info-item-title">经销商名称</view>
              <view class="page-info-item-content">{{ dealerName || '-' }}</view>
            </view>
            <view class="page-info-item">
              <view class="page-info-item-title">季度</view>
              <view class="page-info-item-content">{{ quarterName || '-' }}</view>
            </view>
            <view class="page-info-item">
              <view class="page-info-item-title">审计截止时间</view>
              <view class="page-info-item-content">{{ endDate || '-' }}</view>
            </view>
          </view>

          <view class="gradient-card stats-container">
            <view class="stats-info">
              <view class="stats-item">
                <view class="stats-item-title">销售数量</view>
                <view class="stats-item-content">
                  {{ $numberFormat(summaryData.total_qty) }}
                </view>
              </view>
              <view class="stats-item">
                <view class="stats-item-title">已核实数量</view>
                <view class="stats-item-content color-red">
                  {{ $numberFormat(summaryData.pass_qty) }}
                </view>
              </view>
              <view class="stats-item">
                <view class="stats-item-title">准确率</view>
                <view class="stats-item-content color-red">{{ summaryData.pass_percentage }}</view>
              </view>
            </view>
            <view class="stats-chart-title">各差异情况占比</view>
            <view class="stats-chart-info">
              <template v-if="summaryData.audit_report.length > 0">
                <view class="stats-chart-labels">
                  <view
                    class="stats-chart-label"
                    v-for="(item, index) in summaryData.audit_report"
                    :key="index"
                  >
                    <view class="stats-chart-label-text" :style="{ '--color': colors[index] }">
                      {{ item.label }}
                    </view>
                    <view class="stats-chart-label-value">
                      {{ item.qty }}; {{ item.percentage }}
                    </view>
                  </view>
                  <view class="stats-chart-label">
                    <view class="stats-chart-label-text" style="--color: #deeaff">
                      特殊销量上报
                    </view>
                    <view class="stats-chart-label-value">{{ summaryData.special_sales_qty }}</view>
                  </view>
                </view>
                <view class="stats-chart">
                  <view class="stats-chart-canvas">
                    <!-- <ui-ring-charts ref="ringCharts" /> -->
                    <canvas
                      canvas-id="ringCanvas"
                      class="ring-canvas"
                      disable-scroll
                      @touchstart="canvasTouchHandler"
                      :style="{ display: canvasOpacity > 0 ? '' : 'none' }"
                    />
                  </view>
                </view>
              </template>
              <up-loading-icon
                v-else
                mode="circle"
                size="40"
                timing-function="linear"
                class="stats-chart-loading"
              ></up-loading-icon>
            </view>
          </view>
        </view>
      </view>

      <view class="main-content">
        <ui-popup
          ref="popup"
          class="review-popup"
          :range="[-mainHeight, 0]"
          auto-slide
          :use-transform="false"
          @move="moveHandler"
          @end="endHandler"
          @slideend="transitionendHandler"
        >
          <view class="review-header">
            <view class="review-header-title">票审明细</view>
            <view class="review-header-filter">
              <ui-picker
                v-model="salesCustomer"
                :columns="pickerData.sales_customers"
                searchable
                @open="pickerOpen"
                placeholder="销售医院"
              />
              <ui-picker
                v-model="salesMonth"
                :columns="pickerData.sales_month"
                @open="pickerOpen"
                placeholder="数据月份"
              />
            </view>
          </view>
          <ui-alert icon="info" class="review-alert">请尽快根据差异情况补充相关内容</ui-alert>
          <scroll-view
            scroll-y
            enable-flex
            class="page-scrollview"
            @scrolltolower="loadMore"
            @scroll="handleScroll"
          >
            <view class="review-content">
              <ui-card
                :title="item.customer_name"
                @click="toDetail(item)"
                v-for="(item, index) in summaryData.audit_info"
                :key="index"
              >
                <template #header-right>
                  <ui-tag :type="statusStyle(item.audit_status)" style="margin-left: 8px">
                    {{ statusText(item.audit_status) }}
                  </ui-tag>
                </template>
                <template #default>
                  <ui-label-value label="产品名称">{{ item.sales_global_name }}</ui-label-value>
                  <view class="justify-between">
                    <ui-label-value label="差异数量">
                      {{ $numberFormat(item.diff_qty) }}
                    </ui-label-value>
                    <ui-label-value label="所属月份">{{ item.sales_month }}</ui-label-value>
                  </view>
                </template>
              </ui-card>
            </view>
            <up-loadmore
              v-if="summaryData.audit_info.length === 0 || currentPage > 1"
              :status="loadingPage ? 'loading' : 'more'"
              :nomoreText="currentPage === 1 ? '暂无数据' : '没有更多数据了'"
              margin-top="0"
              margin-bottom="0"
              style="padding-bottom: 10px"
            />
          </scroll-view>
        </ui-popup>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'pinia'
import { shareMixins } from '@/config'
import { getNodeRect, objectToQueryString } from '@/utils/util'
import wxCharts from '@/uni_modules/wx-charts'
import { auditStatusMap, auditStatusStyleMap } from '@/utils/enum'
import { usePickerDataStore, useSummaryDataStore } from '@/store'

export default {
  data() {
    return {
      quarter: '',
      auditType: '',
      dealer: '',
      salesCustomer: '',
      salesMonth: '',
      mainHeight: 0,
      canvasOpacity: 1,
      currentPage: 1,
      loadingPage: true,
      loading: true,
      colors: ['#326DF8', '#06BCFF', '#FF06E1', '#FFA820', '#FE584C', '#0ACEBE'],
    }
  },
  mixins: [shareMixins],
  computed: {
    ...mapState(usePickerDataStore, {
      pickerData: 'pickerData',
      endDate(store) {
        if (!this.quarter) return null
        return store.pickerData.audit_quarters.find(item => item.value === this.quarter)?.end_date
      },
      dealerName(store) {
        return store.pickerData.audit_dealers.find(item => item.value === this.dealer)?.label
      },
      quarterName(store) {
        return store.pickerData.audit_quarters.find(item => item.value === this.quarter)?.label
      },
    }),
    ...mapState(useSummaryDataStore, ['summaryData']),
  },
  watch: {
    dealer() {
      this.refreshFilterSales()
      this.refreshData()
    },
    quarter() {
      this.refreshFilterSales()
      this.refreshData()
    },
    auditType() {
      this.refreshFilterSales()
      this.refreshData()
    },
    salesCustomer() {
      this.refreshFilterSales()
      this.refreshData()
    },
    salesMonth() {
      this.refreshFilterSales()
      this.refreshData()
    },
    'summaryData.audit_report': {
      handler() {
        this.$nextTick(() => {
          this.initRingCharts()
          this.getMainHeight()
        })
      },
    },
    'pickerData.audit_quarters': {
      handler(val) {
        if (val.length) {
          if (val.length >= 2) {
            this.quarter = val[1].value
          } else {
            this.quarter = val[0].value
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    refreshFilterSales() {
      const pickerDataStore = usePickerDataStore()
      pickerDataStore.filterSales({
        dealer_id: this.dealer,
        quarter_id: this.quarter?.toString(),
        audit_type: this.auditType,
      })
    },
    async requestData(isAppend) {
      const summaryDataStore = useSummaryDataStore()
      try {
        if (!isAppend) {
          summaryDataStore.getReportInvoice({
            dealer_id: this.dealer,
            quarter_id: this.quarter?.toString(),
          })
        }
        if (!this.loadingPage) {
          return
        }
        this.loading = true
        const pageData = await summaryDataStore.getSummarySales({
          dealer_id: this.dealer,
          quarter_id: this.quarter?.toString(),
          audit_type: this.auditType,
          customer_name: this.salesCustomer,
          sales_month: this.salesMonth,
          page: this.currentPage,
          page_size: 20,
        })
        if (pageData.length < 20) {
          this.loadingPage = false
        }
      } finally {
        this.loading = false
      }
    },
    refreshData() {
      this.currentPage = 1
      this.loadingPage = true
      this.requestData()
    },
    appendData() {
      if (this.loading) return
      this.currentPage++
      this.requestData(true)
    },
    loadMore() {
      this.appendData()
    },
    toDetail(event) {
      const queryString = objectToQueryString({
        dealer_id: event.dealer_id,
        quarter_id: this.quarter?.toString(),
        audit_type: this.auditType,
        customer_name: event.customer_name,
        sales_month: event.sales_month,
        sales_global_name: event.sales_global_name,
        total_sales_qty: event.total_sales_qty,
        pass_qty: event.pass_qty,
      })
      uni.navigateTo({
        url: '/pages/review-detail/review-detail?' + queryString,
      })
    },
    async getMainHeight() {
      const rect = await getNodeRect('#page-main')
      this.mainHeight = rect.height
    },
    moveHandler(e) {
      // #ifdef MP
      if (e.moveDistance < 0) {
        // const opacity = 1 - Math.abs(e.moveDistance) / 60
        // if (opacity >= 0) {
        //   this.canvasOpacity = opacity
        // } else {
        //   this.canvasOpacity = 0
        // }
        if (e.moveDistance < -70) {
          this.canvasOpacity = 0
        } else {
          this.canvasOpacity = 1
        }
      } else if (e.moveOffset >= 0) {
        this.canvasOpacity = 1
      }
      this.moveOffset = e.moveOffset
      // #endif
    },
    transitionendHandler(e) {
      // #ifdef MP
      if (e.moveOffset === 0) {
        this.canvasOpacity = 1
      }
      this.moveOffset = e.moveOffset
      // #endif
    },
    pickerOpen(isOpen) {
      // #ifdef MP
      if (this.moveOffset && this.moveOffset !== 0) {
        return
      }
      if (isOpen) {
        this.canvasOpacity = 0
      } else {
        this.canvasOpacity = 1
      }
      // #endif
    },
    statusText(status) {
      return auditStatusMap[status]
    },
    statusStyle(status) {
      return auditStatusStyleMap[status]
    },
    canvasTouchHandler(e) {
      console.log(this.ringChart.getCurrentDataIndex(e))
    },
    updateRingChartsData() {
      this.ringChart.updateData({
        series: this.summaryData.audit_report.map((item, i) => {
          return {
            name: item.label,
            data: item.qty,
            stroke: false,
            color: this.colors[i],
          }
        }),
      })
    },
    initRingCharts() {
      if (this.summaryData.audit_report.length === 0) {
        this.canvasOpacity = 0
        return
      }
      if (this.canvasOpacity === 0 && !this.moveOffset) {
        this.canvasOpacity = 1
      }
      this.ringChart = new WxCharts({
        animation: true,
        canvasId: 'ringCanvas',
        type: 'ring',
        extra: {
          ringWidth: 22,
          pie: {
            offsetAngle: -45,
          },
        },
        series: this.summaryData.audit_report.map((item, i) => {
          return {
            name: item.label,
            data: item.qty,
            stroke: false,
            color: this.colors[i],
          }
        }),
        disablePieStroke: true,
        width: 130,
        height: 130,
        dataLabel: false,
        legend: false,
        background: '#fff',
        padding: 0,
      })
      // this.ringChart.addEventListener('renderComplete', () => {
      //   console.log('renderComplete')
      // })
      // setTimeout(() => {
      //   ringChart.stopAnimation()
      // }, 500)
    },
    handleScroll(e) {
      if (e.detail.scrollTop > 0) {
        if (this.$refs.popup.isAtStart()) {
          this.canvasOpacity = 0
          this.$refs.popup.slideToUpper()
        }
      }
    },
  },
  mounted() {
    this.getMainHeight()
  },
  onLoad() {
    // this.refreshData()
  },
  // onReady() {
  //   this.initRingCharts()
  //   // this.$refs.ringCharts.initRingCharts()
  // }
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: unset;
  overflow: hidden;
}

.page-container {
  position: relative;
  z-index: 1;
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.page-inner {
  padding: 0 16px 16px;
}

.page-title {
  padding: 16px;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
}

.page-filter {
  margin-bottom: 20px;

  ::v-deep .ui-picker {
    margin-right: 15px;
  }
}

.review-popup {
  position: absolute !important;
  top: 0;
  right: 0;
  left: 0;
  /* #ifdef H5 */
  height: calc(100vh - 107px - 50px);
  /* #endif */
  /* #ifndef H5 */
  height: calc(100vh - 107px);
  /* #endif */

  ::v-deep .ui-popup {
    height: 100%;
  }

  ::v-deep .ui-popup-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-bottom: 3px;
    overflow: hidden;
  }

  .page-scrollview {
    width: calc(100% + 32px);
    margin-right: -16px;
    margin-left: -16px;
  }
}

.page-info {
  display: flex;
  margin-bottom: 20px;
}

.page-info-item {
  position: relative;
  flex: 1;

  &:not(:last-child) {
    padding-right: 15px;
    margin-right: 15px;
  }

  &:first-child {
    flex: 1.5;
  }

  &:not(:last-child)::after {
    position: absolute;
    top: 20%;
    right: 0;
    bottom: 20%;
    width: 1px;
    content: '';
    background-color: rgba(255, 255, 255, 0.3);
  }

  &:not(:first-child) {
    .page-info-item-content {
      font-size: 15px;
    }
  }
}

.page-info-item-title {
  margin-bottom: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

.page-info-item-content {
  font-size: 13px;
  color: #fff;
}

.stats-info {
  display: flex;
  margin-bottom: 15px;
}

.stats-item {
  position: relative;
  flex: 1;

  &:not(:last-child) {
    padding-right: 15px;
    margin-right: 15px;
  }

  &:not(:last-child)::after {
    position: absolute;
    top: 12%;
    right: 0;
    bottom: 12%;
    width: 1px;
    content: '';
    background-color: rgba(0, 0, 0, 0.06);
  }
}

.stats-item-title {
  margin-bottom: 6px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.stats-item-content {
  font-size: 18px;
  font-weight: bold;
}

.stats-chart-title {
  margin-bottom: 15px;
  font-size: 17px;
  font-weight: bold;
  color: #000;
  text-align: center;
}

.stats-chart-info {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 150px;
}

.stats-chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.stats-chart-labels {
  flex: 1.2;
  padding-right: 3%;
}

.stats-chart-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stats-chart-label-text {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);
  white-space: nowrap;

  &::before {
    display: inline-block;
    width: 4px;
    height: 4px;
    margin-right: 5px;
    vertical-align: 2px;
    content: '';
    background-color: var(--color, #f42850);
    border-radius: 1px;
  }
}

.stats-chart-label-value {
  font-weight: bold;
  color: #000;
  white-space: nowrap;
}

.stats-chart {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  image {
    width: 100%;
    border-radius: 50%;
  }
}

.stats-chart-canvas {
  width: 142px;
  height: 142px;
  padding: 6px;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 0 0 6px rgba(43, 162, 147, 0.16) inset;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.review-header-title {
  font-size: 16px;
  font-weight: bold;
}

.review-header-filter {
  ::v-deep .ui-picker {
    margin-left: 20px;
  }
}

.review-alert {
  /* #ifdef MP */
  display: block;
  /* #endif */
  margin-bottom: 5px;
}

.main-content {
  position: relative;
}

.review-content {
  padding: 5px 16px 16px;
}

.ring-canvas {
  width: 130px;
  height: 130px;
}
</style>
