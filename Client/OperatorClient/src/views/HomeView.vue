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

const createPCDJSON = ref(true) //hab ich
const subPath = ref("") //hab ich
const markerLength = ref(0.15) //hab ich
const useCharuco = ref(false)
const icpIterations = ref(0)
const pcdFrames = ref(5)
const pcdJustCenter = ref(false)
const createNPZs = ref(true)


const recorder = computed(() => {
  return clientStore.Recorder
})
const hasRecorder = computed(() => {
  return clientStore.HasRecorder
})
const hasSubs = computed(() => {
  return clientStore.HasSubs
})
const getSubs = computed(() => {
  return clientStore.GetSubs
})
const getMaster = computed(() => {
  return clientStore.GetMaster
})
const hasMaster = computed(() => {
  return clientStore.HasMaster
})
const isMasterInIdle = computed(() => {
  return clientStore.IsMasterInIdle
})
const areSubsReadyToPrepare = computed(() => {
  return clientStore.AreSubsReadyToPrepare
})
const areSubsWaitingOrRecording = computed(() => {
  return clientStore.AreSubsWaitingOrRecording
})
const areSubsWaiting = computed(() => {
  return clientStore.AreSubsWaiting
})
const areAllRecording = computed(() => {
  return clientStore.AreAllRecording
})
const hasCalibrator = computed(() => {
  return clientStore.HasCalibrator
})
const getCalibrator = computed(() => {
  return clientStore.GetCalibrator
})
const isCalibratorInIdle = computed(() => {
  return clientStore.IsCalibratorInIdle
})

const subCount = ref(getSubs.value.length) //hab ich

const rules = ref({
  required: (value: string) => !!value || 'Required.'
})
onUnmounted(() => {
  bus.off("SOCKET_OPENED", OnSocketOpened);
  bus.off("TAKE_MESSAGE", OnTakeMessage)
})
onMounted(() => {


});
onBeforeMount(() => {
  bus.on("SOCKET_OPENED", OnSocketOpened)
  bus.on("TAKE_MESSAGE", OnTakeMessage)
})

function OnTakeMessage(body: any) {
  console.log(body.eventName)
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
function Calibrate() {
  const proxy = {
    subCount: subCount.value,
    markerLength: markerLength.value,
    subPath: subPath.value,
    createJson: createPCDJSON.value,

    useCharuco: useCharuco.value,
    icpIterations: icpIterations.value,
    pcdFrames: pcdFrames.value,
    pcdJustCenter: pcdJustCenter.value,
    createNPZs: createNPZs.value
  }

  const calibrate: SendEvent = new SendEvent("TRIGGER_CALIBRATION")
  calibrate.addData("Proxy", proxy)
  socketStore.SendEvent(calibrate)
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
              Selektor:
            </div>
            <div class="data-name">
              <v-text-field :rules="[rules.required]" :disabled="areAllRecording || (hasSubs && areSubsWaiting)"
                v-model="dataName" label="Subpfad der Datei"></v-text-field>
            </div>
            <div>
              Actions:
            </div>
            <div class="flex">
              <v-btn
                :disabled="dataName.length === 0 || !hasRecorder || !hasSubs || !areSubsReadyToPrepare || areSubsWaitingOrRecording || areAllRecording"
                title="Wenn alle Subs auf Idle sind, kann die Aufnahme vorbereitet werden."
                @click="PrepareRecord">Aufnahme vorbereiten</v-btn>
              <v-btn style="cursor: pointer;"
                title="Wenn als Subs auf Waiting sind und der Master auf Idle, kann aufgneommen werden."
                @click="TriggerRecord"
                :disabled="dataName.length === 0 || !hasRecorder || !hasMaster || !isMasterInIdle || !areSubsWaiting || areAllRecording">Aufnahme
                starten</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
      <div class="flex-container">
        <v-card class="recorder-item" elevation="2" v-for="(item, index) in recorder" :key="index">
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
    <div class="bottom-content">
      <div class="flex-container">
        <v-card class="" elevation="2">
          <v-card-item>
            <v-card-title>
              Übersicht über Calibrator:
            </v-card-title>
          </v-card-item>

          <v-card-text>
            <div>
              Selektoren:
            </div>
            <div class="selector-section">
              <div class="action-field-element">
                <span>Anzahl der Subs</span>
                <v-select :disabled="!isCalibratorInIdle" :items="[0, 1, 2, 3, 4, 5]" v-model="subCount"
                  label="Anzahl der Subs"></v-select>
              </div>
              <div class="action-field-element">
                <span>Marker Länge</span>
                <v-select label="Marker Länge" :disabled="!isCalibratorInIdle" v-model="markerLength"
                  :items="[0.00, 0.05, 0.10, 0.15, 0.20, 0.25]"></v-select>
              </div>
              <div class="action-field-element">
                <span>Subpath</span>
                <v-text-field :disabled="!isCalibratorInIdle" v-model="subPath" label="Subpath"></v-text-field>
              </div>
              <div class="action-field-element">
                <span>Erstelle Pointcloud JSON</span>
                <v-switch :disabled="!isCalibratorInIdle" v-model="createPCDJSON" :label="`${createPCDJSON.toString()}`"
                  hide-details></v-switch>
              </div>
              <div class="action-field-element">
                <span>Charuco Kalibrierung</span>
                <v-switch :disabled="!isCalibratorInIdle" v-model="useCharuco" :label="`${useCharuco.toString()}`"
                  hide-details></v-switch>
              </div>
              <div class="action-field-element">
                <span>ICP-Iterationen</span>
                <v-select label="Anzahl der Iterationen" :disabled="!isCalibratorInIdle" v-model="icpIterations"
                  :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]"></v-select>
              </div>
              <div class="action-field-element">
                <span>Anzahl PCD Frames</span>
                <v-select label="Anzahl der PCD Frames" :disabled="!isCalibratorInIdle" v-model="pcdFrames"
                  :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]"></v-select>
              </div>
              <div class="action-field-element">
                <span>Erstelle Init NPZ</span>

              </div>
              <div class="action-field-element">
                <span>PCD Centered</span>
                <v-switch :disabled="!isCalibratorInIdle" v-model="pcdJustCenter" :label="`${pcdJustCenter.toString()}`"
                  hide-details></v-switch>
              </div>
              <div class="action-field-element">
                <span>Erstelle NPZs</span>
                <v-switch :disabled="!isCalibratorInIdle" v-model="createNPZs" :label="`${createNPZs.toString()}`"
                  hide-details></v-switch>
              </div>
            </div>
            <div>
              Actions:
            </div>
            <div class="flex">
              <v-btn @click="Calibrate" :disabled="!hasCalibrator || subPath.length === 0 || !isCalibratorInIdle"
                width="300">Kalibrierung
                starten</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
      <div class="flex-container">
        <template v-if="hasCalibrator">
          <v-card class="calibrator" elevation="2">
            <v-card-item class="card-header">
              <v-card-title>
                Calibrator
              </v-card-title>
              <v-card-subtitle>
                STATUS: {{ getCalibrator?.State }}
              </v-card-subtitle>
            </v-card-item>
          </v-card>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
#HomeView {
  width: 100%;
}

.bottom-content {
  padding: 50px 0 0 0;
  display: flex;
}

.top-content {
  padding: 50px 0 0 0;
  display: flex;
  /* height: 500px; */
}

.flex-container {
  padding: 0 21px;
  width: 100%;
}

.flex {
  display: flex;
  justify-content: space-between;
}

.recorder-item {
  margin-bottom: 14px;
}

.selector-section {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.action-field-element {
  width: 50%;
  padding: 0 7px;
}
</style>