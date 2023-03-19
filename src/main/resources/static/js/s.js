console.log("room in sender: "+room);
var peerConnection;
var signalingWebsocket = new WebSocket("ws://" + window.location.host + "/signal");
const localVideo = document.getElementById('localVideo');
    const configuration = {
        iceServers: [{
          //  urls: 'stun:stun.l.google.com:19302'
			urls: 'stun:stun.xten.com:3478'
        },{
			urls: 'stun:stun.internetcalls.com:3478'
		}]
    };

signalingWebsocket.onmessage = function(msg) {
    console.log("Got message", msg.data);
    var signal = JSON.parse(msg.data);
    switch (signal.type) {
        case "offer":
            handleOffer(signal);
            break;   
        case "answer":
            handleAnswer(signal);
            break;
        // In local network, ICE candidates might not be generated.
        case "candidate":
            handleCandidate(signal);
            break;
        
		case "request":
            preparePeerConnection();
            break;
        default:
            break;
    }
};

signalingWebsocket.onopen = function(){
	sendSignal(roomMessage(room));
    console.log("Connected to signaling endpoint. Now generate Local Stream."); 
 //   preparePeerConnection();
    generateLocalStream(true);	
};

function sendSignal(signal) {
    if (signalingWebsocket.readyState == 1) {
        signalingWebsocket.send(JSON.stringify(signal));
    }
};

function preparePeerConnection() {
    peerConnection = new RTCPeerConnection(configuration);
	let localStream =localVideo.srcObject;
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    peerConnection.onnegotiationneeded = async function(){
        console.log('onnegotiationneeded');
        sendOfferSignal();  //第一次发送，虽不能连接成功但不可缺少
    };
    peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
        	sendSignal(event);
        }
    };
 	setTimeout(function() {sendOfferSignal()}, 2500);  //第二次发送，客户端要在第二次发送后才能视频连接成功
};


async function generateLocalStream(firstTime) {
    let localStream;
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: true
        });
        console.log('Received local stream');
        localVideo.srcObject = stream;
        localStream = stream;
        logVideoAudioTrackInfo(localStream);
    } catch (e) {
        console.error(`getUserMedia() error: ${e.name}`);
        throw e;
    }
    console.log('Start complete, waiting for request signal from receiver...');
};

function sendOfferSignal() {
    peerConnection.createOffer(function(offer) {
        sendSignal(offer);
        peerConnection.setLocalDescription(offer);
    }, function(error) {
        console.error("Error creating an offer: ",error);
    });
};

function handleOffer(offer) {
    peerConnection .setRemoteDescription(new RTCSessionDescription(offer));
    peerConnection.createAnswer(function(answer) {
        peerConnection.setLocalDescription(answer);
        sendSignal(answer);
    }, function(error) {
        console.error("Error creating an answer: ",error);
    });
};

function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("connection established successfully!!");
};

function handleCandidate(candidate) {
	alert("handleCandidate");
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

/*
 * Logs names of your webcam & microphone to console just for FYI.
 */
function logVideoAudioTrackInfo(localStream) {
    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();
    if (videoTracks.length > 0) {
        console.log(`Using video device: ${videoTracks[0].label}`);
    }
    if (audioTracks.length > 0) {
        console.log(`Using audio device: ${audioTracks[0].label}`);
    }
};

function roomMessage(iRoom){
	var msg=new Object();
	msg.type="room";
	msg.role="sender"; //or receiver
	msg.roomId=iRoom;
	return msg;
}