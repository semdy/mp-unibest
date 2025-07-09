<template>
  <view class="policy-detail-page g-page full-page">
    <fixed-nav-bar dark title="政策详情" />
    <scroll-view scroll-y enable-flex class="page-scrollview">
      <view class="page-container">
        <ui-card>
          <view class="justify-between">
            <ui-label-value label="政策名称"></ui-label-value>
            <ui-label-value label="政策编号" value-bold>{{ data.policy_number }}</ui-label-value>
          </view>
          <ui-label-value value-bold>
            <text style="font-size: 15px">{{ data.policy_name }}</text>
          </ui-label-value>
        </ui-card>
        <view class="card-group">
          <ui-card>
            <view class="page-info">
              <!-- <view class="page-info-item">
                <view class="page-info-item-title"> 享受政策 </view>
                <view class="page-info-item-content">
                  <text class="color-red">4</text>
                  <text>项</text>
                </view>
              </view> -->
              <view class="page-info-item">
                <view class="page-info-item-title">返利值（含税）</view>
                <view class="page-info-item-content">{{ queryOptions.rebate_amount }}</view>
              </view>
            </view>
          </ui-card>
          <ui-card>
            <view class="page-info">
              <view class="page-info-item">
                <view class="page-info-item-title">数据更新时间</view>
                <view class="page-info-item-content">{{ data.update_time }}</view>
              </view>
            </view>
          </ui-card>
        </view>

        <view class="policy-detail-list">
          <ui-card>
            <ui-divider huge style="margin-top: 16px">
              <ui-alert type="" icon="zheng" :icon-size="16" icon-color="#2ba293" plain bold>
                <text style="font-size: 15px">政策说明</text>
              </ui-alert>
            </ui-divider>
            <view class="policy-description">
              {{ data.policy_description }}
            </view>
          </ui-card>
          <ui-card>
            <view class="section-title">适用产品</view>
            <view class="policy-description">
              {{ data.applicable_products }}
            </view>
            <view class="flec-col" style="margin-top: 12px">
              <text class="section-label">结算周期</text>
              <ui-tag type="warning">{{ data.settlement_cycle }}</ui-tag>
            </view>
          </ui-card>
          <ui-card>
            <view class="section-title">计算公式</view>
            <view class="policy-description">
              {{ data.calculation_formula }}
            </view>
          </ui-card>
          <ui-card>
            <view class="section-title">举例说明</view>
            <view class="policy-description">
              {{ data.example }}
            </view>
          </ui-card>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { shareMixins } from '@/config'
import { getPolicyReportDetailApi } from '@/api'
import { showLoading, hideLoading } from '@/utils/util'

export default {
  data() {
    return {
      queryOptions: {},
      data: {}
    }
  },
  mixins: [shareMixins],
  methods: {
    async getPolicyReportDetail() {
      try {
        showLoading()
        const data = await getPolicyReportDetailApi(this.queryOptions.policy_id)
        this.data = data
      } finally {
        hideLoading()
      }
    }
  },
  onLoad(options) {
    this.queryOptions = options
    this.getPolicyReportDetail()
  }
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
    // padding-right: 15px;
    margin-right: 10px;
  }

  // &:not(:last-child)::after {
  //   content: '';
  //   position: absolute;
  //   right: 0;
  //   top: 20%;
  //   bottom: 20%;
  //   width: 1px;
  //   background-color: #f7f7f7;
  // }
}

.page-info-item-title {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  margin-bottom: 12px;
}

.page-info-item-content {
  font-weight: bold;
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

.policy-detail-list {
  margin-top: 8px;
}

.policy-detail-value {
  font-size: 16px;
  font-weight: bold;
}

.policy-description {
  color: rgba(0, 0, 0, 0.7);
  font-family: Arial, Helvetica, sans-serif;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  margin-left: 22px;
  margin-bottom: 8px;
}

.section-label {
  font-size: 15px;
  font-weight: bold;
  margin-left: 22px;
  margin-right: 8px;
}
</style>
