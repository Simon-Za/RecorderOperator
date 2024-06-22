export type PrepareRecordProxy = {
    FileName: string
}
export type RecordProxy = {
    FileName: string
}


export type RecorderProxy = {
    State: string,
    Type: string,
    ID: string
}

export type CalibratorProxy = {
    State: string
}

export type CalibrateProxy = {
    subCount: number,
    markerLength: number,
    subPath: string,
    createJson: boolean
}