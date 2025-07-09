<template>
	<view class="mask flex-center" v-if="shown">
		<view class="content button-radius">
			<view class="content-top">
				<view class="content-top-text">{{ title || '发现新版本' }}</view>
				<view class="content-version-text">V{{ version }}</view>
				<image class="content-top-image" mode="widthFix" src="/uni_modules/uni-upgrade-center-app/static/app/upgrade-rocket.png"></image>
			</view>
			<view class="content-header"></view>
			<view class="content-body">
				<view class="content-body-title">
					<text>{{ subTitle }}：</text>
				</view>
				<view class="body">
					<scroll-view class="box-des-scroll" scroll-y="true">
						<view class="box-des-item" v-for="(log, index) in contentsLines" :key="index">
							{{ log }}
						</view>
					</scroll-view>
				</view>
				<view class="footer flex-center">
					<button v-if="!is_mandatory && !downloading" class="content-button cancel" @click="closeUpdate">
						{{ cancelDownLoadBtnText }}
					</button>
					<template v-if="isApplicationStore">
						<button class="content-button" @click="jumpToApplicationStore">
							{{ downLoadBtnTextiOS }}
						</button>
					</template>
					<template v-else>
						<template v-if="!downloadSuccess">
							<view class="progress-box flex-column" v-if="downloading">
								<progress class="progress" :percent="downLoadPercent" activeColor="#165dff" show-info stroke-width="6" />
								<view class="progress-text">
									<text>{{ downLoadingText }}</text>
									<text>({{ downloadedSize }}/{{ packageFileSize }}M)</text>
								</view>
							</view>

							<button v-else class="content-button" @click="updateApp">
								{{ downLoadBtnText }}
							</button>
						</template>
						<button
							v-else-if="downloadSuccess && !installed"
							class="content-button long"
							:loading="installing"
							:disabled="installing"
							@click="installPackage"
						>
							{{ installing ? '正在安装……' : '下载完成，立即安装' }}
						</button>
						<button
							v-else-if="installed && !isWGT"
							class="content-button long"
							:loading="installing"
							:disabled="installing"
							@click="installPackage"
						>
							安装未完成，点击安装
						</button>

						<button v-else-if="installed && isWGT" class="content-button long" @click="restart">安装完毕，点击重启</button>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef APP-PLUS
import { createNotificationProgress, cancelNotificationProgress, finishNotificationProgress } from '@/uni_modules/uts-progressNotification';
// #endif
import { compare, platform_iOS, platform_Android, platform_Harmony } from '../utils/utils'
const localFilePathKey = 'UNI_ADMIN_UPGRADE_CENTER_LOCAL_FILE_PATH';

let downloadTask = null;
let openSchemePromise;

export default {
    emits: ['close', 'show'],
	data() {
		return {
			// 从之前下载安装
			installForBeforeFilePath: '',

			// 安装
			installed: false,
			installing: false,

			// 下载
			downloadSuccess: false,
			downloading: false,

			downLoadPercent: 0,
			downloadedSize: 0,
			packageFileSize: 0,

			tempFilePath: '', // 要安装的本地包地址

			// 默认安装包信息
			title: '',
			contents: '',
			version: '',
			is_mandatory: false,
			url: '',
			platform: [],
			store_list: null,

			// 可自定义属性
			subTitle: '更新内容',
			downLoadBtnTextiOS: '立即跳转更新',
			downLoadBtnText: '立即下载更新',
			downLoadingText: '安装包下载中，请稍候',

			cancelDownLoadBtnText: '取消',

			// #ifdef APP-PLUS
			shown: true,
			// #endif
			// #ifdef APP-HARMONY
			shown: false,
			// #endif
		};
	},
	onLoad({ local_storage_key }) {
		if (!local_storage_key) {
			console.error('local_storage_key为空，请检查后重试');
			uni.navigateBack();
			return;
		}

		const localPackageInfo = uni.getStorageSync(local_storage_key);
		if (!localPackageInfo) {
			console.error('安装包信息为空，请检查后重试');
			uni.navigateBack();
			return;
		}

		this.setLocalPackageInfo(localPackageInfo)
	},
	onBackPress() {
		// 强制更新不允许返回
		if (this.is_mandatory) return true;
		if (!this.needNotificationProgress) downloadTask && downloadTask.abort();
	},
	onHide() {
		openSchemePromise = null;
	},
	computed: {
		isWGT() {
			return this.type === 'wgt';
		},
		isNativeApp() {
			return this.type === 'native_app';
		},
		isiOS() {
			return this.platform.indexOf(platform_iOS) !== -1;
		},
		isAndroid() {
			return this.platform.indexOf(platform_Android) !== -1;
		},
		isHarmony() {
			return this.platform.indexOf(platform_Harmony) !== -1;
		},
		isApplicationStore() {
			return !this.isWGT && this.isNativeApp && (
				this.isiOS ||
				this.isHarmony
			)
			// return this.isiOS || (!this.isiOS && !this.isWGT && this.url.indexOf('.apk') === -1);
		},
		needNotificationProgress() {
			return this.platform.indexOf(platform_iOS) === -1 && !this.is_mandatory && !this.isHarmony;
		},
		contentsLines() {
			return this.contents.split('\n');
		}
	},
	methods: {
		show(shown, localPackageInfo) {
			// #ifdef APP-HARMONY
			this.$emit('show')
			if (localPackageInfo) {
				this.shown = shown
				this.setLocalPackageInfo(localPackageInfo)
			} else {
				console.error(`安装包信息为空，请检查后重试`);
			}
			// #endif
		},
		setLocalPackageInfo(localPackageInfo) {
			const requiredKey = ['version', 'url', 'type'];
			for (let key in localPackageInfo) {
				if (requiredKey.indexOf(key) !== -1 && !localPackageInfo[key]) {
					console.error(`参数 ${key} 必填，请检查后重试`);
					// #ifdef APP-PLUS
					uni.navigateBack();
					// #endif
					// #ifdef APP-HARMONY
					this.shown = false
					// #endif
					return;
				}
			}
			Object.assign(this, localPackageInfo);
			this.checkLocalStoragePackage();
		},
		checkLocalStoragePackage() {
			// 如果已经有下载好的包，则直接提示安装
			const localFilePathRecord = uni.getStorageSync(localFilePathKey);
			if (localFilePathRecord) {
				const { version, savedFilePath, installed } = localFilePathRecord;

				// 比对版本
				if (!installed && compare(version, this.version) === 0) {
					this.downloadSuccess = true;
					this.installForBeforeFilePath = savedFilePath;
					this.tempFilePath = savedFilePath;
				} else {
					// 如果保存的包版本小 或 已安装过，则直接删除
					this.deleteSavedFile(savedFilePath);
				}
			}
		},
		askAbortDownload() {
			uni.showModal({
				title: '是否取消下载？',
				cancelText: '否',
				confirmText: '是',
				success: (res) => {
					if (res.confirm) {
						downloadTask && downloadTask.abort();
						if (this.needNotificationProgress) {
							cancelNotificationProgress();
						}
						uni.navigateBack();
					}
				}
			});
		},
		async closeUpdate() {
			if (this.downloading) {
				if (this.is_mandatory) {
					return uni.showToast({
						title: '下载中，请稍后……',
						icon: 'none',
						duration: 500
					});
				}
				if (!this.needNotificationProgress) {
					this.askAbortDownload();
					return;
				}
			}

			if (!this.needNotificationProgress && this.downloadSuccess && this.tempFilePath) {
				// 包已经下载完毕，稍后安装，将包保存在本地
				await this.saveFile(this.tempFilePath, this.version);
			}

			// #ifdef APP-PLUS
			uni.navigateBack();
			// #endif
			// #ifdef APP-HARMONY
			this.shown = false
			this.$emit('close')
			// #endif
		},
		updateApp() {
			this.checkStoreScheme()
				.catch(() => {
					this.downloadPackage();
				})
				.finally(() => {
					openSchemePromise = null;
				});
		},
		// 跳转应用商店
		checkStoreScheme() {
			const storeList = (this.store_list || []).filter((item) => item.enable);
			if (storeList && storeList.length) {
				storeList
					.sort((cur, next) => next.priority - cur.priority)
					.map((item) => item.scheme)
					.reduce((promise, cur, curIndex) => {
						openSchemePromise = (promise || (promise = Promise.reject())).catch(() => {
							return new Promise((resolve, reject) => {
								plus.runtime.openURL(cur, (err) => {
									reject(err);
								});
							});
						});
						return openSchemePromise;
					}, openSchemePromise);
				return openSchemePromise;
			}

			return Promise.reject();
		},
		downloadPackage() {
			this.downloading = true;
			//下载包
			downloadTask = uni.downloadFile({
				url: this.url,
				success: (res) => {
					console.log('下载结束，statusCode：', res.statusCode)
					if (res.statusCode == 200) {
						// fix: wgt 文件下载完成后后缀不是 wgt
						if (this.isWGT && res.tempFilePath.split('.').slice(-1)[0] !== 'wgt') {
							console.log('下载wgt:', res.tempFilePath)
							const failCallback = (e) => {
								console.log('[FILE RENAME FAIL]：', JSON.stringify(e));
							};
							// #ifndef APP-HARMONY
							plus.io.resolveLocalFileSystemURL(
								res.tempFilePath,
								(entry) => {
									entry.getParent((parent) => {
										const newName = `new_wgt_${Date.now()}.wgt`;
										entry.copyTo(
											parent,
											newName,
											(res) => {
												this.tempFilePath = res.fullPath;
												console.log('copy wgt:', this.tempFilePath)
												this.downLoadComplete();
											},
											failCallback
										);
									}, failCallback);
								},
								failCallback
							);
							// #endif
							// #ifdef APP-HARMONY
							failCallback({code: -1, message: 'Download content error, is not wgt.'})
							// #endif
						} else {
							console.log('下载完成，tempFilePath：', res.tempFilePath)
							this.tempFilePath = res.tempFilePath;
							this.downLoadComplete();
						}
					} else {
						console.log('下载错误：' + JSON.stringify(res))
            			this.downloadFail()
					}
				},
				fail: (err) => {
					console.log('下载错误：' + JSON.stringify(err))
					this.downloadFail()
				}
			});

			downloadTask.onProgressUpdate((res) => {
				this.downLoadPercent = res.progress;
				this.downloadedSize = (res.totalBytesWritten / Math.pow(1024, 2)).toFixed(2);
				this.packageFileSize = (res.totalBytesExpectedToWrite / Math.pow(1024, 2)).toFixed(2);

				if (this.needNotificationProgress && !this.downloadSuccess) {
					createNotificationProgress({
						title: '升级中心正在下载安装包……',
						content: `${this.downLoadPercent}%`,
						progress: this.downLoadPercent,
						onClick: () => {
							this.askAbortDownload();
						}
					});
				}
			});
			// if (this.needNotificationProgress) {
			// 	uni.navigateBack();
			// }
		},
		downloadFail() {
			const errMsg = '下载失败，请点击重试'

			this.downloadSuccess = false;
			this.downloading = false;

			this.downLoadPercent = 0;
			this.downloadedSize = 0;
			this.packageFileSize = 0;

			this.downLoadBtnText = errMsg

			downloadTask = null;

			if (this.needNotificationProgress) {
				finishNotificationProgress({
					title: '升级包下载失败',
					content: '请重新检查更新'
				});
			}
		},
		downLoadComplete() {
			this.downloadSuccess = true;
			this.downloading = false;

			this.downLoadPercent = 0;
			this.downloadedSize = 0;
			this.packageFileSize = 0;

			downloadTask = null;

			if (this.needNotificationProgress) {
				finishNotificationProgress({
					title: '安装升级包',
					content: '下载完成'
				});

				this.installPackage();
				return;
			}

			// 强制更新，直接安装
			if (this.is_mandatory) {
				this.installPackage();
			}
		},
		installPackage() {
			// #ifdef APP-PLUS || APP-HARMONY
			// wgt资源包安装
			if (this.isWGT) {
				this.installing = true;
			}
			plus.runtime.install(
				this.tempFilePath,
				{
					force: false
				},
				async (res) => {
					this.installing = false;
					this.installed = true;

					// wgt包，安装后会提示 安装成功，是否重启
					if (this.isWGT) {
						// 强制更新安装完成重启
						if (this.is_mandatory) {
							// #ifdef APP-PLUS
							uni.showLoading({
								icon: 'none',
								title: '安装成功，正在重启……'
							});
							// #endif

							setTimeout(() => {
								// #ifdef APP-PLUS
								uni.hideLoading();
								// #endif
								this.restart();
							}, 1000);
						}
					} else {
						const localFilePathRecord = uni.getStorageSync(localFilePathKey);
						uni.setStorageSync(localFilePathKey, {
							...localFilePathRecord,
							installed: true
						});
					}
				},
				async (err) => {
					// 如果是安装之前的包，安装失败后删除之前的包
					if (this.installForBeforeFilePath) {
						await this.deleteSavedFile(this.installForBeforeFilePath);
						this.installForBeforeFilePath = '';
					}

					// 安装失败需要重新下载安装包
					this.installing = false;
					this.installed = false;

					uni.showModal({
						title: '更新失败，请重新下载',
						content: err.message,
						showCancel: false
					});
				}
			);

			// 非wgt包，安装跳出覆盖安装，此处直接返回上一页
			if (!this.isWGT && !this.is_mandatory) {
				uni.navigateBack();
			}
			// #endif
		},
		restart() {
			this.installed = false;
			// #ifdef APP-HARMONY
			uni.showModal({
				title: '更新完毕',
				content: '请手动重启',
				showCancel: false,
				success(res) {
					plus.runtime.quit()
				}
			})
			// #endif
			// #ifdef APP-PLUS
			//更新完重启app
			plus.runtime.restart();
			// #endif
		},
		saveFile(tempFilePath, version) {
			return new Promise((resolve, reject) => {
				uni.saveFile({
					tempFilePath,
					success({ savedFilePath }) {
						uni.setStorageSync(localFilePathKey, {
							version,
							savedFilePath
						});
					},
					complete() {
						resolve();
					}
				});
			});
		},
		deleteSavedFile(filePath) {
			uni.removeStorageSync(localFilePathKey);
			return uni.removeSavedFile({
				filePath
			});
		},
		jumpToApplicationStore() {
			plus.runtime.openURL(this.url);
		}
	}
};
</script>

<style>
page {
	background: transparent;
}
</style>

<style lang="scss" scoped>
page {
	background: transparent;
}

.flex-center {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	justify-content: center;
	align-items: center;
}

.flex-column {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.mask {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.4);
}

.button-radius {
	border-radius: 20rpx;
}

.content {
	position: relative;
	width: 640rpx;
	background-color: #fff;
	box-sizing: border-box;
	padding: 0 32rpx;
	font-family: Source Han Sans CN;
    background: #f7f8fa;
}

.content-top {
	padding-top: 48rpx;
}

.content-version-text {
	font-size: 28rpx;
	color: #4E5969;
	margin-top: 8rpx;
}

.content-top-image {
	position: absolute;
	top: -80rpx;
	right: 10rpx;
	width: 266rpx;
	height: 272rpx;
}

.content-top-text {
	font-size: 44rpx;
	font-weight: bold;
}

.content-header {
	height: 68rpx;
}

.content-body-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #1D2129;
	margin-bottom: 8rpx;
}

.content-body {
  width: 100%;
}

.footer {
	padding: 24rpx 0 48rpx;
}

.box-des-scroll {
	box-sizing: border-box;
	height: 200rpx;
	text-align: left;
}

.box-des-item {
	font-size: 26rpx;
	padding: 10rpx 0;
	color: #4e5969;

	&::before {
		display: inline-block;
		content: '·';
		font-size: 52rpx;
		margin-right: 20rpx;
		color: $uni-color-primary;
		line-height: 12rpx;
		width: 12rpx;
		height: 12rpx;
		vertical-align: middle;
	}
}

.progress-box {
	width: 100%;
}

.progress {
	width: 90%;
	height: 12rpx;
	border-radius: 12rpx;
	margin-bottom: 16rpx;
}

.progress-text {
	width: 100%;
	font-size: 28rpx;
	color: #4e5969;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.content-button {
	text-align: center;
	font-size: 30rpx;
	font-weight: 400;
	color: #fff;
	border: none;
	flex: 1;
	border-radius: 40rpx;
	padding: 0 30rpx;
	white-space: nowrap;
	height: 80rpx;
	line-height: 80rpx;
	background-color: $uni-color-primary;

	&:active {
		background-color: darken($uni-color-primary, 15%);
	}

	&::after {
		border: none;
	}

	&.cancel {
		color: #4E5969;
		background-color: #f0f0f0;
		margin-right: 32rpx;

		&:active {
			background-color: darken(#f0f0f0, 15%);
		}
	}

	&.long {
		flex: 3.5;
	}
}
</style>
