import asyncio
import websockets
from pyee import AsyncIOEventEmitter
import json
from calibrating.src.BaseCalibrator import BaseCalibrator


webSocketAdress: str = "192.168.178.34"
webSocketPort: str = "8080"



class WebSocketHooks(AsyncIOEventEmitter):
    NEW_CONNECTION = "NEW_CONNECTION"

    async def DispatchHook(self, hook, body):
        self.emit(hook, body)

    def SubscribeHookListener(self, hook, listener):
        self.on(hook, listener)

    def UnsubscripeListener(self, hook, listener):
        self.remove_listener(hook, listener)


class ReceivedEvent:
    def __init__(self, name: str):
        self.eventName = name
        self.data = {}

    @property
    def JSONString(self) -> str:
        return json.dumps(self.__dict__)

    def addData(self, key: str, value):
        self.data[key] = value

def CreateStateUpdate(state:str):
    stateUpdate: ReceivedEvent = ReceivedEvent("PROCESS_CALIBRATOR")
    stateUpdate.addData("State",state)
    return stateUpdate.JSONString


class SocketCalibrator(BaseCalibrator):

    async def SetStatus(self, status):

        print(status)
        await self.webSocket.send(CreateStateUpdate(status))

    def GetProxy(self, baseProxy):

        print(baseProxy)

        proxy = {}

        proxy.recordings_path = "C:\\Users\\nicka\\Desktop\\Test"
        proxy.mkvToolNix_path = "C:\\Program Files\\MKVToolNix"
        proxy.kinect_pic_rec_extractor =".\\venv\\Lib\\site-packages\\open3d\\examples\\reconstruction_system\\sensors"

        proxy.create_dg_init_npz =""

        proxy.amount_Subs = baseProxy["SubCount"]
        proxy.marker_length = baseProxy["MarkerLength"]
        proxy.sub_path= baseProxy["SubPath"]
        proxy.create_pcd_json = baseProxy["CreateJSON"]
        proxy.use_charuco = baseProxy["UseCharuco"]
        proxy.icp_itteration = baseProxy["IcpItteration"]
        proxy.amount_pcd_frames = baseProxy["AmountPcdFrames"]
        proxy.pcd_just_center = baseProxy["PcdJustCenter"]
        proxy.create_npzs = baseProxy["CreateNpzs"]

        return proxy


async def connect_to_server():
    calibrationHooks = WebSocketHooks()
    calibrator = SocketCalibrator()
    url: str = f"ws://{webSocketAdress}:{webSocketPort}"
    async with websockets.connect(url) as websocket:
        calibrator.webSocket = websocket
        async def OnTriggerCalibration(body:object):

            await calibrator.main(baseProxy=body)            


           
        calibrationHooks.SubscribeHookListener(hook="ON_TRIGGER_CALIBRATION",listener=OnTriggerCalibration)

        initCalibrator: ReceivedEvent = ReceivedEvent("INIT_CALIBRATOR")
        await websocket.send(initCalibrator.JSONString)

        while True:
            response = await websocket.recv()
            
            body = json.loads(response)

            event = body.get("eventName", "")
            data = body.get("data", {})

            print(event)
            print(data)

            asyncio.create_task(calibrationHooks.DispatchHook(hook=event,body=data))

            











asyncio.get_event_loop().run_until_complete(connect_to_server())