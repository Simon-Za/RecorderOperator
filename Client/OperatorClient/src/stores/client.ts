import { defineStore } from 'pinia'
import bus from '@/hooks/index'
import { SendEvent } from '@/extensions/athaeck-websocket-vue3-extension/helper/types'
import type { SessionData } from '@/types'
import { useWebSocketStore } from '@/extensions/athaeck-websocket-vue3-extension/stores/webSocket'
import router from '@/router'





export const useclientStore = defineStore({
  id: 'client',
  state: () => ({

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



    },

  },
  getters: {

  }
})
