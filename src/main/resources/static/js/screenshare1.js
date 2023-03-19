var peerConnection;

/*
 * Setup 'leaveButton' button function.
 */
const leaveButton = document.getElementById('leaveButton');
leaveButton.addEventListener('click', leave);

function leave() {
    console.log(new Date(),'Ending call');
    peerConnection.close();
    signalingWebsocket.close();
    window.location.href = './index.html';
};

/*
 * Prepare websocket for signaling server endpoint.
 
var signalingWebsocket = new WebSocket("ws://" + window.location.host +
    "/video-conf-tutorial/"); */

var signalingWebsocket = new WebSocket("ws://" + window.location.host + "/signal");

signalingWebsocket.onmessage = function(msg) {
    console.log(new Date(),"Got message", msg.data);
    var signal = JSON.parse(msg.data);
    switch (signal.type) {
        case "offer":
			console.log(new Date(),"receviced -------offer!!")
            handleOffer(signal);
            break;
        case "answer":
            handleAnswer(signal);
            break;
        // In local network, ICE candidates might not be generated.
        case "candidate":
            handleCandidate(signal);
            break;
        default:
            break;
    }
};

signalingWebsocket.onopen = init();

function sendSignal(signal) {
    if (signalingWebsocket.readyState == 1) {
        signalingWebsocket.send(JSON.stringify(signal));
    }
};

/*
 * Initialize
 */
function init() {
    console.log(new Date(),"Connected to signaling endpoint. Now initializing.");    
    preparePeerConnection();

 //   displayLocalStreamAndSignal(true);

};

/*
 * Prepare RTCPeerConnection & setup event handlers.
 */
 async function preparePeerConnection() {
    
     // Using free public google STUN server.
    const configuration = {
        iceServers: [{
          //  urls: 'stun:stun.l.google.com:19302'
			urls: 'stun:stun.xten.com:3478'
        },{
			urls: 'stun:stun.internetcalls.com:3478'
		}]
    };

    // Prepare peer connection object
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.onnegotiationneeded = async () => {
        console.log(new Date(),'onnegotiationneeded');
    //    sendOfferSignal();
    };
    peerConnection.onicecandidate = function(event) {
	//	console.log(event.candidate)
        if (event.candidate) {
        	sendSignal(event);
        }
    };
    
    /*
	 * Track other participant's remote stream & display in UI when available.
	 * 
	 * This is how other participant's video & audio will start showing up on my
	 * browser as soon as his local stream added to track of peer connection in
	 * his UI.
	 */
    peerConnection.addEventListener('track', displayRemoteStream);
    //单向传输时必须有如下语句：
	setTimeout(function(){sendSignal(roomMessage("request","receiver",null));},1000);

};

/*
 * Display my local webcam & audio on UI.
 */
async function displayLocalStreamAndSignal(firstTime) {
    console.log(new Date(),'Requesting local stream');
    let localStream;
    try {
 	    const localVideo = document.getElementById('localVideo');
       // Capture local display Screen & audio stream & set to local <video> DOM
        // element
   /*     const stream = await navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: false
        }); */
/*         console.log('Received local stream');
       localVideo.srcObject = stream;
        localStream = stream;
        logVideoAudioTrackInfo(localStream); 

        // For first time, add local stream to peer connection.
       if (firstTime) {
            setTimeout(
                function() {
                    addLocalStreamToPeerConnection(localStream);
                }, 2000);
        } */

        // Send offer signal to signaling server endpoint.
	//	sendOfferSignal();
 	setTimeout(function() {sendOfferSignal();}, 5000);     //偶尔在不产生本地视频时管用

    } catch (e) {
        alert(`getUserMedia() error: ${e.name}`);
        throw e;
    }
    console.log('Start complete');
};

/*
 * Add local webcam & audio stream to peer connection so that other
 * participant's UI will be notified using 'track' event.
 * 
 * This is how my video & audio is sent to other participant's UI.
 */
async function addLocalStreamToPeerConnection(localStream) {
    console.log(new Date(),'Starting addLocalStreamToPeerConnection');
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    console.log(new Date(),'localStream tracks added');
};

/*
 * Display remote webcam & audio in UI.
 */
function displayRemoteStream(e) {
    console.log(new Date(),'displayRemoteStream');
    const remoteVideo = document.getElementById('remoteVideo');
	console.log( e.streams[0]);
    if (remoteVideo.srcObject !== e.streams[0]) {
        remoteVideo.srcObject = e.streams[0];
        console.log(new Date(),'pc2 received remote stream');
    }
};

/*
 * Send offer to signaling server. This is kind of telling server that my webcam &
 * audio is ready, so notify other participant of my information so that he can
 * view & hear me using 'track' event.
 */
function sendOfferSignal() {
	peerConnection.createOffer({offerToReceiveVideo: true})
		.then(offer=>{
			 peerConnection.setLocalDescription(offer);
			 sendSignal(offer);

		},
		error=>{
			alert("Error creating an offer");
		})

  /*  peerConnection.createOffer(function(offer) {
        sendSignal(offer);
        peerConnection.setLocalDescription(offer);
    }, function(error) {
        alert("Error creating an offer");
    }); */
};

/*
 * Handle the offer sent by other participant & send back answer to complete the
 * handshake.
 */
function handleOffer(offer) {
    peerConnection .setRemoteDescription(new RTCSessionDescription(offer));

    // create and send an answer to an offer
    peerConnection.createAnswer(function(answer) {
        peerConnection.setLocalDescription(answer);
        sendSignal(answer);
    }, function(error) {
        alert("Error creating an answer");
    });

};

/*
 * Finish the handshake by receiving the answer. Now Peer-to-peer connection is
 * established between my browser & other participant's browser. Since both
 * participants are tracking each others stream, they both will be able to view &
 * hear each other.
 */
function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log(new Date(),"connection established successfully!!");
};

/*
 * Add received ICE candidate to connection. ICE candidate has information about
 * how to connect to remote participant's browser. In local LAN connection, ICE
 * candidate might not be generated.
 */
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

function roomMessage(iType,iRole,iMessage){
	var msg=new Object();
	msg.type=iType;
	msg.role=iRole; //or receiver
	msg.msg=iMessage;
	return msg;
}