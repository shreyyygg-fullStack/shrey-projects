package model;

public class UserDetails {
	String userId;
	String userName;
	String email;
	String password;
	String department;
	String userStatus;
	String userRole;
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getUserStatus() {
		return userStatus;
	}
	public void setUserStatus(String userStatus) {
		this.userStatus = userStatus;
	}
	public String getUserRole() {
		return userRole;
	}
	public void setUserRole(String userRole) {
		this.userRole = userRole;
	}
	public UserDetails(String userId, String userName, String email, String password, String department,
			String userStatus, String userRole) {
		super();
		this.userId = userId;
		this.userName = userName;
		this.email = email;
		this.password = password;
		this.department = department;
		this.userStatus = userStatus;
		this.userRole = userRole;
	}
	public UserDetails() {
		super();
	}
	@Override
	public String toString() {
		return "UserDetails [userId=" + userId + ", userName=" + userName + ", email=" + email + ", password="
				+ password + ", department=" + department + ", userStatus=" + userStatus + ", userRole=" + userRole
				+ "]";
	}
	
	
}
