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
public class DashboardServiceImpl implements DashboardService {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	JwtTokenDetail user=JwtTokenDetail.getInstance();
	DBGetQuery getQuery = new DBGetQuery();
	Logs logs = new Logs();

	public DashboardServiceImpl() {
	}

	@Override
	public List<Object> getBLUFILTERSNF() {
		String sql = getQuery.getBLUFILTERSNF();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getBlueFilterSnf());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getBLUFILTERADV() {
		String sql = getQuery.getBLUFILTERADV();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getBlueFilterAdv());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		
		return result;
	}

	@Override
	public List<Object> getBLUFILTERLC() {
		String sql = getQuery.getBLUFILTERLC();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getBlueFilterLc());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		
		return result;
	}

	@Override
	public List<Object> getBLUFILTERBSH() {
		String sql = getQuery.getBLUFILTERBSH();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getBlueFilterBsh());
			
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getBLUFILTEROUT() {
		String sql = getQuery.getBLUFILTEROUT();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getBlueFilterOut());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		
		return result;
	}

	@Override
	public List<Object> getBLUFILTERPNS() {
		String sql = getQuery.getBLUFILTERPNS();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getBlueFilterPns());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		
		return result;
	}

	@Override
	public List<Object> getBLUFILTERLCP() {
		String sql = getQuery.getBLUFILTERLCP();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getBlueFilterPns());
			
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getBLUFILTERPXEF() {
		String sql = getQuery.getBLUFILTERPXEF();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getBlueFilterPxef());
			
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getBLUFILTERFEXF() {
		String sql = getQuery.getBLUFILTERFEXF();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getBlueFilterFexf());
			
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getBLUFILTERSSP() {
		String sql = getQuery.getBLUFILTERSSP();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getBlueFilterSsp());
			
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getBLUFILTERSAP() {
		String sql = getQuery.getBLUFILTERSAP();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getBlueFilterSap());
			
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getYELLFILTERSNF() {
		String sql = getQuery.getYELLFILTERSNF();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getYellowFilterSnf());
			
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		
		return result;
	}

	@Override
	public List<Object> getYELLFILTERADV() {
		String sql = getQuery.getYELLFILTERADV();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getYellowFilterAdv());
			
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getYELLFILTERLC() {
		String sql = getQuery.getYELLFILTERLC();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getYellowFilterLc());
			
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getYELLFILTERBSH() {
		String sql = getQuery.getYELLFILTERBSH();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getYellowFilterBsh());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getYELLFILTEROUT() {
		String sql = getQuery.getYELLFILTEROUT();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getYellowFilterOut());
			
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getYELLFILTERPNS() {
		String sql = getQuery.getYELLFILTERPNS();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getYellowFilterPns());
			
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getYELLFILTERLCP() {
		String sql = getQuery.getYELLFILTERLCP();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getYellowFilterLcp());
			
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		return result;
	}

	@Override
	public List<Object> getYELLFILTERPXEF() {
		String sql = getQuery.getYELLFILTERPXEF();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getYellowFilterPxef());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		
		return result;
	}

	@Override
	public List<Object> getYELLFILTERFEXF() {
		String sql = getQuery.getYELLFILTERFEXF();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getYellowFilterFexf());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		
		return result;
	}

	@Override
	public List<Object> getYELLFILTERSSP() {
		String sql = getQuery.getYELLFILTERSSP();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+logs.getYellowFilterSsp());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		
		return result;
	}

	@Override
	public List<Object> getYELLFILTERSAP() {
		String sql = getQuery.getYELLFILTERSAP();
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getYellowFilterSap());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		
		return result;
	}

	@Override
	public List<Object> getINDVINDENTDETAIL(String indentNum) {
		String sql = String.format(getQuery.getINDVINDENTDETAIL(), indentNum);
		List<Object> result = new ArrayList<>();
		try {
			List<Map<String,Object>> rows = jdbcTemplate.queryForList(sql);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getOneIndentDetail());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}
		
		return result;
	}

	@Override
	public List<Object> checkPoNumberExist(String customerPoNumber) {
		String sql =getQuery.getQueryCheckPoNumExist();
		Object[] params = new Object[] { customerPoNumber };

		List<Object> result = new ArrayList<>();
		try {
			List<Map<String,Object>> rows = jdbcTemplate.queryForList(sql, params);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getLogForCheckPoNumberExist());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}

		return result;
	}

	@Override
	public List<Object> getIndentUsingPoNumber(String customerPoNumber) {
		String sql =getQuery.getQueryGetIndentUsingPoNumExist();
		Object[] params = new Object[] { customerPoNumber };

		List<Object> result = new ArrayList<>();
		try {
			List<Map<String,Object>> rows = jdbcTemplate.queryForList(sql, params);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getLogForIndentListUsingPoNum());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}

		return result;
	}

	@Override
	public List<Object> getPmtListUsingPoNumber(String customerPoNumber) {
		String sql =getQuery.getQueryGetPmtListUsingPoNum();
		Object[] params = new Object[] { customerPoNumber };

		List<Object> result = new ArrayList<>();
		try {
			List<Map<String,Object>> rows = jdbcTemplate.queryForList(sql, params);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getLogForPmtListUsingPoNum());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}

		return result;
	}

	@Override
	public List<Object> getMasterPmtListUsingPoNumber(String customerPoNumber) {
		String sql =getQuery.getQueryGetMasterPmtListUsingPoNum();
		Object[] params = new Object[] { customerPoNumber };

		List<Object> result = new ArrayList<>();
		try {
			List<Map<String,Object>> rows = jdbcTemplate.queryForList(sql, params);
			result = new ArrayList<>(rows);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+ logs.getLogForMasterPmtListUsingPoNum());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ DashboardServiceImpl.class.getName()+"\t"+e);
		}

		return result;
	}
}
