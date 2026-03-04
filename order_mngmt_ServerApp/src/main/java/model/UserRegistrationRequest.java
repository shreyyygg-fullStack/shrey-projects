package model;

import java.sql.Timestamp;

public class UserRegistrationRequest {

	String user_id;
	String user_name;
	String email;
	String password;
	Timestamp create_time;
	Timestamp update_time;
	String department;
	Integer user_status;
	Integer login_status;
	Integer access_level;

	public UserRegistrationRequest() {
		super();
	}

	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
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

	public Timestamp getCreate_time() {
		return create_time;
	}

	public void setCreate_time(Timestamp create_time) {
		this.create_time = create_time;
	}

	public Timestamp getUpdate_time() {
		return update_time;
	}

	public void setUpdate_time(Timestamp update_time) {
		this.update_time = update_time;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public Integer getUser_status() {
		return user_status;
	}

	public void setUser_status(Integer user_status) {
		this.user_status = user_status;
	}

	public Integer getLogin_status() {
		return login_status;
	}

	public void setLogin_status(Integer login_status) {
		this.login_status = login_status;
	}

	public Integer getAccess_level() {
		return access_level;
	}

	public void setAccess_level(Integer access_level) {
		this.access_level = access_level;
	}

}
