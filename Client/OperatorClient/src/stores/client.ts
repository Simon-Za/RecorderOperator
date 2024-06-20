import { defineStore } from 'pinia'
import bus from '@/hooks/index'
import { SendEvent } from '@/extensions/athaeck-websocket-vue3-extension/helper/types'
import type { RecorderProxy, SessionData } from '@/types'



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
    HasRecorder(state) {
      return this.Recorder !== null && this.Recorder.length > 0
    },
    GetSubs(state) {
      if (!this.HasRecorder) {
        return []
      }
      return state.recorder?.filter(r => r.Type === "Sub")
    },
    HasSubs(state) {
      if (!this.HasRecorder) {
        return
      }
      return this.GetSubs.length > 0
    },
    GetMaster(state) {
      const master: RecorderProxy | undefined = state.recorder?.find(r => r.Type === "Master")
      return master
    },
    HasMaster(state) {
      return this.GetMaster !== undefined
    },
    IsMasterInIdle(state) {
      if (!this.HasMaster) {
        return false
      }
      return this.GetMaster?.State === "Idle"
    },
    AreSubsReadyToPrepare(state) {
      if (!this.HasRecorder) {
        return false
      }
      return this.GetSubs?.every((s: RecorderProxy) => s.State === "Idle")
    },
    AreSubsWaitingOrRecording(state) {
      if (!this.HasRecorder) {
        return false
      }
      return this.GetSubs?.every((s: RecorderProxy) => s.State === "Recording" || s.State === "Waiting")
    },
    AreSubsWaiting(state) {
      if (!this.HasRecorder) {
        return false
      }
      return this.GetSubs?.every((s: RecorderProxy) => s.State === "Waiting")
    },
    AreAllRecording(state) {
      if (!this.HasRecorder) {
        return false
      }
      return this.Recorder?.every((r: RecorderProxy) => r.State === "Recording")
    }
  }
})
