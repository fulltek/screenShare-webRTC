console.log("room in receiver: "+room);
let peerConnection;
const signalingWebsocket = new WebSocket("ws://" + window.location.host + "/signal");
const remoteVideo = document.getElementById('remoteVideo');
const configuration = {
        iceServers: [{
			urls: 'stun:stun.xten.com:3478'
        },{
			urls: 'stun:stun.internetcalls.com:3478'
	}]
 };
signalingWebsocket.onmessage = function(msg) {
    console.log("Got message in receiver: ", msg.data);
    let signal = JSON.parse(msg.data);
    switch (signal.type) {
        case "offer":
            handleOffer(signal);
            break;   
        case "answer":
            handleAnswer(signal);
            break;
        case "candidate":
            handleCandidate(signal);
            break;
        default:
            break;
    }
};

signalingWebsocket.onopen = function(){
	sendSignal(roomMessage("room","receiver",room));
    console.log("sending request message to sender...");    
	sendSignal(roomMessage("request","receiver",null));
};

function sendSignal(signal) {
    if (signalingWebsocket.readyState == 1) {
        signalingWebsocket.send(JSON.stringify(signal));
    }
};

function displayRemoteStream(e) {
    console.log('displayRemoteStream');
    if (remoteVideo.srcObject !== e.streams[0]) {
        remoteVideo.srcObject = e.streams[0];
        console.log('pc2 received remote stream');
    }
};

function sendOfferSignal() {
    peerConnection.createOffer(function(offer) {
	console.log(offer)
        sendSignal(offer);
        peerConnection.setLocalDescription(offer);
    }, function(error) {
        console.error("Error creating an offer",error);
    });
};

function handleOffer(offer) {
	console.log("received offer, begin generate peerConnection, listen events and make answer ... ");
    peerConnection = new RTCPeerConnection(configuration);	
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

	peerConnection.ontrack = event => {
		console.log("remote video stream received ...");
	    remoteVideo.srcObject = event.streams[0];
	};
	peerConnection.onicecandidate = event => {
		console.log(event)
	    if (event.candidate) {
	      sendSignal(event);
	    }
	};
	
		peerConnection.createAnswer(function(answer) {
		    sendSignal(answer);
	        peerConnection.setLocalDescription(answer);
	    }, function(error) {
	        console.error("Error creating an answer",error);
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

function roomMessage(iType,iRole,iMessage){
	let msg=new Object();
	msg.type=iType;
	msg.role=iRole; //or receiver
	msg.msg=iMessage;
	return msg;
}