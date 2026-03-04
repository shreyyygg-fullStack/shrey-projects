package service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import config.DBGetQuery;
import config.DbIndentUpdateQuery;
import config.JwtTokenDetail;
import config.Log4j2;
import config.Logs;

@Service
public class IndentServiceImpl implements IndentService {

    private final String OPEN_TYPE_QUERY_APPEND_STRING = "  where (pmt_sts <> 'P-9' OR del_sts <> 'D-9') and (pmt_sts <> 'P-3' OR del_sts <> 'D-4') order by indent_sheet_num ";
    private final String CLOSED_TYPE_QUERY_APPEND_STRING = " where pmt_sts = 'P-3' AND del_sts = 'D-4' order by indent_sheet_num";
    private final String CANCELLED_TYPE_QUERY_APPEND_STRING = " where pmt_sts = 'P-9' AND del_sts = 'D-9' order by indent_sheet_num ";

    JwtTokenDetail user = JwtTokenDetail.getInstance();
    @Autowired
    private JdbcTemplate jdbcTemplate;

    DBGetQuery getQuery = new DBGetQuery();
    Logs logs = new Logs();
    DbIndentUpdateQuery updateQuery = new DbIndentUpdateQuery();

    public IndentServiceImpl() {
    }

    public List<Object> filter_NextAction_Today() {
        String sql = getQuery.getGETNextAction_Today();
        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + logs.getNextActionDataLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + "\t" + e);
        }
        return result;
    }

    public List<Object> getAllRevisedNextDate(String indentNo) {
        String sql = getQuery.getGetAllRevisedNextDate();

        Object[] params = new Object[]{indentNo};
        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + logs.getRevisedNextActionLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + "\t" + e);
        }
        return result;
    }

    public List<Object> indentDetail(String indentNo) {
        String sql = getQuery.getGetIndentDetail();
        Object[] params = new Object[]{indentNo};
        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + logs.getIndentDetailsLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + "\t" + e);
        }
        System.out.println();
        return result;
    }

    public List<Object> indent() {
        String sql = getQuery.getGetIndent();
        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + logs.getIndentLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + "\t" + e);
        }
        return result;
    }

    public List<Object> getAllIndentList() {
        String sql = updateQuery.getAllIndentList();
        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + logs.getAllIndentLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + "\t" + e);
        }
        return result;
    }

    public List<Object> getOpenIndentList() {
        String sql = updateQuery.getOpenIndentList();
        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + logs.getOpenIndentLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + "\t" + e);
        }
        return result;
    }

    public List<Object> getServiceMasterIndents() {


        String sql = updateQuery.getServiceMasterIndents();
        List<Object> result = new ArrayList<>();
        try {
//            String sql1 = updateQuery.getUpdateIndentsInProd();
//
//            int affectedRows1 = jdbcTemplate.update(sql1);

            String sql2 = updateQuery.getUpdateIndentsInService();

            int affectedRows2 = jdbcTemplate.update(sql2);


            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + " Service Master Indents");
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + "\t" + e);
        }
        return result;
    }


    public List<Object> getClosedIndentList() {
        String sql = updateQuery.getClosedIndentList();
        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + logs.getClosedIndentLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + "\t" + e);
        }
        return result;
    }

    public List<Object> getCancelledIndentList() {
        String sql = updateQuery.getCancelledIndentList();
        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + logs.getCancelledIndentLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + "\t" + e);
        }
        return result;
    }

    public List<Object> getAllIndentListASC(String indentType) {
        String sql = updateQuery.getAllIndentListASC();
        if (indentType.equals("OPEN")) {
            sql = sql + OPEN_TYPE_QUERY_APPEND_STRING;
        } else if (indentType.equals("CLOSED")) {
            sql = sql + CLOSED_TYPE_QUERY_APPEND_STRING;
        } else if (indentType.equals("CANCELLED")) {
            sql = sql + CANCELLED_TYPE_QUERY_APPEND_STRING;
        }
        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + logs.getAllIndentLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + "\t" + e);
        }
        return result;
    }

    public List<Object> getCategoryList() {
        String sql = updateQuery.getCategoryList();
        List<Object> result = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            result = new ArrayList<>(rows);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + " Get Category List");
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + "\t" + e);
        }
        return result;
    }


    public List<Object> getIndentOtherFileList(String indentNo) {
        String sql = updateQuery.getAllIndentOtherFileList();
        String sql1 = updateQuery.getAllIndentImagesData();
        String sql2 = updateQuery.getInvEwbDocs();
        Object[] params = new Object[]{indentNo};

        List<Object> combinedResult = null;
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
            List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1, params);
            List<Map<String, Object>> rows2 = jdbcTemplate.queryForList(sql2, params);

            combinedResult = new ArrayList<>();
            combinedResult.addAll(rows);
            combinedResult.addAll(rows1);
            combinedResult.addAll(rows2);

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + " Get Indent Other File Data");
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + IndentServiceImpl.class.getName() + "\t" + e);
        }
        return combinedResult;
    }


}
