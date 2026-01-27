<template>
  <div class="header">
    <div class="headerMain">
      <div class="headerLeft">
        <img class="logo" src="@/assets/images/hLogo.png" alt="">
        <!-- 天气 -->
        <div class="weather">
          <div class="weatherIcon">
            <img src="@/assets/images/weather.png" alt="">
            <div class="weatherType">多云</div>
          </div>
          <p class="weatherInfo">17℃ ~ 24℃</p>
        </div>
      </div>
      <div class="headerCenter"></div>
      <div class="headerRight">
        <div class="dateString">
          <p class="date">2023-08-10</p>
          <p class="dateWeek">星期五</p>
        </div>
        <div class="timeString">16:13:22</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineComponent } from 'vue';

defineComponent({
  name: 'DashboardHeader',
})
</script>
<style scoped lang="scss">
.header{
  width: 100%;
  height: px2rem($header-height);
  .headerMain{
    width: 100%;
    height: px2rem($header-main-height);
    background: linear-gradient(180deg, rgba(12, 39, 78, 0) 0%, rgba(12, 39, 78, 1) 100%);
    position: relative;
    padding: 0 px2rem(20); 
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .headerLeft{
      display: flex;
      align-items: center;
      .logo{
        width: px2rem(196);
        height: auto;
      }
      .weather{
        display: flex;
        align-items: center;
        margin-left: px2rem(150);
        .weatherIcon{
          display: flex;
          align-items: center;
          img{
            width: px2rem(36);
            height: auto;
            margin-right: px2rem(12);
          }
          .weatherType{
            font-size: px2rem(16);
            line-height: px2rem(23);
            color: $header-color;
          }
        }
        .weatherInfo{
          font-size: px2rem(16);  
          color: $header-color;
          line-height: px2rem(23);
          margin-left: px2rem(40);
        }
      }
    }
    .headerCenter{
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: px2rem(500);
      height: px2rem($header-height);
      background: url("@/assets/images/hTitle.png") no-repeat center center;
      background-size: cover;
    }
    .headerRight{
      display: flex;
      align-items: center;
      .dateString{
        display: flex;
        align-items: center;
        font-size: px2rem(16);
        line-height: px2rem(23);
        color: $header-color;
        margin-right: px2rem(42);
        .date{
          margin-right: px2rem(20);
        }
      }
      .timeString{
        font-size: px2rem(24);
        line-height: px2rem(30);
        font-weight: bold;
        color: #fff;
      }
    }
  }
}
</style>
