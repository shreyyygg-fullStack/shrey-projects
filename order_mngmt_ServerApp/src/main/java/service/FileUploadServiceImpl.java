package service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import javax.servlet.ServletContext;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import config.DBGetQuery;
import config.DbIndentUpdateQuery;
import config.JwtTokenDetail;
import config.Log4j2;
import config.Logs;
import controller.ApplicationLogs;
import controller.IndentManagement;
import model.FileUploadRequest;
import model.FileUploadResponse;
import model.IndentStatusResponce;
import model.IndentStsResOnUpload;

@Service
public class FileUploadServiceImpl implements FileUploadService {
    JwtTokenDetail user = JwtTokenDetail.getInstance();
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String defdate_fmt = null;
    public String defdate_fmt1 = null;

    public String defaultPath = "D:\\iWebSites\\iOTSUploads";
    private final Path root = Paths.get(defaultPath);

    boolean loopFlag;
    int numberOfDaysToAdd;
    int oneDay;
    int dayDiff;
    Date intDate;
    String dateValidate;
    String doubleValidate;
    DateFormat df = new SimpleDateFormat("yyyy-MM-dd");

    List<String> errorList = new ArrayList<>();

    Cell cellValue;
    String cellData;
    String resultMessage = "";
    boolean isValidIndent = true;
    boolean isDataNull = false;
    boolean isDateParsingFailed = false;
    boolean isDoubleParsingFailed = false;

    FileUploadRequest FileUploadReq = new FileUploadRequest();
    IndentStatusResponce indentStsResponce = new IndentStatusResponce();
    IndentStsResOnUpload indentStsResOnUpload = new IndentStsResOnUpload();
    FileUploadResponse fileUploadResp;
    DBGetQuery getQuery = new DBGetQuery();
    Logs logs = new Logs();

    @Autowired
    FileUploadService storageService;

    DbIndentUpdateQuery updateQuery = new DbIndentUpdateQuery();

    @Autowired
    ServletContext context;

    @Override
    public FileUploadResponse init() {
        try {
            if (Files.notExists(root)) {
                Files.createDirectory(root);
            }
        } catch (IOException e) {
            fileUploadResp.setError_title("Something went wrong. Please try again");
            fileUploadResp.setMessage("Could not initialize folder for upload!");
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return fileUploadResp;
        }
        return fileUploadResp;
    }

    @Override
    public FileUploadResponse save(MultipartFile file) {
        errorList.clear();
        fileUploadResp = new FileUploadResponse();
        try {
            Files.copy(file.getInputStream(), this.root.resolve(file.getOriginalFilename()),
                    StandardCopyOption.REPLACE_EXISTING);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getFileSavedLog());

        } catch (Exception e) {
            fileUploadResp.setError_title("Something went wrong. Please try again");
            fileUploadResp.setMessage("Request processing failed, Could not load the file!");
            deleteFile(file);
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return fileUploadResp;
        }

        try {
            excelRead(file);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getFileReadLog());
        } catch (Exception e) {
            fileUploadResp.setError_title("Something went wrong. Please try again");
            fileUploadResp.setMessage("Can't read uploaded excel file.");
            deleteFile(file);
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return fileUploadResp;
        }

        return fileUploadResp;
    }

    @Override
    public Resource load(String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + FileUploadServiceImpl.class.getName() + logs.getLoadedResourcesLog());
                return resource;
            } else {
                fileUploadResp.setError_title("Something went wrong. Please try again");
                fileUploadResp.setMessage("Can't read uploaded excel file.");
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + FileUploadServiceImpl.class.getName() + logs.getUnableToReadFileLog());
                throw new RuntimeException("Could not read the file!");
            }

        } catch (MalformedURLException e) {
            fileUploadResp.setError_title("Something went wrong. Please try again");
            fileUploadResp.setMessage("Can't read uploaded excel file.");
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }


    @Override
    public Stream<Path> loadAll() {
        try {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getLoadedResponseLog());
            return Files.walk(this.root, 1).filter(path -> !path.equals(this.root)).map(this.root::relativize);
        } catch (IOException e) {
            fileUploadResp.setError_title("Something went wrong. Please try again");
            fileUploadResp.setMessage("Can't load excel file.");
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            throw new RuntimeException("Could not load the files!");
        }
    }

    public String deleteFile(MultipartFile file) {
        String result = "";
        try {
            Files.deleteIfExists(this.root.resolve(file.getOriginalFilename()));
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getFileAlreadyExistLog());
        } catch (Exception e) {
            fileUploadResp.setError_title("Something went wrong. Please try again");
            fileUploadResp.setMessage("File is use.");
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            throw new RuntimeException("Could not delete the file. Error: " + e.getMessage());

        }
        return result;
    }

    private FileUploadResponse excelRead(MultipartFile file) throws ParseException {
        try {
            File currDir = new File(".");
//			String path = currDir.getAbsolutePath();
            String fileLocation = this.root.resolve(file.getOriginalFilename()).toString();
            String FILE_NAME = fileLocation.toString();
            FileInputStream excelFile = new FileInputStream(new File(FILE_NAME));

            int count = 1;
            loopFlag = true;
            isValidIndent = true;
            isDataNull = false;
            errorList.clear();

            if (fileLocation != null) {
                if (fileLocation.endsWith(".xlsx")) {
                    Workbook workbook = new XSSFWorkbook(excelFile);
                    Sheet datatypeSheet = workbook.getSheetAt(0);
                    Iterator<Row> iterator = datatypeSheet.iterator();
                    int rowTotal = datatypeSheet.getLastRowNum() + 1;

                    if (rowTotal != 120) {
                        fileUploadResp.setError_title("File can't be uploaded");
                        fileUploadResp.setMessage("Excel file format is not correct. Column count mismatched.");
                        deleteFile(file);
                        workbook.close();
                        return fileUploadResp;
                    }

                    while (iterator.hasNext() && loopFlag) {

                        Row currentRow = iterator.next();
                        int rowIndex = currentRow.getRowNum();
                        count = count + 1;

                        if (rowIndex != 1 && rowIndex != 2) {
                            if (rowIndex == 3) {
                                cellValue = currentRow.getCell(1);
                                validateIndentNumber(cellValue, file);
                                if (isValidIndent == false) {
                                    deleteFile(file);
                                    workbook.close();
                                    return fileUploadResp;
                                }
                            } else {
                                cellValue = currentRow.getCell(1);
                            }

                            try {
                                validateExcelData(rowIndex, currentRow, cellValue, null);
                            } catch (Exception ex) {
                                deleteFile(file);
                                workbook.close();
                                Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName()
                                        + "\t" + FileUploadServiceImpl.class.getName() + "\t" + ex);
                                return fileUploadResp;
                            }
                        }
                    }
                    workbook.close();

                } else if (fileLocation.endsWith(".xls")) {
                    Workbook workbook = new HSSFWorkbook(excelFile);
                    Sheet datatypeSheet = workbook.getSheetAt(0);
                    Iterator<Row> iterator = datatypeSheet.iterator();
                    int rowTotal = datatypeSheet.getLastRowNum() + 1;

                    if (rowTotal != 120) {
                        fileUploadResp.setError_title("File can't be uploaded");
                        fileUploadResp.setMessage("Excel file format is not correct. Column count mismatched.");
                        deleteFile(file);
                        workbook.close();
                        return fileUploadResp;
                    }

                    while (iterator.hasNext() && loopFlag) {
                        Row currentRow = iterator.next();
                        int rowIndex = currentRow.getRowNum();
                        count = count + 1;

                        if (rowIndex != 1 && rowIndex != 2) {
                            if (rowIndex == 3) {
                                cellValue = currentRow.getCell(1);
                                validateIndentNumber(cellValue, file);
                                if (isValidIndent == false) {
                                    deleteFile(file);
                                    workbook.close();
                                    fileUploadResp.setResponseList(errorList);
                                    return fileUploadResp;
                                }
                            } else {
                                cellValue = currentRow.getCell(1);
                            }

                            try {
                                validateExcelData(rowIndex, currentRow, cellValue, null);
                            } catch (Exception ex) {
                                deleteFile(file);
                                workbook.close();
                                Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName()
                                        + FileUploadServiceImpl.class.getName() + "\t" + ex);
                                return fileUploadResp;
                            }
                        }
                    }
                    workbook.close();
                }
            }
            fileUploadResp.setResponseList(errorList);

            try {
                if (errorList.size() > 0) {
                    deleteFile(file);
                    Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                            + FileUploadServiceImpl.class.getName() + logs.getFileDeletedLog());
                    return fileUploadResp;
                } else {
                    String uploadIndentNum = FileUploadReq.getIndent_sheet_num();
                    String uploadedPoNum = FileUploadReq.getCustomer_po_num();
                    if (setIndNoStatusOnUpload(uploadIndentNum)
                            && indentStsResOnUpload.getSelFileRevisedFileExistU() == "1") {
                        insertIndentData(null, file);

                        if (fileUploadResp.getMessage() == "1" && indentSubMasterOperation() && indentDBMasterDataOperation() && indentPaymentDataOperation() && indentInvoiceDataOperation() && indentDocumentsDataOperation() && indentImageDataOperation() && indentServiceMasterDataOperation()) {

                            if (updateIndentRevisionData(uploadIndentNum)) {

                                if (insertLastRevIndent(uploadIndentNum)) {

                                    if (deletePastRevIndentFromMaster(uploadIndentNum)) {

                                        if (checkDuplicateCustomerPoNumber(uploadedPoNum)) {
                                            if (fileUploadResp.getMessage() == "1") {
                                                fileUploadResp.setCust_po(uploadedPoNum);
                                            }
                                        }

                                    } else {

                                        deleteCurrRevIndent(uploadIndentNum);
                                        deletePastRevIndentFromRevision(uploadIndentNum);
                                        deletePreRevSubMaster();
                                        rollBackIndRevInSubMaster(uploadIndentNum);
                                        rollBackPaymentData(uploadIndentNum);
                                        rollBackInvoiceData(uploadIndentNum);
                                        rollBackIndInDBMaster(uploadIndentNum);
                                        rollBackDocumentsData(uploadIndentNum);
                                        rollBackImageData(uploadIndentNum);
                                        rollBackIndInServiceMaster(uploadIndentNum);
                                        fileUploadResp.setError_title("File can't be uploaded");
                                        fileUploadResp.setMessage(
                                                "Something went wrong with file operation. Please try again");
                                        deleteFile(file);
                                        return fileUploadResp;
                                    }

                                } else {

                                    deleteCurrRevIndent(uploadIndentNum);
                                    deletePreRevSubMaster();
                                    rollBackIndRevInSubMaster(uploadIndentNum);
                                    rollBackPaymentData(uploadIndentNum);
                                    rollBackInvoiceData(uploadIndentNum);
                                    rollBackIndInDBMaster(uploadIndentNum);
                                    rollBackDocumentsData(uploadIndentNum);
                                    rollBackImageData(uploadIndentNum);
                                    rollBackIndInServiceMaster(uploadIndentNum);
                                    fileUploadResp.setError_title("File can't be uploaded");
                                    fileUploadResp
                                            .setMessage("Something went wrong with file operation. Please try again");
                                    deleteFile(file);
                                    return fileUploadResp;

                                }

                            } else {
                                deleteCurrRevIndent(uploadIndentNum);
                                deletePreRevSubMaster();
                                rollBackIndRevInSubMaster(uploadIndentNum);
                                rollBackPaymentData(uploadIndentNum);
                                rollBackInvoiceData(uploadIndentNum);
                                rollBackIndInDBMaster(uploadIndentNum);
                                rollBackDocumentsData(uploadIndentNum);
                                rollBackImageData(uploadIndentNum);
                                rollBackIndInServiceMaster(uploadIndentNum);
                                fileUploadResp.setError_title("File can't be uploaded");
                                fileUploadResp.setMessage("Something went wrong with file operation. Please try again");
                                deleteFile(file);
                                return fileUploadResp;
                            }

                        } else {
                            deleteCurrRevIndent(uploadIndentNum);
                            fileUploadResp.setError_title("File can't be uploaded");
                            fileUploadResp.setMessage("Something went wrong with file operation. Please try again");
                            deleteFile(file);
                            return fileUploadResp;
                        }

                        return fileUploadResp;

                    } else {

                        insertIndentData(null, file);

                        if (fileUploadResp.getMessage() == "1") {

                            if (!insertIndentSubData(FileUploadReq.getIndent_sheet_num())) {

                            }
                            if (!insertIndentDBMaster(FileUploadReq.getIndent_sheet_num())) {

                            }
                            if (!insertServiceIndentMaster(FileUploadReq.getIndent_sheet_num())) {

                            }

                        }

                        if (checkDuplicateCustomerPoNumber(uploadedPoNum)) {
                            if (fileUploadResp.getMessage() == "1") {
                                fileUploadResp.setCust_po(uploadedPoNum);
                            }
                        }

                    }

                }

            } catch (Exception ex) {
                fileUploadResp.getError_title();
                fileUploadResp.getMessage();
                deleteFile(file);
                Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + FileUploadServiceImpl.class.getName() + "\t" + ex);
                return fileUploadResp;
            }

        } catch (FileNotFoundException e) {
            e.printStackTrace();
            fileUploadResp.setError_title("Something went wrong. Please try again");
            fileUploadResp.setMessage("File not found!");
            deleteFile(file);
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return fileUploadResp;
        } catch (IOException e) {
            e.printStackTrace();
            fileUploadResp.setError_title("Something went wrong. Please try again");
            fileUploadResp.setMessage("File can not read!");
            deleteFile(file);
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return fileUploadResp;
        }
        return fileUploadResp;
    }

    private FileUploadResponse validateIndentNumber(Cell cellValue, MultipartFile file) {
        if (cellValue == null) {
            isValidIndent = false;
            fileUploadResp.setError_title("Indent number is not valid");
            fileUploadResp.setMessage("Indent number can not be empty.");
            return fileUploadResp;

        } else if (cellValue.toString().length() > 16) {
            isValidIndent = false;
            fileUploadResp.setError_title("Indent number is not valid");
            fileUploadResp.setMessage("Indent number's length can not exceed 16.");
            return fileUploadResp;

        } else if (cellValue.toString().trim().length() == 16) {
            checkDuplicateEntry(cellValue.toString().trim(), file);
            return fileUploadResp;
        }
        return fileUploadResp;
    }

    private FileUploadResponse checkDuplicateEntry(String indentNo, MultipartFile file) {
        String sql = getQuery.getGetIndentNo();
        Object[] params = new Object[]{indentNo};
        List<Map<String, Object>> checkFromMasterDB = jdbcTemplate.queryForList(sql, params);
        String Indent = checkFromMasterDB.get(0).toString().replaceAll("[^0-9]", "");
        int intIndent = Integer.parseInt(Indent);
        if (intIndent != 0) {
            isValidIndent = false;
            fileUploadResp.setError_title("Duplicate entry");
            fileUploadResp.setMessage("Indent number '" + indentNo + "', already exists in record.");
            deleteFile(file);
            return fileUploadResp;
        }
        return fileUploadResp;
    }

    private boolean checkDuplicateCustomerPoNumber(String customerPoNumber) {
        String sql = getQuery.getQueryForCustomerPoNumberExist();
        Object[] params = new Object[]{customerPoNumber};
        String count = (String) jdbcTemplate.queryForObject(sql, params, String.class);
        int intIndent = Integer.parseInt(count.toString());
        if (intIndent > 1) {
            return true;
        }
        return false;
    }

    private FileUploadResponse validateExcelData(int rowIndex, Row currentRow, Cell cellValue2,
                                                 FileUploadRequest fileUploadReq) throws ParseException {
        try {

            if (cellValue2 == null || currentRow.getCell(1).getCellTypeEnum() == CellType.BLANK) {
                cellData = null;
            } else {
                if (cellValue2 != null) {
                    cellValue2.setCellType(CellType.STRING);
                }
                cellData = cellValue2.toString().trim();
            }

            switch (rowIndex) {
                case 3: {
                    String indent_sheet_num = cellData;
                    FileUploadReq.setIndent_sheet_num(indent_sheet_num);
                    if (indent_sheet_num == "" || indent_sheet_num == null) {
                        isDataNull = true;
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("Indent Number : can not be null.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    break;
                }
                case 4: {
                    validateDateFields(currentRow, cellData);
                    if (isDateParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("Indent Issue Date : should be a valid date.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }

                    FileUploadReq.setIndent_issue_date(dateValidate);
                    if (dateValidate == "" || dateValidate == null) {
                        isDataNull = true;
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("Indent Issue Date : can not be null.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                }
                case 5: {
                    String crm_opt_num = cellData;
                    FileUploadReq.setCrm_opt_num(crm_opt_num);
                    break;
                }
                case 6: {
                    String sos_summary = cellData;
                    FileUploadReq.setSos_summary(sos_summary);
                    if (sos_summary == "" || sos_summary == null) {
                        isDataNull = true;
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("SOS Summary : can not be null.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    break;
                }
                case 7: {
                    String sales1_id = cellData;
                    FileUploadReq.setSales1_id(sales1_id);
                    break;
                }
                case 8: {
                    String sales1_name = cellData;
                    FileUploadReq.setSales1_name(sales1_name);
                    break;
                }
                case 9: {
                    String sales2_id = cellData;
                    FileUploadReq.setSales2_id(sales2_id);
                    break;
                }
                case 10: {
                    String sales2_name = cellData;
                    FileUploadReq.setSales2_name(sales2_name);
                    break;
                }
                case 11: {
                    String order_type = cellData;
                    FileUploadReq.setOrder_type(order_type);
                    if (order_type == "" || order_type == null) {
                        isDataNull = true;
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("Order Type : can not be null.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    break;
                }
                case 12: {
                    String customer_po_num = cellData;
                    FileUploadReq.setCustomer_po_num(customer_po_num);
                    break;
                }
                case 13: {
                    validateDateFields(currentRow, cellData);
                    if (isDateParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("Customer PO Date : should be a valid date.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }

                    FileUploadReq.setCustomer_po_date(dateValidate);
                    break;
                }
                case 14: {
                    String contract_acnt_name = cellData;
                    FileUploadReq.setContract_acnt_name(contract_acnt_name);
                    break;
                }
                case 15: {
                    String cntr_code = cellData;
                    FileUploadReq.setCntr_code(cntr_code);
                    break;
                }
                case 16: {
                    String cntr_country = cellData;
                    FileUploadReq.setCntr_country(cntr_country);
                    break;
                }
                case 17: {
                    String cntr_address = cellData;
                    FileUploadReq.setCntr_address(cntr_address);
                    break;
                }
                case 18: {
                    String cntr_tel = cellData;
                    FileUploadReq.setCntr_tel(cntr_tel);
                    break;
                }
                case 19: {
                    String cntr_gst_code = cellData;
                    FileUploadReq.setCntr_gst_code(cntr_gst_code);
                    break;
                }
                case 20: {
                    String cntr_contact_person = cellData;
                    FileUploadReq.setCntr_contact_person(cntr_contact_person);
                    break;
                }
                case 21: {
                    String cntr_email = cellData;
                    FileUploadReq.setCntr_email(cntr_email);
                    break;
                }
                case 22: {
                    String user_acnt_name = cellData;
                    FileUploadReq.setUser_acnt_name(user_acnt_name);
                    break;
                }
                case 23: {
                    String ua_code = cellData;
                    FileUploadReq.setUa_code(ua_code);
                    break;
                }
                case 24: {
                    String ua_country = cellData;
                    FileUploadReq.setUa_country(ua_country);
                    break;
                }
                case 25: {
                    String ua_address = cellData;
                    FileUploadReq.setUa_address(ua_address);
                    break;
                }
                case 26: {
                    String ua_tel = cellData;
                    FileUploadReq.setUa_tel(ua_tel);
                    break;
                }
                case 27: {
                    String ua_gst_code = cellData;
                    FileUploadReq.setUa_gst_code(ua_gst_code);
                    break;
                }
                case 28: {
                    String ua_contact_person = cellData;
                    FileUploadReq.setUa_contact_person(ua_contact_person);
                    break;
                }
                case 29: {
                    String ua_email = cellData;
                    FileUploadReq.setUa_email(ua_email);
                    break;
                }
                case 30: {
                    String key_account_flag = cellData;
                    FileUploadReq.setKey_account_flag(key_account_flag);
                    break;
                }
                case 31: {
                    String sp_cur = cellData;
                    FileUploadReq.setSp_cur(sp_cur);
                    if (sp_cur == "" || sp_cur == null) {
                        isDataNull = true;
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("SP Currency : can not be null.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    break;
                }
                case 32: {
                    validateDoubleFields(currentRow, cellData);
                    if (isDoubleParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("LP Total : should be numeric and greater than 0.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    FileUploadReq.setLp_total(doubleValidate);
                    break;
                }
                case 33: {
                    validateDoubleFields(currentRow, cellData);
                    if (isDoubleParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("SP Total : should be numeric and greater than 0.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    FileUploadReq.setSp_total(doubleValidate);
                    break;
                }
                case 34: {
                    String pck_and_fwd_amnt = cellData;
                    FileUploadReq.setPck_and_fwd_amnt(pck_and_fwd_amnt);
                    break;
                }
                case 35: {
                    String domestic_freight_amnt = cellData;
                    FileUploadReq.setDomestic_freight_amnt(domestic_freight_amnt);
                    break;
                }
                case 36: {
                    String sgst_pc = cellData;
                    FileUploadReq.setSgst_pc(sgst_pc);
                    break;
                }
                case 37: {
                    validateDoubleFields(currentRow, cellData);
                    if (isDoubleParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("SGST Amount : should be numeric and greater than 0.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    FileUploadReq.setSgst_amount(doubleValidate);
                    break;
                }
                case 38: {
                    String cgst_pc = cellData;
                    FileUploadReq.setCgst_pc(cgst_pc);
                    break;
                }
                case 39: {
                    validateDoubleFields(currentRow, cellData);
                    if (isDoubleParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("CGST Amount : should be numeric and greater than 0.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    FileUploadReq.setCgst_amount(doubleValidate);
                    break;
                }
                case 40: {
                    String igst_pc = cellData;
                    FileUploadReq.setIgst_pc(igst_pc);
                    break;
                }
                case 41: {
                    validateDoubleFields(currentRow, cellData);
                    if (isDoubleParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("IGST Amount : should be numeric and greater than 0.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    FileUploadReq.setIgst_amount(doubleValidate);
                    break;
                }
                case 42: {
                    String inst_com_amnt = cellData;
                    FileUploadReq.setInst_com_amnt(inst_com_amnt);
                    break;
                }
                case 43: {
                    String tp_cur = cellData;
                    FileUploadReq.setTp_cur(tp_cur);
                    break;
                }
                case 44: {
                    validateDoubleFields(currentRow, cellData);
                    if (isDoubleParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("TP1 : should be numeric and greater than 0.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    FileUploadReq.setTp1(doubleValidate);
                    break;
                }
                case 45: {
                    validateDoubleFields(currentRow, cellData);
                    if (isDoubleParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("TP2 : should be numeric and greater than 0.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    FileUploadReq.setTp2(doubleValidate);
                    break;
                }
                case 46: {
                    validateDoubleFields(currentRow, cellData);
                    if (isDoubleParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("IIGM INR : should be numeric and greater than 0.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    FileUploadReq.setIigm(doubleValidate);
                    break;
                }
                case 47: {
                    String pmt_trms = cellData;
                    FileUploadReq.setPmt_trms(pmt_trms);
                    if (pmt_trms == "" || pmt_trms == null) {
                        isDataNull = true;
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("PMT Terms : can not be null.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    break;
                }
                case 48: {
                    String adv_type = cellData;
                    FileUploadReq.setAdv_type(adv_type);
                    break;
                }
                case 49: {
                    String adv_pc = cellData;
                    FileUploadReq.setAdv_pc(adv_pc);
                    break;
                }
                case 50: {
                    validateDoubleFields(currentRow, cellData);
                    if (isDoubleParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("ADV Amount : should be numeric and greater than 0.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    FileUploadReq.setAdv_amount(doubleValidate);
                    break;
                }
                case 51: {
                    validateDateFields(currentRow, cellData);
                    if (isDateParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("ADV Date : should be a valid date.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }

                    FileUploadReq.setAdv_date(dateValidate);
                    break;
                }
                case 52: {
                    String bsh_type = cellData;
                    FileUploadReq.setBsh_type(bsh_type);
                    break;
                }
                case 53: {
                    String bsh_pc = cellData;
                    FileUploadReq.setBsh_pc(bsh_pc);
                    break;
                }
                case 54: {
                    validateDoubleFields(currentRow, cellData);
                    if (isDoubleParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("BSH Amount : should be numeric and greater than 0.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    FileUploadReq.setBsh_amount(doubleValidate);
                    break;
                }
                case 55: {
                    validateDateFields(currentRow, cellData);
                    if (isDateParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("BSH Date : should be a valid date.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }

                    FileUploadReq.setBsh_date(dateValidate);
                    break;
                }
                case 56: {
                    String ash_type = cellData;
                    FileUploadReq.setAsh_type(ash_type);
                    break;
                }
                case 57: {
                    String ash_pc = cellData;
                    FileUploadReq.setAsh_pc(ash_pc);
                    break;
                }
                case 58: {
                    validateDoubleFields(currentRow, cellData);
                    if (isDoubleParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("ASH Amount : should be numeric and greater than 0.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    FileUploadReq.setAsh_amount(doubleValidate);
                    break;
                }
                case 59: {
                    validateDateFields(currentRow, cellData);
                    if (isDateParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("ASH Date : should be a valid date.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }

                    FileUploadReq.setAsh_date(dateValidate);
                    break;
                }
                case 60: {
                    String thirdp_com_cur = cellData;
                    FileUploadReq.setThirdp_com_cur(thirdp_com_cur);
                    break;
                }
                case 61: {
                    validateDoubleFields(currentRow, cellData);
                    if (isDoubleParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("3P COM Amount : should be numeric and greater than 0.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    FileUploadReq.setThirdp_com_amnt(doubleValidate);
                    break;
                }
                case 62: {
                    String thirdp_com_paid_by = cellData;
                    FileUploadReq.setThirdp_com_paid_by(thirdp_com_paid_by);
                    break;
                }
                case 63: {
                    String com_acnt_name = cellData;
                    FileUploadReq.setCom_acnt_name(com_acnt_name);
                    break;
                }
                case 64: {
                    String com_code = cellData;
                    FileUploadReq.setCom_code(com_code);
                    break;
                }
                case 65: {
                    String com_country = cellData;
                    FileUploadReq.setCom_country(com_country);
                    break;
                }
                case 66: {
                    String com_address = cellData;
                    FileUploadReq.setCom_address(com_address);
                    break;
                }
                case 67: {
                    String com_tel = cellData;
                    FileUploadReq.setCom_tel(com_tel);
                    break;
                }
                case 68: {
                    String com_gst_code = cellData;
                    FileUploadReq.setCom_gst_code(com_gst_code);
                    break;
                }
                case 69: {
                    String com_contact_person = cellData;
                    FileUploadReq.setCom_contact_person(com_contact_person);
                    break;
                }
                case 70: {
                    String com_email = cellData;
                    FileUploadReq.setCom_email(com_email);
                    break;
                }
                case 71: {
                    String csutomer_application_code = cellData;
                    FileUploadReq.setCsutomer_application_code(csutomer_application_code);
                    if (csutomer_application_code == "" || csutomer_application_code == null) {
                        isDataNull = true;
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("Customer Application Code : can not be null.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    break;
                }
                case 72: {
                    String customer_application_type = cellData;
                    FileUploadReq.setCustomer_application_type(customer_application_type);
                    if (customer_application_type == "" || customer_application_type == null) {
                        isDataNull = true;
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("Customer Application Type : can not be null.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    break;
                }
                case 73: {
                    String customer_app_desc = cellData;
                    FileUploadReq.setCustomer_app_desc(customer_app_desc);
                    break;
                }
                case 74: {
                    validateDateFields(currentRow, cellData);
                    if (isDateParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("REQ ETD by Customer : should be a valid date.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }

                    FileUploadReq.setReq_etd_by_customer(dateValidate);
                    if (dateValidate == "" || dateValidate == null) {
                        isDataNull = true;
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("REQ ETD by Customer : can not be null.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    break;
                }
                case 75: {
                    validateDateFields(currentRow, cellData);
                    if (isDateParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("REQ ETA by Customer : should be a valid date.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }

                    FileUploadReq.setReq_eta_by_customer(dateValidate);
                    if (dateValidate == "" || dateValidate == null) {
                        isDataNull = true;
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("REQ ETA by Customer : can not be null.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }
                    break;
                }
                case 76: {
                    String trd_trms_with_customer = cellData;
                    FileUploadReq.setTrd_trms_with_customer(trd_trms_with_customer);
                    break;
                }
                case 77: {
                    String dest_port_by_customer = cellData;
                    FileUploadReq.setDest_port_by_customer(dest_port_by_customer);
                    break;
                }
                case 78: {
                    String mot = cellData;
                    FileUploadReq.setMot(mot);
                    break;
                }
                case 79: {
                    String freight1 = cellData;
                    FileUploadReq.setFreight1(freight1);
                    break;
                }
                case 80: {
                    validateDateFields(currentRow, cellData);
                    if (isDateParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("REQ ETD to IJ : should be a valid date.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }

                    FileUploadReq.setReq_etd_to_ij(dateValidate);
                    break;
                }
                case 81: {
                    validateDateFields(currentRow, cellData);
                    if (isDateParsingFailed == true) {
                        fileUploadResp.setError_title("Incorrect data in file");
                        fileUploadResp.setMessage("REQ ETA to IJ : should be a valid date.");
                        errorList.add(fileUploadResp.getMessage());
                        loopFlag = false;
                    }

                    FileUploadReq.setReq_eta_to_ij(dateValidate);
                    break;
                }
                case 82: {
                    String trd_trms_with_ij = cellData;
                    FileUploadReq.setTrd_trms_with_ij(trd_trms_with_ij);
                    break;
                }
                case 83: {
                    String dest_port_to_ij = cellData;
                    FileUploadReq.setDest_port_to_ij(dest_port_to_ij);
                    break;
                }
                case 84: {
                    String mot_to_ij = cellData;
                    FileUploadReq.setMot_to_ij(mot_to_ij);
                    break;
                }
                case 85: {
                    String freight2 = cellData;
                    FileUploadReq.setFreight2(freight2);
                    break;
                }
                case 86: {
                    String coo = cellData;
                    FileUploadReq.setCoo(coo);
                    break;
                }
                case 87: {
                    String epa = cellData;
                    FileUploadReq.setEpa(epa);
                    break;
                }
                case 88: {
                    String ip = cellData;
                    FileUploadReq.setIp(ip);
                    break;
                }
                case 89: {
                    String free_detention_period = cellData;
                    FileUploadReq.setFree_detention_period(free_detention_period);
                    break;
                }
                case 90: {
                    String consignee_acnt_name = cellData;
                    FileUploadReq.setConsignee_acnt_name(consignee_acnt_name);
                    break;
                }
                case 91: {
                    String cns_code = cellData;
                    FileUploadReq.setCns_code(cns_code);
                    break;
                }
                case 92: {
                    String cns_country = cellData;
                    FileUploadReq.setCns_country(cns_country);
                    break;
                }
                case 93: {
                    String cns_address = cellData;
                    FileUploadReq.setCns_address(cns_address);
                    break;
                }
                case 94: {
                    String cns_tel = cellData;
                    FileUploadReq.setCns_tel(cns_tel);
                    break;
                }
                case 95: {
                    String cns_gst_code = cellData;
                    FileUploadReq.setCns_gst_code(cns_gst_code);
                    break;
                }
                case 96: {
                    String cns_contact_person = cellData;
                    FileUploadReq.setCns_contact_person(cns_contact_person);
                    break;
                }
                case 97: {
                    String cns_email = cellData;
                    FileUploadReq.setCns_email(cns_email);
                    break;
                }
                case 98: {
                    String cns_iec_code = cellData;
                    FileUploadReq.setCns_iec_code(cns_iec_code);
                    break;
                }
                case 99: {
                    String bank_name_on_cad = cellData;
                    FileUploadReq.setBank_name_on_cad(bank_name_on_cad);
                    break;
                }
                case 100: {
                    String address = cellData;
                    FileUploadReq.setAddress(address);
                    break;
                }
                case 101: {
                    String tel = cellData;
                    FileUploadReq.setTel(tel);
                    break;
                }
                case 102: {
                    String notify_acnt_name = cellData;
                    FileUploadReq.setNotify_acnt_name(notify_acnt_name);
                    break;
                }
                case 103: {
                    String ntf_code = cellData;
                    FileUploadReq.setNtf_code(ntf_code);
                    break;
                }
                case 104: {
                    String ntf_country = cellData;
                    FileUploadReq.setNtf_country(ntf_country);
                    break;
                }
                case 105: {
                    String ntf_address = cellData;
                    FileUploadReq.setNtf_address(ntf_address);
                    break;
                }
                case 106: {
                    String ntf_tel = cellData;
                    FileUploadReq.setNtf_tel(ntf_tel);
                    break;
                }
                case 107: {
                    String ntf_gst_code = cellData;
                    FileUploadReq.setNtf_gst_code(ntf_gst_code);
                    break;
                }
                case 108: {
                    String ntf_contact_person = cellData;
                    FileUploadReq.setNtf_contact_person(ntf_contact_person);
                    break;
                }
                case 109: {
                    String ntf_email = cellData;
                    FileUploadReq.setNtf_email(ntf_email);
                    break;
                }
                case 110: {
                    String production_start = cellData;
                    FileUploadReq.setProduction_start(production_start);
                    break;
                }
                case 111: {
                    String oth_customer_po_sheet = cellData;
                    FileUploadReq.setOth_customer_po_sheet(oth_customer_po_sheet);
                    break;
                }
                case 112: {
                    String oth_sr_spec_sheet = cellData;
                    FileUploadReq.setOth_sr_spec_sheet(oth_sr_spec_sheet);
                    break;
                }
                case 113: {
                    String oth_drawing = cellData;
                    FileUploadReq.setOth_drawing(oth_drawing);
                    break;
                }
                case 114: {
                    String oth_test_report = cellData;
                    FileUploadReq.setOth_test_report(oth_test_report);
                    break;
                }
                case 115: {
                    String oth_pi = cellData;
                    FileUploadReq.setOth_pi(oth_pi);
                    break;
                }
                case 116: {
                    String oth_lc_draft = cellData;
                    FileUploadReq.setOth_lc_draft(oth_lc_draft);
                    break;
                }
                case 117: {
                    String oth_doc1 = cellData;
                    FileUploadReq.setOth_doc1(oth_doc1);
                    break;
                }
                case 118: {
                    String oth_doc2 = cellData;
                    FileUploadReq.setOth_doc2(oth_doc2);
                    break;
                }
                case 119: {
                    String remarks1 = cellData;
                    FileUploadReq.setRemarks1(remarks1);
                }

                case 120: {
                    String pi_no = defdate_fmt1;
                    FileUploadReq.setPi_no(pi_no);

                }
                case 121: {
                    FileUploadReq.setPi_date(defdate_fmt);

                }
                case 122: {
                    String iipo_no = defdate_fmt1;
                    FileUploadReq.setIipo_no(iipo_no);

                }
                case 123: {
                    FileUploadReq.setIipo_date(defdate_fmt);

                }
                case 124: {
                    String ij_project_num = defdate_fmt1;
                    FileUploadReq.setIj_project_num(ij_project_num);

                }
                case 125: {

                    FileUploadReq.setOc_date(defdate_fmt);

                }
                case 126: {


                    FileUploadReq.setSa_date(defdate_fmt);

                }
                case 127: {


                    FileUploadReq.setLc_chk_date_by_ij(defdate_fmt);

                }
                case 128: {

                    FileUploadReq.setLc_open_date(defdate_fmt);

                }
                case 129: {


                    FileUploadReq.setLc_last_revision_date(defdate_fmt);

                }
                case 130: {


                    FileUploadReq.setLatest_shipment_date(defdate_fmt);

                }
                case 131: {


                    FileUploadReq.setLc_expiry_date(defdate_fmt);

                }
                case 132: {


                    FileUploadReq.setExf1(defdate_fmt);

                }
                case 133: {
                    String exf1_sts = defdate_fmt1;
                    FileUploadReq.setExf1_sts(exf1_sts);

                }
                case 134: {


                    FileUploadReq.setExf_ij_accment1(defdate_fmt);

                }
                case 135: {


                    FileUploadReq.setExf2(defdate_fmt);

                }
                case 136: {
                    String exf2_sts = defdate_fmt1;
                    FileUploadReq.setExf2_sts(exf2_sts);

                }
                case 137: {

                    FileUploadReq.setExf_ij_accment2(defdate_fmt);

                }
                case 138: {


                    FileUploadReq.setExf3(defdate_fmt);

                }
                case 139: {
                    String exf3_sts = defdate_fmt1;
                    FileUploadReq.setExf3_sts(exf3_sts);

                }
                case 140: {

                    FileUploadReq.setExf_ij_accment3(defdate_fmt);

                }
                case 141: {
                    String fob_fowarder = defdate_fmt1;
                    FileUploadReq.setFob_fowarder(fob_fowarder);

                }
                case 142: {
                    String invoice_no1 = defdate_fmt1;
                    FileUploadReq.setInvoice_no1(invoice_no1);

                }
                case 143: {

                    FileUploadReq.setInvoice_date1(defdate_fmt);

                }
                case 144: {
                    String mode1 = defdate_fmt1;
                    FileUploadReq.setMode1(mode1);

                }
                case 145: {
                    String from1 = defdate_fmt1;
                    FileUploadReq.setFrom1(from1);

                }
                case 146: {
                    String vessel1 = defdate_fmt1;
                    FileUploadReq.setVessel1(vessel1);

                }
                case 147: {
                    String awb_bl_no1 = defdate_fmt1;
                    FileUploadReq.setAwb_bl_no1(awb_bl_no1);

                }
                case 148: {

                    FileUploadReq.setEtd1(defdate_fmt);

                }
                case 149: {


                    FileUploadReq.setEta1(defdate_fmt);

                }
                case 150: {
                    String invoice_no2 = defdate_fmt1;
                    FileUploadReq.setInvoice_no2(invoice_no2);

                }
                case 151: {


                    FileUploadReq.setInvoice_date2(defdate_fmt);

                }
                case 152: {
                    String mode2 = defdate_fmt1;
                    FileUploadReq.setMode2(mode2);

                }
                case 153: {
                    String from2 = defdate_fmt1;
                    FileUploadReq.setFrom2(from2);

                }
                case 154: {
                    String vessel2 = defdate_fmt1;
                    FileUploadReq.setVessel2(vessel2);

                }
                case 155: {
                    String awb_bl_no2 = defdate_fmt1;
                    FileUploadReq.setAwb_bl_no2(awb_bl_no2);

                }
                case 156: {

                    FileUploadReq.setEtd2(defdate_fmt);

                }
                case 157: {


                    FileUploadReq.setEta2(defdate_fmt);

                }
                case 158: {
                    String invoice_no3 = defdate_fmt1;
                    FileUploadReq.setInvoice_no3(invoice_no3);

                }
                case 159: {


                    FileUploadReq.setInvoice_date3(defdate_fmt);

                }
                case 160: {
                    String mode3 = defdate_fmt1;
                    FileUploadReq.setMode3(mode3);

                }
                case 161: {
                    String from3 = defdate_fmt1;
                    FileUploadReq.setFrom3(from3);

                }
                case 162: {
                    String vessel3 = defdate_fmt1;
                    FileUploadReq.setVessel3(vessel3);

                }
                case 163: {
                    String awb_bl_no3 = defdate_fmt1;
                    FileUploadReq.setAwb_bl_no3(awb_bl_no3);

                }
                case 164: {


                    FileUploadReq.setEtd3(defdate_fmt);

                }
                case 165: {


                    FileUploadReq.setEta3(defdate_fmt);

                }
                case 166: {
                    String eway_bill_req = defdate_fmt1;
                    FileUploadReq.setEway_bill_req(eway_bill_req);

                }
                case 167: {
                    String eway_bill_num = defdate_fmt1;
                    FileUploadReq.setEway_bill_num(eway_bill_num);

                }
                case 168: {
                    String remarks2 = defdate_fmt1;
                    FileUploadReq.setRemarks2(remarks2);

                }
                case 169: {


                    FileUploadReq.setCom_month(defdate_fmt);

                }
                case 170: {


                    FileUploadReq.setChecked_on(defdate_fmt);

                }
                case 171: {


                    FileUploadReq.setNext_check(defdate_fmt);

                }
                case 172: {
                    String for_info = defdate_fmt1;
                    FileUploadReq.setFor_info(for_info);

                }
                case 173: {
                    FileUploadReq.setPmt_sts("P-0");

                }
                case 174: {
                    FileUploadReq.setDel_sts("D-0");
                    break;
                }

                default: {
                    break;
                }

            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getValidateExcelDataLog());
        } catch (Exception ex) {
            resultMessage = ex.getMessage();
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + ex);
            return fileUploadResp;
        }
        return fileUploadResp;
    }

    private FileUploadResponse validateDateFields(Row currentRow, String cellData2) throws ParseException {
        boolean isNumeric = false;
        boolean isDate = false;
        isDateParsingFailed = false;
        dateValidate = "";

        if (cellData2 == null) {
            dateValidate = defdate_fmt;
            return fileUploadResp;
        }

        try {
            isNumeric = isNumeric(cellData2);
            if (isNumeric == false) {
                isDate = isValidDate(cellData2, currentRow);
            }

            if (isNumeric == true) {
//				numberOfDaysToAdd = (int) currentRow.getCell(1).getNumericCellValue();
                numberOfDaysToAdd = Integer.parseInt(cellData2);
                oneDay = 24 * 60 * 60 * 1000;
                dayDiff = 25567;

                intDate = new Date((this.numberOfDaysToAdd - (this.dayDiff + 2)) * this.oneDay);
                Date today = new Date(0);
                Date intDate = addDays(today, (this.numberOfDaysToAdd - (this.dayDiff + 2)));
                dateValidate = df.format(intDate);
                df.parse(dateValidate);

            } else if (isDate == true) {
                Date cellDate = currentRow.getCell(1).getDateCellValue();
                dateValidate = df.format(cellDate);
                df.parse(dateValidate);
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getValidateDateFieldLog());
        } catch (Exception ex) {
            fileUploadResp.setError_title("Incorrect data in file");
            fileUploadResp.setMessage(currentRow.getCell(0) + " should be a valid date.");
            isDateParsingFailed = true;
            dateValidate = cellData2;
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + ex);
        }
        return fileUploadResp;
    }

    private boolean isNumeric(String strNum) {
        if (strNum == null) {
            return false;
        }
        try {
            if (strNum.endsWith(".0")) {
                Double.parseDouble(strNum);
            } else {
                Integer.parseInt(strNum);
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getValidateNumericFieldLog());
        } catch (NumberFormatException nfe) {
            isDateParsingFailed = true;
            dateValidate = strNum;
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + nfe);
            return false;
        }
        return true;
    }

    private boolean isValidDate(String strDate, Row currentRow) {
        if (strDate == null) {
            return false;
        }
        try {
            Date cellDate = currentRow.getCell(1).getDateCellValue();
            strDate = df.format(cellDate);
            df.parse(strDate);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getValidateDateFieldLog());
        } catch (ParseException e) {
            isDateParsingFailed = true;
            dateValidate = strDate;
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }
        return true;
    }

    private Date addDays(Date today, int dayDiff2) {
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(today);
        cal.add(Calendar.DATE, dayDiff2);
        return cal.getTime();
    }

    private FileUploadResponse validateDoubleFields(Row currentRow, String cellData2) {
        isDoubleParsingFailed = false;
        doubleValidate = "";

        if (cellData2 == null) {
            doubleValidate = null;
            return fileUploadResp;
        }

        try {
            boolean isDouble = isDouble(currentRow, cellData2);
            if (isDouble == true) {
                Double.parseDouble(cellData2);
                doubleValidate = cellData2;
                isDoubleParsingFailed = false;
            } else {
                fileUploadResp.setError_title("Incorrect data in file");
                fileUploadResp.setMessage(currentRow.getCell(0) + " should be numeric and greater than 0.");
                isDoubleParsingFailed = true;
                doubleValidate = cellData2;
            }

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getValidateDoubleFieldLog());
        } catch (Exception ex) {
            fileUploadResp.setError_title("Incorrect data in file");
            fileUploadResp.setMessage(currentRow.getCell(0) + " should be numeric and greater than 0.");
            isDoubleParsingFailed = true;
            doubleValidate = cellData2;
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + ex);
        }
        return fileUploadResp;

    }

    private boolean isDouble(Row currentRow, String strDouble) {
        isDoubleParsingFailed = false;
        if (strDouble == null) {
            return false;
        }
        try {
            Double.parseDouble(strDouble);
            String iigmINRCell = currentRow.getCell(0).toString().trim();
            if (iigmINRCell.equals("IIGM INR")) {
                return true;
            }
            if (strDouble.startsWith("-") && !iigmINRCell.equals("IIGM INR")) {
                isDoubleParsingFailed = true;
                doubleValidate = strDouble;
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + FileUploadServiceImpl.class.getName() + logs.getValidateDoubleParsingLog());
                return false;
            }
        } catch (NumberFormatException nfe) {
            isDoubleParsingFailed = true;
            doubleValidate = strDouble;
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + nfe);
            return false;
        }
        return true;
    }

    public Boolean updateIndentRevisionData(String curIndRevNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();
        try {

            if (jdbcTemplate.update(getQuery.getREVISEDUPDATEINDENTNO(),
                    new Object[]{lastRevIndNo, curIndRevNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getUpdatedIndentDataLog());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;
    }

    public Boolean insertLastRevIndent(String curIndRevNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            if (jdbcTemplate.update(getQuery.getREVISIONSELINSERT(), new Object[]{lastRevIndNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getInsertedIndentDataLog());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;
    }

    public Boolean deletePastRevIndentFromRevision(String curIndRevNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            if (jdbcTemplate.update(getQuery.getPREREVDELETE(), new Object[]{lastRevIndNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getDeletedIndentDataLog());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean deletePastRevIndentFromMaster(String curIndRevNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            if (jdbcTemplate.update(getQuery.getCURREVDELETE(), new Object[]{lastRevIndNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getDeletedIndentDataLog());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean deleteCurrRevIndent(String curIndRevNo) {

        try {

            if (jdbcTemplate.update(getQuery.getCURREVDELETE(), new Object[]{curIndRevNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getDeletedIndentDataLog());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean indentSubMasterOperation() {

        if (insertIndentToSubMastRev()) {

            if (updateIndRevInSubMaster(FileUploadReq.getIndent_sheet_num())) {
                return true;

            } else {
                deletePreRevSubMaster();
                return false;
            }

        }

        return false;

    }


    public Boolean indentDBMasterDataOperation() {
        if (updateDBMasterData(FileUploadReq.getIndent_sheet_num())) {
            return true;
        }
        return false;

    }

    public Boolean indentServiceMasterDataOperation() {
        if (updateServiceMasterData(FileUploadReq.getIndent_sheet_num())) {
            return true;
        }
        return false;

    }

    public Boolean indentPaymentDataOperation() {
        if (updatePaymentData(FileUploadReq.getIndent_sheet_num())) {
            return true;
        }
        return false;

    }

    public Boolean indentInvoiceDataOperation() {
        if (updateInvoiceData(FileUploadReq.getIndent_sheet_num())) {
            return true;
        }
        return false;

    }

    public Boolean indentDocumentsDataOperation() {
        if (updateDocumentData(FileUploadReq.getIndent_sheet_num())) {
            return true;
        }
        return false;

    }

    public Boolean indentImageDataOperation() {
        if (updateImageData(FileUploadReq.getIndent_sheet_num())) {
            return true;
        }
        return false;

    }

    public Boolean insertIndentToSubMastRev() {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            if (jdbcTemplate.update(getQuery.getREVSELINSERTSUBMASTER(), new Object[]{lastRevIndNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getInsertedIndentDataLog());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }


    public Boolean deletePreRevSubMaster() {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            if (jdbcTemplate.update(getQuery.getPREREVSUBMASTERDELETE(), new Object[]{lastRevIndNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getDeletedIndentDataLog());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }


    // Updated implementation to update the DB Master table on Revision of Indent
    public Boolean updateIndRevInSubMaster(String curIndNo) {

//		String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();
//
//		try {
//
//			if (jdbcTemplate.update(getQuery.getREVINDUPDATEINSUBMASTER(),
//					new Object[] { curIndNo, lastRevIndNo }) == 0) {
//				return false;
//			}
//			Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//					+ FileUploadServiceImpl.class.getName() + logs.getUpdatedIndentSheetNoLog());
//
//		} catch (Exception e) {
//			Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//					+ FileUploadServiceImpl.class.getName() + "\t" + e);
//			return false;
//		}
//
//		return true;

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

//        if (jdbcTemplate.update(getQuery.getREVINDUPDATEINSUBMASTER(),
//              new Object[] { curIndNo, lastRevIndNo }) == 0) {
//           return false;
//        }
            int rowsAffected = jdbcTemplate.update(
                    getQuery.getREVINDUPDATEINSUBMASTER(),
                    new Object[]{curIndNo, lastRevIndNo}
            );

            if (rowsAffected == 0) {
                return false;
            }

            Map<String, Object> dateMap = jdbcTemplate.queryForMap(getQuery.getGETEXFDATES(), curIndNo);

            Date exf1 = (Date) dateMap.get("exf1_date");
            Date exf2 = (Date) dateMap.get("exf2_date");
            Date exf3 = (Date) dateMap.get("exf3_date");

            String exf1Sts = (String) dateMap.get("exf1_sts");
            String exf2Sts = (String) dateMap.get("exf2_sts");
            String exf3Sts = (String) dateMap.get("exf3_sts");

            Date latestDate = null;
            String latestSts = null;


            if (exf1 != null) {
                latestDate = exf1;
                latestSts = exf1Sts;
            }

            if (exf2 != null) {
                if (latestDate == null || exf2.after(latestDate)) {
                    latestDate = exf2;
                    latestSts = exf2Sts;
                }
            }

            if (exf3 != null) {
                if (latestDate == null || exf3.after(latestDate)) {
                    latestDate = exf3;
                    latestSts = exf3Sts;
                }
            }

            int rowsAffected1 = jdbcTemplate.update(getQuery.getUPDATEPRODDATE(), latestDate, latestSts, curIndNo);

            if (rowsAffected1 == 1) {
                String sql = updateQuery.getSetUPFlag();

                int affectdRows2 = jdbcTemplate.update(sql);
                if (affectdRows2 == 1) {
                    Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                            + FileUploadServiceImpl.class.getName() + "\t" + logs.getUpFlagUpdated());
                }
            }

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getUpdatedIndentSheetNoLog());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }
        return true;

    }


    public Boolean updateDBMasterData(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            jdbcTemplate.update(getQuery.getUPDATEDBMasterData(),
                    new Object[]{curIndNo, FileUploadReq.getSos_summary(), FileUploadReq.getSales1_id(), FileUploadReq.getSales1_name(), FileUploadReq.getOrder_type(), FileUploadReq.getContract_acnt_name(),
                            FileUploadReq.getIipo_no(), FileUploadReq.getExf1(), FileUploadReq.getExf1_sts(), FileUploadReq.getInvoice_no1(), FileUploadReq.getEtd1(), FileUploadReq.getEta1(), FileUploadReq.getChecked_on(),
                            FileUploadReq.getNext_check(), FileUploadReq.getFor_info(), FileUploadReq.getPmt_trms(), FileUploadReq.getReq_etd_by_customer(), FileUploadReq.getCustomer_po_num(), lastRevIndNo});

            Map<String, Object> dateMap = jdbcTemplate.queryForMap(getQuery.getGETMASTEREXFDATES(), curIndNo);

            Date exf1 = (Date) dateMap.get("exf1");
            Date exf2 = (Date) dateMap.get("exf2");
            Date exf3 = (Date) dateMap.get("exf3");

            String exf1Sts = (String) dateMap.get("exf1_sts");
            String exf2Sts = (String) dateMap.get("exf2_sts");
            String exf3Sts = (String) dateMap.get("exf3_sts");

            Date latestDate = null;
            String latestSts = null;


            if (exf1 != null) {
                latestDate = exf1;
                latestSts = exf1Sts;
            }

            if (exf2 != null) {
                if (latestDate == null || exf2.after(latestDate)) {
                    latestDate = exf2;
                    latestSts = exf2Sts;
                }
            }

            if (exf3 != null) {
                if (latestDate == null || exf3.after(latestDate)) {
                    latestDate = exf3;
                    latestSts = exf3Sts;
                }
            }

            int rowsAffected1 = jdbcTemplate.update(getQuery.getUPDATEPEXFDATE(), latestDate, latestSts, curIndNo);

            if (rowsAffected1 == 1) {
                String sql = updateQuery.getSetUPFlag();

                int affectdRows2 = jdbcTemplate.update(sql);
                if (affectdRows2 == 1) {
                    Log4j2.logger.log(Log4j2.LEVEL, "INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                            + FileUploadServiceImpl.class.getName() + "\t" + logs.getUpFlagUpdated());
                }
            }


            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t DB Master Data Updated");

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean updateServiceMasterData(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();
        String indentSts = "Revised";

        try {

            jdbcTemplate.update(getQuery.getUPDATEServiceMasterData(),
                    new Object[]{curIndNo, lastRevIndNo, indentSts, FileUploadReq.getIndent_issue_date(), FileUploadReq.getSos_summary(), FileUploadReq.getSales1_id(), FileUploadReq.getSales1_name(),
                            FileUploadReq.getSales2_id(), FileUploadReq.getSales2_name(), FileUploadReq.getOrder_type(), FileUploadReq.getContract_acnt_name(),
                            FileUploadReq.getCntr_country(), FileUploadReq.getCntr_address(), FileUploadReq.getUser_acnt_name(), FileUploadReq.getUa_country(), FileUploadReq.getUa_address(),
                            FileUploadReq.getUa_contact_person(), FileUploadReq.getUa_tel(), FileUploadReq.getUa_email(), FileUploadReq.getPmt_trms(), lastRevIndNo});


            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t Service Master Data Updated");

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }


    public Boolean updatePaymentData(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            jdbcTemplate.update(getQuery.getREVINDUPDATEINPAYMENTDATA(),
                    new Object[]{curIndNo, lastRevIndNo});
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getLogRevisedPaymentData());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean updateDocumentData(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            jdbcTemplate.update(getQuery.getREVINDUPDATEINDOCUMENTDATA(),
                    new Object[]{curIndNo, lastRevIndNo});
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t Document Data has been Updated");

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean updateImageData(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            jdbcTemplate.update(getQuery.getREVINDUPDATEINIMAGEDATA(),
                    new Object[]{curIndNo, lastRevIndNo});
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t Image Data has been Updated");

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean updateInvoiceData(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            jdbcTemplate.update(getQuery.getREVINDUPDATEININVOICEDATA(),
                    new Object[]{curIndNo, lastRevIndNo});
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getLogRevisedInvoiceData());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean rollBackIndInDBMaster(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            String getRevMasterDataInd = getQuery.getGetRevMasterData();

            Map<String, Object> row = jdbcTemplate.queryForMap(getRevMasterDataInd, lastRevIndNo);
            String indentSheetNum = (String) row.get("indent_sheet_num");
            String sosSummary = (String) row.get("sos_summary");
            String sales1Id = (String) row.get("sales1_id");
            String sales1Name = (String) row.get("sales1_name");
            String orderType = (String) row.get("order_type");
            String contractAcntName = (String) row.get("contract_acnt_name");
            String iipoNo = (String) row.get("iipo_no");
            Date exf1 = (Date) row.get("exf1");
            String exf1Sts = (String) row.get("exf1_sts");
            String invoiceNo1 = (String) row.get("invoice_no1");
            Date etd1 = (Date) row.get("etd1");
            Date eta1 = (Date) row.get("eta1");
            Date checkedOn = (Date) row.get("checked_on");
            Date nextCheck = (Date) row.get("next_check");
            String forInfo = (String) row.get("for_info");
            String pmtSts = (String) row.get("pmt_sts");
            String delSts = (String) row.get("del_sts");
            String pmtTrms = (String) row.get("pmt_trms");
            Date reqEtdByCustomer = (Date) row.get("req_etd_by_customer");
            String customerPoNum = (String) row.get("customer_po_num");


            if (jdbcTemplate.update(getQuery.getUPDATEDBMasterData(),
                    new Object[]{lastRevIndNo, sosSummary, sales1Id, sales1Name, orderType, contractAcntName,
                            iipoNo, exf1, exf1Sts, invoiceNo1, etd1, eta1, checkedOn, nextCheck, forInfo, pmtSts, delSts, pmtTrms, reqEtdByCustomer, customerPoNum, curIndNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t DB Master Data has been rollback.");

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean rollBackIndInServiceMaster(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            String getRevMasterDataInd = getQuery.getGetRevMasterDataFrService();

            Map<String, Object> row = jdbcTemplate.queryForMap(getRevMasterDataInd, lastRevIndNo);
            Date indent_issue_date = (Date) row.get("indent_issue_date");
            String sosSummary = (String) row.get("sos_summary");
            String sales1Id = (String) row.get("sales1_id");
            String sales1Name = (String) row.get("sales1_name");
            String sales2_id = (String) row.get("sales2_id");
            String sales2_name = (String) row.get("sales2_name");
            String orderType = (String) row.get("order_type");
            String contractAcntName = (String) row.get("contract_acnt_name");
            String cntr_country = (String) row.get("cntr_country");
            String cntr_address = (String) row.get("cntr_address");
            String pmt_trms = (String) row.get("pmt_trms");
            String pmt_sts = (String) row.get("pmt_sts");
            String del_sts = (String) row.get("del_sts");

            String user_acnt_name = (String) row.get("user_acnt_name");
            String ua_country = (String) row.get("ua_country");
            String ua_address = (String) row.get("ua_address");
            String ua_contact_person = (String) row.get("ua_contact_person");
            String ua_tel = (String) row.get("ua_tel");
            String ua_email = (String) row.get("ua_email");

            if (jdbcTemplate.update(getQuery.getUPDATERollBackServiceMasterData(),
                    new Object[]{lastRevIndNo, curIndNo, indent_issue_date, sosSummary, sales1Id, sales1Name, sales2_id, sales2_name, orderType, contractAcntName,
                            cntr_country, cntr_address, user_acnt_name, ua_country, ua_address, ua_contact_person, ua_tel, ua_email,  pmt_trms, pmt_sts, del_sts, curIndNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t Service Master Data has been rollback.");

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }


    public Boolean rollBackIndRevInSubMaster(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            if (jdbcTemplate.update(getQuery.getREVINDUPDATEINSUBMASTER(),
                    new Object[]{lastRevIndNo, curIndNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getUpdatedIndentSheetNoLog());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean rollBackPaymentData(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            if (jdbcTemplate.update(getQuery.getREVINDUPDATEINPAYMENTDATA(),
                    new Object[]{lastRevIndNo, curIndNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getLogRollBackPaymentData());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean rollBackImageData(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            if (jdbcTemplate.update(getQuery.getREVINDUPDATEINIMAGEDATA(),
                    new Object[]{lastRevIndNo, curIndNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t Image data has been rollback.");

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean rollBackDocumentsData(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            if (jdbcTemplate.update(getQuery.getREVINDUPDATEINDOCUMENTDATA(),
                    new Object[]{lastRevIndNo, curIndNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t Document data has been rollback.");

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    public Boolean rollBackInvoiceData(String curIndNo) {

        String lastRevIndNo = indentStsResOnUpload.getExistingIndentFileU();

        try {

            if (jdbcTemplate.update(getQuery.getREVINDUPDATEININVOICEDATA(),
                    new Object[]{lastRevIndNo, curIndNo}) == 0) {
                return false;
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getLogRollBackInvoiceData());

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }

        return true;

    }

    // unused
    public String getLastRevIndentNo(String curIndNo) {
        String subString = "";
        String lastRevIndentNo = "";
        int lastrevno = 0;

        try {
            subString = curIndNo.substring(curIndNo.length() - 1);
            lastrevno = Integer.parseInt(subString);

            if (lastrevno > 0) {
                lastrevno = lastrevno - 1;
            }
            String temp = curIndNo.substring(0, curIndNo.length() - 1);
            lastRevIndentNo = temp + Integer.toString(lastrevno);
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getLastRevisionIndentLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
        }

        return lastRevIndentNo;
    }

    public String getIndentNoFormat(String curIndNo) {
        String subString = "";
        String uploadIndFrmt = "";

        try {
            subString = curIndNo.substring(0, curIndNo.length() - 1);
            uploadIndFrmt = subString + "_";

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getFormattedIndentSheetNoLog());
        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
        }

        return uploadIndFrmt;
    }

//	@Override
//	public IndentStatusResponce ckhCurIndNoSts(String curindNo) {
//
//		String query1 = getQuery.getCHECKINDNOEXISTSTS();
//		String query2 = getQuery.getCHECKREVINDNOEXISTSTS();
//
//		try {
//			Object[] obj = new Object[] { curindNo };
//
////			List<Map<String, Object>> mastTblIndNoSts = jdbcTemplate.queryForList(query1, obj);
////			List<Map<String, Object>> revTblIndNoSts = jdbcTemplate.queryForList(query2, obj);
////			String result1 = mastTblIndNoSts.get(0).toString().replaceAll("[^0-9]", "");
////			String result2 = revTblIndNoSts.get(0).toString().replaceAll("[^0-9]", "");
//			Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
//					+ FileUploadServiceImpl.class.getName() + logs.getGetCountOfIndentLog());
//		} catch (Exception e) {
//			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileUploadServiceImpl.class.getName()+"\t"+e);
//		}
//
//		return indentStsResponce;
//	}

    @Override
    public IndentStatusResponce ckhRevIndNoSts(String curindNo) {

        String getIndentNumber = getIndentNoFormat(curindNo);

        String query1 = getQuery.getCHECKINDNOEXISTSTS();

        indentStsResponce.setSelFileNotExistFlag("0");
        indentStsResponce.setSelFileExistAndEqualFlag("0");
        indentStsResponce.setSelFileRevisedFileExist("0");
        indentStsResponce.setExistingIndentFile("0");

        try {
            Object[] obj = new Object[]{getIndentNumber};
            List<Map<String, Object>> mastTblIndNoSts = jdbcTemplate.queryForList(query1, obj);

            if (mastTblIndNoSts.size() == 0) {
                indentStsResponce.setSelFileNotExistFlag("1");
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + FileUploadServiceImpl.class.getName() + logs.getFileNotExistLog());
                return indentStsResponce;
            }

            if (mastTblIndNoSts.size() == 1) {
                if (mastTblIndNoSts.get(0).containsKey("indent_sheet_num")) {

                    String indentNumber = mastTblIndNoSts.get(0).toString().replace("{indent_sheet_num=", "")
                            .replace("}", "");

                    if (indentNumber.equals(curindNo)) {
                        indentStsResponce.setSelFileExistAndEqualFlag("1");
                        indentStsResponce.setExistingIndentFile(indentNumber);
                        return indentStsResponce;
                    }

                    if (indentNumber.equals(curindNo) == false) {
                        indentStsResponce.setSelFileRevisedFileExist("1");
                        indentStsResponce.setExistingIndentFile(indentNumber);
                        return indentStsResponce;
                    }

                }

                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + FileUploadServiceImpl.class.getName() + logs.getFileExistLog());
            }

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
        }
        return indentStsResponce;
    }

    public Boolean setIndNoStatusOnUpload(String curindNo) {

        String getIndentNumber = getIndentNoFormat(curindNo);

        String query1 = getQuery.getCHECKINDNOEXISTSTS();

        indentStsResOnUpload.setSelFileNotExistFlagU("0");
        indentStsResOnUpload.setSelFileExistAndEqualFlagU("0");
        indentStsResOnUpload.setSelFileRevisedFileExistU("0");
        indentStsResOnUpload.setExistingIndentFileU("0");

        try {
            Object[] obj = new Object[]{getIndentNumber};
            List<Map<String, Object>> mastTblIndNoSts = jdbcTemplate.queryForList(query1, obj);

            if (mastTblIndNoSts.size() == 0) {
                indentStsResOnUpload.setSelFileNotExistFlagU("1");
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + FileUploadServiceImpl.class.getName() + logs.getFileNotExistLog());
                return true;
            }

            if (mastTblIndNoSts.size() == 1) {
                if (mastTblIndNoSts.get(0).containsKey("indent_sheet_num")) {

                    String indentNumber = mastTblIndNoSts.get(0).toString().replace("{indent_sheet_num=", "")
                            .replace("}", "");

                    if (indentNumber.equals(curindNo)) {
                        indentStsResOnUpload.setSelFileExistAndEqualFlagU("1");
                        indentStsResOnUpload.setExistingIndentFileU(indentNumber);
                        return true;
                    }

                    if (indentNumber.equals(curindNo) == false) {
                        indentStsResOnUpload.setSelFileRevisedFileExistU("1");
                        indentStsResOnUpload.setExistingIndentFileU(indentNumber);
                        return true;
                    }

                }
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + FileUploadServiceImpl.class.getName() + logs.getFileExistLog());
            }

        } catch (Exception e) {
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return false;
        }
        return false;
    }

    @Override
    public FileUploadResponse insertIndentData(FileUploadRequest fileUploadReq, MultipartFile file) {
        try {
//			long start = System.currentTimeMillis();
            String sql = getQuery.getInsertIndentData();

            int affectdRows = jdbcTemplate.update(sql, new Object[]{FileUploadReq.getIndent_sheet_num(),
                    FileUploadReq.getIndent_issue_date(), FileUploadReq.getCrm_opt_num(),
                    FileUploadReq.getSos_summary(), FileUploadReq.getSales1_id(), FileUploadReq.getSales1_name(),
                    FileUploadReq.getSales2_id(), FileUploadReq.getSales2_name(), FileUploadReq.getOrder_type(),
                    FileUploadReq.getCustomer_po_num(), FileUploadReq.getCustomer_po_date(),
                    FileUploadReq.getContract_acnt_name(), FileUploadReq.getCntr_code(),
                    FileUploadReq.getCntr_country(), FileUploadReq.getCntr_address(), FileUploadReq.getCntr_tel(),
                    FileUploadReq.getCntr_gst_code(), FileUploadReq.getCntr_contact_person(),
                    FileUploadReq.getCntr_email(), FileUploadReq.getUser_acnt_name(), FileUploadReq.getUa_code(),
                    FileUploadReq.getUa_country(), FileUploadReq.getUa_address(), FileUploadReq.getUa_tel(),
                    FileUploadReq.getUa_gst_code(), FileUploadReq.getUa_contact_person(), FileUploadReq.getUa_email(),
                    FileUploadReq.getKey_account_flag(), FileUploadReq.getSp_cur(), FileUploadReq.getLp_total(),
                    FileUploadReq.getSp_total(), FileUploadReq.getPck_and_fwd_amnt(),
                    FileUploadReq.getDomestic_freight_amnt(), FileUploadReq.getSgst_pc(),
                    FileUploadReq.getSgst_amount(), FileUploadReq.getCgst_pc(), FileUploadReq.getCgst_amount(),
                    FileUploadReq.getIgst_pc(), FileUploadReq.getIgst_amount(), FileUploadReq.getInst_com_amnt(),
                    FileUploadReq.getTp_cur(), FileUploadReq.getTp1(), FileUploadReq.getTp2(), FileUploadReq.getIigm(),
                    FileUploadReq.getPmt_trms(), FileUploadReq.getAdv_type(), FileUploadReq.getAdv_pc(),
                    FileUploadReq.getAdv_amount(), FileUploadReq.getAdv_date(), FileUploadReq.getBsh_type(),
                    FileUploadReq.getBsh_pc(), FileUploadReq.getBsh_amount(), FileUploadReq.getBsh_date(),
                    FileUploadReq.getAsh_type(), FileUploadReq.getAsh_pc(), FileUploadReq.getAsh_amount(),
                    FileUploadReq.getAsh_date(), FileUploadReq.getThirdp_com_cur(), FileUploadReq.getThirdp_com_amnt(),
                    FileUploadReq.getThirdp_com_paid_by(), FileUploadReq.getCom_acnt_name(),
                    FileUploadReq.getCom_code(), FileUploadReq.getCom_country(), FileUploadReq.getCom_address(),
                    FileUploadReq.getCom_tel(), FileUploadReq.getCom_gst_code(), FileUploadReq.getCom_contact_person(),
                    FileUploadReq.getCom_email(), FileUploadReq.getCsutomer_application_code(),
                    FileUploadReq.getCustomer_application_type(), FileUploadReq.getCustomer_app_desc(),
                    FileUploadReq.getReq_etd_by_customer(), FileUploadReq.getReq_eta_by_customer(),
                    FileUploadReq.getTrd_trms_with_customer(), FileUploadReq.getDest_port_by_customer(),
                    FileUploadReq.getMot(), FileUploadReq.getFreight1(), FileUploadReq.getReq_etd_to_ij(),
                    FileUploadReq.getReq_eta_to_ij(), FileUploadReq.getTrd_trms_with_ij(),
                    FileUploadReq.getDest_port_to_ij(), FileUploadReq.getMot_to_ij(), FileUploadReq.getFreight2(),
                    FileUploadReq.getCoo(), FileUploadReq.getEpa(), FileUploadReq.getIp(),
                    FileUploadReq.getFree_detention_period(), FileUploadReq.getConsignee_acnt_name(),
                    FileUploadReq.getCns_code(), FileUploadReq.getCns_country(), FileUploadReq.getCns_address(),
                    FileUploadReq.getCns_tel(), FileUploadReq.getCns_gst_code(), FileUploadReq.getCns_contact_person(),
                    FileUploadReq.getCns_email(), FileUploadReq.getCns_iec_code(), FileUploadReq.getBank_name_on_cad(),
                    FileUploadReq.getAddress(), FileUploadReq.getTel(), FileUploadReq.getNotify_acnt_name(),
                    FileUploadReq.getNtf_code(), FileUploadReq.getNtf_country(), FileUploadReq.getNtf_address(),
                    FileUploadReq.getNtf_tel(), FileUploadReq.getNtf_gst_code(), FileUploadReq.getNtf_contact_person(),
                    FileUploadReq.getNtf_email(), FileUploadReq.getProduction_start(),
                    FileUploadReq.getOth_customer_po_sheet(), FileUploadReq.getOth_sr_spec_sheet(),
                    FileUploadReq.getOth_drawing(), FileUploadReq.getOth_test_report(), FileUploadReq.getOth_pi(),
                    FileUploadReq.getOth_lc_draft(), FileUploadReq.getOth_doc1(), FileUploadReq.getOth_doc2(),
                    FileUploadReq.getRemarks1(), FileUploadReq.getPi_no(), FileUploadReq.getPi_date(),
                    FileUploadReq.getIipo_no(), FileUploadReq.getIipo_date(), FileUploadReq.getIj_project_num(),
                    FileUploadReq.getOc_date(), FileUploadReq.getSa_date(), FileUploadReq.getLc_chk_date_by_ij(),
                    FileUploadReq.getLc_open_date(), FileUploadReq.getLc_last_revision_date(),
                    FileUploadReq.getLatest_shipment_date(), FileUploadReq.getLc_expiry_date(), FileUploadReq.getExf1(),
                    FileUploadReq.getExf1_sts(), FileUploadReq.getExf_ij_accment1(), FileUploadReq.getExf2(),
                    FileUploadReq.getExf2_sts(), FileUploadReq.getExf_ij_accment2(), FileUploadReq.getExf3(),
                    FileUploadReq.getExf3_sts(), FileUploadReq.getExf_ij_accment3(), FileUploadReq.getFob_fowarder(),
                    FileUploadReq.getInvoice_no1(), FileUploadReq.getInvoice_date1(), FileUploadReq.getMode1(),
                    FileUploadReq.getFrom1(), FileUploadReq.getVessel1(), FileUploadReq.getAwb_bl_no1(),
                    FileUploadReq.getEtd1(), FileUploadReq.getEta1(), FileUploadReq.getInvoice_no2(),
                    FileUploadReq.getInvoice_date2(), FileUploadReq.getMode2(), FileUploadReq.getFrom2(),
                    FileUploadReq.getVessel2(), FileUploadReq.getAwb_bl_no2(), FileUploadReq.getEtd2(),
                    FileUploadReq.getEta2(), FileUploadReq.getInvoice_no3(), FileUploadReq.getInvoice_date3(),
                    FileUploadReq.getMode3(), FileUploadReq.getFrom3(), FileUploadReq.getVessel3(),
                    FileUploadReq.getAwb_bl_no3(), FileUploadReq.getEtd3(), FileUploadReq.getEta3(),
                    FileUploadReq.getEway_bill_req(), FileUploadReq.getEway_bill_num(), FileUploadReq.getRemarks2(),
                    FileUploadReq.getCom_month(), FileUploadReq.getChecked_on(), FileUploadReq.getNext_check(),
                    FileUploadReq.getFor_info(), FileUploadReq.getPmt_sts(), FileUploadReq.getDel_sts()});

            if (affectdRows == 1) {
                fileUploadResp.setMessage("1");
                insertApplicationLog(user.getJwt_userId(), user.getJwt_userName(),
                        FileUploadReq.getIndent_sheet_num(), "File uploaded",
                        IndentManagement.class.getName());
            }
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + logs.getInsertedIndentLog());
//			long end = System.currentTimeMillis();			

        } catch (DuplicateKeyException e) {
            fileUploadResp.setError_title("Duplicate Entry");
            fileUploadResp.setMessage(FileUploadReq.getIndent_sheet_num() + " Already Exists");
            deleteFile(file);
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return fileUploadResp;
        } catch (Exception e) {
            fileUploadResp.setError_title("Something went wrong. Please try again");
            fileUploadResp.setMessage("Failed to insert into database.");
            deleteFile(file);
            Log4j2.logger.error("ERROR\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + FileUploadServiceImpl.class.getName() + "\t" + e);
            return fileUploadResp;
        }
        return fileUploadResp;
    }

    public Boolean insertIndentSubData(String indent_sheet_num) {
        try {
            String sql = getQuery.getInsertIndentSubData();
            String del_status = "D-0";
            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{FileUploadReq.getIndent_sheet_num(), null, null, null, null, del_status, null, null,
                            null, null, null, null, null, null, null, null, null, null, null, null, null, null, null});

            if (affectdRows == 1) {
                Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + logs.getMasterSubDataInsertedLog());
                return true;
            }
        } catch (DuplicateKeyException ex) {
            fileUploadResp.setMessage("Master Sub Data Data Already Exists");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + fileUploadResp.getMessage());
            return false;
        } catch (Exception e) {
            fileUploadResp.setMessage("Failed to insert into database.");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + fileUploadResp.getMessage());
            return false;
        }
        return false;
    }

    public Boolean insertIndentDBMaster(String indent_sheet_num) {
        try {
            String sql = getQuery.getInsertIndentDbMasterData();
            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{FileUploadReq.getIndent_sheet_num(), FileUploadReq.getSos_summary(), FileUploadReq.getSales1_id(), FileUploadReq.getSales1_name(), FileUploadReq.getOrder_type(), FileUploadReq.getContract_acnt_name(),
                            FileUploadReq.getIipo_no(), FileUploadReq.getExf1(), FileUploadReq.getExf1_sts(), FileUploadReq.getInvoice_no1(), FileUploadReq.getEtd1(), FileUploadReq.getEta1(), FileUploadReq.getChecked_on(),
                            FileUploadReq.getNext_check(), FileUploadReq.getFor_info(), FileUploadReq.getPmt_sts(), FileUploadReq.getDel_sts(), FileUploadReq.getPmt_trms(), FileUploadReq.getReq_etd_by_customer(), FileUploadReq.getCustomer_po_num()});

            if (affectdRows == 1) {
                Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t DB Master Data Inserted Successfully.");
                return true;
            }
        } catch (DuplicateKeyException ex) {
            fileUploadResp.setMessage("DB Master Data Already Exists");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + fileUploadResp.getMessage());
            return false;
        } catch (Exception e) {
            fileUploadResp.setMessage("Failed to insert into database.");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + fileUploadResp.getMessage());
            return false;
        }
        return false;
    }


    public Boolean insertServiceIndentMaster(String indent_sheet_num) {
        try {
            String sql = getQuery.getInsertIndentServiceMaster();
            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{FileUploadReq.getIndent_sheet_num(), FileUploadReq.getIndent_issue_date(), FileUploadReq.getSos_summary(), FileUploadReq.getSales1_id(), FileUploadReq.getSales1_name(), FileUploadReq.getSales2_id(), FileUploadReq.getSales2_name(),
                            FileUploadReq.getOrder_type(), FileUploadReq.getContract_acnt_name(), FileUploadReq.getCntr_country(), FileUploadReq.getCntr_address(), FileUploadReq.getUser_acnt_name(), FileUploadReq.getUa_country(), FileUploadReq.getUa_address(),
                            FileUploadReq.getUa_contact_person(), FileUploadReq.getUa_tel(), FileUploadReq.getUa_email(), FileUploadReq.getPmt_trms(), FileUploadReq.getPmt_sts(), FileUploadReq.getDel_sts()});

            if (affectdRows == 1) {
                Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + IndentManagement.class.getName() + "\t Service Master Data Inserted Successfully.");
                return true;
            }
        } catch (DuplicateKeyException ex) {
            fileUploadResp.setMessage("Service Master Data Already Exists");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + fileUploadResp.getMessage());
            return false;
        } catch (Exception e) {
            fileUploadResp.setMessage("Failed to insert into database.");
            Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + IndentManagement.class.getName() + "\t" + fileUploadResp.getMessage());
            return false;
        }
        return false;
    }

    public boolean insertApplicationLog(String userId, String userName, String indent_sheet_num, String logMsg,
                                        String controllerName) {
        try {
            String sql = getQuery.getInsertApplicationLog();
            int affectdRows = jdbcTemplate.update(sql,
                    new Object[]{userId, userName, indent_sheet_num, logMsg, controllerName});
            if (affectdRows == 1) {
                Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                        + ApplicationLogs.class.getName() + "\t" + "Application log inserted.");
                return true;
            }
            return false;
        } catch (DuplicateKeyException e) {
            Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + ApplicationLogs.class.getName() + "\t" + "Duplicate entry for appication log.");
        } catch (Exception e) {
            Log4j2.logger.log(Log4j2.LEVEL, "INFO " + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
                    + ApplicationLogs.class.getName() + "\t" + "Failed to insert into database.");
        }
        return false;
    }


}
