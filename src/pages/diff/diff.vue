<template>
  <view class="diff-page g-page bg3 full-bg full-page">
    <view style="height: 44px; flex-shrink: 0">
      <uni-status-bar />
    </view>
    <view class="page-container">
      <view class="page-title">差异汇总</view>
      <view class="page-main">
        <view class="page-filter">
          <ui-picker
            dark
            :columns="pickerData.diff_customers"
            v-model="customer"
            placeholder="医院"
          />
          <ui-picker
            dark
            :columns="pickerData.diff_quarters"
            v-model="quarter"
            placeholder="所属季度"
          />
          <ui-picker
            dark
            :columns="pickerData.diff_diffTypes"
            v-model="diffType"
            placeholder="差异类型"
          />
          <ui-picker
            dark
            :columns="pickerData.diff_approveStatus"
            v-model="approveStatus"
            placeholder="审批状态"
          />
        </view>
        <view class="page-info">
          <view class="page-info-item">
            <view class="page-info-item-title">经销商名称</view>
            <view class="page-info-item-content">
              <ui-picker
                dark
                :columns="pickerData.diff_dealers"
                v-model="dealer"
                searchable
                placeholder="经销商名称"
              />
            </view>
          </view>
        </view>
      </view>

      <ui-popup :draggable="false" class="diff-popup">
        <view class="review-header">
          <view class="review-header-title">差异记录</view>
        </view>
        <scroll-view scroll-y enable-flex class="page-scrollview" @scrolltolower="loadMore">
          <view class="diff-content">
            <ui-card
              v-for="(item, index) in diffRecords.diff_info"
              :key="index"
              @click="toDetail(item, index)"
            >
              <template #title>
                <view>
                  <ui-alert type="error" icon="warning" plain>
                    {{ diffTypeText(item.diff_type) }}
                  </ui-alert>
                </view>
              </template>
              <template #header-right>
                <ui-tag :type="approveStatusStyle(item.approval_state)">
                  {{ approveStatusText(item.approval_state) }}
                </ui-tag>
              </template>
              <template #default>
                <ui-label-value label="经销商名称">{{ item.dealer_name }}</ui-label-value>
                <ui-label-value label="销售医院">{{ item.sales_hospital }}</ui-label-value>
                <ui-label-value label="所属季度">{{ item.policy_quarter_name }}</ui-label-value>
                <ui-divider />
                <ui-label-value label="差异数量">
                  {{ $numberFormat(item.discrepancy_quantity) }}
                </ui-label-value>
              </template>
            </ui-card>
          </view>
          <uv-loadmore
            v-if="diffRecords.diff_info.length === 0 || currentPage > 1"
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
</template>

<script>
import { mapState } from 'vuex'
import { shareMixins } from '@/config'
import { objectToQueryString } from '@/utils/util'
import { approveStatusMap, approveStatusStyleMap, diffTypeMap } from '@/utils/enum'

export default {
  data() {
    return {
      customer: '',
      quarter: '',
      diffType: '',
      approveStatus: '',
      dealer: '',
      currentPage: 1,
      loadingPage: true,
      loading: true,
    }
  },
  mixins: [shareMixins],
  computed: mapState({
    pickerData: (state) => state.pickerData.data,
    diffRecords: (state) => state.diffRecords.data,
  }),
  watch: {
    customer() {
      this.refreshData()
    },
    quarter(val) {
      this.refreshData()
    },
    diffType(val) {
      this.refreshData()
    },
    approveStatus(val) {
      this.refreshData()
    },
    dealer(val) {
      this.refreshData()
    },
  },
  methods: {
    toDetail(event, index) {
      const queryString = objectToQueryString({
        difference_id: event.id,
        dataIndex: index,
      })
      uni.navigateTo({
        url: '/pages/diff-detail/diff-detail?' + queryString,
      })
    },
    async requestData() {
      try {
        if (!this.loadingPage) {
          return
        }
        this.loading = true
        const pageData = await this.$store.dispatch('diffRecords/getDiffRecordsReport', {
          customer_name: this.customer,
          quarter_id: this.quarter,
          diff_type: this.diffType,
          approve_status: this.approveStatus,
          dealer_id: this.dealer,
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
      this.requestData()
    },
    loadMore() {
      this.appendData()
    },
    updateItemApprovalStateByIndex(index, status) {
      this.$store.dispatch('diffRecords/updateApprovalState', { index, status })
    },
    diffTypeText(type) {
      return diffTypeMap[type]
    },
    approveStatusText(status) {
      return approveStatusMap[status]
    },
    approveStatusStyle(status) {
      return approveStatusStyleMap[status]
    },
  },
  onLoad() {
    this.refreshData()
  },
}
</script>

<style lang="scss" scoped>
.page-container {
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1;
}

.page-main {
  padding: 16px;
}

.page-title {
  font-size: 24px;
  color: #fff;
  font-weight: 600;
  padding: 16px 16px 0;
}

.page-filter {
  margin-bottom: 5px;

  ::v-deep .ui-picker {
    margin-right: 16px;
    margin-bottom: 16px;
  }
}

ui-popup,
.diff-popup {
  display: flex;
  flex: 1;
  height: 100%;
  overflow: hidden;

  & ::v-deep .ui-popup-body {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  & .diff-content {
    padding: 16px;
  }

  .page-scrollview {
    width: calc(100% + 32px);
    margin: 0 -16px -16px;
  }
}

.page-info {
  display: flex;
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
    content: '';
    position: absolute;
    right: 0;
    top: 20%;
    bottom: 20%;
    width: 1px;
    background-color: rgba(255, 255, 255, 0.3);
  }

  &:not(:first-child) {
    .page-info-item-content {
      font-size: 15px;
    }
  }
}

.page-info-item-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  margin-bottom: 8px;
}

.page-info-item-content {
  font-size: 13px;
  color: #fff;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.review-header-title {
  font-size: 16px;
  font-weight: bold;
}

.review-alert {
  margin-bottom: 10px;
}
</style>
