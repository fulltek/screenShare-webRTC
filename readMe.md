# 操作流程
- 1. 分享屏幕者输入根网址，比如localhost:8080

- 2. 系统检测到用户输入根网址，就建立一个meetingRoom, 并把meetingRoomID返回给网页

- 3. 分享屏幕者会根据meetingRoomId显示一个二维码，然后

	1. 产生RTCPeerConnection对象,用于视频流/音频流、以及数据的传输
	2. 连接websocket信令服务器, 把roomID发送给socket服务器，以便加入根据roomId加入sessionMap;
	3. 产生本地视频流（屏幕分享数据）,并把视频轨道添加到RTCPeerConnection；
	
- 4. 查看屏幕者扫描二维码，进入网页后：

	1. 产生RTCPeerConnection对象,用于视频流/音频流、以及数据的传输;
	2. 自动连接websocket信令服务器，连接成功后发送一个请求信号给被监控者；
	
- 5. 分享屏幕者收到要求监控的信号后：

	1. 由RTCPeerConnection对象创建offer信号（含SDP对象，其中有音视频信息）
	2. RTCPeerConnection的setLocalDescription保存SDP对象
	3. 将包含SDP信息的参数发送到信令服务器（再中继返回给发送请求的查看屏幕者）
	
- 6. 发送请求的查看屏幕者在收到offer信号后：

	1. 调用RTCPeerConnection对象的setRemoteDescription保存SDP信息
	2. 创建一个应答的answer(SDP对象)发送给分享屏幕者
	
- 7. 分享屏幕者在收到answer后，通过setRemoteDescription保存answer中SDP信息

- 8. 分享屏幕者与查看屏幕者根据SDP信息创建好了相对应的音视频channel,开启icecandidate的数据收集。（icecandidate可以理解为是获取对等端的IP地址、公网IP地址），分享屏幕者通过onicecandidate收到candidate信息。

- 9. 分享屏幕者将收到的candidate信息通过信令服务器发送给查看屏幕者

- 10. 查看屏幕者通过addicecandidate将candidate保存起来，知道了分享屏幕者的路由信息

- 11. 查看屏幕者将candidate信息发送给分享屏幕者

- 12. 分享屏幕者将收到的candidate通过addIceCandidate保存起来，知道了查看屏幕者的路由信息

- 13. 分享屏幕者和查看屏幕者之间有了足够信息建立点对点连接，并进行视频传输。

## 解决 eclipse 编辑 html时thymeleaf的js语法时报错红叉：
- 各种取消validation不起作用
- 设置window->preference->language servers，然后取消勾选HTML html language server



