package config;

import encrypt.AES;

public class JwtTokenDetail {

	private static JwtTokenDetail instance = null;

	String jwt_userId;
	String jwt_userName;
	final String Key = "mysecretkey12345";

	private JwtTokenDetail() {
	}

	public static JwtTokenDetail getInstance() {
		if (instance == null) {
			instance = new JwtTokenDetail();
		}
		return instance;
	}

	public String getJwt_userId() {
		return jwt_userId;
	}

	public void setJwt_userId(String jwt_userId) {
		this.jwt_userId = jwt_userId;
		String userId = this.jwt_userId.replaceAll(" ", "+");
		userId = AES.decrypt(userId, Key);
		this.jwt_userId = userId;
	}

	public String getJwt_userName() {
		return jwt_userName;
	}

	public void setJwt_userName(String jwt_userName) {
		this.jwt_userName = jwt_userName;
	}

}
