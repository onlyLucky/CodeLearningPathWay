<template>
  <div
    :class="['wrap-video', { 'video-small': item.templateConfig && item.templateConfig.isPIP }]"
    :style="item.positionStyle"
    ref="videoWrapRef"
    :id="wrapVideoId"
    @click="toggleFullScreen($event)"
  >
    <div class="video">
      <div
        class="video-content"
        :style="{ border }"
      >
        <div class="video-model">
          <div :class="audioOnlyClass">
            <div class="center">
              <div class="name">{{ item.roster.displayName || '' }}</div>
              <div>语音通话中</div>
            </div>
          </div>

          <div :class="videoMuteClass">
            <div class="center">
              <FitAvatar
                :textAvatar="item.textAvatar"
                :avatar="item.avatar"
                :containerWidth="containerWidth"
              />
            </div>
          </div>

          <div :class="videoRequestClass">
            <div class="request-loading"></div>
          </div>

          <div class="video-status">
            <div
              v-if="!item.roster.isContent"
              :class="item.roster.audioTxMute ? 'audio-muted-status' : 'audio-unmuted-status'"
            ></div>
            <div class="name">
              {{ `${isMe || 'Local'}` }}
            </div>
          </div>
        </div>
      </div>

      <video
        :style="item.rotate"
        autoPlay
      ></video>
    </div>
  </div>
</template>
<script>
import FitAvatar from '../FitAvatar';
import store from '@/utils/store';
import _ from 'lodash'
import { Event } from "@/utils/event";
export default {
  props: ['index', 'id', 'item', 'layoutMode', 'model', 'forceLayoutId', 'client'],
  components: { FitAvatar },
  computed: {
    state() {
      return this.item.state;
    },
    border() {
      let border = '';
      if (this.model === 'gallery' && this.item.roster.isActiveSpeaker) {
        border = '2px solid #1483eb';
      } else {
        border = 'none';
      }
      return border;
    },
    audioOnlyClass() {
      return `video-bg ${this.state === 'AUDIO_TEL' || this.state === 'AUDIO_CONTENT' || this.state === 'AUDIO_ONLY'
        ? 'video-show'
        : 'video-hidden'
        }`;
    },
    videoMuteClass() {
      return `video-bg ${this.state === 'MUTE'  ? 'video-show' : 'video-hidden'}`;
    },
    videoRequestClass() {
      return `video-bg ${this.state === 'REQUEST' ? 'video-show' : 'video-hidden'}`;
    },
    // 是否全屏
    isFullScreen() {
      return this.forceLayoutId === this.item.roster.id;
    },
    containerWidth() {
      return this.item.positionInfo?.width || 0;
    },
    isMe(){
      const { meetingName = "" } = store.get("xy-user") || {};
      console.log(this.item,'this.item')
      return this.item.roster.displayName == meetingName?'我':this.item.roster.displayName
    },
  },
  data() {
    return {
      wrapVideoId: 'wrap-' + this.id,
      videoStyle: {},
    };
  },
  mounted() {
    this.renderVideo(this.id);
  },
  methods: {
    async toggleFullScreen(event) {
      Event.click(event, () => {
        event.stopPropagation();
        
        this.$emit('forceFullScreen', this.isFullScreen ? '' : this.id);
      });
    },

    renderVideo(newValue) {
      if (newValue && this.client) {
        console.log(newValue,'wrap-' + newValue)
        this.client.setVideoRenderer(newValue, 'wrap-' + newValue);
        this.calcVideoSize()
      }
    },
    calcVideoSize(){
      let res = this.item.rotate
      console.log("calcVideoSize res:",this.item)
      var rArray = []
      try {
        rArray = this.item.roster.extUserId.split("_");
      } catch (error) {
        console.log(error)
      }
      if(this.item.rotate.width && this.item.rotate.height){
        this.$nextTick(()=>{
          
          let vDom = this.$refs.videoWrapRef
          let width = parseFloat(this.item.rotate.width)
          let height = parseFloat(this.item.rotate.height)
          // 判断当前是否为横屏
          console.log("vDom.clientHeight:",vDom.clientHeight,vDom.clientWidth)
          if(rArray.length>=2){
            if(rArray[1] == 'true' && width<height){
              res.transform = "rotateZ(90deg)"
              res.width = vDom.clientHeight+'px'
              res.height = vDom.clientWidth+'px'
            }
          }else{
            res.width = vDom.clientWidth+'px'
            res.height = vDom.clientHeight+'px'
          }
          this.videoStyle = res
        })
      }else{
        if(rArray.length>=2 && rArray[1] == 'true'){
          this.$nextTick(()=>{
            let vDom = this.$refs.videoWrapRef
            res.transform = "rotateZ(90deg)"
            res.width = vDom.clientHeight+'px'
            res.height = vDom.clientWidth+'px'
            this.videoStyle = res
          })
        }
      }
      this.videoStyle = res
    },
  },
  watch: {
    id: {
      handler(newValue) {
        console.log("renderVideo index")
        this.renderVideo(newValue);
      },
      deep: true,
    },
    'item.rotate': function(){
      this.calcVideoSize();
    },
  },
};
</script>
<style scoped>
.wrap-video {
  position: absolute;
  background: #0a0e27;
  user-select: none;
  overflow: hidden;
  z-index: 1;
}
.video-small {
  border: 1px solid #fff;
  box-sizing: content-box;
}

.video {
  width: 100%;
  height: 100%;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video .video-content {
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
}
.video .video-content:hover .operate-icon {
  opacity: 1;
}
.video video {
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: contain;
}
.video audio {
  position: absolute;
}
.video .video-model {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  color: #ddd;
  font-size: 12px;

  display: flex;
  align-items: center;
  justify-content: center;
}
.video .video-model .video-status {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: rgba(42, 46, 51, 0.8);
  display: flex;
  align-items: center;
  max-width: 90%;
  height: 21px;
}
.video .video-model .name {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 6px;
  margin-left: 6px;
}
.video .video-model .video-bg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: opacity ease 0.2s;
  background: linear-gradient(315deg, #12162f 0%, #0c0e1d 100%);
}
.video .video-model .video-hidden {
  position: absolute;
  opacity: 0;
}
.video .video-model .video-show {
  display: flex;
  opacity: 1;
}
.video .video-model .center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.video .video-model .audio-muted-status,
.video .video-model .audio-unmuted-status {
  width: 26px;
  height: 24px;
  margin: 0 -8px 0 -2px;
}
.video .video-model .audio-muted-status {
  background: url("./img/audio_mute.png") center center no-repeat;
  background-size: 60%;
}
.video .video-model .audio-unmuted-status {
  background: url("./img/audio_unmute.png") center center no-repeat;
  background-size: 60%;
}
.status {
  position: absolute;
  left: 1px;
  top: 0px;
  background-color: #0000002e;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: text;
  z-index: 100;
  padding-right: 5px;
}
.status p {
  margin: 0;
  line-height: 1;
  font-size: 12px;
}

.operate-icon {
  opacity: 0;

  color: rgb(255, 255, 255);
  font-size: 20px;
  background-color: rgba(42, 46, 51, 0.6);
  padding: 4px;
  border-radius: 50%;

  position: absolute;
  top: 6px;
  right: 6px;

  cursor: pointer;

  transition: all ease 0.2s;
}
.operate-icon:hover {
  background-color: rgba(42, 46, 51, 0.8);
}

.request-loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url(~@/assets/img/loading.png) no-repeat;
  background-size: 100% 100%;
  animation: circleRoate 1s infinite linear;
}
</style>
