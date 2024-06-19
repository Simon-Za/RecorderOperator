<script setup lang="ts">
import { SendEvent } from '@/extensions/athaeck-websocket-vue3-extension/helper/types';
import { useWebSocketStore } from '@/extensions/athaeck-websocket-vue3-extension/stores/webSocket';
import { useNotificationStore } from "@/extensions/notifications/stores/index"
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import bus from '@/hooks';
import { ConnectingMindsEvents } from '@/types/Connecting-Minds-Data-Types/types';
import type { NotificationItem } from '@/extensions/notifications/types';
import { onBeforeMount } from 'vue';
import { useclientStore } from '@/stores/client';


const socketStore = useWebSocketStore()
const clientStore = useclientStore()
// const notificationStore = useNotificationStore()
// const router = useRouter()


// const showdialog = ref(false)
// const sessionID = ref("")

// const sessionIdIsValid = computed(() => {
//   return sessionID.value.length > 0
// })

const recorder = computed(() => {
  return clientStore.Recorder
})
const hasMaster = computed(() => {
  return clientStore.HasMaster
})
const canPrepare = computed(() => {
  return clientStore.IsAbleToPrepare
})

onUnmounted(() => {
  bus.off("SOCKET_OPENED", (body: any) => { })
})
onMounted(() => {
  // const initEvent: SendEvent = new SendEvent("INIT_SUPERVISOR")
  // socketStore.SendEvent(initEvent)

});
onBeforeMount(() => {
  bus.on("SOCKET_OPENED", (body: any) => {
    console.log("happened")
    const initEvent: SendEvent = new SendEvent("INIT_SUPERVISOR")
    socketStore.SendEvent(initEvent)
  })
  // bus.on("TAKE_MESSAGE", (body: any) => {
  //   const data: SendEvent = body as SendEvent;
  //   console.log(data)
  //   // if (data.eventName === ConnectingMindsEvents.SESSION_NOT_FOUND) {

  //   // }
  //   if (data.eventName === ConnectingMindsEvents.SESSION_NOT_FOUND) {
  //     const notification: NotificationItem = {
  //       type: "info",
  //       message: data.data["Messsage"],
  //       action1: { label: "" }
  //     }
  //     notificationStore.SpawnNotification(notification)

  //   }

  // });
})

// function joinSession() {
//   if (sessionID.value.length === 0) {
//     return;
//   }
//   const joinSessionEvent: SendEvent = new SendEvent('JOIN_SESSION')
//   joinSessionEvent.addData("SessionID", sessionID.value)
//   joinSessionEvent.addData("Type", "WATCHER")
//   socketStore.SendEvent(joinSessionEvent);
// }

function TriggerRecord() {

}
function PrepareRecord() {

}

</script>

<template>
  <div id="HomeView">
    <div class="top-content">
      <div class="flex-container">
        <v-card class="" elevation="2">
          <v-card-item>
            <v-card-title>
              Übersicht der Recorder:
            </v-card-title>
          </v-card-item>

          <v-card-text>
            <div>
              Actions:
            </div>
            <div class="flex">
              <v-btn :disabled="!canPrepare" title="Wenn alle Subs auf Idle sind, kann die Aufnahme vorbereitet werden."
                @click="PrepareRecord">Aufnahme vorbereiten</v-btn>
              <v-btn style="cursor: pointer;"
                title="Wenn als Subs auf Waiting sind und der Master auf Idle, kann aufgneommen werden."
                @click="TriggerRecord" :disabled="!hasMaster">Aufnahme starten</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
      <div class="flex-container">
        <v-card class="" elevation="2" v-for="(item, index) in recorder" :key="index">
          <v-card-item class="card-header">
            <v-card-title>
              ID: {{ item.Type }} {{ item.ID }}
            </v-card-title>
            <v-card-subtitle>
              STATUS: {{ item.State }}
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
#HomeView {
  width: 100%;
}

.top-content {
  padding: 50px 0;
  display: flex;
}

.flex-container {
  padding: 0 21px;
  width: 100%;
}

.flex {
  display: flex;
  justify-content: space-between;
}
</style>