import { defineStore } from 'pinia'
import bus from '@/hooks/index'
import { SendEvent } from '@/extensions/athaeck-websocket-vue3-extension/helper/types'
import type { RecorderProxy, SessionData } from '@/types'
import { useWebSocketStore } from '@/extensions/athaeck-websocket-vue3-extension/stores/webSocket'
import router from '@/router'





export const useclientStore = defineStore({
  id: 'client',
  state: () => ({
    recorder: null as RecorderProxy[] | null
  }),
  actions: {
    Init(): void {
      bus.on("TAKE_MESSAGE", this._OnTakeMesage)
      bus.on("SOCKET_CLOSED", this._OnClosedSocket)
      bus.on("SOCKED_ERROR", this._OnClosedSocket)
    },
    _OnClosedSocket(body: any) {

    },
    _OnTakeMesage(body: any) {
      const webSocketStore = useWebSocketStore()
      const receive: SendEvent = <SendEvent>body

      console.log(receive)

      if (receive.eventName === "ON_INIT_SUPERVISOR") {
        this.recorder = receive.data.Proxy
      }
      if (receive.eventName === "UPDATE_RECORDER") {
        this.recorder = receive.data.Proxy
      }
    },

  },
  getters: {
    Recorder: (state) => state.recorder,
    HasMaster(state) {
      const master: RecorderProxy | undefined = state.recorder?.find(r => r.Type === "Master")
      return master !== undefined
    },
    IsAbleToPrepare(state) {
      if (state.recorder === null) {
        return false
      } else {
        if (state.recorder.length === 0) {
          return false
        }
      }
      for (const element of state.recorder) {
        if (element.Type === 'Sub') {
          if (element.State === 'Waiting' || element.State === 'Recording') {
            return false;
          }
          if (!element.State.includes('Idle')) {
            return false;
          }
        }
      }
      return true;
    },
    AreSubsWaiting(state) {
      if (state.recorder === null) {
        return false
      } else {
        if (state.recorder.length === 0) {
          return false
        }
      }
      for (const element of state.recorder) {
        if (element.Type === 'Sub') {
          if (element.State !== 'Waiting') {
            return false;
          }
        }
      }
      return true;
    }
  }
})
