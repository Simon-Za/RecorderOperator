import { Recorder } from "../data/recorder"
import { RecorderProxy } from "../types/proxy"

export function GetRecorderProxy(recorder: Recorder[]): RecorderProxy[] {
    const recorderProxy: RecorderProxy[] = []
    for (const r of recorder) {
        recorderProxy.push(r.RecorderData)
    }

    return recorderProxy
}
