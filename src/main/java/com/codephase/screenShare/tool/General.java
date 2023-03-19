/** 
 * projectName: screenShare 
 * fileName: General.java 
 * packageName: com.codephase.screenShare.tool 
 * date: 2021年9月6日下午9:13:28 
 */
package com.codephase.screenShare.tool;

import java.util.Random;

/**   
 * @title: General.java 
 * @package com.codephase.screenShare.tool 
 * @description: 通用工具类
 * @author: Mark.Yan
 * @date: 2021年9月6日 下午9:13:28 
 * @version: V1.0   
*/
public class General {
	
	// 随机生成4位字符串
	public static String getRandomStr() {
		String base = "0123456789";
		Random random = new Random();
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < 6; i++) {
			int number = random.nextInt(base.length());
			sb.append(base.charAt(number));
		}
		return sb.toString();
	}

	
	// 随机生成4位手机验证码
	public static String getRandomVerifyCode() {
		String base = "0123456789";
		Random random = new Random();
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < 4; i++) {
			int number = random.nextInt(base.length());
			sb.append(base.charAt(number));
		}
		return sb.toString();
	}
	

}
