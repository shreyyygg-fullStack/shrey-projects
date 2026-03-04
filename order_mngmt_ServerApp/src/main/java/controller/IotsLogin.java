package controller;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import config.DBGetQuery;
import config.JwtTokenDetail;
import config.Log4j2;
import config.Logs;
import encrypt.AES;
import jwt.JwtTokenUtil;
import model.ApiResultResponse;
import model.LoginRequest;
import model.LoginResponse;
import model.LoginUserDetail;
import model.UserLoginDetail;
import model.UserUpdateRequest;
import model.ChangePasswordRequest;

@RestController
public class IotsLogin {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
	JwtTokenDetail user = JwtTokenDetail.getInstance();

	DBGetQuery dbGetQuery = new DBGetQuery();
	Logs logs = new Logs();

	static final Logger log = LogManager.getLogger(IotsLogin.class);
	String strDateFormat = "yyyy-MM-dd E HH:mm:ss.SSS";
	String formattedDate;
	Object tempPass = null;
	Object currPass = null;

	final String Key = "mysecretkey12345";
	private static final String authenticate = "/authenticate";
	private static final String updateLoginStatus = "/updateLoginStatus";
	private static final String matchUserWithEmail = "matchUserWithEmail/{email}";
	private static final String resetPassword = "/resetPassword";
	private static final String changePassword = "/changePassword";

	@RequestMapping(method = RequestMethod.POST, value = authenticate, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody LoginResponse authenticate(LoginRequest loginRequest, HttpServletRequest req,
			HttpServletResponse res) {

		LoginResponse loginResponse = new LoginResponse();
//		 replacing space with + because while coming through header it add space instead of + for space.
		String userId = loginRequest.getUser_id().replaceAll(" ", "+");
		String password = loginRequest.getPassword().replaceAll(" ", "+");
		userId = AES.decrypt(userId, Key);

//		password = AES.decrypt(password, Key);

		tempPass = null;
		String query = dbGetQuery.getCheckTempPassExists();
		Object[] params = new Object[] { userId };
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(query, params);
		for (Map<String, Object> row : rows) {
			tempPass = row.get("TEMP_PASSWORD");
		}

		if (Objects.nonNull(tempPass)) {
			int passLength = password.length();
			if (((String) tempPass).length() == passLength) {
			}
		}
		query = dbGetQuery.getUSERAUTHENTICATE();
		params = new Object[] { userId, password, password };

		try {

			List<LoginUserDetail> list = jdbcTemplate.query(query, params, new GetUserStatusRowMapper());

			if (list.isEmpty()) {
				loginResponse.setStatus("Failed");
			} else {
				loginResponse.setStatus("Success");
				loginResponse.setUserID(list.get(0).getUserID());
				loginResponse.setUserName(list.get(0).getUserName());
				loginResponse.setUserLoginStatus(list.get(0).getUserLoginStatus());
				loginResponse.setUserActiveStatus(list.get(0).getUserActiveStatus());
				loginResponse.setUserRole(list.get(0).getUserRole());
				loginResponse.setUserDepartment(list.get(0).getUserDepartment());
				loginResponse.setToken(jwtTokenUtil.generateToken(loginRequest, loginResponse));
				loginResponse.setEmail(list.get(0).getEmail());
				loginResponse.setDepartment(list.get(0).getDepartment());
				loginResponse.setDesignation(list.get(0).getDesignation());
				loginResponse.setTempPassword(list.get(0).getTempPassword());
				loginResponse.setPassword(list.get(0).getPassword());
				Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
						+ IotsLogin.class.getName() + logs.getLoginSuccessfull());
			}

		} catch (Exception e) {
			Log4j2.logger.log(Log4j2.LEVEL, "ERROR\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ IotsLogin.class.getName() + "\t" + e);
		}

		return loginResponse;

	}

	@RequestMapping(method = RequestMethod.POST, path = updateLoginStatus, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ApiResultResponse updateLoginStatus(
			@ModelAttribute("UserUpdateRequest") UserUpdateRequest userUpdateRequest, HttpServletRequest req,
			HttpServletResponse res) {

		ApiResultResponse apiResponse = new ApiResultResponse();

		if (userUpdateRequest.getUSER_ID().equals("") || userUpdateRequest.getUSER_ID().equals("null")) {
			userUpdateRequest.setUSER_ID(null);
		}
		if (userUpdateRequest.getLOGIN_STATUS().equals("") || userUpdateRequest.getLOGIN_STATUS().equals("null")) {
			userUpdateRequest.setLOGIN_STATUS(null);
		}

		try {
			String sql = dbGetQuery.getUpdateLoginStatus();
			int affectdRows = jdbcTemplate.update(sql,
					new Object[] { userUpdateRequest.getLOGIN_STATUS(), userUpdateRequest.getUSER_ID() });

			if (affectdRows == 1) {
				apiResponse.setAffectedRows(1);
				apiResponse.setMessage(
						"Login status for User: '" + userUpdateRequest.getUSER_ID() + "', updated successfully.");
				Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
						+ IotsLogin.class.getName() + "\t" + apiResponse.getMessage());
			}
		} catch (Exception e) {
			apiResponse.setAffectedRows(0);
			apiResponse.setMessage("Failed to update into database.");
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ IotsLogin.class.getName() + "\t" + apiResponse.getMessage());
			return apiResponse;
		}
		return apiResponse;
	}

	@RequestMapping(method = RequestMethod.GET, path = matchUserWithEmail, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Object> matchUserWithEmail(@PathVariable String email, HttpServletRequest req,
			HttpServletResponse res) {
		String sql = dbGetQuery.getMatchUserWithEmail();
		Object[] params = new Object[] { email };
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
		List<Object> userDetail = new ArrayList<>(rows);
		if (userDetail.isEmpty()) {

			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ IotsLogin.class.getName() + logs.getUserEmailNotFound());
		} else {
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ IotsLogin.class.getName() + logs.getUserEmailLoaded());
		}
		return userDetail;
	}

	@RequestMapping(method = RequestMethod.POST, path = resetPassword, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ApiResultResponse resetPassword(
			@ModelAttribute("UserUpdateRequest") UserUpdateRequest userUpdateRequest, HttpServletRequest req,
			HttpServletResponse res) {

		ApiResultResponse apiResponse = new ApiResultResponse();

		if (userUpdateRequest.getUSER_ID().equals("") || userUpdateRequest.getUSER_ID().equals("null")) {
			userUpdateRequest.setUSER_ID(null);
		}
		if (userUpdateRequest.getPASSWORD().equals("") || userUpdateRequest.getPASSWORD().equals("null")) {
			userUpdateRequest.setPASSWORD(null);
		}
		String password = userUpdateRequest.getPASSWORD().replaceAll(" ", "+");

//		password = AES.decrypt(password, Key);

		try {
			String sql = dbGetQuery.getResetPassword();
			int affectdRows = jdbcTemplate.update(sql, new Object[] { password, null, userUpdateRequest.getUSER_ID() });

			if (affectdRows == 1) {
				apiResponse.setAffectedRows(1);
				apiResponse
						.setMessage("Password for User: '" + userUpdateRequest.getUSER_ID() + "', reset successfully.");
				Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
						+ IotsLogin.class.getName() + "\t" + apiResponse.getMessage());
			}
		} catch (Exception e) {
			apiResponse.setAffectedRows(0);
			apiResponse.setMessage("Failed to reset password.");
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ IotsLogin.class.getName() + apiResponse.getMessage());
			return apiResponse;
		}
		return apiResponse;
	}

	@RequestMapping(method = RequestMethod.POST, path = changePassword, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ApiResultResponse changePassword(
			@ModelAttribute("ChangePasswordRequest") ChangePasswordRequest changePasswordRequest,
			HttpServletRequest req, HttpServletResponse res) {

		ApiResultResponse apiResponse = new ApiResultResponse();

		if (changePasswordRequest.getUSER_ID().equals("") || changePasswordRequest.getUSER_ID().equals("null")) {
			changePasswordRequest.setUSER_ID(null);
		}
		if (changePasswordRequest.getCURR_PASSWORD().equals("")
				|| changePasswordRequest.getCURR_PASSWORD().equals("null")) {
			changePasswordRequest.setCURR_PASSWORD(null);
		}
		if (changePasswordRequest.getPASSWORD().equals("") || changePasswordRequest.getPASSWORD().equals("null")) {
			changePasswordRequest.setPASSWORD(null);
		}

		String user_id = changePasswordRequest.getUSER_ID().replaceAll(" ", "+");
		String curr_password = changePasswordRequest.getCURR_PASSWORD().replaceAll(" ", "+");
		String password = changePasswordRequest.getPASSWORD().replaceAll(" ", "+");
		user_id = AES.decrypt(user_id, Key);

//		curr_password = AES.decrypt(curr_password, Key);

//		password = AES.decrypt(password, Key);

		try {

			String sql = dbGetQuery.getFetchUserPassword();
			Object[] params = new Object[] { user_id };
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
			for (Map<String, Object> row : rows) {
				currPass = row.get("PASSWORD");
			}
			if (Objects.nonNull(currPass)) {
				if (!((String) currPass).equals(curr_password)) {
					apiResponse.setAffectedRows(0);
					apiResponse.setMessage("Password not matched.");
					Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName()
							+ "\t" + IotsLogin.class.getName() + "\t" + apiResponse.getMessage());
					return apiResponse;
				}
			}

			sql = dbGetQuery.getUpdatePassword();
			int affectdRows = jdbcTemplate.update(sql, new Object[] { password, user_id });

			if (affectdRows == 1) {
				apiResponse.setAffectedRows(1);
				apiResponse.setMessage(
						"Password for User: '" + user_id + "', changed successfully.");
				Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
						+ IotsLogin.class.getName() + "\t" + apiResponse.getMessage());
			}
		} catch (Exception e) {
			apiResponse.setAffectedRows(0);
			apiResponse.setMessage("Failed to change password.");
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ IotsLogin.class.getName() + apiResponse.getMessage());
			return apiResponse;
		}
		return apiResponse;
	}

	// METHOD FOR FORMATING STRING.
	public static String logs(String level, String userId, String userName, String className, String message) {
		String log = String.format("%1$-8s%2$-10s%3$-25s%4$-25s%5$-200s", level, userId, userName, className, message);
		return log;
	}

	class GetUserStatusRowMapper implements RowMapper<LoginUserDetail> {

		UserLoginDetail userlogindetail = new UserLoginDetail();
		LoginUserDetail loginuserdetail = new LoginUserDetail();

		@Override
		public LoginUserDetail mapRow(ResultSet rs, int rowNum) throws SQLException {
			loginuserdetail.setUserID(rs.getString("USER_ID"));
			loginuserdetail.setUserName(rs.getString("USER_NAME"));
			loginuserdetail.setUserLoginStatus(rs.getString("LOGIN_STATUS"));
			loginuserdetail.setUserActiveStatus(rs.getString("ACTIVE_STATUS"));
			loginuserdetail.setUserRole(rs.getString("USER_ROLE"));
			loginuserdetail.setUserDepartment(rs.getString("DEPARTMENT"));
			loginuserdetail.setEmail(rs.getString("EMAIL"));
			loginuserdetail.setDepartment(rs.getString("DEPARTMENT"));
			loginuserdetail.setDesignation(rs.getString("DESIGNATION"));
			loginuserdetail.setTempPassword(rs.getString("TEMP_PASSWORD"));
			loginuserdetail.setPassword(rs.getString("PASSWORD"));
			return loginuserdetail;
		}

	}

}
