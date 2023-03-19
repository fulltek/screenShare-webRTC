/** 
 * projectName: screenShare 
 * fileName: MeetingRoomController.java 
 * packageName: com.codephase.screenShare.controller 
 * date: 2021年9月5日上午7:35:47 
 */
package com.codephase.screenShare.controller;


import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.codephase.screenShare.tool.General;
import com.codephase.screenShare.handler.WebSocketHandler;

/**   
 * @title: MeetingRoomController.java 
 * @package com.codephase.screenShare.controller 
 * @description: TODO
 * @author: Mark.Yan
 * @date: 2021年9月5日 上午7:35:47 
 * @version: V1.0   
*/
@Controller
public class MeetingRoomController {
    
    @RequestMapping("/")
    public String creatMeetingRoom(Model model,HttpServletRequest req) {
    	String roomId;
    	if(req.getSession(true).getAttribute("_room")==null) {
        	boolean hasExist=false;
        	do {
        		roomId=General.getRandomStr();
    	    	if(WebSocketHandler.senderRoomMap.containsValue(roomId)) {
    	    		hasExist=true;
    	    		break;
    	    	}	
        	}
        	while(hasExist);
        	req.getSession(true).setAttribute("_room", roomId);
    	}
    	else
    		roomId=(String) req.getSession(true).getAttribute("_room");
    	model.addAttribute("room",roomId);
        return "sender";
    }
    
    
    @RequestMapping("/{rmid:\\d{6}}")
    public String enterMeetingRoom(Model model,@PathVariable("rmid") String roomId) {
    	System.out.println(roomId);
    	model.addAttribute("room", roomId);
    	return "receiver";
    }
	
    @RequestMapping("/websocket")
    public String socketConnectTest() {
        return "test";
    }
    
    @RequestMapping("/conference")
    public String videoConference(Model model) {
        return "conf";
    }
	
    @RequestMapping("/screenshare")
    public String screenShare(Model model) {
        return "screenshare";
    }
    
    @RequestMapping("/screenshare1")
    public String screenShare1(Model model) {
        return "screenshare1";
    }


}
