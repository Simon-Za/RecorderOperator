# RecorderOperator
This project contains a WebSocket server for the network communication of an operator UI, the recorder and the calibrator.

## Project Overview

### System Requirements
| Component   | Version   |
|-------------|-----------|
| Node      | v18.18.0      |
| npx      | ^9.8.1     |

### Tested on
- Windows 10
- Nvidia RTX 2080 Super

## How to start the Repo
1. Initialize all submodules via: ```git submodule update --init --recursive```
2. Install and start the WebSocket-Server in chapter [Installation WebSocket-Server](WSS)
3. Install and start operator client in chapter [Installation of Operator UI](operator)
4. Install and start recorder in chapter [Installation of Recorder](recorder)
5. Install and start calibrator in chapter [Installation of Calibrator](calibrator)

## [Installation WebSocket-Server](WSS)
1. Navigate to the folder of the server ```.\Socket``` via the console ```cd .\Socket\```
2. Install the project via ```npm install```
3. Create a ```local.json``` in the folder ```.\Socket\config```
4. Add to the ```local.json``` the following JSON object:
```bash
{
    "express": {
        "networkAdapter": "", #The network adapter must be specified here, e.g. WLAN, so that the WebSocket server can be reached via the IP address of your device, which the network has assigned to your device.
        "useNetwork": #write true, if the server can be arrived via the network. false, if it's on your local device
    }
}
```
5. Run the project with ```npm run dev```
6. If the project compiled once, you can use the prompt ```npm start```

## [Installation of Operator UI](operator)
1. Navigate to the folder of the UI (```.\Client\OperatorClient```) : ```cd .\Client\OperatorClient\```
2. Edit ```.env``` with the following line:
```typescript
VITE_WEBSOCKET_ADDRESS="ws://<ip-address, where the WebSocket-Server is available>:8080"
```
3. Install the project via: ```npm install```
4. Install the project via: ```npm run dev```
5. Open the website on ```http://localhost:5173/```


## [Installation of Recorder](recorder)
1. Navigate to the folder of the recorder ```.\Recorder``` via ``` cd .\Recorder\```
2. Install the project via ```npm install```
3. Create a ```local.json``` in the folder ```.\Recorder\config```
4. Add to the ```local.json``` the following JSON object:
```bash
{
    "socket": {
        "host": "", #add the ip-address of the WebSocket-Server, if its running locally type localhost
    },
    "azureKinect": {
        "type": "", #type of recorder [e.g. if it's the master, type Master, if it's a Sub, type Sub]
        "id": "", #id of the recorder [e.g. the  first Sub is 1, the second Sub is 2, Master has id 0]
        "sdkPath": "", #path, where the k4arecorder.exe is installed [e.g. C:/Program Files/Azure Kinect SDK v1.4.1/tools/k4arecorder.exe]
        "folderPath": "", #folder, where the video should be saved [e.g. C:/Users/nicka/OneDrive/Desktop/Test]
        "baseCommand": "{{sdkPath}} <insert here the command of Sub or Master recording (the commands are stored in Notion) (e.g. --device 0 --external-sync master --imu OFF -c 1080p -d NFOV_2X2BINNED -r 30 -l 10)> </insert> {{folderPath}}/{{fileName}}.mkv" #copy it, but add the command inside the <> brackets 
    },
    "timer": {
        "time": "", #change timer in sekunds, to set its delay [e.g. 15]
    }
}
```
5. Run the project via ```npm run start```

## [Installation of Calibrator](calibrator)
1. Navigate to the folder of the calibrator ```.\Calibrator``` via ``` cd .\Calibrator\```
2. Please refer to the base installation of base [calibrator](Calibrator/calibrating/README.md), but please ignore step 9
3. Open the file `Calibrator/__init__.py` and adjust the following variables in lines 56-58:

```python
proxy.recordings_path = "" #[your own path e.g. C:\Users\User\Desktop\Videos]
proxy.mkvToolNix_path = "" #[your own path e.g. D:\MKVToolNix]
proxy.kinect_pic_rec_extractor = "" #.venv\\Lib\\site-packages\\open3d\\examples\\reconstruction_system\\sensors
```

In line 8 change the following:
```python
webSocketAdress = "" #[ip-address, where the websocket is hosted]
```

4.  Install websockets via: ```pip install websockets```
5.  Install pyee via ```pip install pyee```
6.  Run the __init__.py script: ```python .\__init__.py```


## Get an overview about the infrastructure
<figure>
  <img src="./UML/physical-infrastructure.png" alt="Physical-Infrastructure" title="Physical-Infrastructure">
  <figcaption>Figure 1: Physical-Infrastructure of our experimental setup with three Kicect-Cameras</figcaption>
</figure>

Our small setup was implemented without any kind of DHCP server. We only had four IP addresses to use, so we assigned them manually to the PCs. The PC with the IP address 192.168.10.1 uses the Windows Network Share feature to share a specific folder across the entire network. This allows all other clients to save their Kinect videos in that folder, ensuring that all video files are stored centrally. That folder has to be added as a network folder to all other clients, so its folder path can be used in the code as the path for the recordings of the Kinect cameras.
<figure>
  <img src="./UML/Hierachy.png" alt="Infrastructure" title="Infrastructure">
  <figcaption>Figure 2: Infrastructure of this repository and the software of our experimental setup</figcaption>
</figure>

In order to reproduce our results, it is important to use 3 Azure Kinect cameras. Each of these cameras is connected to a laptop or PC as shown in the container ‘For each kinect’. The recorder will run on this device, which will connect to the websocket server and needs access to a central file system so that the recorded video can be saved on it.

The websocket server, Calibrator and the Operator Client are executed on another laptop or PC. This device also provides the central file system. If all recorders and the calibrator are connected, both the recordings and the calibration can be started centrally via the Operator Client.


## Sources
Image of the Kinect from figure 1: https://pbs.twimg.com/media/EgOwJS6U8AAjqu5.png
