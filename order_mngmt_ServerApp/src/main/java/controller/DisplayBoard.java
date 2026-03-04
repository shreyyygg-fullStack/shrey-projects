package controller;

import config.*;
import model.IndentPosition;
import model.IndentUpdateResponse;
import model.PriorityIndents;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import service.DisplayBoardService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;


@RestController
public class DisplayBoard {


    JwtTokenDetail user = JwtTokenDetail.getInstance();
    @Autowired
    @Qualifier("secondaryJdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    @Autowired
    DisplayBoardService displayBoardService;
    DbIndentUpdateQuery updateQuery = new DbIndentUpdateQuery();
    DBGetQuery dbGetQuery = new DBGetQuery();
    Logs logs = new Logs();


    private static final String GET_ALLPRIOROTYINDENTLIST = "/all-priority-indent";
    private static final String GET_REGIONLIST = "/region-list";
    private static final String GET_INDENTDETAIL = "/selected-indentDetail/{indentNum}";
    private static final String GET_INDENTPOSITIONNUMBER = "/selected-indentPosition/{indentPosition}";
    private static final String SET_PRIORITYDATA = "/setPriorityIndent";
    private static final String CHANGE_INDENTPOSITION = "/changeIndentPosition";
    private static final String UPDATE_INDENTPOSITION = "/updateIndentPosition";
    private static final String GET_PAGINATIONDETAILS = "/pagination-details";
    private static final String SAVE_PAGINATIONDETAILS = "/savePageDetails";
    private static final String PRIORITY_INDENT_BY_DATE = "/priority-indents-by-date";
    private static final String SET_DEFAULT_POSITION = "/set-default-indent";

    // Getting ALL PRIOROTY INDENT LIST
    @RequestMapping(GET_ALLPRIOROTYINDENTLIST)
    public @ResponseBody List<PriorityIndents> getAllPriorityIndentList(HttpServletRequest req, HttpServletResponse res) {
        List<PriorityIndents> AllIndentList = displayBoardService.getAllPriorityIndentList();
        return AllIndentList;
    }

// Getting REGION LIST
    @RequestMapping(GET_REGIONLIST)
    public @ResponseBody List<Object> getRegionList(HttpServletRequest req, HttpServletResponse res) {
        List<Object> regionList = displayBoardService.getRegionList();
        return regionList;
    }

    //Getting selected Indent Detail
    @RequestMapping(GET_INDENTDETAIL)
    public @ResponseBody List<Object> getINDENTDETAIL(@PathVariable String indentNum, HttpServletRequest req,
                                                      HttpServletResponse res) {
        List<Object> IndentDetail = displayBoardService.getINDENTDETAIL(indentNum);
        return IndentDetail;
    }

    //Getting the Indent No. of selected Position
    @RequestMapping(GET_INDENTPOSITIONNUMBER)
    public @ResponseBody List<Object> getINDENTPOSITION(@PathVariable String indentPosition, HttpServletRequest req,
                                                        HttpServletResponse res) {
        List<Object> IndentNum = displayBoardService.getINDENTPOSITION(indentPosition);
        return IndentNum;
    }

    //Setting the Priority of Indent no.
    @PostMapping(SET_PRIORITYDATA)
    public @ResponseBody IndentUpdateResponse setPriorityData(@RequestBody Map<String, String> IndentPriority) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();

        String indentNumber = IndentPriority.get("indentNumber");
        String remarks = IndentPriority.get("remarks");
//        String priority_type = IndentPriority.get("priority_type");
        String indentPosition = IndentPriority.get("indentPosition");
        String indentRegion = IndentPriority.get("indentRegion");
        String indentFrieghtTrms = IndentPriority.get("indentFrieghtTrms");
        String indentDispatchLocation = IndentPriority.get("indentDispatchLocation");
        String indentsLinked = IndentPriority.get("indentsLinked");


        try {
            String sql1 = updateQuery.getSetIndentPriority();
            String sql2 = updateQuery.getSetUPFlag();
            String sql3 = updateQuery.getDeleteExpireAudits();

            int affectdRows = jdbcTemplate.update(sql1,
                    new Object[]{remarks, indentPosition, indentRegion, indentsLinked, indentDispatchLocation, indentFrieghtTrms, indentNumber});

            if (affectdRows == 1) {
                indentupdateresp.setAffectedRows(1);
                indentupdateresp.setMessage("Indent Position set Successfully");

                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + DisplayBoard.class.getName() + "\t" + indentupdateresp.getMessage());

                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentNumber, "Indent Position set Successfully",
                        DisplayBoard.class.getName());

                int affectdRows2 = jdbcTemplate.update(sql2);
                if (affectdRows2 == 1) {
                    Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                            + DisplayBoard.class.getName() + "\t" + logs.getUpFlagUpdated());
                }

                if (remarks != null) {
                    if (!remarks.trim().isEmpty()) {
                        int affectedRows3 = jdbcTemplate.update(sql3);
                        if (affectedRows3 > 0) {
                            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                    + DisplayBoard.class.getName() + "\t" + logs.getDeleteReamrks());
                        }
                        insertIboardAudits(indentNumber, user.getJwt_userId(), user.getJwt_userName(), remarks);
                    }
                }
            }
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + DisplayBoard.class.getName() + "\t" + "Failed to set Indent Position" + e);
        }
        return indentupdateresp;
    }


    //Setting new positions for indents
    @PostMapping(CHANGE_INDENTPOSITION)
    public @ResponseBody IndentUpdateResponse changeIndentPosition(@RequestBody Map<String, String> PositionData) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();

        String selectedIndentNum = PositionData.get("selectedIndentNumber");
        String indentPosition = PositionData.get("selectedIndentPosition");
        String assignedIndent = PositionData.get("assignedIndentNum");
        String remarks = PositionData.get("remarks");
//        String indentPriority = PositionData.get("priority_type");
        String indentRegion = PositionData.get("indentRegion");
        String indentFrieghtTrms = PositionData.get("indentFrieghtTrms");
        String indentDispatchLocation = PositionData.get("indentDispatchLocation");
        String indentsLinked = PositionData.get("indentsLinked");

        try {
            String sql1 = updateQuery.getSETDEFAULTPOSITION();
            String sql2 = updateQuery.getSETINDENTPOSITION();
            String sql3 = updateQuery.getSetUPFlag();
            String sql4 = updateQuery.getDeleteExpireAudits();

            int affectdRows1 = jdbcTemplate.update(sql1,
                    new Object[]{assignedIndent});

            if (affectdRows1 == 1) {
                indentupdateresp.setAffectedRows(1);
                indentupdateresp.setMessage("Indent Default Position set Successfully");

                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + DisplayBoard.class.getName() + "\t" + indentupdateresp.getMessage());

                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        assignedIndent, "Indent Default Position set Successfully",
                        DisplayBoard.class.getName());

                int affectdRows2 = jdbcTemplate.update(sql2,
                        new Object[]{indentPosition, remarks,indentRegion, indentsLinked, indentDispatchLocation, indentFrieghtTrms, selectedIndentNum});

                if (affectdRows2 == 1) {
                    indentupdateresp.setAffectedRows(1);
                    indentupdateresp.setMessage("Indent Position Updated Successfully");

                    Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                            + DisplayBoard.class.getName() + "\t" + indentupdateresp.getMessage());

                    insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                            selectedIndentNum, "Indent Position Updated Successfully",
                            DisplayBoard.class.getName());

                    int affectdRows3 = jdbcTemplate.update(sql3);

                    if (affectdRows3 == 1) {
                        Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                + DisplayBoard.class.getName() + "\t" + logs.getUpFlagUpdated());
                    }
                    if (remarks != null) {
                        if (!remarks.trim().isEmpty()) {
                            int affectedRows3 = jdbcTemplate.update(sql4);
                            if (affectedRows3 > 0) {
                                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                        + DisplayBoard.class.getName() + "\t" + logs.getDeleteReamrks());
                            }
                            insertIboardAudits(selectedIndentNum, user.getJwt_userId(), user.getJwt_userName(), remarks);
                        }
                    }
                }
            }
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + DisplayBoard.class.getName() + "\t" + "Failed to update Indent Position " + e);
        }
        return indentupdateresp;
    }

    // DAILY PLANNING COMPONENT METHODS
    //Updating the Positions of Indent nos.
    @PostMapping(UPDATE_INDENTPOSITION)
    public @ResponseBody IndentUpdateResponse updateIndentPosition(@RequestBody List<IndentPosition> indents) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();

        String sql1 = updateQuery.getINDENTNUM();
        String sql2 = updateQuery.getSETDEFAULTPOSITION();
        String sql3 = updateQuery.getUpdateIndentPosition();
        String sql4 = updateQuery.getSetUPFlag();

        int affectdRows1 = 0;
        int affectdRows2 = 0;
        int affectdRows3 = 0;

        try {
            String indentSheetNums = "";
            for (IndentPosition indent : indents) {
                List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql1, new Object[]{indent.getUpdatePosition()});

                indentSheetNums = rows.stream()
                        .map(row -> row.get("indent_sheet_num").toString())
                        .collect(Collectors.joining(", "));

                if (!indentSheetNums.isEmpty()) {
                    affectdRows1 = jdbcTemplate.update(sql2,
                            new Object[]{indentSheetNums});

                    if (affectdRows1 == 1) {
                        indentupdateresp.setAffectedRows(1);
                        indentupdateresp.setMessage("Indent Default Positions set Successfully");

                        Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                + DisplayBoard.class.getName() + "\t" + indentupdateresp.getMessage());

                        insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                indentSheetNums, "Indent Default Positions set Successfully",
                                DisplayBoard.class.getName());

                        affectdRows2 = jdbcTemplate.update(sql3,
                                new Object[]{indent.getUpdatePosition(), indent.getIndent_sheet_num()});

                        if (affectdRows2 == 1) {
                            indentupdateresp.setAffectedRows(1);
                            indentupdateresp.setMessage("Indent Position Updated Successfully");

                            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                    + DisplayBoard.class.getName() + "\t" + indentupdateresp.getMessage());

                            insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                    indent.getIndent_sheet_num(), "Indent Position Updated Successfully",
                                    DisplayBoard.class.getName());

                            affectdRows3 = jdbcTemplate.update(sql4);

                            if (affectdRows3 == 1) {
                                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                        + DisplayBoard.class.getName() + "\t" + logs.getUpFlagUpdated());
                            }
                        }
                    }
                } else {
                    affectdRows2 = jdbcTemplate.update(sql3,
                            new Object[]{indent.getUpdatePosition(), indent.getIndent_sheet_num()});

                    if (affectdRows2 == 1) {
                        indentupdateresp.setAffectedRows(1);
                        indentupdateresp.setMessage("Indent Position Updated Successfully");

                        Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                + DisplayBoard.class.getName() + "\t" + indentupdateresp.getMessage());

                        insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                indent.getIndent_sheet_num(), "Indent Position Updated Successfully",
                                DisplayBoard.class.getName());

                        affectdRows3 = jdbcTemplate.update(sql4);

                        if (affectdRows3 == 1) {
                            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                    + DisplayBoard.class.getName() + "\t" + logs.getUpFlagUpdated());
                        }
                    }
                }
            }
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + DisplayBoard.class.getName() + "\t" +"Failed to update Indent Position " + e);
        }
        return indentupdateresp;
    }

    //setting the default indent position
    @PostMapping(SET_DEFAULT_POSITION)
    public @ResponseBody IndentUpdateResponse setDefaultPosition(@RequestBody Map<String, String> IndentNumber) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();
        String indentNum = IndentNumber.get("selectedIndentNumber");

        try {
            String sql1 = updateQuery.getSETDEFAULTPOSITION();
            String sql2 = updateQuery.getSetUPFlag();

            int affectdRows1 = jdbcTemplate.update(sql1,
                    new Object[]{indentNum});

            if (affectdRows1 == 1) {
                indentupdateresp.setAffectedRows(1);
                indentupdateresp.setMessage("Indent Default Position set Successfully");

                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + DisplayBoard.class.getName() + "\t" + indentupdateresp.getMessage());

                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentNum, "Indent Default Position set Successfully",
                        DisplayBoard.class.getName());

                int affectdRows2 = jdbcTemplate.update(sql2);

                if (affectdRows2 == 1) {
                    Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                            + DisplayBoard.class.getName() + "\t" + logs.getUpFlagUpdated());
                }
            }
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + DisplayBoard.class.getName() + "\t" + "Failed to set Indent Default Position " + e);
        }
        return indentupdateresp;
    }


    //IBoard Pagination setting component methods
    //getting pagination setting
    @RequestMapping(GET_PAGINATIONDETAILS)
    public @ResponseBody List<Object> getPaginationDetails(HttpServletRequest req, HttpServletResponse res) {
        List<Object> paginationDetails = displayBoardService.getPaginationDetails();
        return paginationDetails;
    }


    //saving the pagination setting
    @PostMapping(SAVE_PAGINATIONDETAILS)
    public @ResponseBody IndentUpdateResponse savePaginationDetails(@RequestBody Map<String, String> PaginationDetails) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();

        String pageStatus = PaginationDetails.get("pStatus");
        String pageJumpStatus = PaginationDetails.get("pageJumpStatus");
        String pageJumpNum = PaginationDetails.get("pJumpNumber");
        String pageTimer = PaginationDetails.get("pTimer");

        try {
            String sql1 = updateQuery.getUpdatePaginationDetails();
            String sql2 = updateQuery.getSetDefaultJumpPageNum();

            int affectdRows1 = jdbcTemplate.update(sql1,
                    new Object[]{pageStatus, pageJumpStatus, pageJumpNum, pageTimer});

            if (affectdRows1 == 1) {
                indentupdateresp.setAffectedRows(1);
                indentupdateresp.setMessage("Pagination Details updated Successfully");

                if (Objects.equals(pageJumpStatus, "0")) {
                    int affectdRows2 = jdbcTemplate.update(sql2);

                    if (affectdRows2 == 1) {
                        Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                + DisplayBoard.class.getName() + "\t" + logs.getDefaultPageJumpNum());
                    }
                }
                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + DisplayBoard.class.getName() + "\t" + indentupdateresp.getMessage());
            }
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + DisplayBoard.class.getName() + "\t" + "Failed to update Pagination Details " + e);
        }
        return indentupdateresp;
    }

    //IBOARD FILES
    //Getting filtered indents by date
    @RequestMapping(method = RequestMethod.POST, value = PRIORITY_INDENT_BY_DATE, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<PriorityIndents> listIndentByDate(Year year,
                                                                HttpServletRequest req, HttpServletResponse res) {
        String sql = updateQuery.getPriorityIndentListByDate();
        List<PriorityIndents> data = new ArrayList<PriorityIndents>();
        Object[] params = new Object[]{year.getStartDate(), year.getEndingDate()};

        try {
            data = jdbcTemplate.query(sql, params, new GetPriorityIndentsRowMapper());
            if (data.isEmpty()) {
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoard.class.getName() + logs.getEmptyIndents());
            } else {
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoard.class.getName() + logs.getNonEmptyIndents());
            }
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + DisplayBoard.class.getName() + "\t" + e);
        }
        return data;
    }

    public boolean insertIboardAudits(String indent_sheet_num, String userId, String userName, String remarks) {
        try {
            String sql = updateQuery.getInsertUpdateIboardAudits();

            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{indent_sheet_num, userId, userName, remarks, userId, userName, remarks});

            if (affectdRows == 1 || affectdRows == 2) {
                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + DisplayBoard.class.getName() + "\t" + "Audit log inserted.");
                return true;
            }
            return false;
        } catch (DuplicateKeyException e) {
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + DisplayBoard.class.getName() + "\t" + "Duplicate entry for Audit log." + e);
        } catch (Exception e) {
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + DisplayBoard.class.getName() + "\t" + "Failed to insert into database." + e);
        }
        return false;
    }

    public boolean insertApplicationLog(String userId, String userName, String indent_sheet_num, String logMsg,
                                        String controllerName) {
        try {
            String sql = dbGetQuery.getInsertApplicationLog();
            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{userId, userName, indent_sheet_num, logMsg, controllerName});
            if (affectdRows == 1) {
                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + ApplicationLogs.class.getName() + "\t" + "Application log inserted.");
                return true;
            }
            return false;
        } catch (DuplicateKeyException e) {
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + ApplicationLogs.class.getName() + "\t" + "Duplicate entry for appication log.");
        } catch (Exception e) {
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + ApplicationLogs.class.getName() + "\t" + "Failed to insert into database.");
        }
        return false;
    }
}

class GetPriorityIndentsRowMapper implements RowMapper<PriorityIndents> {

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