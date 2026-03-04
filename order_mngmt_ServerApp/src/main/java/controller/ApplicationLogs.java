package controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import config.DBGetQuery;
import config.JwtTokenDetail;
import config.Log4j2;
import config.Logs;
import model.ApiResultResponse;
import model.UserUpdateRequest;

@RestController
public class ApplicationLogs {

	private static final String getApplicationLog = "/getApplicationLog";
	private static final String getApplicationLogWithDate = "/getApplicationLogWithDate";
	private static final String getDeleteApplicationLog = "/getDeleteApplicationLog";

	JwtTokenDetail user = JwtTokenDetail.getInstance();
	@Autowired
	JdbcTemplate jdbcTemplate;
	DBGetQuery dbGetQuery = new DBGetQuery();
	Logs logs = new Logs();
	static final Logger log = LogManager.getLogger(ApplicationLogs.class);
	String strDateFormat = "yyyy-MM-dd E HH:mm:ss.SSS";
	String formattedDate;

	@RequestMapping(method = RequestMethod.GET, path = getApplicationLog, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Object> getApplicationLog(HttpServletRequest req, HttpServletResponse res) {
		String sql = dbGetQuery.getApplicationLogs();
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
		List<Object> applicationLog = new ArrayList<>(rows);
		return applicationLog;
	}

	@RequestMapping(method = RequestMethod.GET, path = getApplicationLogWithDate, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Object> getApplicationLogWithDate(@RequestParam String fromDate,
			@RequestParam String toDate, HttpServletRequest req, HttpServletResponse res) {
		String sql = dbGetQuery.getApplictionLogWithDate();
		Object[] params = new Object[] { fromDate, toDate };
		List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
		List<Object> ApplicationLog = new ArrayList<>(rows);

		getCurrentTimeUsingDate();

		if (ApplicationLog.isEmpty()) {
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ ApplicationLogs.class.getName() + "\t" + "Duplicate entry for appication log.");
		} else {
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ ApplicationLogs.class.getName() + "\t" + "Failed to insert into database.");
		}
		return ApplicationLog;
	}

	@RequestMapping(method = RequestMethod.POST, path = getDeleteApplicationLog, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ApiResultResponse getDeleteApplicationLog(HttpServletRequest req, HttpServletResponse res) {

		ApiResultResponse apiResponse = new ApiResultResponse();

		try {
			String sql = dbGetQuery.getInsertApplicationLogBck();
			int affectdRows = jdbcTemplate.update(sql);
			if (affectdRows > 0) {
				apiResponse.setMessage("Logs inserted into backup table successfully.");
				Log4j2.logger.log(Log4j2.LEVEL, "INFO " + "\t" + user.getJwt_userId() + "\t" + user.getJwt_userName()
						+ "\t" + ApplicationLogs.class.getName() + "\t" + apiResponse.getMessage());

				sql = dbGetQuery.getDeleteApplicationLog();
				affectdRows = jdbcTemplate.update(sql);
				if (affectdRows >= 1) {
					apiResponse.setAffectedRows(1);
					apiResponse.setMessage("Logs deleted successfully.");
					Log4j2.logger.log(Log4j2.LEVEL,
							"INFO " + "\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
									+ ApplicationLogs.class.getName() + "\t" + apiResponse.getMessage());
				}
			}
		} catch (Exception e) {
			apiResponse.setAffectedRows(0);
			apiResponse.setMessage("Failed to delete from database.");
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ ApplicationLogs.class.getName() + "\t" + apiResponse.getMessage());
			return apiResponse;
		}
		return apiResponse;
	}

	private void getCurrentTimeUsingDate() {
		Date date = new Date();
		DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
		formattedDate = dateFormat.format(date);
	}
}
