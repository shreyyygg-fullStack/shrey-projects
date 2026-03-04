package config;

public class Logs {
    // login api logs
    String loginSuccessfull = "\tLogin Successfully.";
    String userEmailNotFound = "\tUser Email Data not found";
    String userEmailLoaded = "\tUser Email Data Loaded";

    //  dashboard api logs
    String BlueSignalCount = "\tGet Blue Signal Count";
    String YellowSignalCount = "\tGet Yellow Signal Count";
    String BlueFilterSnf = "\tGet Blue Filter SNF";
    String BlueFilterAdv = "\tGet Blue Filter ADV";
    String BlueFilterLc = "\tGet Blue Filter LC";
    String BlueFilterBsh = "\tGet Blue Filter BSH";
    String BlueFilterOut = "\tGet Blue Filter OUT";
    String BlueFilterPns = "\tGet Blue Filter PNS";
    String BlueFilterLcp = "\tGet Blue Filter LCP";
    String BlueFilterPxef = "\tGet Blue Filter PXEF";
    String BlueFilterFexf = "\tGet Blue Filter FXEF";
    String BlueFilterSsp = "\tGet Blue Filter SSP";
    String BlueFilterSap = "\tGet Blue Filter SAP";
    String YellowFilterSnf = "\tGet Yellow Filter SNF";
    String YellowFilterAdv = "\tGet Yellow Filter ADV";
    String YellowFilterLc = "\tGet Yellow Filter LC";
    String YellowFilterBsh = "\tGet Yellow Filter BSH";
    String YellowFilterOut = "\tGet Yellow Filter OUT";
    String YellowFilterPns = "\tGet Yellow Filter PNS";
    String YellowFilterLcp = "\tGet Yellow Filter LCP";
    String YellowFilterPxef = "\tGet Yellow Filter PXEF";
    String YellowFilterFexf = "\tGet Yellow Filter FXEF";
    String YellowFilterSsp = "\tGet Yellow Filter SSP";
    String YellowFilterSap = "\tGet Yellow Filter SAP";
    String OneIndentDetail = "\tGet Individual Indent Details";

    String LogForCheckPoNumberExist = "\tCheck Customer PO Number Exist";
    String LogForIndentListUsingPoNum = "\tGET INDENT LIST USING PO NUMBER";
    String LogForPmtListUsingPoNum = "\tGET PMT LIST USING PO NUMBER";
    String LogForMasterPmtListUsingPoNum = "\tGET MASTER PMT LIST USING PO NUMBER";


    // file management api logs
    String filterAllIndentsLog = "\tGet Indent Data for file download module with all Filter";
    String emptyIndentListLog = "\tGet List all Indents in file-management-download [Empty List]";
    String nonEmptyIndentListLog = "\tGet List all Indents in file-management-download [Non-Empty List]";
    String emptyIndentListOnDateFilterLog = "\tGet List all Indents by Date filter in file-management-download [Empty List]";
    String nonEmptyIndentListOnDateFilterLog = "\tGet List all Indents by Date filter in file-management-download [Non-Empty List]";
    String emptyIndentListOnConFilterLog = "\tGet List all Indents by Conditional filter in file-management-download [Empty List]";
    String nonEmptyIndentListOnConFilterLog = "\tGet List all Indents by Conditional filter in file-management-download [Non-Empty List]";
    String emptyIndentListLogOld = "Get Filter Data on api call from OLd Download module [empty List]";
    String nonEmptyIndentListLogOld = "Get Filter Data on api call from OLd Download module [Non empty List]";
    String uploadFileLog = "\tFile Uploaded";
    String yearListLog = "\tGet Year List";
    String yearDetailLog = "\tGet Year Detail";
    String emptyYearListLog = "\t Get Year List [Empty]";
    String emptyYearDetailLog = "\t Get Year Detail[Empty]";
    String allFilterDetailLog = "\tGet all Filter Details";
    String fileSavedLog = "\tFile Saved";
    String fileReadLog = "\tFile Read";
    String loadedResourcesLog = "\tLoaded Resources";
    String unableToReadFileLog = "\tCan't read uploaded excel file.";
    String loadedResponseLog = "\tloaded All Response";
    String fileAlreadyExistLog = "\tFile Already Exist therefore deleted.";
    String validateExcelDataLog = "\tValidated Excel Data.";
    String fileDeletedLog = "\tFile Deleted.";
    String validateDateFieldLog = "\tValidated Date Field.";
    String validateNumericFieldLog = "\tValidated Numeric Field.";
    String validateDoubleFieldLog = "\tValidated Double Field.";
    String validateDoubleParsingLog = "\tValidated Double Parsing.";
    String lastRevisionIndentLog = "\tGet Last Revision Indent Number";
    String insertedIndentLog = "\tInserted Indent Data";
    String masterSubDataInsertedLog = "\t Master Sub Data Inserted Successfully.";
    String updatedIndentDataLog = "\t Updated indent data using indent sheet number.";
    String insertedIndentDataLog = "\t Inserted indent data using indent sheet number.";
    String deletedIndentDataLog = "\t Deleted indent data using indent sheet number.";
    String updatedIndentSheetNoLog = "\t Updated indent sheet number.";
    String formattedIndentSheetNoLog = "\t Formatted indent sheet number";
    String getCountOfIndentLog = "\t Get total count of given indent sheet number.";
    String fileExistLog = "\t File exists";
    String fileNotExistLog = "\t File not exists";


    String emptyPaymentListLog = "\t Get Payment List [Empty]";
    String nonEmptyPaymentListLog = "\t Get Payment List [Non-Empty]";
    String emptyInvoiceListLog = "\t Get Invoice List [Empty]";
    String nonEmptyInvoiceListLog = "\t Get Invoice List [Non-Empty]";
    String emptyPaymentListLogOnDateFilter = "\t Get Payment List On Date Filter [Empty]";
    String nonEmptyPaymentListLogOnDateFilter = "\t Get Payment List On Date Filter [Non-Empty]";
    String emptyInvoiceListLogOnDateFilter = "\t Get Invoice List On Date Filter [Empty]";
    String nonEmptyInvoiceListLogOnDateFilter = "\t Get Invoice List On Date Filter [Non-Empty]";
    String emptyPaymentListLogOnConFilter = "\t Get Payment List On Conditional Filter [Empty]";
    String nonEmptyPaymentListLogOnConFilter = "\t Get Payment List On Conditional Filter [Non-Empty]";
    String emptyInvoiceListLogOnConFilter = "\t Get Invoice List On Conditional Filter [Empty]";
    String nonEmptyInvoiceListLogOnConFilter = "\t Get Invoice List On Conditional Filter [Non-Empty]";

    String logRevisedPaymentData = "\t Payment data has been revised. ";
    String logRevisedInvoiceData = "\t Invoice data has been revised. ";
    String logRollBackPaymentData = "\t Payment data has been rollback. ";
    String logRollBackInvoiceData = "\t Invoice data has been rollback. ";


    public String getMasterSubDataInsertedLog() {
        return masterSubDataInsertedLog;
    }

    public void setMasterSubDataInsertedLog(String masterSubDataInsertedLog) {
        this.masterSubDataInsertedLog = masterSubDataInsertedLog;
    }

    // indent management api logs
    String emptyIndentDetailLog = "\tGet List of all Details about the indent [Empty List]";
    String nonEmptyIndentDetailLog = "\tGet List of all Details about the indent [Empty List]";
    String emptyIndentSubDetail = "\tIndent Sub Details is Empty.";
    String indentSubDetailLoaded = "\tIndent Sub Details Loaded.";
    String updatePIDataLog = "\tUpdated PI Data";
    String emptyIndentInvoiceDetail = "\tIndent Invoice Details is Empty.";
    String indentInvoiceDetailLoaded = "\tIndent Invoice Details Loaded.";
    String emptyIndentPaymentDetail = "\tIndent Payement Details is Empty.";
    String indentPaymentDetailLoaded = "\tIndent Payment Details Loaded.";
    String emptySumOfPayment = "\tSum of Payement Details is Empty.";
    String sumOfPaymentLoaded = "\tSum of Payment Details Loaded.";
    String updateIIPODataLog = "\tUpdated IIPO Data";
    String updateOCDataLog = "\tUpdated OC Data";
    String updateEXFDataLog = "\tUpdated EXF Data";
    String updatePMTDataLog = "\tUpdated PMT Data";
    String updateLCDataLog = "\tUpdated LC Data";
    String updateCOMDataLog = "\tUpdated COM Data";
    String updateSHIPINVDataLog = "\tUpdated SHIP INV Data";
    String validateNextCheckLog = "\tValidate Next Check Date";
    String updateNextActionLog = "\tUpdating indent Table for new next action.";
    String newIndentCreationLog = "\tIndent number not exist therefore creating a new Indent row.";
    String insertNewIndentDetailLog = "\tInserting new Indent Next Action Details";
    String updateIndentDetailLog = "\tUpdating Existing Indent Next Action Details.";
    String updateNextActionWithoutDateLog = "\tUpdating Next Action Data without next Date.";
    String nextActionDataLog = "\tGet filtered Next Action by Today";
    String revisedNextActionLog = "\tGet all Revised Next Date";
    String indentDetailsLog = "\tGet Indent Details";
    String indentLog = "\tGet Indent";
    String allIndentLog = "\tGet All Indents";
    String OpenIndentLog = "\tGet Open Indents";
    String ClosedIndentLog = "\tGet Closed Indents";
    String CancelledIndentLog = "\tGet Cancelled Indents";
    String emptyIndentSubDetailLog = "\tIndent Sub Details is Empty.";
    String loadedIndentSubDetailLog = "\tIndent Sub Details Loaded.";
    String emptyIndentInvoiceLog = "\tIndent Invoice Details is Empty.";
    String IndentInvoiceDetailLog = "\tIndent Invoice Details Loaded.";
    String emptyIndentPaymentLog = "\tIndent Payement Details is Empty.";
    String indentPaymentLog = "\tIndent Payment Details Loaded.";
    String emptyNextActionLog = "\t Get next action data [Empty List]";
    String nonEmptyNextActionLog = "\t Get next action data [Non-Empty List]";
    String emptyAllRevisedNextDate = "\t Get All Revised Next Date [Empty List]";
    String nonEmptyAllRevisedNextData = "\t Get All Revised Next Date [Non-Empty List]";


    // user management logs
    String userListLog = "\tGet User List";
    String userCreatedLog = "\tUser Created Successfully";
    String userUpdatedLog = "\tEmployee data updated for given ID";
    String userNotExist = "\tUser Not Exist";
    String userDeletedLog = "\tDeleted User";
    String numberOfUserLog = "\tGet Number of Users";
    String userDetailLog = "\tGet User Details";
    String departmentDetailLog = "\tGet Department Details";
    String userAlreadyExistLog = "\tUser Already Exist in Record";

    // email sender log
    String sentMailLog = "Sent Temperory password mail";
    String emailList = " Successfully get the Email List";
    String failEmailList = " Failed to get Email list";
    String addEmail = " E-mail has been added successfully.";
    String failaddEmail = " Failed to add e-mail.";
    String updateEmail = " Email has been updated successfully.";
    String failUpdateEmail = " Failed to update Email.";
    String emailData = " Successfully get the Email Data.";
    String failEmailData = " Failed to get Email Data.";
    String deleteEmail = " Email Deleted Successfully.";
    String failDeleteEmail = " Failed to delete email.";

    //IIEXF mail setting
    String IIEXFemailSent = " II-EXF Email sent successfully";
    String IIEXFemailFail = " Error sending IIEXF email";
    String saveEmailData = " Email Data has been saved successfully";
    String failSaveEmailData = " Failed to save Email Data";
    String saveEmail = " Emails has been saved successfully";
    String failSaveEmail = " Failed to save Email";

    //Display board
    String IndentNum = "\tGet the Indent no. for the position";
    String FailIndentNum = "\tFailed Get the Indent no. for the position";
    String EmptyIndents = "\tGet List all Priority Indents by Date filter [Empty List]";
    String NonEmptyIndents = "\tGet List all Priority Indents by Date filter [Non-Empty List]";
    String UpFlagUpdated = "UPFLAG Updated";
    String UpdatedPosition = "\tPriority Positions Updated";
    String FailUpdatedPosition = "\tPriority Positions not Updated ";
    String FailIndentDetail = "\tFailed to Get Individual Indent Details";
    String PageDetail = "\tGet Pagination Details";
    String RegionListLog = "\tGet Region List";
    String FailRegionListLog = "\tFailed to Get Region List";
    String FailPageDetail = "\tFailed to Get Pagination Details";
    String DefaultPageJumpNum = "\tUpdated the default value for Page Jump Number";
    String DeleteReamrks = "Successfully Deleted the Expired Remarks";

    public String getFailRegionListLog() {
        return FailRegionListLog;
    }

    public void setFailRegionListLog(String failRegionListLog) {
        FailRegionListLog = failRegionListLog;
    }
    public String getRegionListLog() {
        return RegionListLog;
    }

    public void setRegionListLog(String regionList) {
        RegionListLog = regionList;
    }

    public String getDefaultPageJumpNum() {
        return DefaultPageJumpNum;
    }
    public void setDefaultPageJumpNum(String defaultPageJumpNum) {
        DefaultPageJumpNum = defaultPageJumpNum;
    }
    public String getDeleteReamrks() {
        return DeleteReamrks;
    }

    public void setDeleteReamrks(String deleteReamrks) {
        DeleteReamrks = deleteReamrks;
    }
    public void setLogForCheckPoNumberExist(String logForCheckPoNumberExist) {
        LogForCheckPoNumberExist = logForCheckPoNumberExist;
    }
    public String getPageDetail() {
        return PageDetail;
    }
    public void setPageDetail(String pageDetail) {
        PageDetail = pageDetail;
    }

    public String getFailPageDetail() {
        return FailPageDetail;
    }

    public void setFailPageDetail(String failPageDetail) {
        FailPageDetail = failPageDetail;
    }
    public String getFailIndentDetail() {
        return FailIndentDetail;
    }

    public void setFailIndentDetail(String failIndentDetail) {
        FailIndentDetail = failIndentDetail;
    }

    public String getFailIndentNum() {
        return FailIndentNum;
    }

    public void setFailIndentNum(String failIndentNum) {
        FailIndentNum = failIndentNum;
    }
    public String getUpdatedPosition() {
        return UpdatedPosition;
    }

    public void setUpdatedPosition(String updatedPosition) {
        UpdatedPosition = updatedPosition;
    }

    public String getFailUpdatedPosition() {
        return FailUpdatedPosition;
    }

    public void setFailUpdatedPosition(String failUpdatedPosition) {
        FailUpdatedPosition = failUpdatedPosition;
    }

    public String getUpFlagUpdated() {
        return UpFlagUpdated;
    }

    public void setUpFlagUpdated(String upFlagUpdated) {
        UpFlagUpdated = upFlagUpdated;
    }

    public String getEmptyIndents() {
        return EmptyIndents;
    }

    public void setEmptyIndents(String emptyIndents) {
        EmptyIndents = emptyIndents;
    }

    public String getNonEmptyIndents() {
        return NonEmptyIndents;
    }

    public void setNonEmptyIndents(String nonEmptyIndents) {
        NonEmptyIndents = nonEmptyIndents;
    }

    public String getFailSaveEmailData() {
        return failSaveEmailData;
    }

    public void setFailSaveEmailData(String failSaveEmailData) {
        this.failSaveEmailData = failSaveEmailData;
    }

    public String getFailSaveEmail() {
        return failSaveEmail;
    }

    public void setFailSaveEmail(String failSaveEmail) {
        this.failSaveEmail = failSaveEmail;
    }

    public String getIndentNum() {
        return IndentNum;
    }

    public void setIndentNum(String indentNum) {
        IndentNum = indentNum;
    }

    public String getSaveEmail() {
        return saveEmail;
    }

    public void setSaveEmail(String saveEmail) {
        this.saveEmail = saveEmail;
    }

    public String getSaveEmailData() {
        return saveEmailData;
    }

    public void setSaveEmailData(String saveEmailData) {
        this.saveEmailData = saveEmailData;
    }

    public String getIIEXFemailSent() {
        return IIEXFemailSent;
    }

    public void setIIEXFemailSent(String IIEXFemailSent) {
        this.IIEXFemailSent = IIEXFemailSent;
    }

    public String getIIEXFemailFail() {
        return IIEXFemailFail;
    }

    public void setIIEXFemailFail(String IIEXFemailFail) {
        this.IIEXFemailFail = IIEXFemailFail;
    }


    public String getDeleteEmail() {
        return deleteEmail;
    }

    public void setDeleteEmail(String deleteEmail) {
        this.deleteEmail = deleteEmail;
    }

    public String getFailDeleteEmail() {
        return failDeleteEmail;
    }

    public void setFailDeleteEmail(String failDeleteEmail) {
        this.failDeleteEmail = failDeleteEmail;
    }

    public String getEmailData() {
        return emailData;
    }

    public void setEmailData(String emailData) {
        this.emailData = emailData;
    }

    public String getFailEmailData() {
        return failEmailData;
    }

    public void setFailEmailData(String failEmailData) {
        this.failEmailData = failEmailData;
    }

    public String getUpdateEmail() {
        return updateEmail;
    }

    public void setUpdateEmail(String updateEmail) {
        this.updateEmail = updateEmail;
    }

    public String getFailUpdateEmail() {
        return failUpdateEmail;
    }

    public void setFailUpdateEmail(String failUpdateEmail) {
        this.failUpdateEmail = failUpdateEmail;
    }

    public String getFailaddEmail() {
        return failaddEmail;
    }

    public void setFailaddEmail(String failaddEmail) {
        this.failaddEmail = failaddEmail;
    }

    public String getAddEmail() {
        return addEmail;
    }

    public void setAddEmail(String addEmail) {
        this.addEmail = addEmail;
    }

    public String getEmailList() {
        return emailList;
    }

    public void setEmailList(String emailList) {
        this.emailList = emailList;
    }

    public String getFailEmailList() {
        return failEmailList;
    }

    public void setFailEmailList(String failEmailList) {
        this.failEmailList = failEmailList;
    }

    public String getLoginSuccessfull() {
        return loginSuccessfull;
    }

    public String getUserEmailNotFound() {
        return userEmailNotFound;
    }

    public String getUserEmailLoaded() {
        return userEmailLoaded;
    }

    public String getBlueSignalCount() {
        return BlueSignalCount;
    }

    public String getYellowSignalCount() {
        return YellowSignalCount;
    }

    public String getBlueFilterSnf() {
        return BlueFilterSnf;
    }

    public String getBlueFilterAdv() {
        return BlueFilterAdv;
    }

    public String getBlueFilterLc() {
        return BlueFilterLc;
    }

    public String getBlueFilterBsh() {
        return BlueFilterBsh;
    }

    public String getBlueFilterOut() {
        return BlueFilterOut;
    }

    public String getBlueFilterPns() {
        return BlueFilterPns;
    }

    public String getBlueFilterLcp() {
        return BlueFilterLcp;
    }

    public String getBlueFilterPxef() {
        return BlueFilterPxef;
    }

    public String getBlueFilterFexf() {
        return BlueFilterFexf;
    }

    public String getBlueFilterSsp() {
        return BlueFilterSsp;
    }

    public String getBlueFilterSap() {
        return BlueFilterSap;
    }

    public String getYellowFilterSnf() {
        return YellowFilterSnf;
    }

    public String getYellowFilterAdv() {
        return YellowFilterAdv;
    }

    public String getYellowFilterLc() {
        return YellowFilterLc;
    }

    public String getYellowFilterBsh() {
        return YellowFilterBsh;
    }

    public String getYellowFilterOut() {
        return YellowFilterOut;
    }

    public String getYellowFilterPns() {
        return YellowFilterPns;
    }

    public String getYellowFilterLcp() {
        return YellowFilterLcp;
    }

    public String getYellowFilterPxef() {
        return YellowFilterPxef;
    }

    public String getYellowFilterFexf() {
        return YellowFilterFexf;
    }

    public String getYellowFilterSsp() {
        return YellowFilterSsp;
    }

    public String getYellowFilterSap() {
        return YellowFilterSap;
    }

    public String getOneIndentDetail() {
        return OneIndentDetail;
    }

    public String getFilterAllIndentsLog() {
        return filterAllIndentsLog;
    }

    public String getEmptyIndentListLog() {
        return emptyIndentListLog;
    }

    public String getNonEmptyIndentListLog() {
        return nonEmptyIndentListLog;
    }

    public String getEmptyIndentListOnDateFilterLog() {
        return emptyIndentListOnDateFilterLog;
    }

    public String getNonEmptyIndentListOnDateFilterLog() {
        return nonEmptyIndentListOnDateFilterLog;
    }

    public String getEmptyIndentListLogOld() {
        return emptyIndentListLogOld;
    }

    public String getNonEmptyIndentListLogOld() {
        return nonEmptyIndentListLogOld;
    }

    public String getUploadFileLog() {
        return uploadFileLog;
    }

    public String getYearListLog() {
        return yearListLog;
    }

    public String getYearDetailLog() {
        return yearDetailLog;
    }

    public String getAllFilterDetailLog() {
        return allFilterDetailLog;
    }

    public String getFileSavedLog() {
        return fileSavedLog;
    }

    public String getFileReadLog() {
        return fileReadLog;
    }

    public String getLoadedResourcesLog() {
        return loadedResourcesLog;
    }

    public String getUnableToReadFileLog() {
        return unableToReadFileLog;
    }

    public String getLoadedResponseLog() {
        return loadedResponseLog;
    }

    public String getFileAlreadyExistLog() {
        return fileAlreadyExistLog;
    }

    public String getValidateExcelDataLog() {
        return validateExcelDataLog;
    }

    public String getFileDeletedLog() {
        return fileDeletedLog;
    }

    public String getValidateDateFieldLog() {
        return validateDateFieldLog;
    }

    public String getValidateNumericFieldLog() {
        return validateNumericFieldLog;
    }

    public String getValidateDoubleFieldLog() {
        return validateDoubleFieldLog;
    }

    public String getValidateDoubleParsingLog() {
        return validateDoubleParsingLog;
    }

    public String getLastRevisionIndentLog() {
        return lastRevisionIndentLog;
    }

    public String getInsertedIndentLog() {
        return insertedIndentLog;
    }

    public String getEmptyIndentDetailLog() {
        return emptyIndentDetailLog;
    }

    public String getNonEmptyIndentDetailLog() {
        return nonEmptyIndentDetailLog;
    }

    public String getEmptyIndentSubDetail() {
        return emptyIndentSubDetail;
    }

    public String getIndentSubDetailLoaded() {
        return indentSubDetailLoaded;
    }

    public String getUpdatePIDataLog() {
        return updatePIDataLog;
    }

    public String getEmptyIndentInvoiceDetail() {
        return emptyIndentInvoiceDetail;
    }

    public String getIndentInvoiceDetailLoaded() {
        return indentInvoiceDetailLoaded;
    }

    public String getEmptyIndentPaymentDetail() {
        return emptyIndentPaymentDetail;
    }

    public String getIndentPaymentDetailLoaded() {
        return indentPaymentDetailLoaded;
    }

    public String getEmptySumOfPayment() {
        return emptySumOfPayment;
    }

    public String getSumOfPaymentLoaded() {
        return sumOfPaymentLoaded;
    }

    public String getUpdateIIPODataLog() {
        return updateIIPODataLog;
    }

    public String getUpdateOCDataLog() {
        return updateOCDataLog;
    }

    public String getUpdateEXFDataLog() {
        return updateEXFDataLog;
    }

    public String getUpdatePMTDataLog() {
        return updatePMTDataLog;
    }

    public String getUpdateLCDataLog() {
        return updateLCDataLog;
    }

    public String getUpdateCOMDataLog() {
        return updateCOMDataLog;
    }

    public String getUpdateSHIPINVDataLog() {
        return updateSHIPINVDataLog;
    }

    public String getValidateNextCheckLog() {
        return validateNextCheckLog;
    }

    public String getUpdateNextActionLog() {
        return updateNextActionLog;
    }

    public String getNewIndentCreationLog() {
        return newIndentCreationLog;
    }

    public String getInsertNewIndentDetailLog() {
        return insertNewIndentDetailLog;
    }

    public String getUpdateIndentDetailLog() {
        return updateIndentDetailLog;
    }

    public String getUpdateNextActionWithoutDateLog() {
        return updateNextActionWithoutDateLog;
    }

    public String getNextActionDataLog() {
        return nextActionDataLog;
    }

    public String getRevisedNextActionLog() {
        return revisedNextActionLog;
    }

    public String getIndentDetailsLog() {
        return indentDetailsLog;
    }

    public String getIndentLog() {
        return indentLog;
    }

    public String getAllIndentLog() {
        return allIndentLog;
    }

    public String getEmptyIndentSubDetailLog() {
        return emptyIndentSubDetailLog;
    }

    public String getLoadedIndentSubDetailLog() {
        return loadedIndentSubDetailLog;
    }

    public String getEmptyIndentInvoiceLog() {
        return emptyIndentInvoiceLog;
    }

    public String getIndentInvoiceDetailLog() {
        return IndentInvoiceDetailLog;
    }

    public String getEmptyIndentPaymentLog() {
        return emptyIndentPaymentLog;
    }

    public String getIndentPaymentLog() {
        return indentPaymentLog;
    }

    public String getUserListLog() {
        return userListLog;
    }

    public String getUserCreatedLog() {
        return userCreatedLog;
    }

    public String getUserUpdatedLog() {
        return userUpdatedLog;
    }

    public String getUserNotExist() {
        return userNotExist;
    }

    public String getUserDeletedLog() {
        return userDeletedLog;
    }

    public String getNumberOfUserLog() {
        return numberOfUserLog;
    }

    public String getUserDetailLog() {
        return userDetailLog;
    }

    public String getDepartmentDetailLog() {
        return departmentDetailLog;
    }

    public String getUserAlreadyExistLog() {
        return userAlreadyExistLog;
    }

    public void setLoginSuccessfull(String loginSuccessfull) {
        this.loginSuccessfull = loginSuccessfull;
    }

    public void setUserEmailNotFound(String userEmailNotFound) {
        this.userEmailNotFound = userEmailNotFound;
    }

    public void setUserEmailLoaded(String userEmailLoaded) {
        this.userEmailLoaded = userEmailLoaded;
    }

    public void setBlueSignalCount(String blueSignalCount) {
        BlueSignalCount = blueSignalCount;
    }

    public void setYellowSignalCount(String yellowSignalCount) {
        YellowSignalCount = yellowSignalCount;
    }

    public void setBlueFilterSnf(String blueFilterSnf) {
        BlueFilterSnf = blueFilterSnf;
    }

    public void setBlueFilterAdv(String blueFilterAdv) {
        BlueFilterAdv = blueFilterAdv;
    }

    public void setBlueFilterLc(String blueFilterLc) {
        BlueFilterLc = blueFilterLc;
    }

    public void setBlueFilterBsh(String blueFilterBsh) {
        BlueFilterBsh = blueFilterBsh;
    }

    public void setBlueFilterOut(String blueFilterOut) {
        BlueFilterOut = blueFilterOut;
    }

    public void setBlueFilterPns(String blueFilterPns) {
        BlueFilterPns = blueFilterPns;
    }

    public void setBlueFilterLcp(String blueFilterLcp) {
        BlueFilterLcp = blueFilterLcp;
    }

    public void setBlueFilterPxef(String blueFilterPxef) {
        BlueFilterPxef = blueFilterPxef;
    }

    public void setBlueFilterFexf(String blueFilterFexf) {
        BlueFilterFexf = blueFilterFexf;
    }

    public void setBlueFilterSsp(String blueFilterSsp) {
        BlueFilterSsp = blueFilterSsp;
    }

    public void setBlueFilterSap(String blueFilterSap) {
        BlueFilterSap = blueFilterSap;
    }

    public void setYellowFilterSnf(String yellowFilterSnf) {
        YellowFilterSnf = yellowFilterSnf;
    }

    public void setYellowFilterAdv(String yellowFilterAdv) {
        YellowFilterAdv = yellowFilterAdv;
    }

    public void setYellowFilterLc(String yellowFilterLc) {
        YellowFilterLc = yellowFilterLc;
    }

    public void setYellowFilterBsh(String yellowFilterBsh) {
        YellowFilterBsh = yellowFilterBsh;
    }

    public void setYellowFilterOut(String yellowFilterOut) {
        YellowFilterOut = yellowFilterOut;
    }

    public void setYellowFilterPns(String yellowFilterPns) {
        YellowFilterPns = yellowFilterPns;
    }

    public void setYellowFilterLcp(String yellowFilterLcp) {
        YellowFilterLcp = yellowFilterLcp;
    }

    public void setYellowFilterPxef(String yellowFilterPxef) {
        YellowFilterPxef = yellowFilterPxef;
    }

    public void setYellowFilterFexf(String yellowFilterFexf) {
        YellowFilterFexf = yellowFilterFexf;
    }

    public void setYellowFilterSsp(String yellowFilterSsp) {
        YellowFilterSsp = yellowFilterSsp;
    }

    public void setYellowFilterSap(String yellowFilterSap) {
        YellowFilterSap = yellowFilterSap;
    }

    public void setOneIndentDetail(String oneIndentDetail) {
        OneIndentDetail = oneIndentDetail;
    }

    public void setFilterAllIndentsLog(String filterAllIndentsLog) {
        this.filterAllIndentsLog = filterAllIndentsLog;
    }

    public void setEmptyIndentListLog(String emptyIndentListLog) {
        this.emptyIndentListLog = emptyIndentListLog;
    }

    public void setNonEmptyIndentListLog(String nonEmptyIndentListLog) {
        this.nonEmptyIndentListLog = nonEmptyIndentListLog;
    }

    public void setEmptyIndentListOnDateFilterLog(String emptyIndentListOnDateFilterLog) {
        this.emptyIndentListOnDateFilterLog = emptyIndentListOnDateFilterLog;
    }

    public void setNonEmptyIndentListOnDateFilterLog(String nonEmptyIndentListOnDateFilterLog) {
        this.nonEmptyIndentListOnDateFilterLog = nonEmptyIndentListOnDateFilterLog;
    }

    public void setEmptyIndentListLogOld(String emptyIndentListLogOld) {
        this.emptyIndentListLogOld = emptyIndentListLogOld;
    }

    public void setNonEmptyIndentListLogOld(String nonEmptyIndentListLogOld) {
        this.nonEmptyIndentListLogOld = nonEmptyIndentListLogOld;
    }

    public void setUploadFileLog(String uploadFileLog) {
        this.uploadFileLog = uploadFileLog;
    }

    public void setYearListLog(String yearListLog) {
        this.yearListLog = yearListLog;
    }

    public void setYearDetailLog(String yearDetailLog) {
        this.yearDetailLog = yearDetailLog;
    }

    public void setAllFilterDetailLog(String allFilterDetailLog) {
        this.allFilterDetailLog = allFilterDetailLog;
    }

    public void setFileSavedLog(String fileSavedLog) {
        this.fileSavedLog = fileSavedLog;
    }

    public void setFileReadLog(String fileReadLog) {
        this.fileReadLog = fileReadLog;
    }

    public void setLoadedResourcesLog(String loadedResourcesLog) {
        this.loadedResourcesLog = loadedResourcesLog;
    }

    public void setUnableToReadFileLog(String unableToReadFileLog) {
        this.unableToReadFileLog = unableToReadFileLog;
    }

    public void setLoadedResponseLog(String loadedResponseLog) {
        this.loadedResponseLog = loadedResponseLog;
    }

    public void setFileAlreadyExistLog(String fileAlreadyExistLog) {
        this.fileAlreadyExistLog = fileAlreadyExistLog;
    }

    public void setValidateExcelDataLog(String validateExcelDataLog) {
        this.validateExcelDataLog = validateExcelDataLog;
    }

    public void setFileDeletedLog(String fileDeletedLog) {
        this.fileDeletedLog = fileDeletedLog;
    }

    public void setValidateDateFieldLog(String validateDateFieldLog) {
        this.validateDateFieldLog = validateDateFieldLog;
    }

    public void setValidateNumericFieldLog(String validateNumericFieldLog) {
        this.validateNumericFieldLog = validateNumericFieldLog;
    }

    public void setValidateDoubleFieldLog(String validateDoubleFieldLog) {
        this.validateDoubleFieldLog = validateDoubleFieldLog;
    }

    public void setValidateDoubleParsingLog(String validateDoubleParsingLog) {
        this.validateDoubleParsingLog = validateDoubleParsingLog;
    }

    public void setLastRevisionIndentLog(String lastRevisionIndentLog) {
        this.lastRevisionIndentLog = lastRevisionIndentLog;
    }

    public void setInsertedIndentLog(String insertedIndentLog) {
        this.insertedIndentLog = insertedIndentLog;
    }

    public void setEmptyIndentDetailLog(String emptyIndentDetailLog) {
        this.emptyIndentDetailLog = emptyIndentDetailLog;
    }

    public void setNonEmptyIndentDetailLog(String nonEmptyIndentDetailLog) {
        this.nonEmptyIndentDetailLog = nonEmptyIndentDetailLog;
    }

    public void setEmptyIndentSubDetail(String emptyIndentSubDetail) {
        this.emptyIndentSubDetail = emptyIndentSubDetail;
    }

    public void setIndentSubDetailLoaded(String indentSubDetailLoaded) {
        this.indentSubDetailLoaded = indentSubDetailLoaded;
    }

    public void setUpdatePIDataLog(String updatePIDataLog) {
        this.updatePIDataLog = updatePIDataLog;
    }

    public void setEmptyIndentInvoiceDetail(String emptyIndentInvoiceDetail) {
        this.emptyIndentInvoiceDetail = emptyIndentInvoiceDetail;
    }

    public void setIndentInvoiceDetailLoaded(String indentInvoiceDetailLoaded) {
        this.indentInvoiceDetailLoaded = indentInvoiceDetailLoaded;
    }

    public void setEmptyIndentPaymentDetail(String emptyIndentPaymentDetail) {
        this.emptyIndentPaymentDetail = emptyIndentPaymentDetail;
    }

    public void setIndentPaymentDetailLoaded(String indentPaymentDetailLoaded) {
        this.indentPaymentDetailLoaded = indentPaymentDetailLoaded;
    }

    public void setEmptySumOfPayment(String emptySumOfPayment) {
        this.emptySumOfPayment = emptySumOfPayment;
    }

    public void setSumOfPaymentLoaded(String sumOfPaymentLoaded) {
        this.sumOfPaymentLoaded = sumOfPaymentLoaded;
    }

    public void setUpdateIIPODataLog(String updateIIPODataLog) {
        this.updateIIPODataLog = updateIIPODataLog;
    }

    public void setUpdateOCDataLog(String updateOCDataLog) {
        this.updateOCDataLog = updateOCDataLog;
    }

    public void setUpdateEXFDataLog(String updateEXFDataLog) {
        this.updateEXFDataLog = updateEXFDataLog;
    }

    public void setUpdatePMTDataLog(String updatePMTDataLog) {
        this.updatePMTDataLog = updatePMTDataLog;
    }

    public void setUpdateLCDataLog(String updateLCDataLog) {
        this.updateLCDataLog = updateLCDataLog;
    }

    public void setUpdateCOMDataLog(String updateCOMDataLog) {
        this.updateCOMDataLog = updateCOMDataLog;
    }

    public void setUpdateSHIPINVDataLog(String updateSHIPINVDataLog) {
        this.updateSHIPINVDataLog = updateSHIPINVDataLog;
    }

    public void setValidateNextCheckLog(String validateNextCheckLog) {
        this.validateNextCheckLog = validateNextCheckLog;
    }

    public void setUpdateNextActionLog(String updateNextActionLog) {
        this.updateNextActionLog = updateNextActionLog;
    }

    public void setNewIndentCreationLog(String newIndentCreationLog) {
        this.newIndentCreationLog = newIndentCreationLog;
    }

    public void setInsertNewIndentDetailLog(String insertNewIndentDetailLog) {
        this.insertNewIndentDetailLog = insertNewIndentDetailLog;
    }

    public void setUpdateIndentDetailLog(String updateIndentDetailLog) {
        this.updateIndentDetailLog = updateIndentDetailLog;
    }

    public void setUpdateNextActionWithoutDateLog(String updateNextActionWithoutDateLog) {
        this.updateNextActionWithoutDateLog = updateNextActionWithoutDateLog;
    }

    public void setNextActionDataLog(String nextActionDataLog) {
        this.nextActionDataLog = nextActionDataLog;
    }

    public void setRevisedNextActionLog(String revisedNextActionLog) {
        this.revisedNextActionLog = revisedNextActionLog;
    }

    public void setIndentDetailsLog(String indentDetailsLog) {
        this.indentDetailsLog = indentDetailsLog;
    }

    public void setIndentLog(String indentLog) {
        this.indentLog = indentLog;
    }

    public void setAllIndentLog(String allIndentLog) {
        this.allIndentLog = allIndentLog;
    }

    public void setEmptyIndentSubDetailLog(String emptyIndentSubDetailLog) {
        this.emptyIndentSubDetailLog = emptyIndentSubDetailLog;
    }

    public void setLoadedIndentSubDetailLog(String loadedIndentSubDetailLog) {
        this.loadedIndentSubDetailLog = loadedIndentSubDetailLog;
    }

    public void setEmptyIndentInvoiceLog(String emptyIndentInvoiceLog) {
        this.emptyIndentInvoiceLog = emptyIndentInvoiceLog;
    }

    public void setIndentInvoiceDetailLog(String indentInvoiceDetailLog) {
        IndentInvoiceDetailLog = indentInvoiceDetailLog;
    }

    public void setEmptyIndentPaymentLog(String emptyIndentPaymentLog) {
        this.emptyIndentPaymentLog = emptyIndentPaymentLog;
    }

    public void setIndentPaymentLog(String indentPaymentLog) {
        this.indentPaymentLog = indentPaymentLog;
    }

    public void setUserListLog(String userListLog) {
        this.userListLog = userListLog;
    }

    public void setUserCreatedLog(String userCreatedLog) {
        this.userCreatedLog = userCreatedLog;
    }

    public void setUserUpdatedLog(String userUpdatedLog) {
        this.userUpdatedLog = userUpdatedLog;
    }

    public void setUserNotExist(String userNotExist) {
        this.userNotExist = userNotExist;
    }

    public void setUserDeletedLog(String userDeletedLog) {
        this.userDeletedLog = userDeletedLog;
    }

    public void setNumberOfUserLog(String numberOfUserLog) {
        this.numberOfUserLog = numberOfUserLog;
    }

    public void setUserDetailLog(String userDetailLog) {
        this.userDetailLog = userDetailLog;
    }

    public void setDepartmentDetailLog(String departmentDetailLog) {
        this.departmentDetailLog = departmentDetailLog;
    }

    public void setUserAlreadyExistLog(String userAlreadyExistLog) {
        this.userAlreadyExistLog = userAlreadyExistLog;
    }

    public String getUpdatedIndentDataLog() {
        return updatedIndentDataLog;
    }

    public String getInsertedIndentDataLog() {
        return insertedIndentDataLog;
    }

    public String getDeletedIndentDataLog() {
        return deletedIndentDataLog;
    }

    public String getUpdatedIndentSheetNoLog() {
        return updatedIndentSheetNoLog;
    }

    public String getFormattedIndentSheetNoLog() {
        return formattedIndentSheetNoLog;
    }

    public String getGetCountOfIndentLog() {
        return getCountOfIndentLog;
    }

    public String getFileExistLog() {
        return fileExistLog;
    }

    public String getFileNotExistLog() {
        return fileNotExistLog;
    }

    public void setUpdatedIndentDataLog(String updatedIndentDataLog) {
        this.updatedIndentDataLog = updatedIndentDataLog;
    }

    public void setInsertedIndentDataLog(String insertedIndentDataLog) {
        this.insertedIndentDataLog = insertedIndentDataLog;
    }

    public void setDeletedIndentDataLog(String deletedIndentDataLog) {
        this.deletedIndentDataLog = deletedIndentDataLog;
    }

    public void setUpdatedIndentSheetNoLog(String updatedIndentSheetNoLog) {
        this.updatedIndentSheetNoLog = updatedIndentSheetNoLog;
    }

    public void setFormattedIndentSheetNoLog(String formattedIndentSheetNoLog) {
        this.formattedIndentSheetNoLog = formattedIndentSheetNoLog;
    }

    public void setGetCountOfIndentLog(String getCountOfIndentLog) {
        this.getCountOfIndentLog = getCountOfIndentLog;
    }

    public void setFileExistLog(String fileExistLog) {
        this.fileExistLog = fileExistLog;
    }

    public void setFileNotExistLog(String fileNotExistLog) {
        this.fileNotExistLog = fileNotExistLog;
    }

    public String getEmptyNextActionLog() {
        return emptyNextActionLog;
    }

    public String getNonEmptyNextActionLog() {
        return nonEmptyNextActionLog;
    }

    public String getEmptyAllRevisedNextDate() {
        return emptyAllRevisedNextDate;
    }

    public String getNonEmptyAllRevisedNextData() {
        return nonEmptyAllRevisedNextData;
    }

    public void setEmptyNextActionLog(String emptyNextActionLog) {
        this.emptyNextActionLog = emptyNextActionLog;
    }

    public void setNonEmptyNextActionLog(String nonEmptyNextActionLog) {
        this.nonEmptyNextActionLog = nonEmptyNextActionLog;
    }

    public void setEmptyAllRevisedNextDate(String emptyAllRevisedNextDate) {
        this.emptyAllRevisedNextDate = emptyAllRevisedNextDate;
    }

    public void setNonEmptyAllRevisedNextData(String nonEmptyAllRevisedNextData) {
        this.nonEmptyAllRevisedNextData = nonEmptyAllRevisedNextData;
    }

    public String getSentMailLog() {
        return sentMailLog;
    }

    public void setSentMailLog(String sentMailLog) {
        this.sentMailLog = sentMailLog;
    }

    public String getEmptyYearListLog() {
        return emptyYearListLog;
    }

    public String getEmptyYearDetailLog() {
        return emptyYearDetailLog;
    }

    public void setEmptyYearListLog(String emptyYearListLog) {
        this.emptyYearListLog = emptyYearListLog;
    }

    public void setEmptyYearDetailLog(String emptyYearDetailLog) {
        this.emptyYearDetailLog = emptyYearDetailLog;
    }

    public String getEmptyIndentListOnConFilterLog() {
        return emptyIndentListOnConFilterLog;
    }

    public String getNonEmptyIndentListOnConFilterLog() {
        return nonEmptyIndentListOnConFilterLog;
    }

    public void setEmptyIndentListOnConFilterLog(String emptyIndentListOnConFilterLog) {
        this.emptyIndentListOnConFilterLog = emptyIndentListOnConFilterLog;
    }

    public void setNonEmptyIndentListOnConFilterLog(String nonEmptyIndentListOnConFilterLog) {
        this.nonEmptyIndentListOnConFilterLog = nonEmptyIndentListOnConFilterLog;
    }

    public String getEmptyPaymentListLog() {
        return emptyPaymentListLog;
    }

    public String getNonEmptyPaymentListLog() {
        return nonEmptyPaymentListLog;
    }

    public String getEmptyInvoiceListLog() {
        return emptyInvoiceListLog;
    }

    public String getNonEmptyInvoiceListLog() {
        return nonEmptyInvoiceListLog;
    }

    public String getEmptyPaymentListLogOnDateFilter() {
        return emptyPaymentListLogOnDateFilter;
    }

    public String getNonEmptyPaymentListLogOnDateFilter() {
        return nonEmptyPaymentListLogOnDateFilter;
    }

    public String getEmptyInvoiceListLogOnDateFilter() {
        return emptyInvoiceListLogOnDateFilter;
    }

    public String getNonEmptyInvoiceListLogOnDateFilter() {
        return nonEmptyInvoiceListLogOnDateFilter;
    }

    public String getEmptyPaymentListLogOnConFilter() {
        return emptyPaymentListLogOnConFilter;
    }

    public String getNonEmptyPaymentListLogOnConFilter() {
        return nonEmptyPaymentListLogOnConFilter;
    }

    public String getEmptyInvoiceListLogOnConFilter() {
        return emptyInvoiceListLogOnConFilter;
    }

    public String getNonEmptyInvoiceListLogOnConFilter() {
        return nonEmptyInvoiceListLogOnConFilter;
    }

    public void setEmptyPaymentListLog(String emptyPaymentListLog) {
        this.emptyPaymentListLog = emptyPaymentListLog;
    }

    public void setNonEmptyPaymentListLog(String nonEmptyPaymentListLog) {
        this.nonEmptyPaymentListLog = nonEmptyPaymentListLog;
    }

    public void setEmptyInvoiceListLog(String emptyInvoiceListLog) {
        this.emptyInvoiceListLog = emptyInvoiceListLog;
    }

    public void setNonEmptyInvoiceListLog(String nonEmptyInvoiceListLog) {
        this.nonEmptyInvoiceListLog = nonEmptyInvoiceListLog;
    }

    public void setEmptyPaymentListLogOnDateFilter(String emptyPaymentListLogOnDateFilter) {
        this.emptyPaymentListLogOnDateFilter = emptyPaymentListLogOnDateFilter;
    }

    public void setNonEmptyPaymentListLogOnDateFilter(String nonEmptyPaymentListLogOnDateFilter) {
        this.nonEmptyPaymentListLogOnDateFilter = nonEmptyPaymentListLogOnDateFilter;
    }

    public void setEmptyInvoiceListLogOnDateFilter(String emptyInvoiceListLogOnDateFilter) {
        this.emptyInvoiceListLogOnDateFilter = emptyInvoiceListLogOnDateFilter;
    }

    public void setNonEmptyInvoiceListLogOnDateFilter(String nonEmptyInvoiceListLogOnDateFilter) {
        this.nonEmptyInvoiceListLogOnDateFilter = nonEmptyInvoiceListLogOnDateFilter;
    }

    public void setEmptyPaymentListLogOnConFilter(String emptyPaymentListLogOnConFilter) {
        this.emptyPaymentListLogOnConFilter = emptyPaymentListLogOnConFilter;
    }

    public void setNonEmptyPaymentListLogOnConFilter(String nonEmptyPaymentListLogOnConFilter) {
        this.nonEmptyPaymentListLogOnConFilter = nonEmptyPaymentListLogOnConFilter;
    }

    public void setEmptyInvoiceListLogOnConFilter(String emptyInvoiceListLogOnConFilter) {
        this.emptyInvoiceListLogOnConFilter = emptyInvoiceListLogOnConFilter;
    }

    public void setNonEmptyInvoiceListLogOnConFilter(String nonEmptyInvoiceListLogOnConFilter) {
        this.nonEmptyInvoiceListLogOnConFilter = nonEmptyInvoiceListLogOnConFilter;
    }

    public String getLogRevisedPaymentData() {
        return logRevisedPaymentData;
    }

    public void setLogRevisedPaymentData(String logRevisedPaymentData) {
        this.logRevisedPaymentData = logRevisedPaymentData;
    }

    public String getLogRevisedInvoiceData() {
        return logRevisedInvoiceData;
    }

    public void setLogRevisedInvoiceData(String logRevisedInvoiceData) {
        this.logRevisedInvoiceData = logRevisedInvoiceData;
    }

    public String getLogRollBackPaymentData() {
        return logRollBackPaymentData;
    }

    public String getLogRollBackInvoiceData() {
        return logRollBackInvoiceData;
    }

    public void setLogRollBackPaymentData(String logRollBackPaymentData) {
        this.logRollBackPaymentData = logRollBackPaymentData;
    }

    public void setLogRollBackInvoiceData(String logRollBackInvoiceData) {
        this.logRollBackInvoiceData = logRollBackInvoiceData;
    }

    public String getOpenIndentLog() {
        return OpenIndentLog;
    }

    public String getClosedIndentLog() {
        return ClosedIndentLog;
    }

    public String getCancelledIndentLog() {
        return CancelledIndentLog;
    }

    public void setOpenIndentLog(String openIndentLog) {
        OpenIndentLog = openIndentLog;
    }

    public void setClosedIndentLog(String closedIndentLog) {
        ClosedIndentLog = closedIndentLog;
    }

    public void setCancelledIndentLog(String cancelledIndentLog) {
        CancelledIndentLog = cancelledIndentLog;
    }


    public String getLogForCheckPoNumberExist() {
        return LogForCheckPoNumberExist;
    }

    public String getLogForIndentListUsingPoNum() {
        return LogForIndentListUsingPoNum;
    }

    public String getLogForPmtListUsingPoNum() {
        return LogForPmtListUsingPoNum;
    }

    public String getLogForMasterPmtListUsingPoNum() {
        return LogForMasterPmtListUsingPoNum;
    }
}
