<template>
  <div>
    <VirtualList :listData="data" :itemSize="100" />
  </div>
</template>

<script>
import VirtualList from './VirtualList.vue'

const d = []
for (let i = 0; i < 10000; i++) {
  d.push({ id: i, value: i })
}

export default {
  components: {
    VirtualList
  },
  data() {
    return {
      data: d
    }
  }
}
</script>
