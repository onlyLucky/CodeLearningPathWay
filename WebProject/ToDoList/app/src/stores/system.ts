import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useSystemStore = defineStore(
  'system',
  () => {
    const roomNo = ref<string>('')
    const mac = ref<string>('')
    const createMeetingInfo = reactive({
      meetingName: '',
      id: '',
      openTime: '',
    })

    function setRoomNo(value: string) {
      roomNo.value = value
      saveRoomNo()
    }

    function getRoomNo() {
      if (!roomNo.value) {
        loadRoomNo()
      }
      return roomNo.value
    }

    function saveRoomNo() {
      uni.setStorageSync('roomNo', roomNo.value)
    }

    function loadRoomNo() {
      const saved = uni.getStorageSync('roomNo')
      if (saved) {
        roomNo.value = saved
      }
    }

    function setMac(value: string) {
      mac.value = value
      saveMac()
    }

    function getMac() {
      if (!mac.value) {
        loadMac()
      }
      return mac.value
    }

    function saveMac() {
      uni.setStorageSync('mac', mac.value)
    }

    function loadMac() {
      const saved = uni.getStorageSync('mac')
      if (saved) {
        mac.value = saved
      }
    }

    function setCreateMeetingInfo(info: { meetingName: string; id: string; openTime: string }) {
      createMeetingInfo.meetingName = info.meetingName
      createMeetingInfo.id = info.id
      createMeetingInfo.openTime = info.openTime
      saveCreateMeetingInfo()
    }

    function getCreateMeetingInfo() {
      if (!createMeetingInfo.id) {
        loadCreateMeetingInfo()
      }
      return createMeetingInfo
    }

    function saveCreateMeetingInfo() {
      uni.setStorageSync('createMeetingInfo', {
        meetingName: createMeetingInfo.meetingName,
        id: createMeetingInfo.id,
        openTime: createMeetingInfo.openTime,
      })
    }

    function loadCreateMeetingInfo() {
      const saved = uni.getStorageSync('createMeetingInfo')
      if (saved) {
        createMeetingInfo.meetingName = saved.meetingName || ''
        createMeetingInfo.id = saved.id || ''
        createMeetingInfo.openTime = saved.openTime || ''
      }
    }

    return {
      roomNo,
      mac,
      createMeetingInfo,
      setRoomNo,
      getRoomNo,
      loadRoomNo,
      setMac,
      getMac,
      loadMac,
      setCreateMeetingInfo,
      getCreateMeetingInfo,
      loadCreateMeetingInfo,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'system',
          storage: {
            getItem: (key: string) => uni.getStorageSync(key),
            setItem: (key: string, value: unknown) => uni.setStorageSync(key, value),
          },
        },
      ],
    },
  }
)
