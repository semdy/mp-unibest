<template>
	<view :style="{ height: statusBarHeight }" class="uni-status-bar">
		<slot />
	</view>
</template>

<script>
	export default {
		name: 'UniStatusBar',
		data() {
			return {
				statusBarHeight: ''
			}
		},
		mounted() {
			const { statusBarHeight } = uni.getSystemInfoSync()
      if (statusBarHeight) {
        this.statusBarHeight = statusBarHeight + 'px'
      }
		}
	}
</script>

<style lang="scss" >
	.uni-status-bar {
    flex-shrink: 0;
		height: 20px;
		// height: var(--status-bar-height);
    /** #ifdef H5 */
    height: constant(safe-area-inset-top);
    height: env(safe-area-inset-top);
    /** #endif */
	}
</style>
