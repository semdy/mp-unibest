<template>
  <view class="review-diff-page g-page full-page">
    <fixed-nav-bar dark title="关联明细展示" />
    <view class="page-container" style="padding-bottom: 0">
      <ui-card>
        <view class="page-info">
          <view class="page-info-item">
            <view class="page-info-item-title">销售数量</view>
            <view class="page-info-item-content font-lg">
              {{ $numberFormat(queryOptions.sales_qty) }}
            </view>
          </view>
          <view class="page-info-item">
            <view class="page-info-item-title">已核实数量</view>
            <view class="page-info-item-content font-lg">
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
              <view class="page-info-item-title">销售日期</view>
              <view class="page-info-item-content">{{ queryOptions.sales_date }}</view>
            </view>
          </view>
        </ui-card>
      </view>
      <ui-card>
        <view class="page-info">
          <view class="page-info-item">
            <view class="page-info-item-title">产品信息</view>
            <view class="page-info-item-content">{{ queryOptions.product_name }}</view>
          </view>
        </view>
      </ui-card>
      <view class="section-title" style="margin-bottom: 8px">关联明细</view>
    </view>
    <scroll-view scroll-y enable-flex class="page-scrollview">
      <view class="page-container" style="padding-top: 0">
        <ui-card v-for="(item, index) in invoiceData" :key="index">
          <template #title>
            <text>{{ item.date }}</text>
          </template>
          <template #header-right v-if="item.audit_result">
            <ui-alert
              type="primary"
              icon="check-circle"
              plain
              v-if="item.audit_result === '已核实'"
            >
              {{ item.audit_result }}
            </ui-alert>
            <ui-alert v-else type="error" icon="warning" plain>{{ item.audit_result }}</ui-alert>
          </template>
          <template #default>
            <ui-label-value label="发票号码">
              <ui-alert type="" icon="piao" icon-color="#2ba293" plain>
                <text class="review-detail-value">{{ item.num }}</text>
              </ui-alert>
            </ui-label-value>
            <ui-label-value label="销售方名称">{{ item.sales_name }}</ui-label-value>
            <ui-label-value label="购买方名称">{{ item.purchase_name }}</ui-label-value>
            <ui-divider />
            <ui-label-value label="产品名称">{{ item.product_name }}</ui-label-value>
            <view class="justify-between">
              <ui-label-value label="规格型号">{{ item.product_spec }}</ui-label-value>
              <ui-label-value label="关联数量">{{ item.availability_qty }}</ui-label-value>
            </view>
          </template>
        </ui-card>
      </view>
      <uv-loadmore
        v-if="invoiceData.length === 0 || currentPage > 1"
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
import { shareMixins } from '@/config'
import { getRelateDetailCompareApi } from '@/api'

export default {
  data() {
    return {
      queryOptions: {},
      invoiceData: [],
      currentPage: 1,
      loadingPage: true,
      loading: true,
    }
  },
  mixins: [shareMixins],
  methods: {
    async requestData() {
      try {
        if (!this.loadingPage) {
          return
        }
        this.loading = true
        const { invoice_info } = await getRelateDetailCompareApi({
          sales_id: this.queryOptions.sales_id,
          page: this.currentPage,
          page_size: 20,
        })
        if (this.currentPage === 1) {
          this.invoiceData = invoice_info
        } else {
          this.invoiceData = [...this.invoiceData, ...invoice_info]
        }
        if (invoice_info.length < 20) {
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
      this.requestData()
    },
    loadMore() {
      this.appendData()
    },
  },
  onLoad(options) {
    this.queryOptions = options
    this.refreshData()
  },
}
</script>

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
  font-size: 13spx;
  color: rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  margin-bottom: 12px;
}

.card-group {
  display: flex;
  margin-top: 12px;
  margin-bottom: 12px;

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

.review-detail-value {
  font-size: 16px;
  font-weight: bold;
}
</style>
