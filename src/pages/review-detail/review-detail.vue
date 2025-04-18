<template>
  <view class="review-detail-page g-page full-page">
    <fixed-nav-bar dark title="销量明细展示" />
    <view class="page-container" style="padding-bottom: 0">
      <ui-card>
        <view class="page-info">
          <view class="page-info-item">
            <view class="page-info-item-title">销售数量</view>
            <view class="page-info-item-content font-lg">
              {{ $numberFormat(queryOptions.total_sales_qty) }}
            </view>
          </view>
          <view class="page-info-item">
            <view class="page-info-item-title">已核实数量</view>
            <view class="page-info-item-content font-lg color-red">
              {{ $numberFormat(queryOptions.pass_qty) }}
            </view>
          </view>
        </view>
      </ui-card>
      <view class="card-group">
        <ui-card>
          <view class="page-info">
            <view class="page-info-item">
              <view class="page-info-item-title">医院名称</view>
              <view class="page-info-item-content">{{ queryOptions.customer_name }}</view>
            </view>
          </view>
        </ui-card>
        <ui-card>
          <view class="page-info">
            <view class="page-info-item">
              <view class="page-info-item-title">所属月份</view>
              <view class="page-info-item-content">{{ queryOptions.sales_month }}</view>
            </view>
          </view>
        </ui-card>
      </view>
      <view class="section-title">销售明细</view>
      <uv-tabs
        :list="tabs"
        v-model:current="result_type"
        line-color="#2ba293"
        :line-width="14"
        class="section-tabs"
        inactiveStyle="font-size:14px; color: rgba(0,0,0,0.5);"
        activeStyle="color: #000; font-size: 14px; font-weight: bold;"
        item-style="height: 34px;"
        style="margin-bottom: 8px"
      />
    </view>
    <scroll-view
      scroll-y
      enable-flex
      enhanced
      class="page-scrollview"
      id="scrollview"
      @scrolltolower="loadMore"
    >
      <view class="page-container" style="padding-top: 0">
        <ui-card @click="toDetail(item)" v-for="(item, index) in sales_detail" :key="index">
          <template #title>
            <view v-if="item.audit_result">
              <ui-alert
                type="primary"
                icon="check-circle"
                plain
                v-if="item.audit_result === '已核实'"
              >
                {{ item.audit_result }}
              </ui-alert>
              <ui-alert v-else type="error" icon="warning" plain>
                {{ item.audit_result }}
              </ui-alert>
            </view>
          </template>
          <template #header-right>
            <ui-tag :type="statusStyle(item.audit_status)">
              {{ statusText(item.audit_status) }}
            </ui-tag>
          </template>
          <template #default>
            <ui-alert type="" icon="ID" icon-color="#2ba293" plain class="review-detail-alert">
              <text class="review-detail-value">{{ item.id }}</text>
            </ui-alert>
            <ui-divider />
            <view class="justify-between">
              <ui-label-value label="产品名称">{{ item.product_name }}</ui-label-value>
              <ui-label-value label="销量">{{ item.sales_qty }}</ui-label-value>
            </view>
            <view class="justify-between">
              <ui-label-value label="销量日期">{{ item.sales_date }}</ui-label-value>
              <ui-label-value label="差异">{{ item.diff_qty }}</ui-label-value>
            </view>
          </template>
        </ui-card>
      </view>
      <uv-loadmore
        v-if="sales_detail.length === 0 || currentPage > 1"
        :status="loadingPage ? 'loading' : 'more'"
        :nomoreText="currentPage === 1 ? '暂无数据' : '没有更多数据了'"
        margin-top="0"
        margin-bottom="0"
        style="padding-bottom: 10px"
      />
    </scroll-view>
  </view>
</template>

<script>
import { mapState } from 'pinia'
import { shareMixins } from '@/config'
import { showLoading, hideLoading, objectToQueryString, getNode } from '@/utils/util'
import { auditStatusMap, auditStatusStyleMap } from '@/utils/enum'
import { useSummaryDetailStore } from '@/store'

export default {
  data() {
    return {
      tabs: [
        { name: '全部', value: 0 },
        { name: '已核实', value: 1 },
        { name: '未核实', value: 2 },
      ],
      result_type: 0,
      queryOptions: {},
      currentPage: 1,
      loadingPage: true,
      loading: true,
    }
  },
  mixins: [shareMixins],
  computed: {
    ...mapState(useSummaryDetailStore, ['sales_detail']),
  },
  watch: {
    result_type() {
      showLoading()
      this.refreshData().then(() => {
        this.scrollViewContext?.scrollTo({ top: 0 })
      })
    },
  },
  methods: {
    toDetail(event) {
      const queryString = objectToQueryString({
        sales_id: event.id,
        sales_qty: event.sales_qty,
        pass_qty: event.pass_qty,
        customer_name: this.queryOptions.customer_name,
        sales_date: event.sales_date,
        product_name: event.product_name,
      })
      uni.navigateTo({
        url: '/pages/review-diff/review-diff?' + queryString,
      })
    },
    async requestData() {
      if (!this.loadingPage) {
        return
      }
      try {
        this.loading = true
        const summaryDetailStore = useSummaryDetailStore()
        const pageData = await summaryDetailStore.getDetailSales({
          ...this.queryOptions,
          result_type: this.result_type,
          page: this.currentPage,
          page_size: 20,
        })
        if (pageData.length < 20) {
          this.loadingPage = false
        }
      } finally {
        this.loading = false
        if (this.currentPage === 1) {
          hideLoading()
        }
      }
    },
    async refreshData() {
      this.currentPage = 1
      this.loadingPage = true
      await this.requestData()
    },
    appendData() {
      if (this.loading) return
      this.currentPage++
      this.requestData()
    },
    loadMore() {
      this.appendData()
    },
    statusText(status) {
      return auditStatusMap[status]
    },
    statusStyle(status) {
      return auditStatusStyleMap[status]
    },
    async getScrollViewContext() {
      await this.$nextTick()
      this.scrollViewContext = await getNode('#scrollview')
    },
  },
  onLoad(options) {
    this.queryOptions = options
    this.refreshData()
  },
  onReady() {
    this.getScrollViewContext()
  },
}
</script>

<style>
page {
  height: 100% !important;
}
</style>

<style lang="scss" scoped>
.page-container {
  padding: 16px;
}

.page-info {
  display: flex;
}

.page-info-item {
  position: relative;
  flex: 1;

  &:not(:last-child) {
    padding-right: 15px;
    margin-right: 20px;
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 20%;
    bottom: 20%;
    width: 1px;
    background-color: #f7f7f7;
  }
}

.page-info-item-title {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  margin-bottom: 12px;
}

.card-group {
  display: flex;
  margin-top: 12px;

  /* #ifdef MP */
  ui-card {
    min-height: 81px;

    ::v-deep .ui-card {
      height: 100%;
    }
  }
  /* #endif */

  ui-card,
  .ui-card {
    flex: 1;
    margin-bottom: 0;

    &:not(:last-child) {
      margin-right: 12px;
    }
  }
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 16px;
}

.section-tabs {
  margin-left: -11px;
}

.review-detail-alert {
  margin: 12px 0;
}

.review-detail-value {
  font-size: 16px;
  font-weight: bold;
}
</style>
