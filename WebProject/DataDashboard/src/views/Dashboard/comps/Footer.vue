<template>
  <div class="footer">
    <div class="fLeft">
      <div class="dashboardTitle">
        <div class="titleName">情报侦察</div>
      </div>
      <div class="msgInfoBox">
        <div class="msgInfoCon">
          <div class="msgInfoItem">
            <img src="@/assets/images/f1_1.png" alt="">
            <div class="msgInfo">
              <div class="msgTop">
                <p class="msgTitle">战场慧眼</p>
                <p class="msgTime">09:10</p>
              </div>
              <p class="msgDesc">无人机与侦察分队抵近侦察，实时回传敌部署...</p>
            </div>
          </div>
          <div class="msgInfoItem">
            <img src="@/assets/images/f1_2.png" alt="">
            <div class="msgInfo">
              <div class="msgTop">
                <p class="msgTitle">电磁密战</p>
                <p class="msgTime">09:10</p>
              </div>
              <p class="msgDesc">电子侦察单位监听、干扰敌通信与雷达信号...</p>
            </div>
          </div>
          <div class="msgInfoItem">
            <img src="@/assets/images/f1_3.png" alt="">
            <div class="msgInfo">
              <div class="msgTop">
                <p class="msgTitle">哨兵前出</p>
                <p class="msgTime">09:10</p>
              </div>
              <p class="msgDesc">通过战术数据链，将多源侦察情报实时融合...</p>
            </div>
          </div>
          <div class="msgInfoItem">
            <img src="@/assets/images/f1_4.png" alt="">
            <div class="msgInfo">
              <div class="msgTop">
                <p class="msgTitle">战场迷雾</p>
                <p class="msgTime">09:10</p>
              </div>
              <p class="msgDesc">敌实施伪装、佯动与电子欺骗，侦察需结合技...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fCenter">
      <div class="center_item">
        <div class="dashboardTitle">
          <div class="titleName">通信指挥</div>
          <div class="more">
            <p>查看更多</p>
            <img src="@/assets/icons/t_right.png" alt="">
          </div>
        </div>
        <div class="taskBox">
          <div class="taskItem" v-for="(item, index) in taskList" :key="index">
            <div class="taskInfo">
              <p class="taskTitle">{{item.title}}</p>
              <div class="taskProgress">
                <p class="tProgressTxt">任务进度</p>
                <div class="tProgressBar">
                  <div class="tProgress" :style="{width: item.progress + '%'}"></div>
                </div>
                <p class="tProgressNum">{{item.progress}}%</p>
              </div>
            </div>
            <div class="taskOpt">
              <div class="taskBtn btnStatus01">汇报进度</div>
              <div class="taskBtn btnStatus02">查看详情</div>
              <div class="taskBtn btnStatus03">结束任务</div>
            </div>
          </div>
        </div>
      </div>
      <div class="center_item">
        <div class="dashboardTitle">
          <div class="titleName">作战数量统计</div>
        </div>
        <div class="fightData">
          <div class="statisticsTitle">
            <div class="statisticsBox">
              <img src="@/assets/images/itemTitle.png" alt="">
              <div class="sTitleName">
                <p class="title">各营作战量统计数</p>
                <div class="titleNum">160 <span class="unit">次</span></div>
              </div>
            </div>
          </div>
          <div class="charDataCon">
            <!-- 极坐标 -->
            <div class="charLeft">
              <polar-bar-chart :data="workData"></polar-bar-chart>
            </div>
            <div class="charTitle">
              <div class="charTitleName">
                <span class="point"></span>
                <div class="titleTxt">各营作战量统计数</div>
              </div>
              <div class="chatDescs">
                <div class="descItem" v-for="(item, index) in workData" :key="index">
                  <div class="descPoint" :style="{backgroundColor: item.color}"></div>
                  <p class="descTxt">{{item.title}}</p>
                  <p class="descNum">{{item.value}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="center_item">
        <div class="dashboardTitle">
          <div class="titleName">资源消耗</div>
        </div>
        <div class="resourceBox">
          <div class="resourceItem" v-for="(item, index) in resourceList" :key="index">
            <CircleProgress :progress="item.progress" active-color="#09DFEB" >
              <div class="custom-label">
                <span class="percent">{{item.progress}}%</span>
                <span class="label">{{item.title}}</span>
              </div>
            </CircleProgress>
          </div>
        </div>
      </div> 
    </div>
    <div class="fRight">
      <div class="dashboardTitle">
        <div class="titleName">下级部队</div>
      </div>
      <div class="rightTable">
        <div class="tableHeader">
          <div class="tableItem">部队</div>
          <div class="tableItem">指挥</div>
          <div class="tableItem">状态</div>
        </div>
        <div class="tableCon">
          <div class="tableItem">
            <div class="tableCell cellName">一团一营</div>
            <div class="tableCell cellUser">白营长</div>
            <div class="tableCell cellStatus">
              <div class="status status01"></div>
              <p class="tagName">四级战备</p>
            </div>
          </div>
          <div class="tableItem activeBg">
            <div class="tableCell cellName">一团二营</div>
            <div class="tableCell cellUser">孟营长</div>
            <div class="tableCell cellStatus">
              <div class="status status02"></div>
              <p class="tagName">三级战备</p>
            </div>
          </div>
          <div class="tableItem">
            <div class="tableCell cellName">一团三营</div>
            <div class="tableCell cellUser">杜营长</div>
            <div class="tableCell cellStatus">
              <div class="status status02"></div>
              <p class="tagName">三级战备</p>
            </div>
          </div>
          <div class="tableItem">
            <div class="tableCell cellName">一团四营</div>
            <div class="tableCell cellUser">李营长</div>
            <div class="tableCell cellStatus">
              <div class="status status03"></div>
              <p class="tagName">二级战备</p>
            </div>
          </div>
          <div class="tableItem">
            <div class="tableCell cellName">二团一营</div>
            <div class="tableCell cellUser">张营长</div>
            <div class="tableCell cellStatus">
              <div class="status status04"></div>
              <p class="tagName">一级战备</p>
            </div>
          </div>
        </div>
      </div>
      <div class="right_bottom">
        <div class="rb_Btn">联合指挥</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import CircleProgress from '@/components/CircleProgress.vue';
import PolarBarChart from '@/components/PolarBarChart.vue';


const taskList = ref([
  {
    title: '一团对A区域作战任务',
    progress: 50,
  },
  {
    title: '一团对B区域作战任务',
    progress: 30,
  },
  {
    title: '二团对A区域作战任务',
    progress: 70,
  },
  {
    title: '二团对B区域作战任务',
    progress: 80,
  },
  {
    title: '二团对C区域作战任务',
    progress: 90,
  },
])

const resourceList = ref([
  {
    title: '弹药',
    progress: 50,
  },
  {
    title: '能源',
    progress: 25,
  },
  {
    title: '装备',
    progress: 13,
  },
  {
    title: '人员',
    progress: 14,
  },
  {
    title: '后勤物资',
    progress: 25,
  },
  {
    title: '通信资源',
    progress: 8,
  },
  {
    title: '作战平台',
    progress: 7,
  },
  {
    title: '医疗',
    progress: 13,
  },
])

const workData = ref([
  {
    title: '步兵营',
    value: 20,
    color: '#318FF9',
  },
  {
    title: '坦克营',
    value: 10,
    color: '#AA2FD6',
  },
  {
    title: '通信营',
    value: 20,
    color: '#67D62F',
  },
  {
    title: '炮兵营',
    value: 15,
    color: '#31F0FD',
  },
  {
    title: '汽车营',
    value: 10,
    color: '#8340FF',
  },
  {
    title: '后勤营',
    value: 10,
    color: '#E7E7E8',
  },
  {
    title: '飞机营',
    value: 20,
    color: '#E2BB31',
  },
  {
    title: '导弹营',
    value: 2,
    color: '#E33832',
  },
])

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
  .fLeft{
    width: px2rem($center-left-width);
    height: 100%;
    margin-right: px2rem(20);
    .msgInfoBox{
      width: 100%;
      height: calc(100% - px2rem(44));
      padding: px2rem(3) px2rem(10);
      box-sizing: border-box;
      .msgInfoCon{
        width: 100%;
        height: 100%;
        overflow-y: auto;
        .msgInfoItem{
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: px2rem(14);
          img{
            width: px2rem(24);
            height: px2rem(24);
            margin-right: px2rem(6);
          }
          .msgInfo{
            width: calc(100% - px2rem(30));
            height: auto;
            .msgTop{
              width: 100%;
              height: px2rem(24);
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: px2rem(2);
              p{
                color: #fff;
              }
              .msgTitle{
                font-size: px2rem(12);
                line-height: px2rem(18);
              }
              .msgTime{
                font-size: px2rem(8);
                line-height: px2rem(12);
                opacity: 0.5;
              }
            }
            .msgDesc{
              font-size: px2rem(10);
              color: #B0D8F5;
            }
          }
          .msgDesc{
            font-size: px2rem(10);
            line-height: px2rem(14);
            color: #fff;
            opacity: 0.7;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
  }
  .fCenter{
    width: calc(100% - px2rem($center-left-width+40+$center-right-width));
    height: 100%;
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    .center_item{
      width: calc((100% - px2rem(40))/3);
      height: 100%;
      margin-right: px2rem(20);
      .taskBox{
        width: 100%;
        height: calc(100% - px2rem(44));
        padding: px2rem(0) px2rem(10);
        box-sizing: border-box;
        overflow-y: auto;
        .taskItem{
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: px2rem(14);
          .taskInfo{
            width: calc(100% - px2rem(144));
            height: auto;
            .taskTitle{
              width: 100%;
              font-size: px2rem(12);
              line-height: px2rem(18);
              color: #fff;
              margin-bottom: px2rem(2);
            }
            .taskProgress{
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              .tProgressTxt{
                font-size: px2rem(10);
                line-height: px2rem(14);
                color: #fff;
                opacity: 0.7;
                margin-right: px2rem(8);
              }
              .tProgressBar{
                width: px2rem(70);
                height: px2rem(4);
                border-radius: px2rem(4);
                background-color: rgba(255, 255, 255, 0.1);
                margin-right: px2rem(4);
                .tProgress{
                  width: 0%;
                  height: px2rem(4);
                  border-radius: px2rem(4);
                  background-color: #09DFEB;
                }
              }
              .tProgressNum{
                font-size: px2rem(8);
                line-height: px2rem(12);
                color: #fff;
              }
            }
          }
          .taskOpt{
            width: px2rem(144);
            display: flex;
            align-items: center;
            justify-content: center;
            .taskBtn{
              width: px2rem(40);
              height: px2rem(20);
              font-size: px2rem(8);
              line-height: px2rem(12);
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: px2rem(8);
            }
            .btnStatus01{
              background-color: #FF852E;
            }
            .btnStatus02{
              background-color: #006FFF;
            }
            .btnStatus03{
              background-color: #FF2F00;
            }
          }
        }
      }
      .fightData{
        width: 100%;
        height: calc(100% - px2rem(36));
        .statisticsTitle{
          width: 100%;
          height: px2rem(62);
          padding: px2rem(14) px2rem(0) px2rem(14) px2rem(12);
          box-sizing: border-box;
          .statisticsBox{
            width: 100%;
            height: 100%;
            display: flex;
            img{
              width: px2rem(38);
              height: px2rem(34);
            }
            .sTitleName{
              width: calc(100% - px2rem(38));
              height: 100%;
              padding: 0 px2rem(12) 0 px2rem(20);
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: linear-gradient(90deg, rgba(8, 83, 106, 0.4) 0%, rgba(13, 78, 99, 0.02) 100%);
              .title{
                font-size: px2rem(12);
                line-height: px2rem(18);
                color: #B0D8F5;
              }
              .titleNum{
                display: flex;
                align-items: flex-end;
                font-size: px2rem(14);
                line-height: px2rem(18);
                color: #B0D8F5;
                .unit{
                  font-size: px2rem(8);
                  line-height: px2rem(16);
                  color: #99B3C8;
                  margin-left: px2rem(4);
                }
              }
            }
          }
        }
        .charDataCon{
          width: 100%;
          height: calc(100% - px2rem(62));
          padding: 0 px2rem(8);
          box-sizing: border-box;
          display: flex;
          align-items: center;
          .charLeft{
            width: px2rem(130);
            height: px2rem(130);
            margin-right: px2rem(18);
            // background: rgba(255,255,255,0.1);
          }
          .charTitle{
            width: calc(100% - px2rem(148));
            height: 100%;
            .charTitleName{
              width: 100%;
              height: px2rem(20);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: px2rem(14);
              .point{
                width: px2rem(6);
                height: px2rem(6);
                border-radius: px2rem(6);
                background-color: #EAB309;
                margin-right: px2rem(4);
              }
              .titleTxt{
                font-size: px2rem(12);
                line-height: px2rem(20);
                color: #B0D8F5;
              }
            }
            .chatDescs{
              width: 100%;
              height: calc(100% - px2rem(34));
              overflow-y: auto;
              display: flex;
              flex-wrap: wrap;
              align-content: flex-start;
              .descItem{
                width: calc((100% - px2rem(16))/3);
                height: px2rem(25);
                margin-right: px2rem(8);
                margin-bottom: px2rem(8);
                background: linear-gradient(90deg, rgba(44, 60, 85, 0.5) 0%, rgba(44, 60, 85, 0) 100%);
                padding: 0 px2rem(8);
                box-sizing: border-box;
                display: flex;
                align-items: center;
                .descPoint{
                  width: px2rem(8);
                  height: px2rem(8);
                  background-color: #EAB309;
                  margin-right: px2rem(4);
                }
                .descTxt{
                  font-size: px2rem(12);
                  line-height: px2rem(20);
                  color: #99B3C8;
                  opacity: 0.5;
                  margin-right: px2rem(4);
                }
                .descNum{
                  font-size: px2rem(12);
                  line-height: px2rem(20);
                  color: #99B3C8;
                }
              }
              .descItem:nth-child(3n){
                margin-right: 0;
              }
            }
          }
        }
      }
      .resourceBox{
        width: 100%;
        height: calc(100% - px2rem(44));
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: space-between;
        flex-wrap: wrap;
        overflow-y: auto;
        .resourceItem{
          width: px2rem(90);
          height: px2rem(90);
          .custom-label{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            
            .percent{
              font-size: px2rem(12);
              line-height: px2rem(18);
              color: #fff;
              margin-bottom: px2rem(2);
            }
            .label{
              font-size: px2rem(8);
              line-height: px2rem(12);
              color: #fff;
              opacity: 0.7;
            }
          }
        }
      }
    }
    .center_item:last-child{
      margin-right: 0;
    }
  }
  .fRight{
    width: px2rem($center-right-width);
    height: 100%;
    margin-left: px2rem(20);

    .rightTable{
      width: 100%;
      height: calc(100% - px2rem(94));
      font-size: px2rem(12);
      .tableHeader{
        width: 100%;
        height: px2rem(24);
        padding: 0 px2rem(14);
        box-sizing: border-box;
        background: rgba(13, 48, 99, 0.5);
        font-size: px2rem(10);
        line-height: px2rem(24);
        color: #99B3C8;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .tableCon{
        width: 100%;
        height: calc(100% - px2rem(24));
        overflow-y: auto;
        .tableItem{
          width: 100%;
          height: px2rem(24);
          padding: 0 px2rem(14);
          box-sizing: border-box;
          font-size: px2rem(10);
          line-height: px2rem(24);
          color: #99B3C8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .tableCell.cellStatus{
            display: flex;
            align-items: center;
            .status{
              width: px2rem(6);
              height: px2rem(6);
              margin-right: px2rem(4);
              border-radius: px2rem(1);
            }
            .status.status01{
              background-color: #60FF2B;
            }
            .status.status02{
              background-color: #006FFF;
            }
            .status.status03{
              background-color: #FF852E;
            }
            .status.status04{
              background-color: #FF2F00;
            }
          }
        }
        .tableItem.activeBg{
          background: url('@/assets/images/f6_1.png') no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
    .right_bottom{
      width: 100%;
      height: px2rem(50);
      display: flex;
      align-items: center;
      justify-content: center;
      .rb_Btn{
        width: px2rem(160);
        height: px2rem(32);
        background-color: #006FFF;
        font-size: px2rem(12);
        line-height: px2rem(30);
        font-weight: bold;
        color: #fff;
        text-align: center;
        margin-top: px2rem(18);
      }
    }
  }
}

.dashboardTitle{
  width: 100%;
  height: px2rem(36);
  margin-bottom: px2rem(8);
  padding: 0 px2rem(12);
  box-sizing: border-box;
  background-color: rgba(13, 48, 99, 0.5);
  border-left: px2rem(4) solid #12539D;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .titleName{
    font-size: px2rem(16);
    font-weight: bolder;
    color: #B0D8F5;
    text-shadow: 0 px2rem(4) px2rem(16)  #3F91D8;
  }
  .more{
    display: flex;
    align-items: center;
    p{
      font-size: px2rem(10);
      color: #00F2FF;
      margin-right: px2rem(2);
    }
    img{
      width: px2rem(12);
      height: px2rem(12);
    }
  }
}
</style>
