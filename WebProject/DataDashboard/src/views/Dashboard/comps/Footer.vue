<template>
  <div class="footer">
  </div>
</template>
<script setup lang="ts">
import { defineComponent } from 'vue';

defineComponent({
  name: 'DashboardFooter',
})
</script>
<style scoped lang="scss">
.footer{
  width: 100%;
  height: px2rem(236);
  display: flex;
  align-items: center;
  justify-content: center;
  .title{
    font-size: px2rem(24);
    // font-size: 24px;
    font-weight: bold;
  }
}
</style>
