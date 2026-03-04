package controller;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model.*;
import model.FileDownload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import config.DBGetQuery;
import config.DbIndentUpdateQuery;
import config.JwtTokenDetail;
import config.Log4j2;
import config.Logs;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import service.EXFemailSender;
import service.INVeWBemailSender;
import service.IndentService;

@RestController
public class IndentManagement {

    JwtTokenDetail user = JwtTokenDetail.getInstance();
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    IndentService indService;

    @Autowired
    EXFemailSender exFemailSender;

    @Autowired
    INVeWBemailSender inVeWBemailSender;

    String strDateFormat = "yyyy-MM-dd E HH:mm:ss.SSS";
    String formattedDate;

    @Autowired
    private RestTemplate restTemplate;
    JwtTokenDetail jwttokendetail = JwtTokenDetail.getInstance();
    DbIndentUpdateQuery updateQuery = new DbIndentUpdateQuery();
    DBGetQuery dbGetQuery = new DBGetQuery();
    Logs logs = new Logs();
    ApplicationLogs applicationLogs = new ApplicationLogs();
    public String defdate_fmt = "0000-00-00";

    private static final String GET_ALLINDENTLIST = "/indent";
    private static final String GET_OPENINDENTLIST = "/OpenIndent";
    private static final String GET_CLOSEDINDENTLIST = "/ClosedIndent";
    private static final String GET_CANCELLEDINDENTLIST = "/CancelledIndent";
    private static final String GET_ALLINDENTLISTASC = "/indentASC/{indentType}";
    private static final String GET_ALLINDENTSUBLIST = "/indentSubDetail/{indentno}";
    private static final String GET_UPDATEPIDATA = "/updatePIData";
    private static final String GET_UPDATEIIPODATA = "/updateIIPOData";
    private static final String GET_UPDATEIIOCDATA = "/updateIIOCData";
    private static final String GET_UPDATEOCDATA = "/updateOCData";
    private static final String GET_UPDATEIIEXFDATA = "/updateIIEXFData";
    private static final String GET_UPDATEBGDATA = "/updateBGData";
    private static final String GET_UPDATEINVDATA = "/updateINVData";
    private static final String GET_INSERTINVDATA = "/insertINVData";
    private static final String GET_DELETEINVDATA = "/deleteINVData";
    private static final String GET_UPDATEEXFDATA = "/updateEXFData";
    private static final String GET_UPDATELCDATA = "/updateLCData";
    private static final String GET_UPDATECOMDATA = "/updateCOMData";
    private static final String GET_UPDATESHPINVDATA = "/updateSHPorINVData";
    private static final String GET_UPDATENEXTACTIONDATA = "/updateNextActionData";

    private static final String GET_INVOICEINDENTLIST = "/getInvIndentData/{indentno}";
    private static final String GET_INDENTLISTFROMINVOICE = "/getIndentListFromInvoice";
    private static final String GET_INDENT_DETAILS = "/getIndentDetails";


    private static final String GET_INDENTOTHERFILEDATA = "/getIndentOtherFileData/{indentNo}";
    private static final String GET_CATEGORYLIST = "/getCategoryList";
    private static final String GET_INSERTOTHERFILEDATA = "/insertOtherFileData";
    private static final String GET_INSERTIMAGEFILEDATA = "/insertImageFileData";
    private static final String GET_DELETEOTHERFILE = "/deleteOtherFile";
    private static final String GET_DELETEIAMGEFILE = "/deleteImageFile";
    private static final String GET_INDENTDELSTS = "/getIndentDelSts/{indentno}";


    private static final String GET_PAYMENTINDENTLIST = "/getPaymentIndentData/{indentno}";    // fetch payment data.
    private static final String PAYMENT_DATA = "/PaymentData";       // insertion or update payment data
    private static final String DELETE_PAYMENT_DATA = "/DeletePaymentData";  // delete payment data
    private static final String INVOICE_FILTER_DATA = "/InvoiceFilterData/{indentType}";
    private static final String CANCEL_PAYMENT = "/paymentCancel";

    private static final String OPEN_INVOICE_APPEND = " AND (master.pmt_sts <> 'P-9' OR master.del_sts <> 'D-9') AND (master.pmt_sts <> 'P-3' OR master.del_sts <> 'D-4')";
    private static final String CLOSED_INVOICE_APPEND = " AND master.pmt_sts = 'P-3' AND master.del_sts = 'D-4'";
    private static final String CANCELLED_INVOICE_APPEND = " AND master.pmt_sts = 'P-9' AND master.del_sts = 'D-9'";
    private static final String SEND_INV_EMAIL = "/sendInvMail";
    private static final String SET_SERVICE_INDENT_STS = "/setIndentStatus";

    private static final String GET_SERVICE_MASTER_DATA = "/getServiceData";

    @RequestMapping(method = RequestMethod.POST, value = GET_INDENT_DETAILS, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Map<String, Object>> updateUser(FileDownload obj, HttpServletRequest req,
                                                              HttpServletResponse res) {
        String sql = "select * from master_data where  indent_sheet_num =?";
        List<Map<String, Object>> data = new ArrayList<>();
        try {
            data = jdbcTemplate.queryForList(sql, obj.getIndent_sheet_num());
            if (data.isEmpty()) {
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + logs.getEmptyIndentDetailLog());
            } else {
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + logs.getNonEmptyIndentDetailLog());

            }
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + e);
        }
        return data;
    }

    @RequestMapping(GET_CATEGORYLIST)
    public @ResponseBody List<Object> getCategoryList(HttpServletRequest req, HttpServletResponse res) {
        List<Object> categoryList = indService.getCategoryList();
        return categoryList;
    }

    @RequestMapping(GET_INDENTOTHERFILEDATA)
    public @ResponseBody List<Object> getIndentOtherFileList(@PathVariable("indentNo") String indentNo, HttpServletRequest req, HttpServletResponse res) {
        List<Object> indentOtherFileList = indService.getIndentOtherFileList(indentNo);
        getCurrentTimeUsingDate();

        if (indentOtherFileList.isEmpty()) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getEmptyIndentDetailLog());
        } else {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getNonEmptyIndentDetailLog());
        }
        return indentOtherFileList;
    }

    @RequestMapping(method = RequestMethod.GET, path = GET_INDENTDELSTS, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Object> GET_INDENTDELSTS(@PathVariable String indentno, HttpServletRequest req,
                                                       HttpServletResponse res) {

        String sql = updateQuery.getIndentDelStS();
        Object[] params = new Object[]{indentno};
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
        List<Object> delSts = new ArrayList<>(rows);
//        getCurrentTimeUsingDate();

        if (delSts.isEmpty()) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + " Failed to get Del Sts.");
        } else {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + " Get Del Status Successfully.");
        }
        return delSts;
    }

    @RequestMapping(GET_ALLINDENTLIST)
    public @ResponseBody List<Object> getIndent(HttpServletRequest req, HttpServletResponse res) {
        List<Object> AllIndentList = indService.getAllIndentList();
        getCurrentTimeUsingDate();

        if (AllIndentList.isEmpty()) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getEmptyIndentDetailLog());
        } else {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getNonEmptyIndentDetailLog());
        }
        return AllIndentList;
    }

    @RequestMapping(GET_OPENINDENTLIST)
    public @ResponseBody List<Object> getOpenIndent(HttpServletRequest req, HttpServletResponse res) {
        List<Object> AllIndentList = indService.getOpenIndentList();
        getCurrentTimeUsingDate();

        if (AllIndentList.isEmpty()) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getEmptyIndentDetailLog());
        } else {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getNonEmptyIndentDetailLog());
        }
        return AllIndentList;
    }

    @RequestMapping(GET_CLOSEDINDENTLIST)
    public @ResponseBody List<Object> getClosedIndent(HttpServletRequest req, HttpServletResponse res) {
        List<Object> AllIndentList = indService.getClosedIndentList();
        getCurrentTimeUsingDate();

        if (AllIndentList.isEmpty()) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getEmptyIndentDetailLog());
        } else {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getNonEmptyIndentDetailLog());
        }
        return AllIndentList;
    }

    @RequestMapping(GET_CANCELLEDINDENTLIST)
    public @ResponseBody List<Object> getCancelledIndent(HttpServletRequest req, HttpServletResponse res) {
        List<Object> AllIndentList = indService.getCancelledIndentList();
        getCurrentTimeUsingDate();

        if (AllIndentList.isEmpty()) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getEmptyIndentDetailLog());
        } else {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getNonEmptyIndentDetailLog());
        }
        return AllIndentList;
    }

    @RequestMapping(GET_ALLINDENTLISTASC)
    public @ResponseBody List<Object> getIndentASC(@PathVariable("indentType") String indentType, HttpServletRequest req, HttpServletResponse res) {
        List<Object> AllIndentList = indService.getAllIndentListASC(indentType);
        getCurrentTimeUsingDate();

        if (AllIndentList.isEmpty()) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getEmptyIndentDetailLog());
        } else {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getNonEmptyIndentDetailLog());
        }
        return AllIndentList;
    }

    @RequestMapping(method = RequestMethod.GET, path = GET_ALLINDENTSUBLIST, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Object> GET_ALLINDENTSUBLIST(@PathVariable String indentno, HttpServletRequest req,
                                                           HttpServletResponse res) {

        String sql = dbGetQuery.getIndentSubDetail();
        Object[] params = new Object[]{indentno};
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
        List<Object> indentSubDetail = new ArrayList<>(rows);
        getCurrentTimeUsingDate();

        if (indentSubDetail.isEmpty()) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getEmptyIndentSubDetail());

        } else {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getIndentSubDetailLoaded());
        }
        return indentSubDetail;
    }

    @RequestMapping(method = RequestMethod.GET, path = GET_INVOICEINDENTLIST, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Object> GET_INVOICEINDENTLIST(@PathVariable String indentno, HttpServletRequest req,
                                                            HttpServletResponse res) {

        String sql = updateQuery.getInvewbIndentData();
        Object[] params = new Object[]{indentno};
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
        List<Object> invoiceDetail = new ArrayList<>(rows);
        getCurrentTimeUsingDate();

        if (invoiceDetail.isEmpty()) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getEmptyIndentInvoiceDetail());
        } else {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getIndentInvoiceDetailLoaded());
        }
        return invoiceDetail;
    }

    @RequestMapping(method = RequestMethod.GET, path = GET_PAYMENTINDENTLIST, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Object> GET_PAYMENTINDENTLIST(@PathVariable String indentno, HttpServletRequest req,
                                                            HttpServletResponse res) {

        String sql = updateQuery.getAllPaymentData();
        Object[] params = new Object[]{indentno};
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
        List<Object> paymentDetail = new ArrayList<>(rows);
        getCurrentTimeUsingDate();

        if (paymentDetail.isEmpty()) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getEmptyIndentPaymentDetail());
        } else {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getIndentPaymentDetailLoaded());
        }
        return paymentDetail;
    }

    @RequestMapping(method = RequestMethod.POST, path = GET_INSERTOTHERFILEDATA, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public @ResponseBody ApiResultResponse insertOtherFileData(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("category") List<String> categories,
            @RequestParam("indent_sheet_num") List<String> indent_sheet_num,
            HttpServletRequest req,
            HttpServletResponse res) throws IOException {
        ApiResultResponse apiResponse = new ApiResultResponse();

        String updated_by = user.getJwt_userId();

        try {
            if (files.size() != categories.size() || files.size() != indent_sheet_num.size()) {
                apiResponse.setMessage("Mismatch in number of files, categories, or indent sheet numbers.");
                return apiResponse;
            }
            for (int i = 0; i < files.size(); i++) {
                MultipartFile file = files.get(i);
                String category = categories.get(i);
                String indentSheetNum = indent_sheet_num.get(i);

                if (file != null && !file.isEmpty()) {
                    byte[] fileBytes = file.getBytes();
                    String fileName = file.getOriginalFilename();
                    String indent_doc_id = UUID.randomUUID().toString();

                    String sql = updateQuery.getInsertOtherDocs();

                    int affectedRows = jdbcTemplate.update(sql,
                            indent_doc_id,
                            indentSheetNum,
                            fileBytes,
                            fileName,
                            category,
                            updated_by
                    );

                    if (affectedRows == 1) {
                        apiResponse.setAffectedRows(1);
                        apiResponse.setMessage("Doc File Inserted successfully.");
                        Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                        insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                indent_sheet_num.get(0), "Doc File Information Updated",
                                IndentManagement.class.getName());
                    }
                }
            }
        } catch (Exception e) {
            apiResponse.setMessage("Failed to update into database. Please Try Again");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage() + e);
            return apiResponse;
        }
        return apiResponse;
    }

    @RequestMapping(method = RequestMethod.POST, path = GET_INSERTIMAGEFILEDATA, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public @ResponseBody ApiResultResponse insertImageFileData(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("indent_sheet_num") List<String> indent_sheet_num,
            HttpServletRequest req,
            HttpServletResponse res) throws IOException {
        ApiResultResponse apiResponse = new ApiResultResponse();

        String updated_by = user.getJwt_userId();

        try {

            for (int i = 0; i < files.size(); i++) {
                MultipartFile file = files.get(i);

                String indentSheetNum = indent_sheet_num.get(i);

                if (file != null && !file.isEmpty()) {
                    byte[] fileBytes = file.getBytes();
                    String fileName = file.getOriginalFilename();
                    String indent_img_id = UUID.randomUUID().toString();

                    String sql = updateQuery.getInsertImages();

                    int affectedRows = jdbcTemplate.update(sql,
                            indent_img_id,
                            indentSheetNum,
                            fileBytes,
                            fileName,
                            updated_by
                    );

                    if (affectedRows == 1) {
                        apiResponse.setAffectedRows(1);
                        apiResponse.setMessage("Other File Inserted successfully.");
                        Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                        insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                indent_sheet_num.get(0), "Other File Information Updated",
                                IndentManagement.class.getName());
                    }
                }
            }
        } catch (Exception e) {
            apiResponse.setMessage("Failed to update into database. Please Try Again");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage() + e);
            return apiResponse;
        }
        return apiResponse;
    }

    @RequestMapping(method = RequestMethod.POST, value = GET_UPDATEPIDATA, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody IndentUpdateResponse getUpdatePIData1(IndentUpdateRequest indentupdateres,
                                                               HttpServletRequest req, HttpServletResponse res) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();
        getCurrentTimeUsingDate();

        if (indentupdateres.getPi_no().equals("null") || StringUtils.isEmpty(indentupdateres.getPi_no())) {
            indentupdateres.setPi_no(null);
        }

        if (indentupdateres.getPi_date().equals("null") || StringUtils.isEmpty(indentupdateres.getPi_date())) {
            indentupdateres.setPi_date(null);
        }

        String sql = updateQuery.getUpdatePIData();
        try {
            if (jdbcTemplate.update(sql, new Object[]{indentupdateres.getPi_no(), indentupdateres.getPi_date(),
                    indentupdateres.getIndent_sheet_num()}) == 1) {
                indentupdateresp.setAffectedRows(1);
                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentupdateres.getIndent_sheet_num(), "PI Information Updated",
                        IndentManagement.class.getName());
            } else {

            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getUpdatePIDataLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + e);
        }

        return indentupdateresp;
    }

    @RequestMapping(method = RequestMethod.POST, value = GET_UPDATEIIPODATA, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody IndentUpdateResponse getUpdateIIPOData(IndentUpdateRequest indentupdateres,
                                                                HttpServletRequest req, HttpServletResponse res) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();
        getCurrentTimeUsingDate();

        if (indentupdateres.getIipo_no().equals("null")) {
            indentupdateres.setIipo_no(null);
        }

        if (indentupdateres.getIipo_date().equals("null") || StringUtils.isEmpty(indentupdateres.getIipo_date())) {
            indentupdateres.setIipo_date(null);
        }

        String sql = updateQuery.getUpdateIIPOData();
        try {
            if (jdbcTemplate.update(sql, new Object[]{indentupdateres.getIipo_no(), indentupdateres.getIipo_date(),
                    indentupdateres.getIndent_sheet_num()}) == 1) {
                indentupdateresp.setAffectedRows(1);
                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentupdateres.getIndent_sheet_num(), "II-PO Information Updated",
                        IndentManagement.class.getName());
            } else {

            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getUpdateIIPODataLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + e);
        }

        return indentupdateresp;

    }

    @RequestMapping(method = RequestMethod.POST, path = GET_UPDATEIIOCDATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ApiResultResponse updateIIOCData(
            @ModelAttribute("IndentUpdateRequest") IndentUpdateRequest indentUpdateRequest, HttpServletRequest req,
            HttpServletResponse res) {

        ApiResultResponse apiResponse = new ApiResultResponse();

        if (indentUpdateRequest.getJob_no().equals("") || indentUpdateRequest.getJob_no().equals("null")) {
            indentUpdateRequest.setJob_no(null);
        }
        if (indentUpdateRequest.getPrd_ord_date().equals("") || indentUpdateRequest.getPrd_ord_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getPrd_ord_date())) {
            indentUpdateRequest.setPrd_ord_date(null);
        }
        if (indentUpdateRequest.getOc_no().equals("") || indentUpdateRequest.getOc_no().equals("null")) {
            indentUpdateRequest.setOc_no(null);
        }
        if (indentUpdateRequest.getOc_date().equals("") || indentUpdateRequest.getOc_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getOc_date())) {
            indentUpdateRequest.setOc_date(null);
        }
        if (indentUpdateRequest.getIndent_sheet_num().equals("")
                || indentUpdateRequest.getIndent_sheet_num().equals("null")) {
            indentUpdateRequest.setIndent_sheet_num(null);
        }

        try {
            String sql = updateQuery.getUpdateIIOCData();

            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{indentUpdateRequest.getJob_no(), indentUpdateRequest.getPrd_ord_date(),
                            indentUpdateRequest.getOc_no(), indentUpdateRequest.getOc_date(),
                            indentUpdateRequest.getIndent_sheet_num()});

            if (affectdRows == 1) {
                apiResponse.setAffectedRows(1);
                apiResponse.setMessage("II-OC Updated successfully.");
                Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());

                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentUpdateRequest.getIndent_sheet_num(), "II-OC Information Updated",
                        IndentManagement.class.getName());
            }
        } catch (Exception e) {
            apiResponse.setMessage("Failed to update into database.");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage() + e);
            return apiResponse;
        }
        return apiResponse;
    }

    @RequestMapping(method = RequestMethod.POST, value = GET_UPDATEOCDATA, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody IndentUpdateResponse getUpdateOCData(IndentUpdateRequest indentupdateres,
                                                              HttpServletRequest req, HttpServletResponse res) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();
        getCurrentTimeUsingDate();

        if (indentupdateres.getIj_project_num().equals("null")
                || StringUtils.isEmpty(indentupdateres.getIj_project_num())) {
            indentupdateres.setIj_project_num(null);
        }

        if (indentupdateres.getOc_date().equals("null") || StringUtils.isEmpty(indentupdateres.getOc_date())) {
            indentupdateres.setOc_date(null);
        }

        String sql = updateQuery.getUpdateOCData();
        try {
            if (jdbcTemplate.update(sql, new Object[]{indentupdateres.getIj_project_num(),
                    indentupdateres.getOc_date(), indentupdateres.getIndent_sheet_num()}) == 1) {
                indentupdateresp.setAffectedRows(1);
                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentupdateres.getIndent_sheet_num(), "VD-OC Information Updated",
                        IndentManagement.class.getName());
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getUpdateOCDataLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + e);
        }

        return indentupdateresp;

    }

    @RequestMapping(method = RequestMethod.POST, value = GET_UPDATEEXFDATA, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody IndentUpdateResponse getUpdateEXFData(IndentUpdateRequest indentupdateres,
                                                               HttpServletRequest req, HttpServletResponse res) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();
        getCurrentTimeUsingDate();

        if (indentupdateres.getDel_sts().equals("null") || StringUtils.isEmpty(indentupdateres.getDel_sts())) {
            indentupdateres.setDel_sts(null);
        }

        if (indentupdateres.getExf1().equals("null") || StringUtils.isEmpty(indentupdateres.getExf1())) {
            indentupdateres.setExf1(null);
        }

        if (indentupdateres.getExf2().equals("null") || StringUtils.isEmpty(indentupdateres.getExf2())) {
            indentupdateres.setExf2(null);
        }

        if (indentupdateres.getExf3().equals("null") || StringUtils.isEmpty(indentupdateres.getExf3())) {
            indentupdateres.setExf3(null);
        }

        if (indentupdateres.getExf1_sts().equals("null") || StringUtils.isEmpty(indentupdateres.getExf1_sts())) {
            indentupdateres.setExf1_sts(null);
        }

        if (indentupdateres.getExf2_sts().equals("null") || StringUtils.isEmpty(indentupdateres.getExf2_sts())) {
            indentupdateres.setExf2_sts(null);
        }

        if (indentupdateres.getExf3_sts().equals("null") || StringUtils.isEmpty(indentupdateres.getExf3_sts())) {
            indentupdateres.setExf3_sts(null);
        }

        if (indentupdateres.getExf_ij_accment1().equals("null")
                || StringUtils.isEmpty(indentupdateres.getExf_ij_accment1())) {
            indentupdateres.setExf_ij_accment1(null);
        }

        if (indentupdateres.getExf_ij_accment2().equals("null")
                || StringUtils.isEmpty(indentupdateres.getExf_ij_accment2())) {
            indentupdateres.setExf_ij_accment2(null);
        }

        if (indentupdateres.getExf_ij_accment3().equals("null")
                || StringUtils.isEmpty(indentupdateres.getExf_ij_accment3())) {
            indentupdateres.setExf_ij_accment3(null);
        }

        String sql = updateQuery.getUpdateEXFData();
        try {

            String sql1 = updateQuery.getIndentDelStS();
            Object[] params = new Object[]{indentupdateres.getIndent_sheet_num()};
            Map<String, Object> result = jdbcTemplate.queryForMap(sql1, params);
            String delSts = (String) result.get("del_sts");

            if (jdbcTemplate.update(sql, new Object[]{indentupdateres.getExf1(), indentupdateres.getExf1_sts(),
                    indentupdateres.getExf_ij_accment1(), indentupdateres.getExf2(), indentupdateres.getExf2_sts(),
                    indentupdateres.getExf_ij_accment2(), indentupdateres.getExf3(), indentupdateres.getExf3_sts(),
                    indentupdateres.getExf_ij_accment3(), indentupdateres.getDel_sts(),
                    indentupdateres.getIndent_sheet_num()}) == 1) {

                indentupdateresp.setAffectedRows(1);
                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentupdateres.getIndent_sheet_num(), "VD-EXF Information Updated",
                        IndentManagement.class.getName());

                if (!Objects.equals(delSts, indentupdateres.getDel_sts())) {
                    insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                            indentupdateres.getIndent_sheet_num(), "DEL Status Updated from " + delSts + " to " + indentupdateres.getDel_sts(),
                            IndentManagement.class.getName());
                }

            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getUpdateEXFDataLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + e);
        }

        return indentupdateresp;

    }

    @RequestMapping(method = RequestMethod.POST, path = GET_UPDATEIIEXFDATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ApiResultResponse updateIIEXFData(
            @ModelAttribute("IndentUpdateRequest") IndentUpdateRequest indentUpdateRequest, HttpServletRequest req,
            HttpServletResponse res) {

        ApiResultResponse apiResponse = new ApiResultResponse();

        if (indentUpdateRequest.getDel_sts().equals("") || indentUpdateRequest.getDel_sts().equals("null")) {
            indentUpdateRequest.setDel_sts(null);
        }
        if (indentUpdateRequest.getExf1_date().equals("") || indentUpdateRequest.getExf1_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getExf1_date())) {
            indentUpdateRequest.setExf1_date(null);
        }
        if (indentUpdateRequest.getExf1_sts().equals("") || indentUpdateRequest.getExf1_sts().equals("null")) {
            indentUpdateRequest.setExf1_sts(null);
        }
        if (indentUpdateRequest.getExf1_annc_date().equals("") || indentUpdateRequest.getExf1_annc_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getExf1_annc_date())) {
            indentUpdateRequest.setExf1_annc_date(null);
        }
        if (indentUpdateRequest.getExf2_date().equals("") || indentUpdateRequest.getExf2_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getExf2_date())) {
            indentUpdateRequest.setExf2_date(null);
        }
        if (indentUpdateRequest.getExf2_sts().equals("") || indentUpdateRequest.getExf2_sts().equals("null")) {
            indentUpdateRequest.setExf2_sts(null);
        }
        if (indentUpdateRequest.getExf2_annc_date().equals("") || indentUpdateRequest.getExf2_annc_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getExf2_annc_date())) {
            indentUpdateRequest.setExf2_annc_date(null);
        }
        if (indentUpdateRequest.getExf3_date().equals("") || indentUpdateRequest.getExf3_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getExf3_date())) {
            indentUpdateRequest.setExf3_date(null);
        }
        if (indentUpdateRequest.getExf3_sts().equals("") || indentUpdateRequest.getExf3_sts().equals("null")) {
            indentUpdateRequest.setExf3_sts(null);
        }
        if (indentUpdateRequest.getExf3_annc_date().equals("") || indentUpdateRequest.getExf3_annc_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getExf3_annc_date())) {
            indentUpdateRequest.setExf3_annc_date(null);
        }
        if (indentUpdateRequest.getIndent_sheet_num().equals("")
                || indentUpdateRequest.getIndent_sheet_num().equals("null")) {
            indentUpdateRequest.setIndent_sheet_num(null);
        }

        try {

            String sql1 = updateQuery.getIndentDelStS();
            Object[] params = new Object[]{indentUpdateRequest.getIndent_sheet_num()};
            Map<String, Object> result1 = jdbcTemplate.queryForMap(sql1, params);
            String delSts = (String) result1.get("del_sts");

            //query to fetch previous exf date and exf status
            String sqlPreExf = dbGetQuery.getExfDateandstatus();

            //query to fetch updated exf date and exf status
            String sqlUpExf = dbGetQuery.getExfDateandstatus();

            //query to fetch account info
            String sqlmaster = dbGetQuery.getAccountInfo();

            // queries to update the EXF DATA
            String sql = updateQuery.getUpdateIIEXFData();
            String sql2 = updateQuery.getQueryUpdateDelStatusOfMaster();

            int affectdRows;
            int affectdRows2;

            // query to get the email flag
            String sqlEmailFlag = dbGetQuery.getGetEmailFlag();
            String eFlag = jdbcTemplate.queryForObject(sqlEmailFlag, String.class);

            if (Objects.equals(eFlag, "1")) {

                //method to fetch previous exf date and status
                List<PreviousExfData> preExfData = new ArrayList<>();
                Object[] param = new Object[]{indentUpdateRequest.getIndent_sheet_num()};
                List<PreviousExfData> row = jdbcTemplate.query(sqlPreExf, param, new GetPreExfMapper());
                preExfData = new ArrayList<PreviousExfData>(row);

                //method to fetch account info
                List<CustomerAccountInfo> accountInfo = new ArrayList<>();
                Object[] param3 = new Object[]{indentUpdateRequest.getIndent_sheet_num()};
                List<CustomerAccountInfo> row3 = jdbcTemplate.query(sqlmaster, param3, new GetAccountMapper());
                accountInfo = new ArrayList<CustomerAccountInfo>(row3);

                affectdRows = jdbcTemplate.update(sql,
                        new Object[]{indentUpdateRequest.getDel_sts(), indentUpdateRequest.getExf1_date(),
                                indentUpdateRequest.getExf1_sts(), indentUpdateRequest.getExf1_annc_date(),
                                indentUpdateRequest.getExf2_date(), indentUpdateRequest.getExf2_sts(),
                                indentUpdateRequest.getExf2_annc_date(), indentUpdateRequest.getExf3_date(),
                                indentUpdateRequest.getExf3_sts(), indentUpdateRequest.getExf3_annc_date(),
                                indentUpdateRequest.getIndent_sheet_num()});
                affectdRows2 = jdbcTemplate.update(sql2, new Object[]{indentUpdateRequest.getDel_sts(), indentUpdateRequest.getIndent_sheet_num()});

                if (affectdRows == 1 && affectdRows2 == 1) {
                    apiResponse.setAffectedRows(1);

                    //method to fetch updated exf date and status
                    List<UpdatedExfData> updExfData = new ArrayList<>();
                    Object[] param2 = new Object[]{indentUpdateRequest.getIndent_sheet_num()};
                    List<UpdatedExfData> row2 = jdbcTemplate.query(sqlUpExf, param2, new GetUpdatedExfMapper());
                    updExfData = new ArrayList<UpdatedExfData>(row2);

                    String predatadate = "";
                    String updatadate = "";
                    String predataSts = "";
                    String updataSts = "";


                    for (PreviousExfData predate : preExfData) {
                        predatadate = predate.getPreExfDate();
                    }
                    for (UpdatedExfData update : updExfData) {
                        updatadate = update.getUpdExfDate();
                        updataSts = update.getUpdExfSts();
                    }

                    //query to fetch last date/time of email sent to an Indent no.
                    String sqlGetEmailLog = dbGetQuery.getLastExfDateLog();

                    List<Object> result3 = new ArrayList<>();
                    Object[] param4 = new Object[]{indentUpdateRequest.getIndent_sheet_num(), indentUpdateRequest.getIndent_sheet_num()};
                    List<Map<String, Object>> date = jdbcTemplate.queryForList(sqlGetEmailLog, param4);
                    result3 = new ArrayList<>(date);

                    String dateString;
                    if (!result3.isEmpty()) {
                        Map<String, Object> firstRow = (Map<String, Object>) result3.get(0);
                        dateString = firstRow.get("EXF1_DATE").toString();
                    } else {
                        dateString = "";
                    }
                    //condition to check if the exf status is "Fixed" or not to send the email
                    if (Objects.equals(updataSts, "Fixed") && updatadate != null && !Objects.equals(updatadate, dateString) || Objects.equals(updataSts, "Partially Fixed") && updatadate != null && !Objects.equals(updatadate, dateString)) {

                        //sending the parameter values to set in the email
                        exFemailSender.getEmailData(preExfData, updExfData, accountInfo);
                        exFemailSender.getEmailInfo(accountInfo);

                        String result = exFemailSender.Emailsender(accountInfo, preExfData, updExfData, indentUpdateRequest.getIndent_sheet_num());

                        if (Objects.equals(result, "Success")) {

                            apiResponse.setMessage("II-EXF Updated successfully and Email is sent too.");

                            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                            insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                    indentUpdateRequest.getIndent_sheet_num(), "II-EXF Information Updated and Email is sent too",
                                    IndentManagement.class.getName());

                            if (!Objects.equals(delSts, indentUpdateRequest.getDel_sts())) {
                                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                        indentUpdateRequest.getIndent_sheet_num(), "DEL Status Updated from " + delSts + " to " + indentUpdateRequest.getDel_sts(),
                                        IndentManagement.class.getName());
                            }

                            String sql3 = updateQuery.getInsertEmailLog();
                            int affectedrows4 = jdbcTemplate.update(sql3, new Object[]{indentUpdateRequest.getIndent_sheet_num(), updatadate});

                            if (affectedrows4 == 1) {
                                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                        + IndentManagement.class.getName() + "\t" + "Email log inserted");
                            }

                        } else if (Objects.equals(result, "Success(with empty User Id)")) {

                            apiResponse.setMessage("II-EXF Updated successfully and Email is sent too (with empty User Id).");

                            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                            insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                    indentUpdateRequest.getIndent_sheet_num(), "II-EXF Information Updated and Email is sent too (with empty User Id)",
                                    IndentManagement.class.getName());

                            if (!Objects.equals(delSts, indentUpdateRequest.getDel_sts())) {
                                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                        indentUpdateRequest.getIndent_sheet_num(), "DEL Status Updated from " + delSts + " to " + indentUpdateRequest.getDel_sts(),
                                        IndentManagement.class.getName());
                            }

                            String sql3 = updateQuery.getInsertEmailLog();
                            int affectedrows4 = jdbcTemplate.update(sql3, new Object[]{indentUpdateRequest.getIndent_sheet_num(), updatadate});

                            if (affectedrows4 == 1) {
                                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                        + IndentManagement.class.getName() + "\t" + "Email log inserted");
                            }

                        } else {
                            apiResponse.setMessage("II-EXF Updated successfully.");

                            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                            insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                    indentUpdateRequest.getIndent_sheet_num(), "II-EXF Information Updated",
                                    IndentManagement.class.getName());

                            if (!Objects.equals(delSts, indentUpdateRequest.getDel_sts())) {
                                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                        indentUpdateRequest.getIndent_sheet_num(), "DEL Status Updated from " + delSts + " to " + indentUpdateRequest.getDel_sts(),
                                        IndentManagement.class.getName());
                            }
                        }
                    } else {
                        apiResponse.setMessage("II-EXF Updated successfully.");

                        Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                        insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                indentUpdateRequest.getIndent_sheet_num(), "II-EXF Information Updated",
                                IndentManagement.class.getName());

                        if (!Objects.equals(delSts, indentUpdateRequest.getDel_sts())) {
                            insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                    indentUpdateRequest.getIndent_sheet_num(), "DEL Status Updated from " + delSts + " to " + indentUpdateRequest.getDel_sts(),
                                    IndentManagement.class.getName());
                        }
                    }
                }
            } else {
                affectdRows = jdbcTemplate.update(sql,
                        new Object[]{indentUpdateRequest.getDel_sts(), indentUpdateRequest.getExf1_date(),
                                indentUpdateRequest.getExf1_sts(), indentUpdateRequest.getExf1_annc_date(),
                                indentUpdateRequest.getExf2_date(), indentUpdateRequest.getExf2_sts(),
                                indentUpdateRequest.getExf2_annc_date(), indentUpdateRequest.getExf3_date(),
                                indentUpdateRequest.getExf3_sts(), indentUpdateRequest.getExf3_annc_date(),
                                indentUpdateRequest.getIndent_sheet_num()});
                affectdRows2 = jdbcTemplate.update(sql2, new Object[]{indentUpdateRequest.getDel_sts(), indentUpdateRequest.getIndent_sheet_num()});

                if (affectdRows == 1 && affectdRows2 == 1) {
                    apiResponse.setAffectedRows(1);

                    apiResponse.setMessage("II-EXF Updated successfully.");
                    Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                            + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                    insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                            indentUpdateRequest.getIndent_sheet_num(), "II-EXF Information Updated",
                            IndentManagement.class.getName());

                    if (!Objects.equals(delSts, indentUpdateRequest.getDel_sts())) {
                        insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                indentUpdateRequest.getIndent_sheet_num(), "DEL Status Updated from " + delSts + " to " + indentUpdateRequest.getDel_sts(),
                                IndentManagement.class.getName());
                    }
                }
            }
        } catch (Exception e) {
            apiResponse.setMessage("Failed to update into database.");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage() + e);
            return apiResponse;
        }
        return apiResponse;
    }


    class GetPreExfMapper implements RowMapper<PreviousExfData> {

        public PreviousExfData mapRow(ResultSet rs, int rowNum) throws SQLException {
            PreviousExfData previousExfData = new PreviousExfData();

            previousExfData.setPreExfDate(rs.getString("exf1_date"));
            previousExfData.setPreExfSts(rs.getString("exf1_sts"));

            return previousExfData;
        }
    }

    class GetUpdatedExfMapper implements RowMapper<UpdatedExfData> {

        public UpdatedExfData mapRow(ResultSet rs, int rowNum) throws SQLException {
            UpdatedExfData updatedExfData = new UpdatedExfData();

            updatedExfData.setUpdExfDate(rs.getString("exf1_date"));
            updatedExfData.setUpdExfSts(rs.getString("exf1_sts"));

            return updatedExfData;
        }
    }

    class GetAccountMapper implements RowMapper<CustomerAccountInfo> {
        public CustomerAccountInfo mapRow(ResultSet rs, int rowNum) throws SQLException {
            CustomerAccountInfo accountInfo = new CustomerAccountInfo();

            accountInfo.setSosSum(rs.getString("sos_summary"));
            accountInfo.setIndent_sheet_num(rs.getString("indent_sheet_num"));
            accountInfo.setSales1(rs.getString("sales1_id"));
            accountInfo.setCustomerName(rs.getString("contract_acnt_name"));

            return accountInfo;
        }
    }


    @RequestMapping(method = RequestMethod.POST, path = GET_UPDATEBGDATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ApiResultResponse updateBGData(
            @ModelAttribute("IndentUpdateRequest") IndentUpdateRequest indentUpdateRequest, HttpServletRequest req,
            HttpServletResponse res) {
        ApiResultResponse apiResponse = new ApiResultResponse();

        if (indentUpdateRequest.getAbg_request_anct_date().equals("")
                || indentUpdateRequest.getAbg_request_anct_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getAbg_request_anct_date())) {
            indentUpdateRequest.setAbg_request_anct_date(null);
        }
        if (indentUpdateRequest.getAbg_issuance_date().equals("")
                || indentUpdateRequest.getAbg_issuance_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getAbg_issuance_date())) {
            indentUpdateRequest.setAbg_issuance_date(null);
        }
        if (indentUpdateRequest.getAbg_final_submission_draft_date().equals("")
                || indentUpdateRequest.getAbg_final_submission_draft_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getAbg_final_submission_draft_date())) {
            indentUpdateRequest.setAbg_final_submission_draft_date(null);
        }
        if (indentUpdateRequest.getAbg_final_submission_bg_date().equals("")
                || indentUpdateRequest.getAbg_final_submission_bg_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getAbg_final_submission_bg_date())) {
            indentUpdateRequest.setAbg_final_submission_bg_date(null);
        }
        if (indentUpdateRequest.getPbg_request_anct_date().equals("")
                || indentUpdateRequest.getPbg_request_anct_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getPbg_request_anct_date())) {
            indentUpdateRequest.setPbg_request_anct_date(null);
        }
        if (indentUpdateRequest.getPbg_issuance_date().equals("")
                || indentUpdateRequest.getPbg_issuance_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getPbg_issuance_date())) {
            indentUpdateRequest.setPbg_issuance_date(null);
        }
        if (indentUpdateRequest.getPbg_final_submission_draft_date().equals("")
                || indentUpdateRequest.getPbg_final_submission_draft_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getPbg_final_submission_draft_date())) {
            indentUpdateRequest.setPbg_final_submission_draft_date(null);
        }
        if (indentUpdateRequest.getPbg_final_submission_bg_date().equals("")
                || indentUpdateRequest.getPbg_final_submission_bg_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getPbg_final_submission_bg_date())) {
            indentUpdateRequest.setPbg_final_submission_bg_date(null);
        }

        if (indentUpdateRequest.getIndent_sheet_num().equals("")
                || indentUpdateRequest.getIndent_sheet_num().equals("null")) {
            indentUpdateRequest.setIndent_sheet_num(null);
        }

        try {
            String sql = updateQuery.getUpdateBGData();

            int affectdRows = jdbcTemplate.update(sql, new Object[]{indentUpdateRequest.getAbg_request_anct_date(),
                    indentUpdateRequest.getAbg_issuance_date(),
                    indentUpdateRequest.getAbg_final_submission_draft_date(),
                    indentUpdateRequest.getAbg_final_submission_bg_date(),
                    indentUpdateRequest.getPbg_request_anct_date(), indentUpdateRequest.getPbg_issuance_date(),
                    indentUpdateRequest.getPbg_final_submission_draft_date(),
                    indentUpdateRequest.getPbg_final_submission_bg_date(), indentUpdateRequest.getIndent_sheet_num()});

            if (affectdRows == 1) {
                apiResponse.setAffectedRows(1);
                apiResponse.setMessage("II-EXF Updated successfully.");
                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentUpdateRequest.getIndent_sheet_num(), "BG Information Updated",
                        IndentManagement.class.getName());
            }
        } catch (Exception e) {
            apiResponse.setMessage("Failed to update into database.");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage() + e);
            return apiResponse;
        }
        return apiResponse;
    }

//    @RequestMapping(method = RequestMethod.POST, path = GET_INSERTINVDATA, produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody ApiResultResponse insertINVData(
//            @ModelAttribute("IndentUpdateRequest") IndentUpdateRequest indentUpdateRequest, HttpServletRequest req,
//            HttpServletResponse res) {
//        ApiResultResponse apiResponse = new ApiResultResponse();
//
//        if (indentUpdateRequest.getInv_request_anct_date().equals("")
//                || indentUpdateRequest.getInv_request_anct_date().equals("null")
//                || StringUtils.isEmpty(indentUpdateRequest.getInv_request_anct_date())) {
//            indentUpdateRequest.setInv_request_anct_date(null);
//        }
//        if (indentUpdateRequest.getInv_issuance_date().equals("")
//                || indentUpdateRequest.getInv_issuance_date().equals("null")
//                || StringUtils.isEmpty(indentUpdateRequest.getInv_issuance_date())) {
//            indentUpdateRequest.setInv_issuance_date(null);
//        }
//        if (indentUpdateRequest.getInv_no().equals("") || indentUpdateRequest.getInv_no().equals("null")) {
//            indentUpdateRequest.setInv_no(null);
//        }
//        if (indentUpdateRequest.getEwb_no().equals("") || indentUpdateRequest.getEwb_no().equals("null")) {
//            indentUpdateRequest.setEwb_no(null);
//        }
//        if (indentUpdateRequest.getEwb_issuance_date().equals("")
//                || indentUpdateRequest.getEwb_issuance_date().equals("null")
//                || StringUtils.isEmpty(indentUpdateRequest.getEwb_issuance_date())) {
//            indentUpdateRequest.setEwb_issuance_date(null);
//        }
//        if (indentUpdateRequest.getTransportation_method().equals("")
//                || indentUpdateRequest.getTransportation_method().equals("null")) {
//            indentUpdateRequest.setTransportation_method(null);
//        }
//        if (indentUpdateRequest.getDispatch_date().equals("") || indentUpdateRequest.getDispatch_date().equals("null")
//                || StringUtils.isEmpty(indentUpdateRequest.getDispatch_date())) {
//            indentUpdateRequest.setDispatch_date(null);
//        }
//        if (indentUpdateRequest.getDispatch_from_indent().equals("")
//                || indentUpdateRequest.getDispatch_from_indent().equals("null")) {
//            indentUpdateRequest.setDispatch_from_indent(null);
//        }
//        if (indentUpdateRequest.getDispatch_from_origin().equals("")
//                || indentUpdateRequest.getDispatch_from_origin().equals("null")) {
//            indentUpdateRequest.setDispatch_from_origin(null);
//        }
//        if (indentUpdateRequest.getDispatch_to_indent().equals("")
//                || indentUpdateRequest.getDispatch_to_indent().equals("null")) {
//            indentUpdateRequest.setDispatch_to_indent(null);
//        }
//        if (indentUpdateRequest.getDispatch_to_destination().equals("")
//                || indentUpdateRequest.getDispatch_to_destination().equals("null")) {
//            indentUpdateRequest.setDispatch_to_destination(null);
//        }
//        if (indentUpdateRequest.getIndent_sheet_num().equals("")
//                || indentUpdateRequest.getIndent_sheet_num().equals("null")) {
//            indentUpdateRequest.setIndent_sheet_num(null);
//        }
//        if (indentUpdateRequest.getInvoice_id().equals("") || indentUpdateRequest.getInvoice_id().equals("null")) {
//            indentUpdateRequest.setInvoice_id(null);
//        }
//        if (indentUpdateRequest.getMachine_sn().equals("") || indentUpdateRequest.getMachine_sn().equals("null")) {
//            indentUpdateRequest.setMachine_sn(null);
//        }
//
//        try {
//            String sql = updateQuery.getInsertINVData();
//            int affectdRows = jdbcTemplate.update(sql,
//                    new Object[]{indentUpdateRequest.getInvoice_id(), indentUpdateRequest.getIndent_sheet_num(),
//                            indentUpdateRequest.getInv_request_anct_date(), indentUpdateRequest.getInv_issuance_date(),
//                            indentUpdateRequest.getInv_no(), indentUpdateRequest.getEwb_no(),
//                            indentUpdateRequest.getEwb_issuance_date(), indentUpdateRequest.getTransportation_method(),
//                            indentUpdateRequest.getDispatch_date(), indentUpdateRequest.getDispatch_from_indent(),
//                            indentUpdateRequest.getDispatch_from_origin(), indentUpdateRequest.getDispatch_to_indent(),
//                            indentUpdateRequest.getDispatch_to_destination(), indentUpdateRequest.getMachine_sn()});
//            if (affectdRows == 1) {
//                apiResponse.setAffectedRows(1);
//                apiResponse.setMessage("INV/eWB Inserted successfully.");
//                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//                        + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
//                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
//                        indentUpdateRequest.getIndent_sheet_num(), "INV/eWB Information Updated",
//                        IndentManagement.class.getName());
//            }
//        } catch (DuplicateKeyException ex) {
//            apiResponse.setAffectedRows(0);
//            apiResponse.setMessage("Invoice Number Already Exist In Current Indent.");
//            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
//            return apiResponse;
//        } catch (Exception e) {
//            apiResponse.setMessage("'Failed to update into database. Please Try Again'");
//            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
//            return apiResponse;
//        }
//        return apiResponse;
//    }

    @RequestMapping(method = RequestMethod.POST, path = GET_INSERTINVDATA, consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ApiResultResponse insertINVData(
            @ModelAttribute("IndentUpdateRequest") IndentUpdateRequest indentUpdateRequest, HttpServletRequest req,
            HttpServletResponse res) throws IOException {
        ApiResultResponse apiResponse = new ApiResultResponse();

        if (indentUpdateRequest.getInv_request_anct_date().equals("")
                || indentUpdateRequest.getInv_request_anct_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getInv_request_anct_date())) {
            indentUpdateRequest.setInv_request_anct_date(null);
        }
        if (indentUpdateRequest.getInv_issuance_date().equals("")
                || indentUpdateRequest.getInv_issuance_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getInv_issuance_date())) {
            indentUpdateRequest.setInv_issuance_date(null);
        }
        if (indentUpdateRequest.getInv_no().equals("") || indentUpdateRequest.getInv_no().equals("null")) {
            indentUpdateRequest.setInv_no(null);
        }
        if (indentUpdateRequest.getEwb_no().equals("") || indentUpdateRequest.getEwb_no().equals("null")) {
            indentUpdateRequest.setEwb_no(null);
        }
        if (indentUpdateRequest.getEwb_issuance_date().equals("")
                || indentUpdateRequest.getEwb_issuance_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getEwb_issuance_date())) {
            indentUpdateRequest.setEwb_issuance_date(null);
        }
        if (indentUpdateRequest.getTransportation_method().equals("")
                || indentUpdateRequest.getTransportation_method().equals("null")) {
            indentUpdateRequest.setTransportation_method(null);
        }
        if (indentUpdateRequest.getDispatch_date().equals("") || indentUpdateRequest.getDispatch_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getDispatch_date())) {
            indentUpdateRequest.setDispatch_date(null);
        }
        if (indentUpdateRequest.getDispatch_from_indent().equals("")
                || indentUpdateRequest.getDispatch_from_indent().equals("null")) {
            indentUpdateRequest.setDispatch_from_indent(null);
        }
        if (indentUpdateRequest.getDispatch_from_origin().equals("")
                || indentUpdateRequest.getDispatch_from_origin().equals("null")) {
            indentUpdateRequest.setDispatch_from_origin(null);
        }
        if (indentUpdateRequest.getDispatch_to_indent().equals("")
                || indentUpdateRequest.getDispatch_to_indent().equals("null")) {
            indentUpdateRequest.setDispatch_to_indent(null);
        }
        if (indentUpdateRequest.getDispatch_to_destination().equals("")
                || indentUpdateRequest.getDispatch_to_destination().equals("null")) {
            indentUpdateRequest.setDispatch_to_destination(null);
        }
        if (indentUpdateRequest.getIndent_sheet_num().equals("")
                || indentUpdateRequest.getIndent_sheet_num().equals("null")) {
            indentUpdateRequest.setIndent_sheet_num(null);
        }
        if (indentUpdateRequest.getInvoice_id().equals("") || indentUpdateRequest.getInvoice_id().equals("null")) {
            indentUpdateRequest.setInvoice_id(null);
        }
        if (indentUpdateRequest.getMachine_sn().equals("") || indentUpdateRequest.getMachine_sn().equals("null")) {
            indentUpdateRequest.setMachine_sn(null);
        }

        try {
            String sql2 = updateQuery.getGetINVNo();

            List<Object> result = new ArrayList<>();
            Object[] param = new Object[]{indentUpdateRequest.getIndent_sheet_num(), indentUpdateRequest.getInv_no()};
            List<Map<String, Object>> row = jdbcTemplate.queryForList(sql2, param);
            result = new ArrayList<>(row);

            if (!result.isEmpty()) {

                apiResponse.setAffectedRows(0);
                apiResponse.setMessage("Invoice Number Already Exist In Current Indent.");
                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                return apiResponse;

            } else {
                String uuid = UUID.randomUUID().toString();
                byte[] invoiceBytes = null;
                String invoiceFileName = null;
                byte[] ewbBytes = null;
                String ewbFileName = null;

                // For Invoice Doc
                if (indentUpdateRequest.getInvoice_doc() != null
                        && !indentUpdateRequest.getInvoice_doc().isEmpty()
                        && indentUpdateRequest.getInv_doc_name() != null
                        && !indentUpdateRequest.getInv_doc_name().isEmpty()) {

                    invoiceBytes = indentUpdateRequest.getInvoice_doc().getBytes();
                    invoiceFileName = indentUpdateRequest.getInv_doc_name();
                }

                // For EWB Doc
                if (indentUpdateRequest.getEwb_doc() != null
                        && !indentUpdateRequest.getEwb_doc().isEmpty()
                        && indentUpdateRequest.getEwb_doc_name() != null
                        && !indentUpdateRequest.getEwb_doc_name().isEmpty()) {

                    ewbBytes = indentUpdateRequest.getEwb_doc().getBytes();
                    ewbFileName = indentUpdateRequest.getEwb_doc_name();
                }


                String sql = updateQuery.getInsertINVData();
                int affectdRows = jdbcTemplate.update(sql,
                        new Object[]{uuid, indentUpdateRequest.getInvoice_id(), indentUpdateRequest.getIndent_sheet_num(),
                                indentUpdateRequest.getInv_request_anct_date(), indentUpdateRequest.getInv_issuance_date(),
                                indentUpdateRequest.getInv_no(), indentUpdateRequest.getEwb_no(),
                                indentUpdateRequest.getEwb_issuance_date(), indentUpdateRequest.getTransportation_method(),
                                indentUpdateRequest.getDispatch_date(), indentUpdateRequest.getDispatch_from_indent(),
                                indentUpdateRequest.getDispatch_from_origin(), indentUpdateRequest.getDispatch_to_indent(),
                                indentUpdateRequest.getDispatch_to_destination(), indentUpdateRequest.getMachine_sn(), invoiceBytes, invoiceFileName, ewbBytes, ewbFileName, user.getJwt_userName()});

                if (affectdRows == 1) {
                    apiResponse.setAffectedRows(1);
                    apiResponse.setMessage("INV/eWB Inserted successfully.");
                    Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                            + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());

//                    String sqlEmailFlag = dbGetQuery.getGetEmailFlag2();
//                    String eFlag = jdbcTemplate.queryForObject(sqlEmailFlag, String.class);
//
//                    if (Objects.equals(eFlag, "1")) {
//                        Object[] params = new Object[]{indentUpdateRequest.getIndent_sheet_num()};
//                        String sqlCustName = dbGetQuery.getGetCustomerInfo();
//
//                        Map<String, Object> result2 = jdbcTemplate.queryForMap(sqlCustName, params);
//                        String customerName = (String) result2.get("contract_acnt_name");
//                        String delSts = (String) result2.get("del_sts");
//                        String pmtSts = (String) result2.get("pmt_sts");
//
////                        String result1 = inVeWBemailSender.triggerINVeWBEmail(customerName, indentUpdateRequest.getIndent_sheet_num(), indentUpdateRequest.getInv_issuance_date(),
////                                indentUpdateRequest.getInv_no(), invoiceBytes, invoiceFileName, indentUpdateRequest.getDispatch_date(),
////                                indentUpdateRequest.getEwb_issuance_date(), indentUpdateRequest.getEwb_no(), ewbBytes, ewbFileName, user.getJwt_userName(), delSts, pmtSts);
//
//                        if (result1 == "Success") {
//
//                            apiResponse.setMessage("INV/eWB Inserted successfully and Email is sent too.");
//
//                            insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
//                                    indentUpdateRequest.getIndent_sheet_num(), "INV/eWB Information Updated and Email is sent to Respective Employees.",
//                                    IndentManagement.class.getName());
//
//                            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//                                    + IndentManagement.class.getName() + "\t" + "INV/eWB Email sent.");
//                        } else {
//                            apiResponse.setMessage("INV/eWB Inserted successfully but failed to send Email.");
//
//                            insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
//                                    indentUpdateRequest.getIndent_sheet_num(), "INV/eWB Information Updated but failed to send Email.",
//                                    IndentManagement.class.getName());
//
//
//                            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//                                    + IndentManagement.class.getName() + "\t" + "Failed to send INV/eWB Email.");
//                        }
//                    }
//                    else {
                    insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                            indentUpdateRequest.getIndent_sheet_num(), "INV/eWB Information Updated",
                            IndentManagement.class.getName());
//                    }
                }
            }
        } catch (DuplicateKeyException ex) {
            apiResponse.setAffectedRows(0);
            apiResponse.setMessage("Invoice Number Already Exist In Current Indent.");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage() + ex);
            return apiResponse;
        } catch (Exception e) {
            apiResponse.setMessage("Failed to update into database. Please Try Again");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage() + e);
            return apiResponse;
        }
        return apiResponse;
    }

//    @RequestMapping(method = RequestMethod.POST, path = GET_UPDATEINVDATA, produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody ApiResultResponse updateINVData(
//            @ModelAttribute("IndentUpdateRequest") IndentUpdateRequest indentUpdateRequest, HttpServletRequest req,
//            HttpServletResponse res) {
//
//        ApiResultResponse apiResponse = new ApiResultResponse();
//
//        if (indentUpdateRequest.getInv_request_anct_date().equals("")
//                || indentUpdateRequest.getInv_request_anct_date().equals("null")
//                || StringUtils.isEmpty(indentUpdateRequest.getInv_request_anct_date())) {
//            indentUpdateRequest.setInv_request_anct_date(null);
//        }
//        if (indentUpdateRequest.getInv_issuance_date().equals("")
//                || indentUpdateRequest.getInv_issuance_date().equals("null")
//                || StringUtils.isEmpty(indentUpdateRequest.getInv_issuance_date())) {
//            indentUpdateRequest.setInv_issuance_date(null);
//        }
//        if (indentUpdateRequest.getInv_no().equals("") || indentUpdateRequest.getInv_no().equals("null")) {
//            indentUpdateRequest.setInv_no(null);
//        }
//        if (indentUpdateRequest.getEwb_no().equals("") || indentUpdateRequest.getEwb_no().equals("null")) {
//            indentUpdateRequest.setEwb_no(null);
//        }
//        if (indentUpdateRequest.getEwb_issuance_date().equals("")
//                || indentUpdateRequest.getEwb_issuance_date().equals("null")
//                || StringUtils.isEmpty(indentUpdateRequest.getEwb_issuance_date())) {
//            indentUpdateRequest.setEwb_issuance_date(null);
//        }
//        if (indentUpdateRequest.getTransportation_method().equals("")
//                || indentUpdateRequest.getTransportation_method().equals("null")) {
//            indentUpdateRequest.setTransportation_method(null);
//        }
//        if (indentUpdateRequest.getDispatch_date().equals("") || indentUpdateRequest.getDispatch_date().equals("null")
//                || StringUtils.isEmpty(indentUpdateRequest.getDispatch_date())) {
//            indentUpdateRequest.setDispatch_date(null);
//        }
//        if (indentUpdateRequest.getDispatch_from_indent().equals("")
//                || indentUpdateRequest.getDispatch_from_indent().equals("null")) {
//            indentUpdateRequest.setDispatch_from_indent(null);
//        }
//        if (indentUpdateRequest.getDispatch_from_origin().equals("")
//                || indentUpdateRequest.getDispatch_from_origin().equals("null")) {
//            indentUpdateRequest.setDispatch_from_origin(null);
//        }
//        if (indentUpdateRequest.getDispatch_to_indent().equals("")
//                || indentUpdateRequest.getDispatch_to_indent().equals("null")) {
//            indentUpdateRequest.setDispatch_to_indent(null);
//        }
//        if (indentUpdateRequest.getDispatch_to_destination().equals("")
//                || indentUpdateRequest.getDispatch_to_destination().equals("null")) {
//            indentUpdateRequest.setDispatch_to_destination(null);
//        }
//        if (indentUpdateRequest.getIndent_sheet_num().equals("")
//                || indentUpdateRequest.getIndent_sheet_num().equals("null")) {
//            indentUpdateRequest.setIndent_sheet_num(null);
//        }
//        if (indentUpdateRequest.getInvoice_id().equals("") || indentUpdateRequest.getInvoice_id().equals("null")) {
//            indentUpdateRequest.setInvoice_id(null);
//        }
//        if (indentUpdateRequest.getMachine_sn().equals("") || indentUpdateRequest.getMachine_sn().equals("null")) {
//            indentUpdateRequest.setMachine_sn(null);
//        }
//
//        try {
//            String sql = updateQuery.getUpdateINVData();
//            int affectdRows = jdbcTemplate.update(sql,
//                    new Object[]{indentUpdateRequest.getInv_request_anct_date(),
//                            indentUpdateRequest.getInv_issuance_date(), indentUpdateRequest.getInv_no(),
//                            indentUpdateRequest.getEwb_no(), indentUpdateRequest.getEwb_issuance_date(),
//                            indentUpdateRequest.getTransportation_method(), indentUpdateRequest.getDispatch_date(),
//                            indentUpdateRequest.getDispatch_from_indent(),
//                            indentUpdateRequest.getDispatch_from_origin(), indentUpdateRequest.getDispatch_to_indent(),
//                            indentUpdateRequest.getDispatch_to_destination(), indentUpdateRequest.getMachine_sn(),
//                            indentUpdateRequest.getIndent_sheet_num(), indentUpdateRequest.getInvoice_id()});
//
//            if (affectdRows == 1) {
//                apiResponse.setAffectedRows(1);
//                apiResponse.setMessage("INV/eWB Updated successfully.");
//                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//                        + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
//                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
//                        indentUpdateRequest.getIndent_sheet_num(), "INV/eWB Information Updated",
//                        IndentManagement.class.getName());
//            }
//        } catch (DuplicateKeyException ex) {
//            apiResponse.setAffectedRows(0);
//            apiResponse.setMessage("Invoice Number Already Existing.");
//            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
//            return apiResponse;
//        } catch (Exception e) {
//            apiResponse.setMessage("'Failed to update into database. Please Try Again'");
//            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
//            return apiResponse;
//        }
//        return apiResponse;
//    }

    @RequestMapping(method = RequestMethod.POST, path = GET_UPDATEINVDATA, consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ApiResultResponse updateINVData(
            @ModelAttribute("IndentUpdateRequest") IndentUpdateRequest indentUpdateRequest, HttpServletRequest req,
            HttpServletResponse res) throws IOException {

        ApiResultResponse apiResponse = new ApiResultResponse();

        if (indentUpdateRequest.getInv_request_anct_date().equals("")
                || indentUpdateRequest.getInv_request_anct_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getInv_request_anct_date())) {
            indentUpdateRequest.setInv_request_anct_date(null);
        }
        if (indentUpdateRequest.getInv_issuance_date().equals("")
                || indentUpdateRequest.getInv_issuance_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getInv_issuance_date())) {
            indentUpdateRequest.setInv_issuance_date(null);
        }
        if (indentUpdateRequest.getInv_no().equals("") || indentUpdateRequest.getInv_no().equals("null")) {
            indentUpdateRequest.setInv_no(null);
        }
        if (indentUpdateRequest.getEwb_no().equals("") || indentUpdateRequest.getEwb_no().equals("null")) {
            indentUpdateRequest.setEwb_no(null);
        }
        if (indentUpdateRequest.getEwb_issuance_date().equals("")
                || indentUpdateRequest.getEwb_issuance_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getEwb_issuance_date())) {
            indentUpdateRequest.setEwb_issuance_date(null);
        }
        if (indentUpdateRequest.getTransportation_method().equals("")
                || indentUpdateRequest.getTransportation_method().equals("null")) {
            indentUpdateRequest.setTransportation_method(null);
        }
        if (indentUpdateRequest.getDispatch_date().equals("") || indentUpdateRequest.getDispatch_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getDispatch_date())) {
            indentUpdateRequest.setDispatch_date(null);
        }
        if (indentUpdateRequest.getDispatch_from_indent().equals("")
                || indentUpdateRequest.getDispatch_from_indent().equals("null")) {
            indentUpdateRequest.setDispatch_from_indent(null);
        }
        if (indentUpdateRequest.getDispatch_from_origin().equals("")
                || indentUpdateRequest.getDispatch_from_origin().equals("null")) {
            indentUpdateRequest.setDispatch_from_origin(null);
        }
        if (indentUpdateRequest.getDispatch_to_indent().equals("")
                || indentUpdateRequest.getDispatch_to_indent().equals("null")) {
            indentUpdateRequest.setDispatch_to_indent(null);
        }
        if (indentUpdateRequest.getDispatch_to_destination().equals("")
                || indentUpdateRequest.getDispatch_to_destination().equals("null")) {
            indentUpdateRequest.setDispatch_to_destination(null);
        }
        if (indentUpdateRequest.getIndent_sheet_num().equals("")
                || indentUpdateRequest.getIndent_sheet_num().equals("null")) {
            indentUpdateRequest.setIndent_sheet_num(null);
        }
        if (indentUpdateRequest.getInvoice_id().equals("") || indentUpdateRequest.getInvoice_id().equals("null")) {
            indentUpdateRequest.setInvoice_id(null);
        }
        if (indentUpdateRequest.getMachine_sn().equals("") || indentUpdateRequest.getMachine_sn().equals("null")) {
            indentUpdateRequest.setMachine_sn(null);
        }

        try {
            String sql2 = updateQuery.getGetIndentINVNo();

            Object[] param = new Object[]{indentUpdateRequest.getIndent_sheet_num(), indentUpdateRequest.getInvoice_id()};
            List<Map<String, Object>> row = jdbcTemplate.queryForList(sql2, param);
            String newInvNo = indentUpdateRequest.getInv_no();

            boolean exists = false;
            for (Map<String, Object> map : row) {
                String existingInvNo = String.valueOf(map.get("inv_no"));
                if (newInvNo.equalsIgnoreCase(existingInvNo)) {
                    exists = true;
                    break;
                }
            }
            if (exists) {

                apiResponse.setAffectedRows(0);
                apiResponse.setMessage("Invoice Number Already Existing.");
                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                return apiResponse;

            } else {

                byte[] invoiceBytes = null;
                String invoiceFileName = null;
                byte[] ewbBytes = null;
                String ewbFileName = null;

                // For Invoice Doc
                if (indentUpdateRequest.getInvoice_doc() != null
                        && !indentUpdateRequest.getInvoice_doc().isEmpty()
                        && indentUpdateRequest.getInv_doc_name() != null
                        && !indentUpdateRequest.getInv_doc_name().isEmpty()) {

                    invoiceBytes = indentUpdateRequest.getInvoice_doc().getBytes();
                    invoiceFileName = indentUpdateRequest.getInv_doc_name();
                }

                // For EWB Doc
                if (indentUpdateRequest.getEwb_doc() != null
                        && !indentUpdateRequest.getEwb_doc().isEmpty()
                        && indentUpdateRequest.getEwb_doc_name() != null
                        && !indentUpdateRequest.getEwb_doc_name().isEmpty()) {

                    ewbBytes = indentUpdateRequest.getEwb_doc().getBytes();
                    ewbFileName = indentUpdateRequest.getEwb_doc_name();
                }

                String sql = updateQuery.getUpdateINVData();
                int affectdRows = jdbcTemplate.update(sql,
                        new Object[]{indentUpdateRequest.getInv_request_anct_date(),
                                indentUpdateRequest.getInv_issuance_date(), indentUpdateRequest.getInv_no(),
                                indentUpdateRequest.getEwb_no(), indentUpdateRequest.getEwb_issuance_date(),
                                indentUpdateRequest.getTransportation_method(), indentUpdateRequest.getDispatch_date(),
                                indentUpdateRequest.getDispatch_from_indent(),
                                indentUpdateRequest.getDispatch_from_origin(), indentUpdateRequest.getDispatch_to_indent(),
                                indentUpdateRequest.getDispatch_to_destination(), indentUpdateRequest.getMachine_sn(), invoiceBytes, invoiceFileName, ewbBytes, ewbFileName, user.getJwt_userName(),
                                indentUpdateRequest.getInvoice_id()});

                if (affectdRows == 1) {
                    apiResponse.setAffectedRows(1);
                    apiResponse.setMessage("INV/eWB Updated successfully.");
                    Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                            + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());

//                    String sqlEmailFlag = dbGetQuery.getGetEmailFlag2();
//                    String eFlag = jdbcTemplate.queryForObject(sqlEmailFlag, String.class);
//
//                    if (Objects.equals(eFlag, "1")) {
//                        Object[] params = new Object[]{indentUpdateRequest.getIndent_sheet_num()};
//                        String sqlCustName = dbGetQuery.getGetCustomerInfo();
//
//                        Map<String, Object> result2 = jdbcTemplate.queryForMap(sqlCustName, params);
//                        String customerName = (String) result2.get("contract_acnt_name");
//                        String delSts = (String) result2.get("del_sts");
//                        String pmtSts = (String) result2.get("pmt_sts");
//
////                        String result1 = inVeWBemailSender.triggerINVeWBEmail(customerName, indentUpdateRequest.getIndent_sheet_num(), indentUpdateRequest.getInv_issuance_date(),
////                                indentUpdateRequest.getInv_no(), invoiceBytes, invoiceFileName, indentUpdateRequest.getDispatch_date(),
////                                indentUpdateRequest.getEwb_issuance_date(), indentUpdateRequest.getEwb_no(), ewbBytes, ewbFileName, user.getJwt_userName(), delSts, pmtSts);
//
//                        if (result1 == "Success") {
//
//                            apiResponse.setMessage("INV/eWB Updated successfully and Email is sent too.");
//
//                            insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
//                                    indentUpdateRequest.getIndent_sheet_num(), "INV/eWB Information Updated and Email is sent to Respective Employees.",
//                                    IndentManagement.class.getName());
//
//                            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//                                    + IndentManagement.class.getName() + "\t" + "INV/eWB Email sent.");
//
//                        } else {
//
//                            apiResponse.setMessage("INV/eWB Updated successfully but failed to send Email.");
//
//                            insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
//                                    indentUpdateRequest.getIndent_sheet_num(), "INV/eWB Information Updated but failed to send Email.",
//                                    IndentManagement.class.getName());
//
//
//                            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//                                    + IndentManagement.class.getName() + "\t" + "Failed to send INV/eWB Email.");
//                        }
//                    }
//                    else {
                    insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                            indentUpdateRequest.getIndent_sheet_num(), "INV/eWB Information Updated",
                            IndentManagement.class.getName());
//                    }
                }
            }
        } catch (DuplicateKeyException ex) {
            apiResponse.setAffectedRows(0);
            apiResponse.setMessage("Invoice Number Already Existing.");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage() + ex);
            return apiResponse;
        } catch (Exception e) {
            apiResponse.setMessage("Failed to update into database. Please Try Again");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage() + e);
            return apiResponse;
        }
        return apiResponse;
    }


    @RequestMapping(method = RequestMethod.POST, path = GET_DELETEOTHERFILE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ApiResultResponse deleteOtherFile(
            @RequestParam("indent_doc_id") String indent_doc_id, @RequestParam("indent_sheet_num") String indent_sheet_num, HttpServletRequest req,
            HttpServletResponse res) {

        ApiResultResponse apiResponse = new ApiResultResponse();

        try {
            String sql = updateQuery.getDeleteOtherFile();
            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{indent_doc_id});

            if (affectdRows == 1) {
                apiResponse.setAffectedRows(1);
                apiResponse.setMessage("Doc File Deleted successfully.");
                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indent_sheet_num, "Doc File Information got Deleted",
                        IndentManagement.class.getName());
            }
        } catch (Exception e) {
            apiResponse.setMessage("Failed to Deleted from database.");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage() + e);
            return apiResponse;
        }
        return apiResponse;
    }

    @RequestMapping(method = RequestMethod.POST, path = GET_DELETEIAMGEFILE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ApiResultResponse deleteImageFile(
            @RequestParam("indent_img_id") String indent_img_id, @RequestParam("indent_sheet_num") String indent_sheet_num, HttpServletRequest req,
            HttpServletResponse res) {

        ApiResultResponse apiResponse = new ApiResultResponse();

        try {
            String sql = updateQuery.getDeleteImageFile();
            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{indent_img_id});

            if (affectdRows == 1) {
                apiResponse.setAffectedRows(1);
                apiResponse.setMessage("Other File Deleted successfully.");
                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indent_sheet_num, "Other File Information got Deleted",
                        IndentManagement.class.getName());
            }
        } catch (Exception e) {
            apiResponse.setMessage("Failed to Deleted from database.");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage() + e);
            return apiResponse;
        }
        return apiResponse;
    }

    @RequestMapping(method = RequestMethod.POST, path = GET_DELETEINVDATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ApiResultResponse deleteINVData(
            @ModelAttribute("IndentUpdateRequest") IndentUpdateRequest indentUpdateRequest, HttpServletRequest req,
            HttpServletResponse res) {

        ApiResultResponse apiResponse = new ApiResultResponse();

        if (indentUpdateRequest.getIndent_sheet_num().equals("")
                || indentUpdateRequest.getIndent_sheet_num().equals("null")) {
            indentUpdateRequest.setIndent_sheet_num(null);
        }
        if (indentUpdateRequest.getInvoice_id().equals("") || indentUpdateRequest.getInvoice_id().equals("null")) {
            indentUpdateRequest.setInvoice_id(null);
        }

        try {
            String sql = updateQuery.getDeleteInvoiceData();
            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{indentUpdateRequest.getIndent_sheet_num(), indentUpdateRequest.getInvoice_id()});

            if (affectdRows == 1) {
                apiResponse.setAffectedRows(1);
                apiResponse.setMessage("INV/eWB Deleted Successfully.");
                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());
                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentUpdateRequest.getIndent_sheet_num(), "INV/eWB Information Deleted",
                        IndentManagement.class.getName());
            }
        } catch (Exception e) {
            apiResponse.setMessage("Failed to Deleted from database.");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + apiResponse.getMessage() + e);
            return apiResponse;
        }
        return apiResponse;
    }


    @RequestMapping(method = RequestMethod.POST, value = GET_UPDATELCDATA, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody IndentUpdateResponse getUpdateLCData(IndentUpdateRequest indentupdateres,
                                                              HttpServletRequest req, HttpServletResponse res) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();
        getCurrentTimeUsingDate();

        if (indentupdateres.getLc_chk_date_by_ij().equals("null")
                || StringUtils.isEmpty(indentupdateres.getLc_chk_date_by_ij())) {
            indentupdateres.setLc_chk_date_by_ij(null);
        }

        if (indentupdateres.getLc_open_date().equals("null")
                || StringUtils.isEmpty(indentupdateres.getLc_open_date())) {
            indentupdateres.setLc_open_date(null);
        }

        if (indentupdateres.getLc_last_revision_date().equals("null")
                || StringUtils.isEmpty(indentupdateres.getLc_last_revision_date())) {
            indentupdateres.setLc_last_revision_date(null);
        }

        if (indentupdateres.getLatest_shipment_date().equals("null")
                || StringUtils.isEmpty(indentupdateres.getLatest_shipment_date())) {
            indentupdateres.setLatest_shipment_date(null);
        }

        if (indentupdateres.getLc_expiry_date().equals("null")
                || StringUtils.isEmpty(indentupdateres.getLc_expiry_date())) {
            indentupdateres.setLc_expiry_date(null);
        }

        String sql = updateQuery.getUpdateLCData();
        try {
            if (jdbcTemplate.update(sql,
                    new Object[]{indentupdateres.getLc_chk_date_by_ij(), indentupdateres.getLc_open_date(),
                            indentupdateres.getLc_last_revision_date(), indentupdateres.getLatest_shipment_date(),
                            indentupdateres.getLc_expiry_date(), indentupdateres.getIndent_sheet_num()}) == 1) {
                indentupdateresp.setAffectedRows(1);

                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentupdateres.getIndent_sheet_num(), "LC Information Updated",
                        IndentManagement.class.getName());
            } else {

            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getUpdateLCDataLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + e);
        }

        return indentupdateresp;

    }

    @RequestMapping(method = RequestMethod.POST, value = GET_UPDATECOMDATA, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody IndentUpdateResponse getUpdateCOMData(IndentUpdateRequest indentupdateres,
                                                               HttpServletRequest req, HttpServletResponse res) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();
        getCurrentTimeUsingDate();

        if (indentupdateres.getCom_month().equals("null") || StringUtils.isEmpty(indentupdateres.getCom_month())) {
            indentupdateres.setCom_month(null);
        }

        String sql = updateQuery.getUpdateCOMData();
        try {
            if (jdbcTemplate.update(sql,
                    new Object[]{indentupdateres.getCom_month(), indentupdateres.getIndent_sheet_num()}) == 1) {
                indentupdateresp.setAffectedRows(1);
                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentupdateres.getIndent_sheet_num(), "COM Information Updated",
                        IndentManagement.class.getName());
            } else {

            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getUpdateCOMDataLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + e);
        }

        return indentupdateresp;

    }

    @RequestMapping(method = RequestMethod.POST, value = GET_UPDATESHPINVDATA, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody IndentUpdateResponse getUpdateSHPINVData(IndentUpdateRequest indentupdateres,
                                                                  HttpServletRequest req, HttpServletResponse res) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();
        getCurrentTimeUsingDate();

        if (indentupdateres.getInvoice_no1().equals("null") || StringUtils.isEmpty(indentupdateres.getInvoice_no1())) {
            indentupdateres.setInvoice_no1(null);
        }

        if (indentupdateres.getInvoice_date1().equals("null")
                || StringUtils.isEmpty(indentupdateres.getInvoice_date1())) {
            indentupdateres.setInvoice_date1(null);
        }

        if (indentupdateres.getMode1().equals("null") || StringUtils.isEmpty(indentupdateres.getMode1())) {
            indentupdateres.setMode1(null);
        }

        if (indentupdateres.getFrom1().equals("null") || StringUtils.isEmpty(indentupdateres.getFrom1())) {
            indentupdateres.setFrom1(null);
        }

        if (indentupdateres.getVessel1().equals("null") || StringUtils.isEmpty(indentupdateres.getVessel1())) {
            indentupdateres.setVessel1(null);
        }

        if (indentupdateres.getAwb_bl_no1().equals("null") || StringUtils.isEmpty(indentupdateres.getAwb_bl_no1())) {
            indentupdateres.setAwb_bl_no1(null);
        }

        if (indentupdateres.getEtd1().equals("null") || StringUtils.isEmpty(indentupdateres.getEtd1())) {
            indentupdateres.setEtd1(null);
        }

        if (indentupdateres.getEta1().equals("null") || StringUtils.isEmpty(indentupdateres.getEta1())) {
            indentupdateres.setEta1(null);
        }

        if (indentupdateres.getInvoice_no2().equals("null") || StringUtils.isEmpty(indentupdateres.getInvoice_no2())) {
            indentupdateres.setInvoice_no2(null);
        }

        if (indentupdateres.getInvoice_date2().equals("null")
                || StringUtils.isEmpty(indentupdateres.getInvoice_date2())) {
            indentupdateres.setInvoice_date2(null);
        }

        if (indentupdateres.getMode2().equals("null") || StringUtils.isEmpty(indentupdateres.getMode2())) {
            indentupdateres.setMode2(null);
        }

        if (indentupdateres.getFrom2().equals("null") || StringUtils.isEmpty(indentupdateres.getFrom2())) {
            indentupdateres.setFrom2(null);
        }

        if (indentupdateres.getVessel2().equals("null") || StringUtils.isEmpty(indentupdateres.getVessel2())) {
            indentupdateres.setVessel2(null);
        }

        if (indentupdateres.getAwb_bl_no2().equals("null") || StringUtils.isEmpty(indentupdateres.getAwb_bl_no2())) {
            indentupdateres.setAwb_bl_no2(null);
        }

        if (indentupdateres.getEtd2().equals("null") || StringUtils.isEmpty(indentupdateres.getEtd2())) {
            indentupdateres.setEtd2(null);
        }

        if (indentupdateres.getEta2().equals("null") || StringUtils.isEmpty(indentupdateres.getEta2())) {
            indentupdateres.setEta2(null);
        }

        if (indentupdateres.getInvoice_no3().equals("null") || StringUtils.isEmpty(indentupdateres.getInvoice_no3())) {
            indentupdateres.setInvoice_no3(null);
        }

        if (indentupdateres.getInvoice_date3().equals("null")
                || StringUtils.isEmpty(indentupdateres.getInvoice_date3())) {
            indentupdateres.setInvoice_date3(null);
        }

        if (indentupdateres.getMode3().equals("null") || StringUtils.isEmpty(indentupdateres.getMode3())) {
            indentupdateres.setMode3(null);
        }

        if (indentupdateres.getFrom3().equals("null") || StringUtils.isEmpty(indentupdateres.getFrom3())) {
            indentupdateres.setFrom3(null);
        }

        if (indentupdateres.getVessel3().equals("null") || StringUtils.isEmpty(indentupdateres.getVessel3())) {
            indentupdateres.setVessel3(null);
        }

        if (indentupdateres.getAwb_bl_no3().equals("null") || StringUtils.isEmpty(indentupdateres.getAwb_bl_no3())) {
            indentupdateres.setAwb_bl_no3(null);
        }

        if (indentupdateres.getEtd3().equals("null") || StringUtils.isEmpty(indentupdateres.getEtd3())) {
            indentupdateres.setEtd3(null);
        }

        if (indentupdateres.getEta3().equals("null") || StringUtils.isEmpty(indentupdateres.getEta3())) {
            indentupdateres.setEta3(null);
        }

        if (indentupdateres.getDel_sts().equals("null") || StringUtils.isEmpty(indentupdateres.getDel_sts())) {
            indentupdateres.setDel_sts(null);
        }

        String sql = updateQuery.getUpdateSHPorINVData();
        try {

            String sql1 = updateQuery.getIndentDelStS();
            Object[] params = new Object[]{indentupdateres.getIndent_sheet_num()};
            Map<String, Object> result = jdbcTemplate.queryForMap(sql1, params);
            String delSts = (String) result.get("del_sts");

            if (jdbcTemplate.update(sql,
                    new Object[]{indentupdateres.getInvoice_no1(), indentupdateres.getInvoice_date1(),
                            indentupdateres.getMode1(), indentupdateres.getFrom1(), indentupdateres.getVessel1(),
                            indentupdateres.getAwb_bl_no1(), indentupdateres.getEtd1(), indentupdateres.getEta1(),

                            indentupdateres.getInvoice_no2(), indentupdateres.getInvoice_date2(),
                            indentupdateres.getMode2(), indentupdateres.getFrom2(), indentupdateres.getVessel2(),
                            indentupdateres.getAwb_bl_no2(), indentupdateres.getEtd2(), indentupdateres.getEta2(),

                            indentupdateres.getInvoice_no3(), indentupdateres.getInvoice_date3(),
                            indentupdateres.getMode3(), indentupdateres.getFrom3(), indentupdateres.getVessel3(),
                            indentupdateres.getAwb_bl_no3(), indentupdateres.getEtd3(), indentupdateres.getEta3(),

                            indentupdateres.getDel_sts(), indentupdateres.getIndent_sheet_num()}) == 1) {

                indentupdateresp.setAffectedRows(1);
                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentupdateres.getIndent_sheet_num(), "VD-SHP Information Updated",
                        IndentManagement.class.getName());

                if (!Objects.equals(delSts, indentupdateres.getDel_sts())) {
                    insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                            indentupdateres.getIndent_sheet_num(), "DEL Status Updated from " + delSts + " to " + indentupdateres.getDel_sts(),
                            IndentManagement.class.getName());
                }

            } else {

            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getUpdateSHIPINVDataLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + e);
        }

        return indentupdateresp;

    }

    @RequestMapping(method = RequestMethod.POST, value = GET_UPDATENEXTACTIONDATA, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody IndentUpdateResponse getUpdateNextActionData(IndentUpdateRequest indentupdatereq,
                                                                      HttpServletRequest req, HttpServletResponse res) {

        Boolean differentNextCheck = false;
        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();

        getCurrentTimeUsingDate();
        // convert request object to null if empty.
        if (indentupdatereq.getFor_info().equals("null") || StringUtils.isEmpty(indentupdatereq.getFor_info())) {
            indentupdatereq.setFor_info(null);
        }

        if (indentupdatereq.getChecked_on().equals("null") || StringUtils.isEmpty(indentupdatereq.getChecked_on())) {
            indentupdatereq.setChecked_on(null);
        }

        if (indentupdatereq.getNext_check().equals("null") || StringUtils.isEmpty(indentupdatereq.getNext_check())) {
            indentupdatereq.setNext_check(null);
        }

        if (jwttokendetail.getJwt_userName() != "" || !StringUtils.isEmpty(jwttokendetail.getJwt_userName())) {
            indentupdatereq.setUpdated_by(jwttokendetail.getJwt_userName());
        }

        if (indentupdatereq.getUpdated_by().equals("null")) {
            indentupdatereq.setUpdated_by(null);
        }

        if (jwttokendetail.getJwt_userName() != "" || !StringUtils.isEmpty(jwttokendetail.getJwt_userName())) {
            indentupdatereq.setUpdated_by(jwttokendetail.getJwt_userName());
        }

        String sql1 = updateQuery.getCheckNextDate();
        Object[] params = new Object[]{indentupdatereq.getIndent_sheet_num(), indentupdatereq.getNext_check()};
        try {
            List<Map<String, Object>> dbNextActionData = jdbcTemplate.queryForList(sql1, params);

            if (dbNextActionData.isEmpty()) {
                differentNextCheck = true;
            }

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getValidateNextCheckLog());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + e);
        }

        if (differentNextCheck == true) {

            String sql2 = updateQuery.getUpdateNextActionData();

            try {
                if (jdbcTemplate.update(sql2,
                        new Object[]{indentupdatereq.getChecked_on(), indentupdatereq.getNext_check(),
                                indentupdatereq.getFor_info(), indentupdatereq.getUpdated_by(),
                                indentupdatereq.getIndent_sheet_num()}) == 1) {

                    indentupdateresp.setAffectedRows(1);
                    insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                            indentupdatereq.getIndent_sheet_num(), "NXT ACT Information Updated",
                            IndentManagement.class.getName());
                }
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + logs.getUpdateNextActionLog());

            } catch (Exception e) {
                Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + e);
            }

        } else {

            String sql3 = updateQuery.getUpdateIndentWithoutNextDate();
            try {
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + logs.getUpdateNextActionWithoutDateLog());
                if (jdbcTemplate.update(sql3, new Object[]{indentupdatereq.getChecked_on(),
                        indentupdatereq.getFor_info(), indentupdatereq.getIndent_sheet_num()}) == 1) {
                    indentupdateresp.setAffectedRows(1);
                    insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                            indentupdatereq.getIndent_sheet_num(), "NXT ACT Information Updated",
                            IndentManagement.class.getName());
                } else {

                }
            } catch (Exception e) {
                Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + e);
            }

        }

        return indentupdateresp;

    }

    public boolean insertApplicationLog(String userId, String userName, String indent_sheet_num, String logMsg,
                                        String controllerName) {
        try {
            String sql = dbGetQuery.getInsertApplicationLog();
            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{userId, userName, indent_sheet_num, logMsg, controllerName});
            if (affectdRows == 1) {
                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + ApplicationLogs.class.getName() + "\t" + "Application log inserted.");
                return true;
            }
            return false;
        } catch (DuplicateKeyException e) {
            Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + ApplicationLogs.class.getName() + "\t" + "Duplicate entry for appication log." + e);
        } catch (Exception e) {
            Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + ApplicationLogs.class.getName() + "\t" + "Failed to insert into database." + e);
        }
        return false;
    }

    private void getCurrentTimeUsingDate() {
        Date date = new Date();
        DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
        formattedDate = dateFormat.format(date);
    }


    @RequestMapping(method = RequestMethod.POST, path = GET_INDENTLISTFROMINVOICE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Map<String, Object>> getIndentListFromInvoice(
            @ModelAttribute("IndentUpdateRequest") IndentUpdateRequest indentUpdateRequest, HttpServletRequest req,
            HttpServletResponse res) {

        if (indentUpdateRequest.getInv_no().equals("") || indentUpdateRequest.getInv_no().equals("null")) {
            indentUpdateRequest.setInv_no(null);
        }

        if (indentUpdateRequest.getIndent_sheet_num().equals("") || indentUpdateRequest.getIndent_sheet_num().equals("null")) {
            indentUpdateRequest.setIndent_sheet_num(null);
        }
        // check whether indent number and invoice number (composite key) exist or not.
        String query = updateQuery.getIndentFromInvoiceNo();
        List<Map<String, Object>> data = new ArrayList<>();
        try {
            data = jdbcTemplate.queryForList(query,
                    new Object[]{indentUpdateRequest.getInv_no(), indentUpdateRequest.getIndent_sheet_num()});
            // invoice for a given indent not exist there fore invoice can be added and hence indent list for the given invoice should be return.
            if (data.isEmpty()) {
                String sql = updateQuery.getListOfIndentFromInvoiceNo();   // query for return indent list for the given invoice number.
                data = jdbcTemplate.queryForList(sql,
                        new Object[]{indentUpdateRequest.getInv_no()});
                Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + ApplicationLogs.class.getName() + "\t" + "Indent list is return using Invoice number.");
                return data;
            } else {
                data = new ArrayList<>();
                Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + ApplicationLogs.class.getName() + "\t" + "Indent for given Invoice number not exist.");
                return data;
            }
        } catch (Exception e) {
            Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + ApplicationLogs.class.getName() + "\t" + "Failed to get Indent From Invoice." + e);
            data = new ArrayList<>();
            return data;
        }

    }


    @RequestMapping(method = RequestMethod.POST, value = PAYMENT_DATA, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody IndentUpdateResponse insertPaymentData(IndentUpdateRequest indentUpdateRequest,
                                                                HttpServletRequest req, HttpServletResponse res) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();
        getCurrentTimeUsingDate();

        if (indentUpdateRequest.getIndent_sheet_num().equals("") || indentUpdateRequest.getIndent_sheet_num().equals("null")) {
            indentupdateresp.setAffectedRows(0);
            indentupdateresp.setMessage("Indent_sheet_num can not be null. ");
            return indentupdateresp;

        }
        if (indentUpdateRequest.getPmt_sts().equals("") || indentUpdateRequest.getPmt_sts().equals("null")) {
            indentupdateresp.setAffectedRows(0);
            indentupdateresp.setMessage("Payment type can not be null. ");
            return indentupdateresp;

        }
        if (indentUpdateRequest.getPayment_type().equals("") || indentUpdateRequest.getPayment_type().equals("null")) {
            indentupdateresp.setAffectedRows(0);
            indentupdateresp.setMessage("Payment Type is null. ");
            return indentupdateresp;
        }
        if (indentUpdateRequest.getPayment_date().equals("") || indentUpdateRequest.getPayment_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getPayment_date())) {
            indentUpdateRequest.setPayment_date(null);
        }
        if (indentUpdateRequest.getPayment_amount().equals("") || indentUpdateRequest.getPayment_amount().equals("null")) {
            indentUpdateRequest.setPayment_amount(null);
        }
        String sql;
        Object[] object;
        int affectedRows = 0;
        try {
            String prvPmtSts = "";
            String sql1 = updateQuery.getGetPrevPmtSts();
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql1, new Object[]{indentUpdateRequest.getIndent_sheet_num()});
            prvPmtSts = rows.stream()
                    .map(row -> row.get("pmt_sts").toString())
                    .collect(Collectors.joining(", "));

            if (indentUpdateRequest.getPayment_amount() == null && indentUpdateRequest.getPayment_date() == null) {
                if (indentUpdateRequest.getCustomer_po_num().equals("") || indentUpdateRequest.getCustomer_po_num().equals("null")) {
                    sql = updateQuery.getUpdatePMTsts();
                    object = new Object[]{indentUpdateRequest.getPmt_sts(), indentUpdateRequest.getIndent_sheet_num()};
                } else {
                    sql = updateQuery.getUpdatePMTsts(); //changed as above
                    object = new Object[]{indentUpdateRequest.getPmt_sts(), indentUpdateRequest.getIndent_sheet_num()};
                }
                affectedRows = jdbcTemplate.update(sql,
                        object);

                if (affectedRows != 0) {
                    indentupdateresp.setAffectedRows(1);
                    indentupdateresp.setMessage("PMT Status updated successfully.");

                    insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                            indentUpdateRequest.getIndent_sheet_num(), indentupdateresp.getMessage(),
                            IndentManagement.class.getName());

                    if (!Objects.equals(prvPmtSts, indentUpdateRequest.getPmt_sts())) {
                        insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                indentUpdateRequest.getIndent_sheet_num(), "PMT Status Updated from " + prvPmtSts + " to " + indentUpdateRequest.getPmt_sts(),
                                IndentManagement.class.getName());
                    }
                }
            } else {

                sql = updateQuery.getQueryCreatePaymentData();
                affectedRows = jdbcTemplate.update(sql,
                        new Object[]{indentUpdateRequest.getIndent_sheet_num(), indentUpdateRequest.getPayment_type(), indentUpdateRequest.getPayment_date(), indentUpdateRequest.getPayment_amount()});

                if (affectedRows != 0) {
                    indentupdateresp.setAffectedRows(1);
                    indentupdateresp.setMessage(indentUpdateRequest.getPayment_type() + " Payment Data Inserted");

                    if (indentUpdateRequest.getCustomer_po_num().equals("") || indentUpdateRequest.getCustomer_po_num().equals("null")) {
                        sql = updateQuery.getUpdatePMTsts();
                        object = new Object[]{indentUpdateRequest.getPmt_sts(), indentUpdateRequest.getIndent_sheet_num()};
                    } else {
                        sql = updateQuery.getUpdatePMTsts(); //changed as above
                        object = new Object[]{indentUpdateRequest.getPmt_sts(), indentUpdateRequest.getIndent_sheet_num()};
                    }
                    jdbcTemplate.update(sql,
                            object);

                    insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                            indentUpdateRequest.getIndent_sheet_num(), indentupdateresp.getMessage(),
                            IndentManagement.class.getName());

                    if (!Objects.equals(prvPmtSts, indentUpdateRequest.getPmt_sts())) {
                        insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                                indentUpdateRequest.getIndent_sheet_num(), "PMT Status Updated from " + prvPmtSts + " to " + indentUpdateRequest.getPmt_sts(),
                                IndentManagement.class.getName());

                    }

                    Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                            + IndentManagement.class.getName() + "\t" + indentupdateresp.getMessage());


                } else {
                    indentupdateresp.setAffectedRows(0);
                    indentupdateresp.setMessage("Failed to insert payment data.");

                    Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                            + IndentManagement.class.getName() + "\t" + indentupdateresp.getMessage());
                }
            }


        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + e);
        }

        return indentupdateresp;

    }


    @RequestMapping(method = RequestMethod.PUT, value = PAYMENT_DATA, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody IndentUpdateResponse updatePaymentData(IndentUpdateRequest indentUpdateRequest,
                                                                HttpServletRequest req, HttpServletResponse res) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();
        getCurrentTimeUsingDate();

        if (indentUpdateRequest.getId().equals("") || indentUpdateRequest.getId().equals("null")) {
            indentupdateresp.setAffectedRows(0);
            indentupdateresp.setMessage("Payment id is null. ");
            return indentupdateresp;
        }

        if (indentUpdateRequest.getIndent_sheet_num().equals("")
                || indentUpdateRequest.getIndent_sheet_num().equals("null")) {
            indentupdateresp.setAffectedRows(0);
            indentupdateresp.setMessage("IndentSheet is null. ");
            return indentupdateresp;
        }

        if (indentUpdateRequest.getPayment_type().equals("") || indentUpdateRequest.getPayment_type().equals("null")) {
            indentupdateresp.setAffectedRows(0);
            indentupdateresp.setMessage("Payment Type is null. ");
            return indentupdateresp;
        }

        if (indentUpdateRequest.getPayment_date().equals("") || indentUpdateRequest.getPayment_date().equals("null")
                || StringUtils.isEmpty(indentUpdateRequest.getPayment_date())) {
            indentUpdateRequest.setPayment_date(null);
        }

        if (indentUpdateRequest.getPayment_amount().equals("") || indentUpdateRequest.getPayment_amount().equals("null")) {
            indentUpdateRequest.setPayment_amount(null);
        }


        String sql = updateQuery.getQueryUpdatePaymentData();
        Object[] object;
        try {

            String prvPmtSts = "";
            String sql1 = updateQuery.getGetPrevPmtSts();
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql1, new Object[]{indentUpdateRequest.getIndent_sheet_num()});
            prvPmtSts = rows.stream()
                    .map(row -> row.get("pmt_sts").toString())
                    .collect(Collectors.joining(", "));

            if (jdbcTemplate.update(sql,
                    new Object[]{indentUpdateRequest.getPayment_type(), indentUpdateRequest.getPayment_date(), indentUpdateRequest.getPayment_amount(), indentUpdateRequest.getId()}) == 1) {
                indentupdateresp.setAffectedRows(1);
                indentupdateresp.setMessage(indentUpdateRequest.getPayment_type() + " Payment data updated successfully. ");
                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentUpdateRequest.getIndent_sheet_num(), indentupdateresp.getMessage(),
                        IndentManagement.class.getName());

                if (!Objects.equals(prvPmtSts, indentUpdateRequest.getPmt_sts())) {
                    insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                            indentUpdateRequest.getIndent_sheet_num(), "PMT Status Updated from " + prvPmtSts + " to " + indentUpdateRequest.getPmt_sts(),
                            IndentManagement.class.getName());
                }

                if (indentUpdateRequest.getCustomer_po_num().equals("") || indentUpdateRequest.getCustomer_po_num().equals("null")) {
                    sql = updateQuery.getUpdatePMTsts();
                    object = new Object[]{indentUpdateRequest.getPmt_sts(), indentUpdateRequest.getIndent_sheet_num()};
                } else {
                    sql = updateQuery.getUpdatePMTsts(); //changed as above
                    object = new Object[]{indentUpdateRequest.getPmt_sts(), indentUpdateRequest.getIndent_sheet_num()};
                }
                jdbcTemplate.update(sql,
                        object);

                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + indentupdateresp.getMessage());

            } else {
                indentupdateresp.setAffectedRows(0);
                indentupdateresp.setMessage("Payment id not present. ");
                return indentupdateresp;
            }
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + e);
        }

        return indentupdateresp;

    }


    @RequestMapping(method = RequestMethod.POST, value = DELETE_PAYMENT_DATA, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody IndentUpdateResponse deletePaymentData(IndentUpdateRequest indentupdateres,
                                                                HttpServletRequest req, HttpServletResponse res) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();
        getCurrentTimeUsingDate();

        if (indentupdateres.getIndent_sheet_num().equals("") || indentupdateres.getIndent_sheet_num().equals("null")) {
            indentupdateresp.setAffectedRows(0);
            indentupdateresp.setMessage("Indent_sheet_number is null. ");
            return indentupdateresp;
        }
        if (indentupdateres.getId().equals("") || indentupdateres.getId().equals("null")) {
            indentupdateresp.setAffectedRows(0);
            indentupdateresp.setMessage("Payment id is null. ");
            return indentupdateresp;
        }

        try {
            String sql = updateQuery.getQueryDeletePaymentData();
            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{indentupdateres.getId()});
            if (affectdRows == 1) {
                indentupdateresp.setAffectedRows(1);
                indentupdateresp.setMessage("Payment Data Deleted successfully.");
                Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + indentupdateresp.getMessage());

                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentupdateres.getIndent_sheet_num(), indentupdateresp.getMessage(),
                        IndentManagement.class.getName());
            }
        } catch (Exception e) {
            indentupdateresp.setAffectedRows(0);
            indentupdateresp.setMessage("Failed to delete from database.");
            Log4j2.logger.log(Log4j2.LEVEL, "ERROR \t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + indentupdateresp.getMessage() + e);
            return indentupdateresp;
        }

        return indentupdateresp;

    }


    @RequestMapping(method = RequestMethod.GET, path = INVOICE_FILTER_DATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Object> getInvoiceFilterData(@PathVariable("indentType") String indentType, HttpServletRequest req,
                                                           HttpServletResponse res) {
        String failedLog = "Failed to get invoice filter data";
        String sql = updateQuery.getQueryGetInvoiceFilterData();
        if (indentType.equals("OPEN")) {
            sql = sql + OPEN_INVOICE_APPEND;
        }
        if (indentType.equals("CLOSED")) {
            sql = sql + CLOSED_INVOICE_APPEND;
        }
        if (indentType.equals("CANCELLED")) {
            sql = sql + CANCELLED_INVOICE_APPEND;
        }
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            List<Object> invoiceFilterDetails = new ArrayList<>(rows);
            return invoiceFilterDetails;
        } catch (Exception e) {
            Log4j2.logger.log(Log4j2.LEVEL, "ERROR " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + failedLog + e);
            List<Object> invoiceFilterDetails = new ArrayList<>();
            return invoiceFilterDetails;
        }
    }


    @RequestMapping(method = RequestMethod.POST, value = CANCEL_PAYMENT, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody IndentUpdateResponse cancelPayment(IndentUpdateRequest indentupdateres,
                                                            HttpServletRequest req, HttpServletResponse res) {

        IndentUpdateResponse indentupdateresp = new IndentUpdateResponse();

        if (indentupdateres.getIndent_sheet_num().equals("") || indentupdateres.getIndent_sheet_num().equals("null")) {
            indentupdateresp.setAffectedRows(0);
            indentupdateresp.setMessage("Indent_sheet_number is null. ");
            return indentupdateresp;
        }
        try {
            String sql = updateQuery.getQueryPaymentCancel();
            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{indentupdateres.getIndent_sheet_num()});
            if (affectdRows == 1) {
                indentupdateresp.setAffectedRows(1);
                indentupdateresp.setMessage("PMT Status set to P-9");
                Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + indentupdateresp.getMessage());

                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indentupdateres.getIndent_sheet_num(), indentupdateresp.getMessage(),
                        IndentManagement.class.getName());
            }
        } catch (Exception e) {
            indentupdateresp.setAffectedRows(0);
            indentupdateresp.setMessage("Failed to update in database.");
            Log4j2.logger.log(Log4j2.LEVEL, "ERROR " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + indentupdateresp.getMessage() + e);
            return indentupdateresp;
        }

        return indentupdateresp;

    }


    @PostMapping(SEND_INV_EMAIL)
    public @ResponseBody APIResponse saveEmailFormData(@RequestBody Map<String, Object> request) {

        APIResponse apiResponse = new APIResponse();

        String[] emails = ((List<String>) request.get("emails")).toArray(new String[0]);
        String id = (String) request.get("invoiceId");
        String subject = (String) request.get("subject");
        String body = (String) request.get("body");

        try {
            Object[] params = new Object[]{id};
            String sqlInv = updateQuery.getGetInvRow();

            Map<String, Object> result = jdbcTemplate.queryForMap(sqlInv, params);
            String indent_sheet_num = (String) result.get("indent_sheet_num");
            Date inv_issuance_date = (Date) result.get("inv_issuance_date");
            String inv_no = (String) result.get("inv_no");
            String ewb_no = (String) result.get("ewb_no");
            Date ewb_issuance_date = (Date) result.get("ewb_issuance_date");
            Date dispatch_date = (Date) result.get("dispatch_date");
            byte[] invoice_doc = (byte[]) result.get("invoice_doc");
            String inv_doc_name = (String) result.get("inv_doc_name");
            byte[] ewb_doc = (byte[]) result.get("ewb_doc");
            String ewb_doc_name = (String) result.get("ewb_doc_name");
            String updated_by = (String) result.get("updated_by");


            Object[] params1 = new Object[]{indent_sheet_num};
            String sqlCustName = dbGetQuery.getGetCustomerInfo();

            Map<String, Object> result2 = jdbcTemplate.queryForMap(sqlCustName, params1);
            String customerName = (String) result2.get("contract_acnt_name");
            String delSts = (String) result2.get("del_sts");
            String pmtSts = (String) result2.get("pmt_sts");

            String invIssuanceDateStr = inv_issuance_date != null ? inv_issuance_date.toString() : "";
            String dispatchDateStr = dispatch_date != null ? dispatch_date.toString() : "";
            String ewbIssuanceDateStr = ewb_issuance_date != null ? ewb_issuance_date.toString() : "";


            String result1 = inVeWBemailSender.triggerINVeWBEmail(Arrays.asList(emails), subject, body, customerName, indent_sheet_num, invIssuanceDateStr,
                    inv_no, invoice_doc, inv_doc_name, dispatchDateStr, ewbIssuanceDateStr, ewb_no, ewb_doc, ewb_doc_name, updated_by, delSts, pmtSts);

            if (result1 == "Success") {

                apiResponse.setAffectedRows(1);
                apiResponse.setMessage(" Invoice Email Sent");

                Log4j2.logger.log(Log4j2.LEVEL, "INFO \t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t" + apiResponse.getMessage());

                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        indent_sheet_num, "INV/eWB Email Sent",
                        IndentManagement.class.getName());

                String sql = updateQuery.getUpdateEmailSentSequence();

                int affectdRows = jdbcTemplate.update(sql,
                        new Object[]{id});

                if (affectdRows == 1) {
                    Log4j2.logger.log(Log4j2.LEVEL, "INFO \t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                            + IndentManagement.class.getName() + "\t" + " Invoice Email Sent flag updated.");

                    String sql1 = updateQuery.getUpdateEmailSetting2();

                    int affectdRows1 = jdbcTemplate.update(sql1,
                            new Object[]{subject, body});

                    if (affectdRows1 == 1) {
                        Log4j2.logger.log(Log4j2.LEVEL, "INFO \t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                                + IndentManagement.class.getName() + "\t" + " Inv Email Setting successfully updated.");
                    }
                }
            }
        } catch (Exception e) {

            Log4j2.logger.log(Log4j2.LEVEL, "ERROR \t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + " Failed to send Invoice Email" + e);

        }
        return apiResponse;
    }


    @RequestMapping(GET_SERVICE_MASTER_DATA)
    public @ResponseBody List<Object> getServiceMasterData(HttpServletRequest req, HttpServletResponse res) {
        List<Object> AllIndentList = indService.getServiceMasterIndents();

//        sendValueToISM();

        if (AllIndentList.isEmpty()) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getEmptyIndentDetailLog());
        } else {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + logs.getNonEmptyIndentDetailLog());
        }
        return AllIndentList;
    }


    @PostMapping(SET_SERVICE_INDENT_STS)
    public @ResponseBody APIResponse setServiceIndentStatus(@RequestBody Map<String, Object> request) {

        APIResponse apiResponse = new APIResponse();

        String indentNo = (String) request.get("indentNo");
        String serviceRemarks = (String) request.get("serviceRemarks");
        String statusFlag = (String) request.get("statusFlag");
        String shippingRegion = (String) request.get("shipRegion");

        try {

            Object[] params = new Object[]{shippingRegion, serviceRemarks, statusFlag, user.getJwt_userName(), indentNo};
            String sql = updateQuery.getSetServiceIndentSts();

            int affectdRows = jdbcTemplate.update(sql, params);

            if (affectdRows == 1) {
                apiResponse.setAffectedRows(1);

                Log4j2.logger.log(Log4j2.LEVEL, "INFO\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + ApplicationLogs.class.getName() + "\t" + " Indent Service Status Updated Successfully");
            }

        } catch (Exception e) {
            Log4j2.logger.log(Log4j2.LEVEL, "ERROR\t " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + ApplicationLogs.class.getName() + "\t" + " Failed to update Indent Service Status");
        }
        return apiResponse;
    }

//    @Value("${service.b.base-url}")
//    private String serviceBBaseUrl;
//
//    @Value("${service.b.process-endpoint}")
//    private String processEndpoint;
//
//
//    public String sendValueToISM() {
//
//        String value = "IOTS Data Updated";
//
//        String url = serviceBBaseUrl + processEndpoint + value;
//
//        return restTemplate.getForObject(url, String.class);
//    }








}
