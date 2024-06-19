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


const socketStore = useWebSocketStore()
// const notificationStore = useNotificationStore()
// const router = useRouter()


// const showdialog = ref(false)
// const sessionID = ref("")

// const sessionIdIsValid = computed(() => {
//   return sessionID.value.length > 0
// })
onUnmounted(() => {
  // bus.off("TAKE_MESSAGE", (body: any) => { })
})
onMounted(() => {


});
onBeforeMount(() => {
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



</script>

<template>
  <div id="HomeView">

    <!-- <div class="content">
      <div class="game-container">
        <div class="header-section">
          <h1>Willkommen bei Connecting Minds</h1>
          <p>WATCHER</p>
          <div class="input-wrapper"><v-text-field v-model="sessionID" label="Session ID" placeholder="1234"
              class="sessionIDInput"></v-text-field></div>

          <button :disabled="!sessionIdIsValid" @click="joinSession" class="control-button">Session Beitreten</button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.input-wrapper {
  margin-top: 21px;
}

.header-section h1 {
  color: white;
}

.header-section p {
  color: white;
}

#HomeView {
  padding: 10%;

}

.game-container {
  width: 100%;
  background-color: transparent;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 4% 20%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}



.sessionIDInput {
  width: 100%;
}

.footer {
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 10px;
  background-color: #1f1f1f;
}

.custom-card {
  background-color: #3d898d;

}

.custom-card {
  background-color: transparent;

  color: white;

  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-dialog-btn {

  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  animation: pulse 5s infinite;
  background-image: url('@/assets/button_image.png');
  background-size: cover;
  background-position: center;
  height: 200px;
  width: 200px;

}

.control-button {
  color: #ffffff;
  padding: 14px 28px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  animation: pulse 5s infinite;
  background-image: url('@/assets/button_image.png');
  background-size: cover;
  background-position: center;
  width: 150px;
  color: #fff;
  cursor: pointer;
}

.control-button:disabled {
  filter: grayscale(100%) !important;
  animation: none;
  cursor: not-allowed;
}


.text-h5 {
  color: orange;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
}

.disagree-button,
.agree-button {

  color: white !important;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-left: 10px;
}

.disagree-button:hover,
.agree-button:hover {
  color: white;
}


@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>