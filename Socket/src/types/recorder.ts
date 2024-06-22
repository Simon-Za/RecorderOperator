import { CalibrateProxy } from "./proxy"


export type TRecorder = {
    Type: string,  //Master, Sub
    ID: string
}
export type RecordingState = {
    State: string
}
export type TPrepareRecord = {
    FileName: string
}
export type TCalibrate = {
    Proxy: CalibrateProxy
}