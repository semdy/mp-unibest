<template>
  <view class="diff-detail-page g-page full-page">
    <fixed-nav-bar dark title="差异详情" />
    <scroll-view scroll-y enable-flex class="page-scrollview">
      <view class="page-container">
        <ui-card>
          <view class="page-info">
            <view class="page-info-item">
              <view class="page-info-item-title">差异类型</view>
              <view class="page-info-item-content">
                <ui-alert type="error" icon="warning" plain>
                  {{ diffTypeText(data.diff_type) }}
                </ui-alert>
              </view>
            </view>
            <view class="page-info-item">
              <view class="page-info-item-title">审核状态</view>
              <view class="page-info-item-content">
                <ui-tag :type="approveStatusStyle(data.approval_state)">
                  {{ approveStatusText(data.approval_state) }}
                </ui-tag>
              </view>
            </view>
          </view>
          <view class="page-info" style="margin-top: 16px">
            <view class="page-info-item">
              <view class="page-info-item-title">所属季度</view>
              <view class="page-info-item-content">{{ data.policy_quarter_name }}</view>
            </view>
            <view class="page-info-item">
              <view class="page-info-item-title">差异数量</view>
              <view class="page-info-item-content">
                {{ $numberFormat(data.discrepancy_quantity) }}
              </view>
            </view>
          </view>
        </ui-card>

        <template v-if="data.diff_type === 3">
          <ui-card>
            <ui-label-value label="经销商名称" value-bold>{{ data.dealer_name }}</ui-label-value>
            <ui-label-value label="销售医院" value-bold>{{ data.sales_hospital }}</ui-label-value>
            <ui-divider />
            <ui-label-value label="销量产品名称">{{ data.product_name }}</ui-label-value>
            <ui-label-value label="规格型号">{{ data.item_code }}</ui-label-value>
          </ui-card>

          <ui-card>
            <ui-label-value label="发票产品名称">
              {{ data.invoice_product_name }}
            </ui-label-value>
            <ui-label-value label="发票规格型号">
              {{ data.specification_model }}
            </ui-label-value>
          </ui-card>
        </template>

        <!-- <ui-card v-if="data.approval_state === 1 || data.approval_state === 2">
          <ui-label-value label="发票号码" value-bold>
            <ui-alert type="" icon="piao" icon-color="#2ba293" plain>
              <text class="diff-detail-value">{{ data.invoice_product_name }}</text>
            </ui-alert>
          </ui-label-value>
          <ui-label-value label="销售方名称" value-bold> {{ data.seller_name }} </ui-label-value>
          <ui-label-value label="购买方名称" value-bold> {{ data.buyer_name }} </ui-label-value>
          <ui-divider />
          <ui-label-value label="Global分类"> {{ data.global_category_name }} </ui-label-value>
          <view class="justify-between">
            <ui-label-value label="规格型号"> {{ data.item_code }} </ui-label-value>
            <ui-label-value label="差异数量">
              {{ $numberFormat(data.discrepancy_quantity) }}
            </ui-label-value>
          </view>
        </ui-card> -->

        <ui-card v-if="data.diff_type === 2">
          <ui-label-value label="经销商名称" value-bold>{{ data.dealer_name }}</ui-label-value>
          <ui-label-value label="销售医院" value-bold>{{ data.sales_hospital }}</ui-label-value>
          <ui-divider />
          <ui-label-value label="购买方名称">{{ data.buyer_name }}</ui-label-value>
        </ui-card>

        <ui-card v-if="data.diff_type === 1">
          <ui-label-value label="经销商名称" value-bold>{{ data.dealer_name }}</ui-label-value>
          <ui-label-value label="销售医院" value-bold>{{ data.sales_hospital }}</ui-label-value>
          <ui-divider />
          <ui-label-value label="销售日期">{{ data.sales_date }}</ui-label-value>
          <ui-label-value label="发票日期">{{ data.invoice_date }}</ui-label-value>
          <ui-label-value label="发票号码" value-bold>{{ data.invoice_number }}</ui-label-value>
        </ui-card>

        <ui-card v-if="data.diff_type === 0">
          <ui-label-value label="经销商名称" value-bold>{{ data.dealer_name }}</ui-label-value>
          <ui-label-value label="销售医院" value-bold>{{ data.sales_hospital }}</ui-label-value>
        </ui-card>

        <ui-card v-if="data.diff_type === 4 || data.diff_type === 5">
          <ui-label-value label="经销商名称" value-bold>{{ data.dealer_name }}</ui-label-value>
          <ui-label-value label="销售医院" value-bold>{{ data.sales_hospital }}</ui-label-value>
          <ui-divider />
          <ui-label-value label="销售方名称" value-bold>{{ data.seller_name }}</ui-label-value>
          <ui-label-value label="购买方名称" value-bold>{{ data.buyer_name }}</ui-label-value>
          <ui-label-value label="非披露备注" value-bold>
            {{ data.non_disclosure_note }}
          </ui-label-value>
        </ui-card>

        <ui-card v-if="data.diff_type === 0 || data.diff_type === 4 || data.diff_type === 5">
          <ui-alert icon="info" class="review-alert">补充发票及配送备案请到DMS中操作</ui-alert>
          <view class="diff-description" style="margin-top: 16px" v-if="data.diff_type === 0">
            销量多报差异需要从泰尔茂DMS系统补充发票
          </view>
          <view class="diff-description" style="margin-top: 16px" v-if="data.diff_type === 4">
            购买方差异需要从泰尔茂DMS提交备案申请
          </view>
          <view class="diff-description" style="margin-top: 16px" v-if="data.diff_type === 5">
            销售方差异需要从泰尔茂DMS提交备案申请
          </view>
        </ui-card>

        <ui-card v-if="data.diff_type === 0">
          <ui-label-value label="Global分类" label-color="#000" value-bold inline>
            {{ data.global_category_name }}
          </ui-label-value>
          <view class="justify-between">
            <ui-label-value label="销量">{{ data.sales_quantity }}</ui-label-value>
            <ui-label-value label="差异">{{ data.discrepancy_quantity }}</ui-label-value>
          </view>
        </ui-card>

        <ui-card
          v-if="
            data.diff_type === 1 ||
            data.diff_type === 2 ||
            data.diff_type === 3 ||
            data.approval_state === 1 ||
            data.approval_state === 2
          "
        >
          <ui-alert icon="info" class="review-alert">补充发票及配送备案请到DMS中操作</ui-alert>
          <ui-divider huge>
            <ui-alert type="" icon="yi" :icon-size="16" icon-color="#2ba293" plain bold>
              <text style="font-size: 15px">差异说明</text>
            </ui-alert>
          </ui-divider>

          <view class="diff-description">
            <textarea
              v-if="data.diff_type === 1 || data.diff_type === 2 || data.diff_type === 3"
              v-model="data.summit_note"
              placeholder="请填写差异说明"
              class="diff-editor"
            />
            <text v-else>{{ data.summit_note }}</text>
            <view class="diff-switch">
              <ui-alert type="" plain bold>
                <text style="font-size: 15px; margin-right: 12px">长期有效</text>
                <uv-switch
                  v-model="data.approve_timeliness"
                  :disabled="data.approval_state === 1 || data.approval_state === 2"
                  active-color="#2ba293"
                  inactive-color="#eee"
                />
              </ui-alert>
            </view>
          </view>
          <template v-if="data.approval_state === 4">
            <ui-divider huge>
              <ui-alert type="error" icon="bo" :icon-size="16" plain bold>
                <text style="font-size: 15px">驳回说明</text>
              </ui-alert>
            </ui-divider>
            <view class="diff-description">
              {{ data.approval_note }}
            </view>
          </template>
          <ui-divider huge>
            <ui-alert type="" icon="zhi" :icon-size="16" icon-color="#2ba293" plain bold>
              <text style="font-size: 15px">支持件</text>
            </ui-alert>
          </ui-divider>
          <view class="upload-wrapper">
            <view style="flex: none">
              <uv-upload
                ref="uploadRef"
                :width="70"
                :height="70"
                :max-count="1"
                :fileList="fileListWithHttp"
                :deletable="
                  data.is_approval_permission &&
                  (data.approval_state === 0 || data.approval_state === 4)
                "
                :beforeRead="beforeRead"
                @afterRead="afterRead"
                @delete="deletePic"
              >
                <view
                  class="upload-trigger"
                  v-if="
                    data.is_approval_permission &&
                    (data.approval_state === 0 || data.approval_state === 4)
                  "
                  @click.stop="actionShow = true"
                >
                  <ui-icon name="plus" />
                </view>
                <view v-else style="display: none"></view>
              </uv-upload>
            </view>
            <view class="upload-explain">仅支持 png、jpg、xls、word</view>
          </view>
        </ui-card>
      </view>
    </scroll-view>

    <view
      class="page-footer flex-row"
      v-if="data.is_approval_permission && (data.approval_state === 1 || data.approval_state === 2)"
    >
      <uv-button
        type="error"
        shape="square"
        plain
        class="page-footer-btn"
        @click="showReject"
        text="驳回"
      />
      <uv-button
        type="primary"
        shape="square"
        class="page-footer-btn"
        @click="handleApprove"
        :loading="submitting"
        text="审批通过"
      />
    </view>
    <view
      v-if="data.is_approval_permission && (data.approval_state === 0 || data.approval_state === 4)"
      class="page-footer flex-row"
    >
      <uv-button type="primary" shape="square" plain class="page-footer-btn" @click="handleCancel">
        取消
      </uv-button>
      <uv-button
        type="primary"
        shape="square"
        class="page-footer-btn"
        :loading="submitting"
        @click="handleSubmit"
        text="提交"
      />
    </view>

    <view style="flex: none">
      <uv-popup v-model:show="showPopup" class="approve-popup">
        <view class="approve-content">
          <view class="approve-title">{{ isApprove ? '审批通过' : '驳回' }}原因</view>
          <textarea v-model="approve_desc" class="approve-editor" placeholder="请填写..." />
        </view>
        <view class="page-footer flex-row">
          <uv-button
            type="info"
            shape="square"
            plain
            class="page-footer-btn"
            @click="showPopup = false"
            text="取消"
          />
          <uv-button
            :type="isApprove ? 'primary' : 'error'"
            shape="square"
            class="page-footer-btn"
            :loading="submitting"
            @click="isApprove ? handleApprove() : handleReject()"
            text="确定"
          />
        </view>
      </uv-popup>
      <uv-action-sheet
        :actions="actionList"
        v-model:show="actionShow"
        @select="handleActionSelect"
      />
    </view>
  </view>
</template>

<script>
import { shareMixins, getServerUrl } from '@/config'
import test from '@/uni_modules/uview-plus/libs/function/test'
import {
  getDiffRecordReportDetailApi,
  submitDifferenceApi,
  approveDifferenceApi,
  uploadFile,
} from '@/api'
import { showLoading, hideLoading, toast, getPrevPage } from '@/utils/util'
import { approveStatusMap, approveStatusStyleMap, diffTypeMap } from '@/utils/enum'

function isOfficeFile(filePathOrName) {
  return /\.(doc|docx|xls|xlsx)$/.test(filePathOrName)
}

export default {
  data() {
    return {
      approve_desc: '',
      showPopup: false,
      isApprove: true,
      fileList: [],
      actionList: [
        {
          name: '从聊天记录里选择',
          accept: 'all',
        },
        {
          name: '从相册选择',
          accept: 'image',
          capture: ['album'],
        },
        {
          name: '拍照',
          accept: 'image',
          capture: ['camera'],
        },
        {
          name: '取消',
          action: 'cancel',
        },
      ],
      actionShow: false,
      queryOptions: {},
      data: {},
      submitting: false,
    }
  },
  mixins: [shareMixins],
  watch: {
    showPopup(val) {
      if (!val) {
        this.approve_desc = ''
      }
    },
  },
  computed: {
    fileListWithHttp() {
      const serverUrl = getServerUrl()
      return this.fileList.map((item) => {
        if (item.url && !item.url.startsWith('http')) {
          item.url = serverUrl + (item.url.startsWith('/') ? item.url : '/' + item.url)
        }
        return item
      })
    },
  },
  methods: {
    async getDiffRecordReportDetail() {
      try {
        showLoading()
        const data = await getDiffRecordReportDetailApi({
          difference_id: this.queryOptions.difference_id,
        })
        // data.diff_type = 1
        // data.approval_state = 0
        // data.is_approval_permission = true
        this.data = data
        if (data.file_url) {
          this.fileList = [
            {
              url: data.file_url,
            },
          ]
        }
        return data
      } catch (e) {
        return this.data
      } finally {
        hideLoading()
      }
    },
    async submitDifference() {
      if (!this.data.summit_note || !this.data.summit_note.trim()) {
        toast.error('请填写差异说明')
        return Promise.reject()
      }
      if (!this.fileList.length) {
        toast.error('请选择一个支持件')
        return Promise.reject()
      }
      try {
        this.submitting = true
        await submitDifferenceApi({
          file_url: this.fileList[0].url,
          approve_timeliness: this.data.approve_timeliness,
          difference_id: this.queryOptions.difference_id,
          summit_note: this.data.summit_note,
        })
        const newData = await this.getDiffRecordReportDetail()
        getPrevPage().$vm.updateItemApprovalStateByIndex(
          this.queryOptions.dataIndex,
          newData.approval_state,
        )
      } finally {
        this.submitting = false
      }
    },
    async approveDifference() {
      if (!this.approve_desc.trim()) {
        if (this.isApprove) {
          // toast.error('请填写审批通过原因')
        } else {
          toast.error('请填写驳回原因')
          return Promise.reject()
        }
      }
      try {
        this.submitting = true
        const data = await approveDifferenceApi({
          difference_id: this.queryOptions.difference_id,
          // approve_result: this.isApprove ? this.approve_desc : '',
          approve_result: this.isApprove,
          reject_desc: !this.isApprove ? this.approve_desc : '',
        })
        this.showPopup = false
        const newData = await this.getDiffRecordReportDetail()
        getPrevPage().$vm.updateItemApprovalStateByIndex(
          this.queryOptions.dataIndex,
          newData.approval_state,
        )
      } finally {
        this.submitting = false
      }
    },
    handleActionSelect(item) {
      if (item.action === 'cancel') {
        this.actionShow = false
        return
      }
      this.$refs.uploadRef.chooseFile({ accept: item.accept, capture: item.capture })
    },
    deletePic(event) {
      this.fileList.splice(event.index, 1)
    },
    beforeRead(event) {
      if (!Array.isArray(event)) {
        event = [event]
      }
      const res = event.filter((item) => {
        const name = item.name || item.url
        return test.image(name) || isOfficeFile(name)
      })
      if (res.length !== event.length) {
        toast.error('不支持此类文件')
      }
      return res
    },
    async afterRead(event) {
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      let lists = [].concat(event.file)
      let fileListLen = this.fileList.length
      lists.forEach((item) => {
        this.fileList.push({
          ...item,
          status: 'uploading',
          message: '',
        })
      })
      for (let i = 0; i < lists.length; i++) {
        let url = lists[i].url
        let status = 'success'
        try {
          const { file_url } = await this.doUploadFile(url)
          url = file_url
        } catch (e) {
          status = 'failed'
        }
        const item = this.fileList[fileListLen]
        this.fileList.splice(fileListLen, 1, {
          ...item,
          status,
          url,
        })
        fileListLen++
      }
    },
    doUploadFile(url) {
      return uploadFile({
        filePath: url,
        name: 'file',
        formData: {},
      })
    },
    handleCancel() {
      uni.navigateBack()
    },
    handleSubmit() {
      this.submitDifference()
    },
    showReject() {
      this.isApprove = false
      this.showPopup = true
    },
    showApprove() {
      this.isApprove = true
      this.showPopup = true
    },
    handleReject() {
      this.approveDifference()
    },
    handleApprove() {
      this.isApprove = true
      this.approveDifference()
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
  onLoad(options) {
    this.queryOptions = options
    this.getDiffRecordReportDetail()
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
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  margin-bottom: 12px;
}

.diff-detail-value {
  font-size: 16px;
  font-weight: bold;
}

.page-footer {
  padding: 16px;
  background-color: #fff;

  &-btn {
    flex: 1;

    &:not(:last-child) {
      margin-right: 16px;
    }
  }
}

.diff-description {
  font-family: Arial, Helvetica, sans-serif;
}

.diff-switch {
  margin: 16px;
}

.upload-wrapper {
  display: flex;
  align-items: flex-end;
}

.upload-trigger {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.5);

  &:active {
    color: rgba(0, 0, 0, 0.7);
    border-color: rgba(0, 0, 0, 0.6);
  }
}

.upload-explain {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
  margin-left: 8px;
}

.approve-popup {
  & ::v-deep .uv-popup__content {
    border-radius: 12px 12px 0 0;
  }
}

.diff-editor,
.approve-editor {
  width: 100%;
  height: 80px;
  font-size: 14px;
  border: none;
  background: none;
  color: #666;
  font-family: Arial, Helvetica, sans-serif;
}

.approve-title {
  font-size: 14px;
  // font-weight: bold;
  margin-bottom: 10px;
}

.approve-content {
  padding: 16px 16px 0;
}
</style>
