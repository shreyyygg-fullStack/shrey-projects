package controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import config.DBGetQuery;
import config.JwtTokenDetail;
import config.Log4j2;
import config.Logs;
import encrypt.AES;
import model.ApiResultResponse;
import model.UserUpdateRequest;

@RestController
public class UserManagement {

	private static final String updatePassword = "/updatePassword";
	private static final String getUserList = "/getUserList";
	private static final String getActiveUserList = "/getActiveUserList";
	private static final String getInActiveUserList = "getInActiveUserList";
	private static final String getDepartmentList = "/getDepartmentList";
	private static final String getDesignationList = "/getDesignationList";
	private static final String getUserRoleList = "/getUserRoleList";
	private static final String getCurrentUserCount = "/getCurrentUserCount";
	private static final String getActiveUserCount = "/getActiveUserCount";
	private static final String getInActiveUserCount = "/getInActiveUserCount";
	private static final String getInsertUser = "/getInsertUser";
	private static final String getUpdateUser = "/getUpdateUser";
	private static final String getDeleteUser = "/getDeleteUser";

	JwtTokenDetail user = JwtTokenDetail.getInstance();
	@Autowired
	JdbcTemplate jdbcTemplate;
	DBGetQuery dbGetQuery = new DBGetQuery();
	Logs logs = new Logs();
	final String Key = "mysecretkey12345";
	
	@RequestMapping(method = RequestMethod.GET, path = getUserList, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Object> getUserList(HttpServletRequest req, HttpServletResponse res) {
		String sql = dbGetQuery.getUserList();
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		List<Object> userlist = new ArrayList<>(rows);
		return userlist;
	}

	@RequestMapping(method = RequestMethod.GET, path = getActiveUserList, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Object> getActiveUserList(HttpServletRequest req, HttpServletResponse res) {
		String sql = dbGetQuery.getActiveUserList();
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		List<Object> userlist = new ArrayList<>(rows);
		return userlist;
	}

	@RequestMapping(method = RequestMethod.GET, path = getInActiveUserList, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Object> getInActiveUserList(HttpServletRequest req, HttpServletResponse res) {
		String sql = dbGetQuery.getInActiveUserList();
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		List<Object> userlist = new ArrayList<>(rows);
		return userlist;
	}

	@RequestMapping(method = RequestMethod.GET, path = getDepartmentList, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Object> getDepartmentList(HttpServletRequest req, HttpServletResponse res) {
		String sql = dbGetQuery.getDepartmentList();
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		List<Object> userlist = new ArrayList<>(rows);
		return userlist;
	}

	@RequestMapping(method = RequestMethod.GET, path = getDesignationList, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Object> getDesignationList(HttpServletRequest req, HttpServletResponse res) {
		String sql = dbGetQuery.getDesignationist();
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		List<Object> userlist = new ArrayList<>(rows);
		return userlist;
	}

	@RequestMapping(method = RequestMethod.GET, path = getUserRoleList, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Object> getUserRoleList(HttpServletRequest req, HttpServletResponse res) {
		String sql = dbGetQuery.getUserRoleList();
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		List<Object> userlist = new ArrayList<>(rows);
		return userlist;
	}

	@RequestMapping(method = RequestMethod.GET, path = getCurrentUserCount, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Object> getCurrentUserCount(HttpServletRequest req, HttpServletResponse res) {
		String sql = dbGetQuery.getCurrentUserCount();
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		List<Object> userlist = new ArrayList<>(rows);
		return userlist;
	}

	@RequestMapping(method = RequestMethod.GET, path = getActiveUserCount, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Object> getActiveUserCount(HttpServletRequest req, HttpServletResponse res) {
		String sql = dbGetQuery.getActiveUserCount();
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		List<Object> userlist = new ArrayList<>(rows);
		return userlist;
	}

	@RequestMapping(method = RequestMethod.GET, path = getInActiveUserCount, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Object> getInActiveUserCount(HttpServletRequest req, HttpServletResponse res) {
		String sql = dbGetQuery.getInActiveUserCount();
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		List<Object> userlist = new ArrayList<>(rows);
		return userlist;
	}

	@RequestMapping(method = RequestMethod.POST, path = updatePassword, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ApiResultResponse updatePassword(
			@ModelAttribute("UserUpdateRequest") UserUpdateRequest userUpdateRequest, HttpServletRequest req,
			HttpServletResponse res) {

		ApiResultResponse apiResponse = new ApiResultResponse();

		if (userUpdateRequest.getUSER_ID().equals("") || userUpdateRequest.getUSER_ID().equals("null")) {
			userUpdateRequest.setUSER_ID(null);
		}
		if (userUpdateRequest.getPASSWORD().equals("") || userUpdateRequest.getPASSWORD().equals("null")) {
			userUpdateRequest.setPASSWORD(null);
		}

		try {
			String sql = dbGetQuery.getUpdatePassword();
			
			String password = userUpdateRequest.getPASSWORD().replaceAll(" ", "+");

//			password = AES.decrypt(password, Key);
			
			int affectdRows = jdbcTemplate.update(sql,
					new Object[] { password, userUpdateRequest.getUSER_ID() });

			if (affectdRows == 1) {
				apiResponse.setAffectedRows(1);
				apiResponse.setMessage(
						"Password for User: '" + userUpdateRequest.getUSER_ID() + "', updated successfully.");
				Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
						+ UserManagement.class.getName() + "\t" + apiResponse.getMessage());
			}
		} catch (Exception e) {
			apiResponse.setAffectedRows(0);
			apiResponse.setMessage("Failed to update into database.");
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ UserManagement.class.getName() + "\t" + apiResponse.getMessage());
			return apiResponse;
		}
		return apiResponse;
	}

	@RequestMapping(method = RequestMethod.POST, path = getInsertUser, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ApiResultResponse getInsertUser(
			@ModelAttribute("UserUpdateRequest") UserUpdateRequest userUpdateRequest, HttpServletRequest req,
			HttpServletResponse res) {

		ApiResultResponse apiResponse = new ApiResultResponse();

		if (userUpdateRequest.getUSER_ID().equals("") || userUpdateRequest.getUSER_ID().equals("null")) {
			userUpdateRequest.setUSER_ID(null);
		}
		if (userUpdateRequest.getUSER_NAME().equals("") || userUpdateRequest.getUSER_NAME().equals("null")) {
			userUpdateRequest.setUSER_NAME(null);
		}
		if (userUpdateRequest.getEMAIL().equals("") || userUpdateRequest.getEMAIL().equals("null")) {
			userUpdateRequest.setEMAIL(null);
		}
		if (userUpdateRequest.getPASSWORD().equals("") || userUpdateRequest.getPASSWORD().equals("null")) {
			userUpdateRequest.setPASSWORD(null);
		}
		if (userUpdateRequest.getUSER_ROLE().equals("") || userUpdateRequest.getUSER_ROLE().equals("null")) {
			userUpdateRequest.setUSER_ROLE(null);
		}
		if (userUpdateRequest.getDEPARTMENT().equals("") || userUpdateRequest.getDEPARTMENT().equals("null")) {
			userUpdateRequest.setDEPARTMENT(null);
		}
		if (userUpdateRequest.getDESIGNATION().equals("") || userUpdateRequest.getDESIGNATION().equals("null")) {
			userUpdateRequest.setDESIGNATION(null);
		}
		if (userUpdateRequest.getACTIVE_STATUS().equals("") || userUpdateRequest.getACTIVE_STATUS().equals("null")) {
			userUpdateRequest.setACTIVE_STATUS(null);
		}
		if (userUpdateRequest.getLOGIN_STATUS().equals("") || userUpdateRequest.getLOGIN_STATUS().equals("null")) {
			userUpdateRequest.setLOGIN_STATUS(null);
		}
		if (userUpdateRequest.getCREATED_ON().equals("") || userUpdateRequest.getCREATED_ON().equals("null")) {
			userUpdateRequest.setCREATED_ON(null);
		}

		try {

			String sql = dbGetQuery.getInsertUser();
			
			String password = userUpdateRequest.getPASSWORD().replaceAll(" ", "+");

//			password = AES.decrypt(password, Key);
			
			int affectdRows = jdbcTemplate.update(sql,
					new Object[] { userUpdateRequest.getUSER_ID(), userUpdateRequest.getUSER_NAME(),
							userUpdateRequest.getEMAIL(), password,
							userUpdateRequest.getUSER_ROLE(), userUpdateRequest.getDEPARTMENT(),
							userUpdateRequest.getDESIGNATION(), userUpdateRequest.getACTIVE_STATUS(),
							userUpdateRequest.getLOGIN_STATUS(), userUpdateRequest.getCREATED_ON() });


			if (affectdRows == 1) {
				apiResponse.setAffectedRows(1);
				apiResponse.setMessage("User: '" + userUpdateRequest.getUSER_NAME() + "', inserted successfully.");
				Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
						+ UserManagement.class.getName() + "\t" + apiResponse.getMessage());
			}

		} catch (DuplicateKeyException e) {
			apiResponse.setAffectedRows(0);
			apiResponse.setMessage("User: '" + userUpdateRequest.getUSER_NAME() + "', already exists in record.");
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ UserManagement.class.getName() + "\t" + apiResponse.getMessage());
			return apiResponse;

		} catch (Exception e) {
			apiResponse.setAffectedRows(0);
			apiResponse.setMessage("Failed to insert into database.");
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ UserManagement.class.getName() + "\t" + apiResponse.getMessage());
			return apiResponse;
		}
		return apiResponse;
	}

	@RequestMapping(method = RequestMethod.POST, path = getUpdateUser, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ApiResultResponse getUpdateUser(
			@ModelAttribute("UserUpdateRequest") UserUpdateRequest userUpdateRequest, HttpServletRequest req,
			HttpServletResponse res) {

		ApiResultResponse apiResponse = new ApiResultResponse();

		if (userUpdateRequest.getUSER_ID().equals("") || userUpdateRequest.getUSER_ID().equals("null")) {
			userUpdateRequest.setUSER_ID(null);
		}
		if (userUpdateRequest.getPASSWORD().equals("") || userUpdateRequest.getPASSWORD().equals("null")) {
			userUpdateRequest.setPASSWORD(null);
		}
		if (userUpdateRequest.getUSER_ROLE().equals("") || userUpdateRequest.getUSER_ROLE().equals("null")) {
			userUpdateRequest.setUSER_ROLE(null);
		}
		if (userUpdateRequest.getDESIGNATION().equals("") || userUpdateRequest.getDESIGNATION().equals("null")) {
			userUpdateRequest.setDESIGNATION(null);
		}
		if (userUpdateRequest.getACTIVE_STATUS().equals("") || userUpdateRequest.getACTIVE_STATUS().equals("null")) {
			userUpdateRequest.setACTIVE_STATUS(null);
		}
		if (userUpdateRequest.getLOGIN_STATUS().equals("") || userUpdateRequest.getLOGIN_STATUS().equals("null")) {
			userUpdateRequest.setLOGIN_STATUS(null);
		}
		if (userUpdateRequest.getUPDATED_ON().equals("") || userUpdateRequest.getUPDATED_ON().equals("null")) {
			userUpdateRequest.setUPDATED_ON(null);
		}

		try {
			String sql = dbGetQuery.getUpdateUser();
			
			String password = userUpdateRequest.getPASSWORD().replaceAll(" ", "+");

//			password = AES.decrypt(password, Key);
			
			int affectdRows = jdbcTemplate.update(sql,
					new Object[] { password, userUpdateRequest.getUSER_ROLE(),
							userUpdateRequest.getDESIGNATION(), userUpdateRequest.getACTIVE_STATUS(),
							userUpdateRequest.getLOGIN_STATUS(), userUpdateRequest.getUPDATED_ON(),
							userUpdateRequest.getUSER_ID() });

			if (affectdRows == 1) {
				apiResponse.setAffectedRows(1);
				apiResponse.setMessage("User: '" + userUpdateRequest.getUSER_NAME() + "', updated successfully.");
				Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
						+ UserManagement.class.getName() + "\t" + apiResponse.getMessage());
			}
		} catch (Exception e) {
			apiResponse.setAffectedRows(0);
			apiResponse.setMessage("Failed to update into database.");
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ UserManagement.class.getName() + "\t" + apiResponse.getMessage());
			return apiResponse;
		}
		return apiResponse;
	}

	@RequestMapping(method = RequestMethod.POST, path = getDeleteUser, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ApiResultResponse getDeleteUser(
			@ModelAttribute("UserUpdateRequest") UserUpdateRequest userUpdateRequest, HttpServletRequest req,
			HttpServletResponse res) {

		ApiResultResponse apiResponse = new ApiResultResponse();

		if (userUpdateRequest.getUSER_ID().equals("") || userUpdateRequest.getUSER_ID().equals("null")) {
			userUpdateRequest.setUSER_ID(null);
		}

		try {
			String sql = dbGetQuery.getDeleteUser();
			int affectdRows = jdbcTemplate.update(sql, userUpdateRequest.getUSER_ID());

			if (affectdRows == 1) {
				apiResponse.setAffectedRows(1);
				apiResponse.setMessage("User: '" + userUpdateRequest.getUSER_NAME() + "', deleted successfully.");
				Log4j2.logger.log(Log4j2.LEVEL, "INFO " + "\t" + user.getJwt_userId() + "\t" + user.getJwt_userName()
						+ "\t" + UserManagement.class.getName() + "\t" + apiResponse.getMessage());
			}
		} catch (Exception e) {
			apiResponse.setAffectedRows(0);
			apiResponse.setMessage("Failed to delete from database.");
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ UserManagement.class.getName() + "\t" + apiResponse.getMessage());
			return apiResponse;
		}
		return apiResponse;
	}
}
