<template>
  <view class="home-page g-page bg2 full-bg full-page">
    <view style="height: 44px; flex-shrink: 0">
      <uni-status-bar />
    </view>
    <view class="page-container">
      <view class="page-title">政策记录</view>
      <view class="page-main">
        <view class="page-info">
          <view class="page-info-item">
            <view class="page-info-item-title">经销商名称</view>
            <view class="page-info-item-content">
              <ui-picker
                dark
                :columns="pickerData.policy_dealers"
                v-model="dealer"
                searchable
                placeholder="经销商名称"
              />
            </view>
          </view>
          <view class="page-info-item">
            <view class="page-info-item-title">数据更新时间</view>
            <view class="page-info-item-content" style="margin-top: 14px">
              {{ basicInfo.update_time || '-' }}
            </view>
          </view>
        </view>

        <view class="page-info">
          <view class="page-info-item">
            <view class="page-info-item-title">上级经销商</view>
            <view class="page-info-item-content">{{ basicInfo.dealer_leader_name || '-' }}</view>
          </view>
          <view class="page-info-item">
            <view class="page-info-item-title">享受政策</view>
            <view class="page-info-item-content">{{ totalRecords }}项</view>
          </view>
          <view class="page-info-item">
            <view class="page-info-item-title">产品线</view>
            <view class="page-info-item-content">{{ basicInfo.product_line || '-' }}</view>
          </view>
        </view>
      </view>

      <ui-popup :draggable="false" class="policy-popup">
        <view class="policy-header">
          <view class="policy-header-title">政策记录</view>
          <view class="policy-header-filter">
            <ui-picker
              :columns="pickerData.policy_quarters"
              v-model="quarter"
              placeholder="所有季度"
            />
          </view>
        </view>
        <scroll-view scroll-y enable-flex class="page-scrollview" @scrolltolower="loadMore">
          <view class="policy-content">
            <ui-card @click="toDetail(item)" v-for="(item, index) in policy_info" :key="index">
              <view class="policy-name">{{ item.policy_name }}</view>
              <ui-label-value value-bold inline>
                <text style="margin-right: 8px">政策编号</text>
                <text>{{ item.policy_number }}</text>
              </ui-label-value>
              <ui-label-value value-bold inline>
                <text style="margin-right: 8px">结算编号</text>
                <text>{{ item.settlement_number }}</text>
              </ui-label-value>
              <view class="justify-between">
                <ui-label-value label="所属季度">{{ item.account_period }}</ui-label-value>
                <ui-tag :type="statusStyle(item.dms_confirmed)">
                  {{ statusText(item.dms_confirmed) }}
                </ui-tag>
              </view>
              <view class="justify-between">
                <ui-label-value label="返利值(含税)">{{ item.rebate_amount }}</ui-label-value>
                <ui-label-value label="已结算金额">{{ item.claimed_amount }}</ui-label-value>
              </view>
            </ui-card>
          </view>
          <up-loadmore
            v-if="policy_info.length === 0 || currentPage > 1"
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
import { mapState } from 'pinia'
import { shareMixins } from '@/config'
import { objectToQueryString } from '@/utils/util'
import { dmsConfirmedStatusMap, dmsConfirmedStatusStyleMap } from '@/utils/enum'
import { usePickerDataStore, usePolicyDataStore } from '@/store'

export default {
  data() {
    return {
      dealer: '',
      quarter: '',
      totalRecords: 0,
      currentPage: 1,
      loadingPage: true,
      loading: true,
    }
  },
  mixins: [shareMixins],
  computed: {
    ...mapState(usePickerDataStore, ['pickerData']),
    ...mapState(usePolicyDataStore, {
      policy_info: 'policy_info',
      basicInfo: store => store.policy_info[0] || {},
    }),
  },
  watch: {
    dealer() {
      this.refreshData()
    },
    quarter(val) {
      this.refreshData()
    },
  },
  methods: {
    toDetail(event) {
      const queryString = objectToQueryString({
        policy_id: event.policy,
        rebate_amount: event.rebate_amount,
      })
      uni.navigateTo({
        url: '/pages/policy-detail/policy-detail?' + queryString,
      })
    },
    async requestData() {
      try {
        if (!this.loadingPage) {
          return
        }
        this.loading = true
        const policyDataStore = usePolicyDataStore()
        const res = await policyDataStore.getPolicyReportData({
          dealer_id: this.dealer,
          quarter_id: this.quarter,
          page: this.currentPage,
          page_size: 20,
        })
        this.totalRecords = res.pagination.total_records
        if (res.data.length < 20) {
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
    statusText(status) {
      return dmsConfirmedStatusMap[status]
    },
    statusStyle(status) {
      return dmsConfirmedStatusStyleMap[status]
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

ui-popup,
.policy-popup {
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

  & .policy-content {
    padding: 16px;
  }

  .page-scrollview {
    width: calc(100% + 32px);
    margin: 0 -16px -16px;
  }
}

.page-info {
  display: flex;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
}

.page-info-item {
  position: relative;
  flex: 1;

  &:not(:last-child) {
    padding-right: 15px;
    margin-right: 15px;
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

.policy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.policy-header-title {
  font-size: 16px;
  font-weight: bold;
}

.policy-header-filter {
  ::v-deep .ui-picker {
    margin-left: 20px;
  }
}

.policy-alert {
  margin-bottom: 10px;
}

.policy-name {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 6px;
  word-wrap: break-word;
}
</style>
