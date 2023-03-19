/** 
 * projectName: screenShare 
 * fileName: GeneralTest.java 
 * packageName: com.codephase.screenShare 
 * date: 2021年9月6日下午9:15:04 
 */
package com.codephase.screenShare;

import org.junit.jupiter.api.Test;

import com.codephase.screenShare.tool.General;

/**   
 * @title: GeneralTest.java 
 * @package com.codephase.screenShare 
 * @description: TODO
 * @author: Mark.Yan
 * @date: 2021年9月6日 下午9:15:04 
 * @version: V1.0   
*/
public class GeneralTest {
	
	@Test
	void generalTest() {
		System.out.println(General.getRandomStr());
	}

}
