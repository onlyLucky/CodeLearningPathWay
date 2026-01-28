<template>
  <div class="dashboard">
    <DashboardHeader></DashboardHeader>
    <div class="dashboardCon">
      <div class="conBox">
        <div class="dashboardCenter">
          <CenterLeft></CenterLeft>
          <div class="MapCon">
            <MapComps></MapComps>
          </div>
          <CenterRight></CenterRight>
        </div>
        
        <DashboardFooter></DashboardFooter>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MapComps from '@/components/MapComps/index.vue'
import DashboardFooter from './comps/Footer.vue'
import DashboardHeader from './comps/Header.vue'
import CenterLeft from './comps/CenterLeft.vue'
import CenterRight from './comps/CenterRight.vue'

import { defineComponent } from 'vue';

defineComponent({
  components: {
    MapComps,
    DashboardFooter,
    DashboardHeader,
    CenterLeft,
    CenterRight,
  }
})
</script>

<style scoped lang="scss">
.dashboard {
  width: 100%;
  height: 100%;
  background:url("@/assets/images/bg.png") no-repeat center center;
  background-size: cover;
  overflow: hidden;
  .dashboardCon{
    width: 100%;
    height: calc(100% - px2rem(88));
    padding: px2rem(8) px2rem(20) px2rem(20) px2rem(20);
    box-sizing: border-box;
    background: linear-gradient(180deg, rgba(7, 14, 28, 1) 0%, rgba(7, 14, 28, 0) 0%, rgba(7, 14, 28, 0.63) 20.83%, rgba(7, 14, 28, 0.79) 100%, rgba(7, 14, 28, 0.7) 100%);
    .conBox{
      width: 100%;
      height: 100%;
      overflow: hidden;
      .dashboardCenter{
        width: 100%;
        height: calc(100% - px2rem(256));
        margin-bottom: px2rem(20);
        display: flex;
        .MapCon{
          width: calc(100% - px2rem($center-left-width+40+$center-right-width));
          margin: 0 px2rem(20);
        }
      }
    }
    // background-color: lightblue;
  }
}
</style>
