package service;

import config.DbIndentUpdateQuery;
import config.JwtTokenDetail;
import config.Log4j2;
import config.Logs;
import model.PriorityIndents;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DisplayBoardServiceImpl implements DisplayBoardService {


    @Autowired
    @Qualifier("secondaryJdbcTemplate")
    private JdbcTemplate jdbcTemplate;
    Logs logs = new Logs();
    JwtTokenDetail user = JwtTokenDetail.getInstance();
    DbIndentUpdateQuery updateQuery = new DbIndentUpdateQuery();
    public List<PriorityIndents> getAllPriorityIndentList() {

        String sql = updateQuery.getUpdatePriorityType();
        String sql1 = updateQuery.getAllPriorityIndentList();

        List<PriorityIndents> result = new ArrayList<>();
        try {
            int affectdRows = jdbcTemplate.update(sql);

            List<PriorityIndents> rows = jdbcTemplate.query(sql1, new GetAllPriorityIndentsRowMapper());
            result = new ArrayList<PriorityIndents>(rows);

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoardServiceImpl.class.getName() + logs.getAllIndentLog());

            if(affectdRows > 0){
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoardServiceImpl.class.getName() + logs.getUpdatedPosition());
            }else{
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoardServiceImpl.class.getName() + logs.getFailUpdatedPosition());
            }
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoardServiceImpl.class.getName() + "\t" + "Failed to Get All Indents "+ e);
        }
        return result;
    }

    @Override
    public List<Object> getINDENTDETAIL(String indentNum) {
        String sql = updateQuery.getINDENTDETAIL();
        Object[] params = new Object[]{indentNum};

        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoardServiceImpl.class.getName() + logs.getOneIndentDetail());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoardServiceImpl.class.getName() + logs.getFailIndentDetail());
        }
        return result;
    }

    @Override
    public List<Object> getINDENTPOSITION(String indentPosition) {
        String sql = updateQuery.getINDENTNUM();
        Object[] params = new Object[]{indentPosition};

        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoardServiceImpl.class.getName() + logs.getIndentNum());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoardServiceImpl.class.getName() + logs.getFailIndentNum());
        }
        return result;
    }

    public List<Object> getPaginationDetails() {
        String sql = updateQuery.getPaginationDetails();
        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoardServiceImpl.class.getName() + logs.getPageDetail());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoardServiceImpl.class.getName() + logs.getFailPageDetail());
        }
        return result;
    }

    public List<Object> getRegionList() {
        String sql = updateQuery.getRegionList();
        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoardServiceImpl.class.getName() + logs.getRegionListLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoardServiceImpl.class.getName() + logs.getFailRegionListLog());
        }
        return result;
    }

}

class GetAllPriorityIndentsRowMapper implements RowMapper<PriorityIndents> {

    public PriorityIndents mapRow(ResultSet rs, int rowNum) throws SQLException {
        PriorityIndents priorityIndents = new PriorityIndents();

        priorityIndents.setIndent_sheet_num(rs.getString("indent_sheet_num"));
        priorityIndents.setIndent_issue_date(rs.getString("indent_issue_date"));
        priorityIndents.setContract_acnt_name(rs.getString("contract_acnt_name"));
        priorityIndents.setSos_summary(rs.getString("sos_summary"));
        priorityIndents.setSales1_name(rs.getString("sales1_name"));
        priorityIndents.setOrder_type(rs.getString("order_type"));
        priorityIndents.setIipo_no(rs.getString("iipo_no"));
        priorityIndents.setInvoice_no1(rs.getString("invoice_no1"));
        priorityIndents.setExf1_sts(rs.getString("exf1_sts"));
        priorityIndents.setEtd1(rs.getString("etd1"));
        priorityIndents.setExf1(rs.getString("exf1"));
        priorityIndents.setPriority_type(rs.getString("priority_type"));
        priorityIndents.setPriority_position(rs.getString("priority_position"));
        priorityIndents.setRemark1(rs.getString("remark1"));
        priorityIndents.setProd_date(rs.getString("prod_date"));
        priorityIndents.setProd_sts(rs.getString("prod_sts"));
        priorityIndents.setDel_sts(rs.getString("del_sts"));
        priorityIndents.setPmt_sts(rs.getString("pmt_sts"));
        priorityIndents.setFor_info(rs.getString("for_info"));
        priorityIndents.setRegion(rs.getString("region"));
        priorityIndents.setLinked_indents(rs.getString("linked_indents"));
        priorityIndents.setFrieght_trms(rs.getString("frieght_trms"));
        priorityIndents.setDispatch_location(rs.getString("dispatch_location"));
        priorityIndents.setPmt_trms(rs.getString("pmt_trms"));
        priorityIndents.setCustomer_etd(rs.getString("customer_etd"));
        priorityIndents.setCustomer_po_num(rs.getString("customer_po_num"));
        return priorityIndents;
    }
}