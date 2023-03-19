    const messageWindow = document.getElementById("messages");

    const sendButton = document.getElementById("send");
    const messageInput = document.getElementById("message");

    const fileInput = document.getElementById("file");
    const sendImageButton = document.getElementById("sendImage");

    const socket = new WebSocket("ws://"+ window.location.host +"/signal");
    socket.binaryType = "arraybuffer";

    socket.onopen = function (event) {
        addMessageToWindow("websocket 连接成功!");
    };

    socket.onmessage = function (event) {
        if (event.data instanceof ArrayBuffer) {
            addMessageToWindow('收到消息:');
            addImageToWindow(event.data);
        } else {
            addMessageToWindow(`收到消息: ${event.data}`);
        }
    };

    sendButton.onclick = function (event) {
        sendMessage(messageInput.value);
        messageInput.value = "";
    };

    sendImageButton.onclick = function (event) {
        let file = fileInput.files[0];
        sendMessage(file);
        fileInput.value = null;
    };

    function sendMessage(message) {
        socket.send(message);
        addMessageToWindow("发出消息: " + message);
    }

    function addMessageToWindow(message) {
        messageWindow.innerHTML += `<div>${message}</div>`
    }

    function addImageToWindow(image) {
        let url = URL.createObjectURL(new Blob([image]));
        messageWindow.innerHTML += `<img src="${url}"/>`
    }