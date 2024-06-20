<script setup lang="ts">
import { SendEvent } from '@/extensions/athaeck-websocket-vue3-extension/helper/types';
import { useWebSocketStore } from '@/extensions/athaeck-websocket-vue3-extension/stores/webSocket';

import { onMounted, ref, computed, onUnmounted } from 'vue';

import bus from '@/hooks';

import { onBeforeMount } from 'vue';
import { useclientStore } from '@/stores/client';


const socketStore = useWebSocketStore()
const clientStore = useclientStore()

const dataName = ref("")



const recorder = computed(() => {
  return clientStore.Recorder
})
const hasMaster = computed(() => {
  return clientStore.HasMaster
  // return true
})
const canPrepare = computed(() => {
  return clientStore.IsAbleToPrepare
})

const isInPreparation = computed(() => {
  return clientStore.AreSubsWaiting
})

onUnmounted(() => {
  bus.off("SOCKET_OPENED", OnSocketOpened)
  bus.off("TAKE_MESSAGE", OnTakeMessage)
})
onMounted(() => {


});
onBeforeMount(() => {
  bus.on("SOCKET_OPENED", OnSocketOpened)
  bus.on("TAKE_MESSAGE", OnTakeMessage)
})

function OnTakeMessage(body: SendEvent) {
  console.log(body)
  if (body.eventName === "ON_FINISH_RECORD") {
    dataName.value = ""
  }
}

function OnSocketOpened(body: any) {
  console.log("happened")
  const initEvent: SendEvent = new SendEvent("INIT_SUPERVISOR")
  socketStore.SendEvent(initEvent)
}
function TriggerRecord() {
  if (dataName.value.length === 0) {
    return
  }

  const record: SendEvent = new SendEvent("TRIGGER_RECORD")
  record.addData("FileName", dataName.value)
  socketStore.SendEvent(record)
}
function PrepareRecord() {
  if (dataName.value.length === 0) {
    return;
  }

  const prepareRecord: SendEvent = new SendEvent("PREPARE_RECORD")
  prepareRecord.addData("FileName", dataName.value)
  socketStore.SendEvent(prepareRecord)
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
            <div class="data-name">
              <v-text-field :disabled="isInPreparation" v-model="dataName" label="Name der Datei"></v-text-field>
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