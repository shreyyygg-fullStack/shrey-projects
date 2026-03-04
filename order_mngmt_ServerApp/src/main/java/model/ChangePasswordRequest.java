package model;

public class ChangePasswordRequest {
	
	String USER_ID;
	String CURR_PASSWORD;
	String PASSWORD;
	
	public ChangePasswordRequest() {
		super();
	}

	public String getUSER_ID() {
		return USER_ID;
	}

	public void setUSER_ID(String uSER_ID) {
		USER_ID = uSER_ID;
	}

	public String getCURR_PASSWORD() {
		return CURR_PASSWORD;
	}

	public void setCURR_PASSWORD(String cURR_PASSWORD) {
		CURR_PASSWORD = cURR_PASSWORD;
	}

	public String getPASSWORD() {
		return PASSWORD;
	}

	public void setPASSWORD(String pASSWORD) {
		PASSWORD = pASSWORD;
	}
	
}