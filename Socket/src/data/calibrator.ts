import { RecorderOperator } from "../.."
import { RecorderHooks } from "../hooks/recorderHooks"
import { WebSocket } from "ws"
import { CalibrateProxy, CalibratorProxy } from "../types/proxy"
import { OperatorHooks } from "../hooks/operatorHooks"
import { ReceivedEvent } from "../../athaeck-websocket-express-base/base/helper"
import { Free3DKeys } from "../types/keys"
import { OperatorComponent } from "./operatorComponent"

export class Calibrator extends OperatorComponent {
    private _state: string

    constructor(webSocket: WebSocket, hooks: RecorderHooks) {
        // this._webSocket = webSocket
        // this._hooks = hooks
        super(webSocket, hooks)

        this._state = "Idle"
    }

    public TakeOperator(operator: RecorderOperator): void {
        this.hooks.DispatchHook(RecorderHooks.CREATE_CALIBRATOR, this)
        operator.Hooks.SubscribeHookListener(OperatorHooks.CALIBRATE, this.OnCalibrate)
    }
    public RemoveOperator(operator: RecorderOperator): void {
        this.hooks.DispatchHook(RecorderHooks.REMOVE_CALIBRATOR, this)
        operator.Hooks.UnSubscribeListener(OperatorHooks.CALIBRATE, this.OnCalibrate)
    }

    private OnCalibrate = (proxy: CalibrateProxy) => {
        const calibrate: ReceivedEvent = new ReceivedEvent(Free3DKeys.ON_TRIGGER_CALIBRATION)
        calibrate.addData("SubCount", proxy.subCount)
        calibrate.addData("MarkerLength", proxy.markerLength)
        calibrate.addData("SubPath", proxy.subPath)
        calibrate.addData("CreateJSON", proxy.createJson)
        calibrate.addData("UseCharuco", proxy.useCharuco)
        calibrate.addData("IcpItteration", proxy.icpIterations)
        calibrate.addData("AmountPcdFrames", proxy.pcdFrames)
        calibrate.addData("PcdJustCenter", proxy.pcdJustCenter)
        calibrate.addData("CreateNpzs", proxy.createNPZs)
        this.webSocket.send(calibrate.JSONString)
    }

    public TakeState(state: string): void {
        this._state = state
    }

    public get State(): string {
        return this._state
    }
    public get CalibratorData(): CalibratorProxy {
        return {
            State: this._state
        }
    }
}