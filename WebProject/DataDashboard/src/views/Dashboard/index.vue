<template>
  <div class="dashboard">
    <div class="MapCon">
      <map-comps></map-comps>
    </div>
  </div>
</template>

<script setup lang="ts">
import MapComps from '@/components/MapComps/index.vue'
import { defineComponent } from 'vue';

defineComponent({
  components: {
    MapComps
  }
})
</script>

<style scoped lang="scss">
.dashboard {
  width: 100%;
  height: 100%;
  color: $primary-color;
  font-size: px2rem(16);
  // font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  .MapCon{
    width: 60%;
    height: 100%;
  }
}
</style>
