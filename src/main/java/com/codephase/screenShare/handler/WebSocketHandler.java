/** 
 * projectName: screenShare 
 * fileName: WebSocketHandler.java 
 * packageName: com.codephase.screenShare.handler 
 * date: 2021年9月4日下午11:09:27 
 */
package com.codephase.screenShare.handler;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**   
 * @title: WebSocketHandler.java 
 * @package com.codephase.screenShare.handler 
 * @description: TODO
 * @author: Mark.Yan
 * @date: 2021年9月4日 下午11:09:27 
 * @version: V1.0   
*/
public class WebSocketHandler extends AbstractWebSocketHandler{
	private static final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<WebSocketSession>());
//	public static final Map<String,Set<WebSocketSession>> roomMembersMap =  Collections.synchronizedMap(new HashMap<String,Set<WebSocketSession>>());
	public static final Map<WebSocketSession,String> senderRoomMap = Collections.synchronizedMap(new HashMap<WebSocketSession,String>());
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
	/*	ObjectMapper mapper = new ObjectMapper();
		System.out.println("Got signal - " + message.getPayload());
		JsonNode node = mapper.readTree(message.getPayload());
		Set<WebSocketSession> sessions;
		if(node.get("type")!=null&&node.get("type").asText().equals("room")) {
			if(roomMembersMap.containsKey(node.get("roomId").asText())) 
				sessions=roomMembersMap.get(node.get("roomId").asText());
			else
				sessions=Collections.synchronizedSet(new HashSet<WebSocketSession>());
			sessions.add(session);
			roomMembersMap.put(node.get("roomId").asText(),sessions);
			System.out.println("roomMembersMap: "+roomMembersMap);
			if(node.get("role").asText().equals("sender")&&!senderRoomMap.containsKey(session)) {
				senderRoomMap.put(session, node.get("roomId").asText());   //sender的session作为key存入senderRoomMap Map.
			}
			System.out.println("senderRoomMap: "+senderRoomMap);
		}
		else {
			 // When message is received, send it to other participants with the same roomId.
			 // sender发来的其它类型消息（比如offer,answer,event），需要发给同一room里的所有receiver;
			 // receiver发来的其它类型消息，只需发给同一room里的唯一sender			 
			if(senderRoomMap.containsKey(session)) {   //sender发来的offer/answer/enent消息
				for (WebSocketSession sess : roomMembersMap.get(senderRoomMap.get(session))) { 
					if (!sess.equals(session)) {
						sess.sendMessage(message);    
					}
				}
			}
			else {   //receiver
				outer:for(String key:roomMembersMap.keySet()) {
					for(WebSocketSession sesskey:senderRoomMap.keySet()) {
						if(senderRoomMap.get(sesskey).equals(key)) { //receiver发来的offer/answer/enent消息
							sesskey.sendMessage(message);
							break outer;
						}
					}
				}
			}
		} */
		
		for(WebSocketSession sess:sessions) {
			if(!sess.equals(session))
				sess.sendMessage(message);  
		}
		
	}

	@Override
	protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws IOException {
	    System.out.println("New Binary Message Received"); 
	  //  session.sendMessage(message);  //echo the message received back to the sender.
	}
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("WebSocket Connection Established!");
		// Add websocket session to a global set to use in OnMessage.
		sessions.add(session);		
		
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("WebSocket Connection Closed!");
	/*	if(senderRoomMap.containsKey(session)) {  //sender发来的offer/answer/enent消息
			roomMembersMap.remove(senderRoomMap.get(session));
			if(roomMembersMap.get(senderRoomMap.get(session))!=null&&roomMembersMap.get(senderRoomMap.get(session)).isEmpty())
				roomMembersMap.remove(senderRoomMap.get(session));
			senderRoomMap.remove(session);
		}
		else {//receiver
			for(String key:roomMembersMap.keySet()) {
				if(roomMembersMap.get(key).contains(session)) {
					roomMembersMap.get(key).remove(session);
					if(roomMembersMap.get(key).isEmpty())
						roomMembersMap.remove(key);
					break;
				}
			}
		} */
		sessions.remove(session);
	}

}
