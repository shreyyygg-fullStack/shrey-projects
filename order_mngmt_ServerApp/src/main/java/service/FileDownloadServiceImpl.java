package service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import config.DBGetQuery;
import config.JwtTokenDetail;
import config.Log4j2;
import config.Logs;

@Service
public class FileDownloadServiceImpl implements FileDownloadService {
	JwtTokenDetail user=JwtTokenDetail.getInstance();
	@Autowired
	private JdbcTemplate jdbcTemplate;

	DBGetQuery getQuery = new DBGetQuery();
	Logs logs = new Logs();

	public List<Object> getYearList() {
		String sql = getQuery.getGetYearList();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownloadServiceImpl.class.getName()+logs.getYearListLog());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownloadServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	public List<Object> getYearDetails(String id) {
		String sql = getQuery.getGetSelectedYearDetails();
		Object[] params = new Object[] { id };
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownloadServiceImpl.class.getName()+ logs.getYearDetailLog());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownloadServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	public List<Object> getAllFilterDtails(String specNotFinal, String advPending, String letterCredPending,
			String befShpPending, String outstanding, String prodNotStarted, String lcCheckPending, String pExfPending,
			String fExfPending, String shpSchPendning, String shpAdvicePending, String yearList) {
		
		String sql = getQuery.getGetSelectedYearDetailsWithFilters();
		Object[] params = new Object[] { yearList };
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownloadServiceImpl.class.getName()+ logs.getAllFilterDetailLog());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownloadServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

}
