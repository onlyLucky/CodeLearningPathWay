<template>
  <div class="footer">
    <div class="fLeft">
      <div class="dashboardTitle">
        <div class="titleName">情报侦察</div>
      </div>
      <div class="msgInfoBox">
        <div class="msgInfoCon" ref="msgInfoConRef" @mouseenter="pauseScroll" @mouseleave="resumeScroll">
          <div class="msgInfoWrapper">
            <div class="msgInfoItem" v-for="(item,index) in msgInfoList" :key="'first-' + index">
              <img v-if="item.status === 1" src="@/assets/images/f1_1.png" alt="">
              <img v-if="item.status === 2" src="@/assets/images/f1_2.png" alt="">
              <img v-if="item.status === 3" src="@/assets/images/f1_3.png" alt="">
              <img v-if="item.status === 4" src="@/assets/images/f1_4.png" alt="">
              <div class="msgInfo">
                <div class="msgTop">
                  <p class="msgTitle">{{item.title}}</p>
                  <p class="msgTime">{{item.time}}</p>
                </div>
                <p class="msgDesc">{{item.desc}}</p>
              </div>
            </div>
            <div class="msgInfoItem" v-for="(item,index) in msgInfoList" :key="'second-' + index">
              <img v-if="item.status === 1" src="@/assets/images/f1_1.png" alt="">
              <img v-if="item.status === 2" src="@/assets/images/f1_2.png" alt="">
              <img v-if="item.status === 3" src="@/assets/images/f1_3.png" alt="">
              <img v-if="item.status === 4" src="@/assets/images/f1_4.png" alt="">
              <div class="msgInfo">
                <div class="msgTop">
                  <p class="msgTitle">{{item.title}}</p>
                  <p class="msgTime">{{item.time}}</p>
                </div>
                <p class="msgDesc">{{item.desc}}</p>
              </div>
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
        <div class="taskBox" ref="taskBoxRef" @mouseenter="pauseTaskScroll" @mouseleave="resumeTaskScroll">
          <div class="taskBoxWrapper">
            <div class="taskItem" v-for="(item, index) in taskList" :key="'task-first-' + index">
              <div class="taskInfo">
                <p class="taskTitle">{{item.title}}</p>
                <div class="taskProgress">
                  <p class="tProgressTxt">任务进度</p>
                  <div class="tProgressBar">
                    <div class="tProgress" :style="{width: item.targetProgress + '%'}"></div>
                  </div>
                  <p class="tProgressNum">{{item.targetProgress}}%</p>
                </div>
              </div>
              <div class="taskOpt">
                <div class="taskBtn btnStatus01">汇报进度</div>
                <div class="taskBtn btnStatus02">查看详情</div>
                <div class="taskBtn btnStatus03">结束任务</div>
              </div>
            </div>
            <div class="taskItem" v-for="(item, index) in taskList" :key="'task-second-' + index">
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
                <div class="titleNum">{{workTotal}} <span class="unit">次</span></div>
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
        <div class="tableCon" ref="tableConRef" @mouseenter="pauseTableScroll" @mouseleave="resumeTableScroll">
          <div class="tableConWrapper">
            <div class="tableItem" v-for="(item, index) in teamListData" :key="index">
              <div class="tableCell cellName">{{item.teamName}}</div>
              <div class="tableCell cellUser">{{item.leaderName}}</div>
              <div class="tableCell cellStatus">
                <div class="status" :class="`status0${item.status}`"></div>
                <p class="tagName">{{item.statusTxt}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right_bottom">
        <div class="rb_Btn btn01" v-if="!isInMeeting" @click="goUnitVideo">联合指挥</div>
        <div class="rb_Btn btn02" v-else @click="cancelUnitVideo">取消指挥</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, nextTick, inject} from 'vue';
import { gsap } from 'gsap';
import CircleProgress from '@/components/CircleProgress.vue';
import PolarBarChart from '@/components/PolarBarChart.vue';

let teamTabCurrent = ref(0)
// 定义滚动功能的响应式引用
const msgInfoConRef = ref<HTMLElement | null>(null);
const taskBoxRef = ref<HTMLElement | null>(null);
const tableConRef = ref<HTMLElement | null>(null);
let animationFrameId: number | null = null;
let msgScrollTop = 0;
let taskScrollTop = 0;
let tableScrollTop = 0;
let scrollSpeed = 0.6; // 滚动速度
let isMsgPaused = false;
let isTaskPaused = false;
let isTablePaused = false;
let lastTimestamp = 0;
const FRAME_RATE = 60; // 限制为30帧
const FRAME_INTERVAL = 1000 / FRAME_RATE; // 每帧间隔时间

/* 情报侦查 */
var msgInfoList = ref([
  {
    title: "战场慧眼",
    time: "09:00",
    desc: "无人机与侦察分队抵近侦察，实时回传敌部署...",
    status: 1,
  },
  {
    title: "电磁密战",
    time: "09:20",
    desc: "电子侦察单位监听、干扰敌通信与雷达信号...",
    status: 2,
  },
  {
    title: "哨兵前出",
    time: "10:12",
    desc: "通过战术数据链，将多源侦察情报实时融合...",
    status: 3,
  },
  {
    title: "战场迷雾",
    time: "10:30",
    desc: "敌实施伪装、佯动与电子欺骗，侦察需结合技...",
    status: 4,
  },
  {
    title: "战场慧眼",
    time: "09:00",
    desc: "无人机与侦察分队抵近侦察，实时回传敌部署...",
    status: 1,
  },
  {
    title: "电磁密战",
    time: "09:20",
    desc: "电子侦察单位监听、干扰敌通信与雷达信号...",
    status: 2,
  },
  {
    title: "哨兵前出",
    time: "10:12",
    desc: "通过战术数据链，将多源侦察情报实时融合...",
    status: 3,
  },
  {
    title: "战场迷雾",
    time: "10:30",
    desc: "敌实施伪装、佯动与电子欺骗，侦察需结合技...",
    status: 4,
  },
])

// 统一的滚动函数，使用单个requestAnimationFrame并限制为30帧
const unifiedScrollStep = (timestamp: number) => {
  // 计算时间差，以确保帧率稳定在30fps
  if (timestamp - lastTimestamp >= FRAME_INTERVAL) {
    // 消息滚动
    if (!isMsgPaused && msgInfoConRef.value) {
      const msgContainer = msgInfoConRef.value;
      const msgSingleSetHeight = msgContainer.scrollHeight / 2;
      
      msgScrollTop += scrollSpeed;
      
      if (msgScrollTop >= msgSingleSetHeight) {
        msgScrollTop = 0;
        msgInfoConRef.value.scrollTop = msgScrollTop;
      } else {
        msgInfoConRef.value.scrollTop = msgScrollTop;
      }
    }
    
    // 任务框滚动
    if (!isTaskPaused && taskBoxRef.value) {
      const taskContainer = taskBoxRef.value;
      const taskSingleSetHeight = taskContainer.scrollHeight / 2;
      
      taskScrollTop += scrollSpeed;
      
      if (taskScrollTop >= taskSingleSetHeight) {
        taskScrollTop = 0;
        taskBoxRef.value.scrollTop = taskScrollTop;
      } else {
        taskBoxRef.value.scrollTop = taskScrollTop;
      }
    }
    
    // 表格滚动
    if (!isTablePaused && tableConRef.value) {
      const tableContainer = tableConRef.value;
      const tableSingleSetHeight = tableContainer.scrollHeight / 2;
      
      tableScrollTop += scrollSpeed;
      
      if (tableScrollTop >= tableSingleSetHeight) {
        tableScrollTop = 0;
        tableConRef.value.scrollTop = tableScrollTop;
      } else {
        tableConRef.value.scrollTop = tableScrollTop;
      }
    }
    
    lastTimestamp = timestamp;
  }
  
  animationFrameId = requestAnimationFrame(unifiedScrollStep);
};

const startScrolling = () => {
  // 初始化滚动位置
  msgScrollTop = 0;
  taskScrollTop = 0;
  tableScrollTop = 0;
  
  // 启动统一的滚动循环
  animationFrameId = requestAnimationFrame(unifiedScrollStep);
};

const pauseScroll = () => {
  isMsgPaused = true;
};

const resumeScroll = () => {
  isMsgPaused = false;
};

const pauseTaskScroll = () => {
  isTaskPaused = true;
};

const resumeTaskScroll = () => {
  isTaskPaused = false;
};

const pauseTableScroll = () => {
  isTablePaused = true;
};

const resumeTableScroll = () => {
  isTablePaused = false;
};

/* 下级部队作战任务 */
var teamListData = ref<any[]>([])
const teamTabList = [
  [
    {teamName: '一团一营',leaderName: '白营长',status: 3,statusTxt: '三级战备'},
    {teamName: '一团二营',leaderName: '孟营长',status: 2,statusTxt: '二级战备'},
    {teamName: '一团三营',leaderName: '杜营长',status: 2,statusTxt: '二级战备'},
    {teamName: '一团四营',leaderName: '李营长',status: 3,statusTxt: '三级战备'},
    {teamName: '二团一营',leaderName: '张营长',status: 4,statusTxt: '四级战备'},
    {teamName: '二团二营',leaderName: '王营长',status: 2,statusTxt: '二级战备'},
    {teamName: '二团三营',leaderName: '赵营长',status: 4,statusTxt: '四级战备'},
    {teamName: '二团四营',leaderName: '王营长',status: 1,statusTxt: '一级战备'},
    {teamName: '三团一营',leaderName: '王营长',status: 4,statusTxt: '四级战备'},
    {teamName: '一团一营',leaderName: '白营长',status: 3,statusTxt: '三级战备'},
    {teamName: '一团二营',leaderName: '孟营长',status: 2,statusTxt: '二级战备'},
    {teamName: '一团三营',leaderName: '杜营长',status: 2,statusTxt: '二级战备'},
    {teamName: '一团四营',leaderName: '李营长',status: 3,statusTxt: '三级战备'},
    {teamName: '二团一营',leaderName: '张营长',status: 4,statusTxt: '四级战备'},
    {teamName: '二团二营',leaderName: '王营长',status: 2,statusTxt: '二级战备'},
    {teamName: '二团三营',leaderName: '赵营长',status: 4,statusTxt: '四级战备'},
    {teamName: '二团四营',leaderName: '王营长',status: 1,statusTxt: '一级战备'},
    {teamName: '三团一营',leaderName: '王营长',status: 4,statusTxt: '四级战备'},
  ],
  [
    {teamName: '一团一营',leaderName: '白营长',status: 3,statusTxt: '三级战备'},
    {teamName: '一团二营',leaderName: '孟营长',status: 2,statusTxt: '二级战备'},
    {teamName: '一团三营',leaderName: '杜营长',status: 2,statusTxt: '二级战备'},
    {teamName: '一团四营',leaderName: '李营长',status: 3,statusTxt: '三级战备'},
    {teamName: '一团五营',leaderName: '孙营长',status: 4,statusTxt: '四级战备'},
    {teamName: '一团六营',leaderName: '刘营长',status: 2,statusTxt: '二级战备'},
    {teamName: '一团一营',leaderName: '白营长',status: 3,statusTxt: '三级战备'},
    {teamName: '一团二营',leaderName: '孟营长',status: 2,statusTxt: '二级战备'},
    {teamName: '一团三营',leaderName: '杜营长',status: 2,statusTxt: '二级战备'},
    {teamName: '一团四营',leaderName: '李营长',status: 3,statusTxt: '三级战备'},
    {teamName: '一团五营',leaderName: '孙营长',status: 4,statusTxt: '四级战备'},
    {teamName: '一团六营',leaderName: '刘营长',status: 2,statusTxt: '二级战备'},
  ],
  [
    {teamName: '二团一营',leaderName: '张营长',status: 4,statusTxt: '四级战备'},
    {teamName: '二团二营',leaderName: '王营长',status: 2,statusTxt: '二级战备'},
    {teamName: '二团三营',leaderName: '赵营长',status: 4,statusTxt: '四级战备'},
    {teamName: '二团四营',leaderName: '王营长',status: 1,statusTxt: '一级战备'},
    {teamName: '二团五营',leaderName: '周营长',status: 1,statusTxt: '一级战备'},
    {teamName: '二团六营',leaderName: '刘营长',status: 1,statusTxt: '一级战备'},
    {teamName: '二团一营',leaderName: '张营长',status: 4,statusTxt: '四级战备'},
    {teamName: '二团二营',leaderName: '王营长',status: 2,statusTxt: '二级战备'},
    {teamName: '二团三营',leaderName: '赵营长',status: 4,statusTxt: '四级战备'},
    {teamName: '二团四营',leaderName: '王营长',status: 1,statusTxt: '一级战备'},
    {teamName: '二团五营',leaderName: '周营长',status: 1,statusTxt: '一级战备'},
    {teamName: '二团六营',leaderName: '刘营长',status: 1,statusTxt: '一级战备'},
  ],
  [
    {teamName: '三团一营',leaderName: '张营长',status: 4,statusTxt: '四级战备'},
    {teamName: '三团二营',leaderName: '王营长',status: 2,statusTxt: '二级战备'},
    {teamName: '三团三营',leaderName: '赵营长',status: 4,statusTxt: '四级战备'},
    {teamName: '三团四营',leaderName: '王营长',status: 1,statusTxt: '一级战备'},
    {teamName: '三团五营',leaderName: '周营长',status: 1,statusTxt: '一级战备'},
    {teamName: '三团六营',leaderName: '刘营长',status: 1,statusTxt: '一级战备'},
    {teamName: '三团一营',leaderName: '张营长',status: 4,statusTxt: '四级战备'},
    {teamName: '三团二营',leaderName: '王营长',status: 2,statusTxt: '二级战备'},
    {teamName: '三团三营',leaderName: '赵营长',status: 4,statusTxt: '四级战备'},
    {teamName: '三团四营',leaderName: '王营长',status: 1,statusTxt: '一级战备'},
    {teamName: '三团五营',leaderName: '周营长',status: 1,statusTxt: '一级战备'},
    {teamName: '三团六营',leaderName: '刘营长',status: 1,statusTxt: '一级战备'},
  ],
  [
    {teamName: '四团一营',leaderName: '张营长',status: 4,statusTxt: '四级战备'},
    {teamName: '四团二营',leaderName: '王营长',status: 2,statusTxt: '二级战备'},
    {teamName: '四团三营',leaderName: '赵营长',status: 4,statusTxt: '四级战备'},
    {teamName: '四团四营',leaderName: '王营长',status: 1,statusTxt: '一级战备'},
    {teamName: '四团五营',leaderName: '周营长',status: 1,statusTxt: '一级战备'},
    {teamName: '四团六营',leaderName: '刘营长',status: 1,statusTxt: '一级战备'},
    {teamName: '四团一营',leaderName: '张营长',status: 4,statusTxt: '四级战备'},
    {teamName: '四团二营',leaderName: '王营长',status: 2,statusTxt: '二级战备'},
    {teamName: '四团三营',leaderName: '赵营长',status: 4,statusTxt: '四级战备'},
    {teamName: '四团四营',leaderName: '王营长',status: 1,statusTxt: '一级战备'},
    {teamName: '四团五营',leaderName: '周营长',status: 1,statusTxt: '一级战备'},
    {teamName: '四团六营',leaderName: '刘营长',status: 1,statusTxt: '一级战备'},
  ],
  [
    {teamName: '五团一营',leaderName: '张营长',status: 4,statusTxt: '四级战备'},
    {teamName: '五团二营',leaderName: '王营长',status: 2,statusTxt: '二级战备'},
    {teamName: '五团三营',leaderName: '赵营长',status: 4,statusTxt: '四级战备'},
    {teamName: '五团四营',leaderName: '王营长',status: 1,statusTxt: '一级战备'},
    {teamName: '五团五营',leaderName: '周营长',status: 1,statusTxt: '一级战备'},
    {teamName: '五团六营',leaderName: '刘营长',status: 1,statusTxt: '一级战备'},
    {teamName: '五团一营',leaderName: '张营长',status: 4,statusTxt: '四级战备'},
    {teamName: '五团二营',leaderName: '王营长',status: 2,statusTxt: '二级战备'},
    {teamName: '五团三营',leaderName: '赵营长',status: 4,statusTxt: '四级战备'},
    {teamName: '五团四营',leaderName: '王营长',status: 1,statusTxt: '一级战备'},
    {teamName: '五团五营',leaderName: '周营长',status: 1,statusTxt: '一级战备'},
    {teamName: '五团六营',leaderName: '刘营长',status: 1,statusTxt: '一级战备'},
  ]
]
teamListData.value = teamTabList[teamTabCurrent.value]


/* 通信指挥 */
const taskList = ref<any[]>([])

const taskTabList = [
  [
    {title: '一团对A区域作战任务',progress: 0,targetProgress: 50},
    {title: '一团对B区域作战任务',progress: 0,targetProgress: 30},
    {title: '二团对A区域作战任务',progress: 0,targetProgress: 70},
    {title: '二团对B区域作战任务',progress: 0,targetProgress: 80},
    {title: '二团对C区域作战任务',progress: 0,targetProgress: 90},
    {title: '二团对D区域作战任务',progress: 0,targetProgress: 60},
    {title: '三团对A区域作战任务',progress: 0,targetProgress: 20},
    {title: '三团对B区域作战任务',progress: 0,targetProgress: 10},
  ],
  [
    {title: '一团对A区域作战任务',progress: 0,targetProgress: 50},
    {title: '一团对B区域作战任务',progress: 0,targetProgress: 30},
    {title: '一团对C区域作战任务',progress: 0,targetProgress: 20},
    {title: '一团对D区域作战任务',progress: 0,targetProgress: 25},
    {title: '一团对E区域作战任务',progress: 0,targetProgress: 30},
    {title: '一团对F区域作战任务',progress: 0,targetProgress: 10},
  ],
  [
    {title: '二团对A区域作战任务',progress: 0,targetProgress: 50},
    {title: '二团对B区域作战任务',progress: 0,targetProgress: 30},
    {title: '二团对C区域作战任务',progress: 0,targetProgress: 20},
    {title: '二团对D区域作战任务',progress: 0,targetProgress: 25},
    {title: '二团对E区域作战任务',progress: 0,targetProgress: 30},
    {title: '二团对F区域作战任务',progress: 0,targetProgress: 10},
  ],
  [
    {title: '三团对A区域作战任务',progress: 0,targetProgress: 50},
    {title: '三团对B区域作战任务',progress: 0,targetProgress: 30},
    {title: '三团对C区域作战任务',progress: 0,targetProgress: 20},
    {title: '三团对D区域作战任务',progress: 0,targetProgress: 25},
    {title: '三团对E区域作战任务',progress: 0,targetProgress: 30},
    {title: '三团对F区域作战任务',progress: 0,targetProgress: 10},
  ],
  [
    {title: '四团对A区域作战任务',progress: 0,targetProgress: 50},
    {title: '四团对B区域作战任务',progress: 0,targetProgress: 30},
    {title: '四团对C区域作战任务',progress: 0,targetProgress: 20},
    {title: '四团对D区域作战任务',progress: 0,targetProgress: 25},
    {title: '四团对E区域作战任务',progress: 0,targetProgress: 30},
    {title: '四团对F区域作战任务',progress: 0,targetProgress: 10},
  ],
  [
    {title: '五团对A区域作战任务',progress: 0,targetProgress: 50},
    {title: '五团对B区域作战任务',progress: 0,targetProgress: 30},
    {title: '五团对C区域作战任务',progress: 0,targetProgress: 20},
    {title: '五团对D区域作战任务',progress: 0,targetProgress: 25},
    {title: '五团对E区域作战任务',progress: 0,targetProgress: 30},
    {title: '五团对F区域作战任务',progress: 0,targetProgress: 10},
  ],
]

taskList.value = taskTabList[teamTabCurrent.value]

const resourceList = ref([
  {
    title: '弹药',
    progress: 0,
    targetProgress: 53,
  },
  {
    title: '能源',
    progress: 0,
    targetProgress: 42,
  },
  {
    title: '装备',
    progress: 0,
    targetProgress: 33,
  },
  {
    title: '人员',
    progress: 0,
    targetProgress: 68,
  },
  {
    title: '后勤物资',
    progress: 0,
    targetProgress: 45,
  },
  {
    title: '通信资源',
    progress: 0,
    targetProgress: 41,
  },
  {
    title: '作战平台',
    progress: 0,
    targetProgress: 64,
  },
  {
    title: '医疗',
    progress: 0,
    targetProgress: 21,
  },
])

const resourceProgressList = [
  [53,42,33,68,45,41,64,21],
  [21,25,43,70,23,53,27,12],
  [12,20,34,38,32,35,47,28],
  [48,52,58,77,36,28,30,33],
  [55,62,34,47,40,53,39,16],
  [30,52,22,82,33,32,47,35],
]

const animateResourceProgress = () => {
  var targetResourceData = resourceProgressList[teamTabCurrent.value]
  resourceList.value.map((item,index)=>{
    item.progress = 0
    item.targetProgress = targetResourceData[index]
  })
  console.log(resourceList.value,'resourceList.value')
  resourceList.value.forEach((resource, index) => {
    gsap.to(resource, {
      progress: resource.targetProgress,
      duration: 1.2,
      ease: 'power2.out',
      delay: index * 0.15 + 1,
      snap: { progress: 1 }
    })
  })
}

const workTotal = ref(0)
const workTotalList = [160, 23, 47, 30, 40, 30, 12]

const workData = ref([
  {
    title: '步兵营',
    value: 0,
    targetValue: 20,
    color: '#318FF9',
  },
  {
    title: '坦克营',
    value: 0,
    targetValue: 10,
    color: '#AA2FD6',
  },
  {
    title: '通信营',
    value: 0,
    targetValue: 20,
    color: '#67D62F',
  },
  {
    title: '炮兵营',
    value: 0,
    targetValue: 15,
    color: '#31F0FD',
  },
  {
    title: '汽车营',
    value: 0,
    targetValue: 10,
    color: '#8340FF',
  },
  {
    title: '后勤营',
    value: 0,
    targetValue: 10,
    color: '#E7E7E8',
  },
  {
    title: '飞机营',
    value: 0,
    targetValue: 20,
    color: '#E2BB31',
  },
  {
    title: '导弹营',
    value: 0,
    targetValue: 2,
    color: '#E33832',
  },
])

const workDataList = [
  [89, 62, 55, 50, 42, 36, 30, 28],
  [20, 10, 20, 15, 10, 10, 5, 2],
  [12, 15, 22, 18, 14, 12, 10, 3],
  [20, 30, 12, 35, 40, 30, 12, 5],
  [23, 25, 20, 18, 16, 18, 4, 8],
  [12, 21, 10, 12, 9, 12, 5, 12],
]

const animateWorkData = () => {
  var targetWorkData = workDataList[teamTabCurrent.value]
  workData.value.forEach((item, index) => {
    item.value = 0
    item.targetValue = targetWorkData[index]
  })
  workData.value.forEach((item, index) => {
    gsap.to(item, {
      value: item.targetValue,
      duration: 1,
      ease: 'power2.out',
      delay: index * 0.1,
      snap: { value: 1 }
    })
  })
  workTotal.value = 0
  gsap.to(workTotal, {
    value: workTotalList[teamTabCurrent.value],
    duration: 2,
    ease: 'power2.out',
    snap: { value: 1 }
  })
}

// 注入父组件提供的方法
const triggerSendMessageToIframe = inject('triggerSendMessageToIframe');

let isInMeeting = ref(false);
const goUnitVideo = ()=>{
  // 触发 CenterLeft 组件中的 sendMessageToIframe 函数
  if (triggerSendMessageToIframe) {
    isInMeeting.value = true;
    (triggerSendMessageToIframe as Function)({type: 'startMeet'});
  }
}
const cancelUnitVideo = ()=>{
  // 触发 CenterLeft 组件中的 sendMessageToIframe 函数
  if (triggerSendMessageToIframe) {
    isInMeeting.value = false;
    (triggerSendMessageToIframe as Function)({type: 'stopMeet'});
  }
}

const tabDataChangeFunc = (index: number) => {
  teamTabCurrent.value = index
  animateResourceProgress()
  animateWorkData()
  msgScrollTop = 0;
  taskScrollTop = 0;
  tableScrollTop = 0;
  teamListData.value = teamTabList[index]
  taskList.value = taskTabList[index]
}

onMounted(() => {
  // animateTaskProgress()
  animateResourceProgress()
  animateWorkData()
  // 组件挂载后启动滚动动画
  nextTick(() => {
    startScrolling();
  });
})

onUnmounted(() => {
  // 组件卸载时取消动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
})

defineExpose({
  tabDataChangeFunc
})

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
        overflow-y: hidden; /* 视觉上隐藏滚动条但保持滚动功能 */
        position: relative;
        
        /* 隐藏不同浏览器的滚动条 */
        &::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        
        -ms-overflow-style: none;  /* IE 和 Edge */
        scrollbar-width: none;  /* Firefox */
        
        .msgInfoWrapper {
          width: 100%;
          display: block;
          
          /* 通过复制内容创建无缝滚动 */
          > .msgInfoItem {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: px2rem(14);
          }
        }
        
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
        overflow-y: hidden; /* 视觉上隐藏滚动条但保持滚动功能 */
        position: relative;
        
        /* 隐藏不同浏览器的滚动条 */
        &::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        
        -ms-overflow-style: none;  /* IE 和 Edge */
        scrollbar-width: none;  /* Firefox */
        
        .taskBoxWrapper {
          width: 100%;
          display: block;
        }
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
          overflow-y: hidden; /* 视觉上隐藏滚动条但保持滚动功能 */
          position: relative;
          
          /* 隐藏不同浏览器的滚动条 */
          &::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
          
          -ms-overflow-style: none;  /* IE 和 Edge */
          scrollbar-width: none;  /* Firefox */
          
          .tableConWrapper {
            width: 100%;
            display: block;
          }
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
        cursor: pointer;
      }
      .btn01{
        background-color: #006FFF;
      }
      .btn02{
        background-color: #FF2F00;
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
