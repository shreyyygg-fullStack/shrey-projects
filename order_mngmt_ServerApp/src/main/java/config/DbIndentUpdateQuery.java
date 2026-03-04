package config;

public class DbIndentUpdateQuery {

    String AllIndentList = "select * from indentmaster.master_data order by indent_sheet_num desc";
    String OpenIndentList = "SELECT * from indentmaster.master_data where ( pmt_sts <> 'P-9' OR del_sts <> 'D-9') and (pmt_sts <> 'P-3' OR del_sts <> 'D-4') order by indent_sheet_num desc";
    String ClosedIndentList = "SELECT * from indentmaster.master_data where pmt_sts = 'P-3' AND del_sts = 'D-4' order by indent_sheet_num desc";
    String CancelledIndentList = "SELECT * from indentmaster.master_data where pmt_sts = 'P-9' AND del_sts = 'D-9' order by indent_sheet_num desc";
    String AllIndentListASC = "select * from indentmaster.master_data";
    String updatePIData = "update master_data set pi_no=?, pi_date=? WHERE indent_sheet_num =?";
    String updateIIPOData = "update master_data set iipo_no=?, iipo_date=? WHERE indent_sheet_num = ?";
    String updateIIOCData = "update master_sub_data set job_no=?, prd_ord_date=?, oc_no=?, oc_date=? WHERE indent_sheet_num = ?";
    String updateOCData = "update master_data set ij_project_num=?, oc_date=? WHERE indent_sheet_num = ?";
    String updateIIEXFData = "update master_sub_data set del_sts=?, exf1_date=?, exf1_sts=?, exf1_annc_date=?, exf2_date=?, exf2_sts=?, exf2_annc_date=?, exf3_date=?, exf3_sts=?, exf3_annc_date=? WHERE indent_sheet_num = ?";
    String updateBGData = "update master_sub_data set abg_request_anct_date=?, abg_issuance_date=?, abg_final_submission_draft_date=?, abg_final_submission_bg_date=?, pbg_request_anct_date=?, pbg_issuance_date=?, pbg_final_submission_draft_date=?, pbg_final_submission_bg_date=? WHERE indent_sheet_num = ?";
    String updateINVData = "update indent_invoice_data set inv_request_anct_date=?, inv_issuance_date=?, inv_no=?, ewb_no=?, ewb_issuance_date=?, transportation_method=?, dispatch_date=?, dispatch_from_indent=?, dispatch_from_origin=?, dispatch_to_indent=?, dispatch_to_destination=?, machine_sn=?, invoice_doc = ?, inv_doc_name = ?, ewb_doc = ?, ewb_doc_name = ?,updated_by = ?  WHERE id=?";
    String getIndentINVNo = "SELECT inv_no FROM indentmaster.indent_invoice_data WHERE indent_sheet_num = ? AND id <> ? ";
    String getINVNo = "select inv_no from indentmaster.indent_invoice_data where indent_sheet_num = ? and inv_no = ?";
    String insertOtherDocs = "INSERT INTO indentmaster.indent_documents (indent_doc_id, indent_sheet_num, document, doc_name, category, updated_by) VALUES (?, ?, ?, ?, ?, ?)";
    String insertImages = "INSERT INTO indentmaster.indent_images (indent_img_id, indent_sheet_num, image, image_name, updated_by) VALUES (?, ?, ?, ?, ?)";
    String insertINVData = "INSERT INTO `indentmaster`.`indent_invoice_data`(`id`,`invoice_id`, `indent_sheet_num`,`inv_request_anct_date`,`inv_issuance_date`,`inv_no`,`ewb_no`,`ewb_issuance_date`,`transportation_method`,`dispatch_date`,`dispatch_from_indent`,`dispatch_from_origin`,`dispatch_to_indent`,`dispatch_to_destination`,`machine_sn`, `invoice_doc`, `inv_doc_name`, `ewb_doc`, `ewb_doc_name`, `updated_by`)  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    String updateEXFData = "update master_data set exf1=?, exf1_sts=?, exf_ij_accment1=?, exf2=?, exf2_sts=?, exf_ij_accment2=?, exf3=?, exf3_sts=?, exf_ij_accment3=?, del_sts=? WHERE indent_sheet_num = ?";
    String updateLCData = "update master_data set lc_chk_date_by_ij=?, lc_open_date=?, lc_last_revision_date=?, latest_shipment_date=?, lc_expiry_date=? WHERE indent_sheet_num = ?";
    String updateCOMData = "update master_data set com_month=? WHERE indent_sheet_num = ?";
    String updateSHPorINVData = "update master_data set invoice_no1=?, invoice_date1=?, mode1=?, from1=?, vessel1=?, awb_bl_no1=?, etd1=?, eta1=?, "
            + "invoice_no2=?, invoice_date2=?, mode2=?, from2=?, vessel2=?, awb_bl_no2=?, etd2=?, eta2=?, "
            + "invoice_no3=?, invoice_date3=?, mode3=?, from3=?,  vessel3=?, awb_bl_no3=?, etd3=?, eta3=?, "
            + "del_sts=?  WHERE indent_sheet_num = ?";

    String checkNextDate = "select next_check from master_data WHERE indent_sheet_num = ? and next_check =?";
    String updateNextActionData = "update master_data set checked_on=?, next_check=?, for_info=?, updated_by=? WHERE indent_sheet_num = ?";
    String getInformationFromDB = "select next_check, indent_sheet_num, sos_summary, user_acnt_name, for_info from master_data WHERE indent_sheet_num = ?";
    String indentActionData = "select next_action_date from indent_number_action where indent_sheet_number=? and next_action_date =? ";
    String insertIndentAction = "INSERT IGNORE INTO indent_number_action SET indent_sheet_number=?, updated_by=?";
    String checkIfIndentExist = "Select updated_by from indent_number_action where indent_sheet_number = ?";
    String updateNextActionUser = "UPDATE indentmaster.indent_number_action set updated_by =? where indent_sheet_number =? ";
    String updateIndentWithoutNextDate = "UPDATE indentmaster.master_data set checked_on=?, for_info=? where indent_sheet_num =?";
    String invewbIndentData = "SELECT * FROM indentmaster.indent_invoice_data where indent_sheet_num = ? order by inv_issuance_date DESC";
    String allPaymentData = "SELECT * FROM indentmaster.indent_payment_data WHERE indent_sheet_num=? order by payment_date";
    String deleteInvoiceData = "delete from indent_invoice_data WHERE indent_sheet_num = ? and id = ?";
    String getPrevPmtSts = "select pmt_sts from indentmaster.master_data where indent_sheet_num  = ?";
    String updatePMTsts = "update indentmaster.master_data "
            + "set pmt_sts = ? "
            + "where indent_sheet_num =?";
    String updatePmtStsUsingPoNumber = "update indentmaster.master_data "
            + "set pmt_sts = ? "
            + "where customer_po_num =?";
    String listOfIndentFromInvoiceNo = "Select indent_sheet_num, sos_summary, contract_acnt_name FROM indentmaster.master_data where indent_sheet_num in \r\n"
            + "(select indent_sheet_num from indentmaster.indent_invoice_data where inv_no = ?)";
    String IndentFromInvoiceNo = "select indent_sheet_num from indentmaster.indent_invoice_data where inv_no = ? and indent_sheet_num = ?";
    String queryUpdateDelStatusOfMaster = "update indentmaster.master_data set del_sts = ? WHERE indent_sheet_num = ?";
    String queryCreatePaymentData = "INSERT INTO indentmaster.indent_payment_data (indent_sheet_num, payment_type, payment_date, payment_amount) value (?, ?, ?, ?)";
    String queryUpdatePaymentData = "UPDATE indentmaster.indent_payment_data SET payment_type = ?, payment_date = ?, payment_amount = ? WHERE id = ?";
    String queryDeletePaymentData = "DELETE FROM indentmaster.indent_payment_data WHERE id = ?";
    String queryGetInvoiceFilterData = "SELECT master.indent_sheet_num, master.invoice_no1, master.invoice_no2, master.invoice_no3, inv.inv_no from master_data as master left JOIN indent_invoice_data as inv " +
            "on master.indent_sheet_num = inv.indent_sheet_num ";
    String queryPaymentCancel = "UPDATE indentmaster.master_data SET pmt_sts = 'P-9' where indent_sheet_num = ? ";

    //email setting
    String addEmail = "INSERT into indentmaster.users_emails (email) VALUES (?)";
    String deleteEmail = "DELETE FROM indentmaster.users_emails WHERE id_num = ?";
    String updateEmail = "UPDATE indentmaster.users_emails set email = ? where id_num = ? ";

    //IIEXF mail setting
    String saveEmailForm = " update indentmaster.email_data set subject= ?, body = ? , email_flag = ? where id = ?";
    String setDefaultCC = "update indentmaster.users_emails set cc = '0'";
    String setCC = "update indentmaster.users_emails set cc = '1' where email = ?";
    String setDefaultEmailforIIEXF = "update indentmaster.users_emails set setting_1 = '0'";
    String setIIEXFemail = "update indentmaster.users_emails set setting_1 = '1' where email = ?";

    String setDefaultCC2 = "update indentmaster.users_emails set cc_2 = '0'";
    String setCC2 = "update indentmaster.users_emails set cc_2 = '1' where email = ?";
    String setDefaultEmail2 = "update indentmaster.users_emails set setting_2 = '0'";
    String seEmail2 = "update indentmaster.users_emails set setting_2 = '1' where email = ?";


    String insertEmailLog = "insert into indentmaster.email_logs (INDENT_NO , EXF1_DATE , SENT_FLAG) values (? , ? , '1')";

    //Display Board , Pagination Setting and Daily Planning
    String SETINDENTPOSITION = "update iboard.db_master set priority_position = ? , remark1 = ?, region = ?, linked_indents = ?,dispatch_location = ?,frieght_trms = ?   WHERE indent_sheet_num = ? ";
    String SETDEFAULTPOSITION = "update iboard.db_master set priority_position = '999' WHERE indent_sheet_num = ? ";
    String INDENTDETAIL = "SELECT * FROM iboard.db_master WHERE indent_sheet_num = ?";
    String INDENTNUM = "SELECT indent_sheet_num FROM iboard.db_master WHERE priority_position = ?";
    String SetIndentPriority = "update iboard.db_master set remark1 = ? , priority_position = ? , region = ?, linked_indents = ?,dispatch_location = ?,frieght_trms = ?   WHERE indent_sheet_num = ? ";
    String SetUPFlag = "update iboard.update_event set UPFLAG = UPFLAG + 1 WHERE ID = '1'";
    String UpdateIndentPosition = "update iboard.db_master set priority_position = ? WHERE indent_sheet_num = ?";
    String AllPriorityIndentList = "SELECT \n" +
            "    a.*, \n" +
            "    b.indent_issue_date \n" +
            "FROM \n" +
            "    iboard.db_master a\n" +
            "LEFT JOIN \n" +
            "    indentmaster.master_data b ON a.indent_sheet_num = b.indent_sheet_num order by priority_position, indent_sheet_num desc;";

    String UpdatePriorityType = "UPDATE iboard.db_master\n" +
            "SET priority_type = CASE\n" +
            "    WHEN (DATEDIFF(CURDATE(), exf1) > 0 OR DATEDIFF(CURDATE(), prod_date) > 0) THEN 1\n" +
            "    ELSE 2\n" +
            "END\n" +
            "WHERE del_sts = 'D-1';\n";

    //FOR FUTURE USE
    //    String UpdateRemarkFlag = "update iboard.update_event set REMARKFLAG = '1' WHERE ID = '1'";
    //    String GETREMARK = "SELECT remark1 FROM iboard.db_master WHERE indent_sheet_num = ?";

    String PaginationDetails = "SELECT * FROM iboard.master_pagination;";
    String RegionList = "SELECT * FROM iboard.region_list;";
    String UpdatePaginationDetails = "update iboard.master_pagination set PSTATUS = ? , PJUMPSTATUS = ? , PJUMPNUMBER = ? , PTIMER = ? , PFLAG = '1' WHERE ID = '1' ";
    String SetDefaultJumpPageNum = "update iboard.master_pagination set PJUMPNUMBER = '1' WHERE ID = '1' ";
    String PriorityIndentListByDate = "SELECT \n" +
            "    a.*, \n" +
            "    b.indent_issue_date \n" +
            "FROM \n" +
            "    iboard.db_master a\n" +
            "LEFT JOIN \n" +
            "    indentmaster.master_data b ON a.indent_sheet_num = b.indent_sheet_num WHERE  b.indent_issue_date between ? and ? order by priority_position, indent_sheet_num desc;";
    String insertUpdateIboardAudits = "INSERT INTO `iboard`.`iboard_audit`( `INDENT_NO`,`USER_ID`,`USER_NAME`,`REMARKS`) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE USER_ID = ? , USER_NAME = ? , REMARKS = ? ";
    String DeleteExpireAudits = "delete from iboard.iboard_audit where CREATE_TIME < (SELECT DATE_SUB(now(), INTERVAL 30 DAY));";

    ///other files queries
    String categoryList = "select * from indentmaster.indent_doc_category";
    String AllIndentOtherFileList = "select * from indentmaster.indent_documents where indent_sheet_num = ?";
    String AllIndentImagesData = "select * from indentmaster.indent_images where indent_sheet_num = ?";
    String InvEwbDocs = "select id,invoice_doc,inv_doc_name,ewb_doc,ewb_doc_name from indentmaster.indent_invoice_data where indent_sheet_num = ?";
    String indentDelStS = "SELECT del_sts FROM indentmaster.master_data where indent_sheet_num =?";
    String deleteImageFile = "delete from indentmaster.indent_images WHERE indent_img_id = ?";
    String deleteOtherFile = "delete from indentmaster.indent_documents WHERE indent_doc_id = ?";
    String updateEmailSetting2 = "UPDATE indentmaster.email_data\n" +
            "SET subject = ?,body = ?  \n" +
            "WHERE id = 2 ";
    String updateEmailSentSequence = "UPDATE indentmaster.indent_invoice_data\n" +
            "SET email_sent = email_sent + 1\n" +
            "WHERE id = ? ";

    String getInvRow = "select * from indentmaster.indent_invoice_data where id = ? ";


    String serviceMasterIndents = "SELECT indentmaster.service_master.*,\n" +
            "                      DATEDIFF(CURDATE(), updated_on) AS day_diff,\n" +
            "                      iuserpayment.pmt_sts AS payment_sts,\n" +
            "        iuserdelevery.del_sts AS delivery_sts \n" +
            "                        FROM indentmaster.service_master service_master\n" +
            "                      LEFT JOIN iboard.iuserpayment iuserpayment ON service_master.pmt_sts = iuserpayment.id \n" +
            "                 LEFT JOIN iboard.iuserdelevery iuserdelevery ON service_master.del_sts = iuserdelevery.id order by indent_sheet_num desc";

    String SetServiceIndentSts = "update indentmaster.service_master set shipping_region = ?,service_remarks = ? ,service_status_flag = ? ,updated_on = NOW() , updated_by = ? WHERE indent_sheet_num = ? ";

    String updateIndentsInProd = "UPDATE indentmaster.service_master " +
            "SET   service_status_flag = " +
            "CASE " +
            "WHEN service_status_flag = 0 OR service_status_flag = 1 " +
            "THEN 1 ELSE service_status_flag " +
            "END " +
            "WHERE exf1 IS NOT NULL OR exf2 IS NOT NULL OR exf3 IS NOT NULL OR prod1_date IS NOT NULL OR prod2_date IS NOT NULL OR " +
            "prod3_date IS NOT NULL OR del_sts = 'D-1' OR del_sts = 'D-2' OR del_sts = 'D-3'";

    String updateIndentsInService = "UPDATE indentmaster.service_master " +
            "SET  service_status_flag = " +
            "CASE " +
            "WHEN service_status_flag = 0 OR service_status_flag = 1 " +
            "THEN 1 ELSE service_status_flag " +
            "END " +
            "WHERE (exf1 IS NOT NULL AND (exf1_sts = 'Fixed' OR exf1_sts = 'Partially Fixed')) OR (exf2 IS NOT NULL AND (exf2_sts = 'Fixed' OR exf2_sts = 'Partially Fixed')) OR  " +
            "(exf3 IS NOT NULL AND (exf3_sts = 'Fixed' OR exf3_sts = 'Partially Fixed')) OR " +
            "(prod1_date IS NOT NULL AND (prod1_sts = 'Fixed' OR prod1_sts = 'Partially Fixed')) OR (prod2_date IS NOT NULL AND (prod2_sts = 'Fixed' OR prod2_sts = 'Partially Fixed'))" +
            " OR (prod3_date IS NOT NULL AND (prod3_sts = 'Fixed' OR prod3_sts = 'Partially Fixed')) OR del_sts = 'D-4' OR del_sts = 'D-5'";


    public String getUpdateIndentsInService() {
        return updateIndentsInService;
    }

    public void setUpdateIndentsInService(String updateIndentsInService) {
        this.updateIndentsInService = updateIndentsInService;
    }

    public String getUpdateIndentsInProd() {
        return updateIndentsInProd;
    }

    public void setUpdateIndentsInProd(String updateIndentsInProd) {
        this.updateIndentsInProd = updateIndentsInProd;
    }

    public String getSetServiceIndentSts() {
        return SetServiceIndentSts;
    }

    public void setSetServiceIndentSts(String setServiceIndentSts) {
        SetServiceIndentSts = setServiceIndentSts;
    }

    public String getServiceMasterIndents() {
        return serviceMasterIndents;
    }

    public void setServiceMasterIndents(String serviceMasterIndents) {
        this.serviceMasterIndents = serviceMasterIndents;
    }

    public String getUpdateEmailSetting2() {
        return updateEmailSetting2;
    }

    public void setUpdateEmailSetting2(String updateEmailSetting2) {
        this.updateEmailSetting2 = updateEmailSetting2;
    }


    public String getUpdateEmailSentSequence() {
        return updateEmailSentSequence;
    }

    public void setUpdateEmailSentSequence(String updateEmailSentSequence) {
        this.updateEmailSentSequence = updateEmailSentSequence;
    }

    public String getGetInvRow() {
        return getInvRow;
    }

    public void setGetInvRow(String getInvRow) {
        this.getInvRow = getInvRow;
    }

    public String getInvEwbDocs() {
        return InvEwbDocs;
    }

    public void setInvEwbDocs(String invEwbDocs) {
        InvEwbDocs = invEwbDocs;
    }

    public String getInsertImages() {
        return insertImages;
    }

    public void setInsertImages(String insertImages) {
        this.insertImages = insertImages;
    }

    public String getInsertOtherDocs() {
        return insertOtherDocs;
    }

    public void setInsertOtherDocs(String insertOtherDocs) {
        this.insertOtherDocs = insertOtherDocs;
    }

    public String getGetINVNo() {
        return getINVNo;
    }

    public void setGetINVNo(String getINVNo) {
        this.getINVNo = getINVNo;
    }

    public String getGetIndentINVNo() {
        return getIndentINVNo;
    }

    public void setGetIndentINVNo(String getIndentINVNo) {
        this.getIndentINVNo = getIndentINVNo;
    }

    public String getSeEmail2() {
        return seEmail2;
    }

    public void setSeEmail2(String seEmail2) {
        this.seEmail2 = seEmail2;
    }

    public String getSetDefaultEmail2() {
        return setDefaultEmail2;
    }

    public void setSetDefaultEmail2(String setDefaultEmail2) {
        this.setDefaultEmail2 = setDefaultEmail2;
    }

    public String getSetCC2() {
        return setCC2;
    }

    public void setSetCC2(String setCC2) {
        this.setCC2 = setCC2;
    }

    public String getSetDefaultCC2() {
        return setDefaultCC2;
    }

    public void setSetDefaultCC2(String setDefaultCC2) {
        this.setDefaultCC2 = setDefaultCC2;
    }

    public String getDeleteOtherFile() {
        return deleteOtherFile;
    }

    public void setDeleteOtherFile(String deleteOtherFile) {
        this.deleteOtherFile = deleteOtherFile;
    }

    public String getDeleteImageFile() {
        return deleteImageFile;
    }

    public void setDeleteImageFile(String deleteImageFile) {
        this.deleteImageFile = deleteImageFile;
    }

    public String getIndentDelStS() {
        return indentDelStS;
    }

    public void setIndentDelStS(String indentDelStS) {
        this.indentDelStS = indentDelStS;
    }

    public String getCategoryList() {
        return categoryList;
    }

    public void setCategoryList(String categoryList) {
        this.categoryList = categoryList;
    }

    public String getAllIndentOtherFileList() {
        return AllIndentOtherFileList;
    }

    public void setAllIndentOtherFileList(String allIndentOtherFileList) {
        AllIndentOtherFileList = allIndentOtherFileList;
    }

    public String getAllIndentImagesData() {
        return AllIndentImagesData;
    }

    public void setAllIndentImagesData(String allIndentImagesData) {
        AllIndentImagesData = allIndentImagesData;
    }

    public String getInsertEmailLog() {
        return insertEmailLog;
    }

    public void setInsertEmailLog(String insertEmailLog) {
        this.insertEmailLog = insertEmailLog;
    }

    public String getRegionList() {
        return RegionList;
    }

    public void setRegionList(String regionList) {
        RegionList = regionList;
    }

    public String getDeleteExpireAudits() {
        return DeleteExpireAudits;
    }

    public void setDeleteExpireAudits(String deleteExpireAudits) {
        DeleteExpireAudits = deleteExpireAudits;
    }

    public String getInsertUpdateIboardAudits() {
        return insertUpdateIboardAudits;
    }

    public void setInsertUpdateIboardAudits(String insertUpdateIboardAudits) {
        this.insertUpdateIboardAudits = insertUpdateIboardAudits;
    }

    public String getPriorityIndentListByDate() {
        return PriorityIndentListByDate;
    }

    public void setPriorityIndentListByDate(String priorityIndentListByDate) {
        PriorityIndentListByDate = priorityIndentListByDate;
    }

    public String getUpdatePriorityType() {
        return UpdatePriorityType;
    }

    public void setUpdatePriorityType(String updatePriorityType) {
        UpdatePriorityType = updatePriorityType;
    }

    public String getSetDefaultJumpPageNum() {
        return SetDefaultJumpPageNum;
    }

    public void setSetDefaultJumpPageNum(String setDefaultJumpPageNum) {
        SetDefaultJumpPageNum = setDefaultJumpPageNum;
    }

    public String getUpdatePaginationDetails() {
        return UpdatePaginationDetails;
    }

    public void setUpdatePaginationDetails(String updatePaginationDetails) {
        UpdatePaginationDetails = updatePaginationDetails;
    }

    public String getPaginationDetails() {
        return PaginationDetails;
    }

    public void setPaginationDetails(String paginationDetails) {
        PaginationDetails = paginationDetails;
    }

    public String getSetUPFlag() {
        return SetUPFlag;
    }

    public void setSetUPFlag(String setUPFlag) {
        SetUPFlag = setUPFlag;
    }

//    public String getUpdateRemarkFlag() {
//        return UpdateRemarkFlag;
//    }
//    public void setUpdateRemarkFlag(String updateRemarkFlag) {
//        UpdateRemarkFlag = updateRemarkFlag;
//    }
//
//    public String getGETREMARK() {
//        return GETREMARK;
//    }
//
//    public void setGETREMARK(String GETREMARK) {
//        this.GETREMARK = GETREMARK;
//    }

    public String getSetDefaultEmailforIIEXF() {
        return setDefaultEmailforIIEXF;
    }

    public void setSetDefaultEmailforIIEXF(String setDefaultEmailforIIEXF) {
        this.setDefaultEmailforIIEXF = setDefaultEmailforIIEXF;
    }

    public String getSetIIEXFemail() {
        return setIIEXFemail;
    }

    public void setSetIIEXFemail(String setIIEXFemail) {
        this.setIIEXFemail = setIIEXFemail;
    }

    public String getSetDefaultCC() {
        return setDefaultCC;
    }

    public void setSetDefaultCC(String setDefaultCC) {
        this.setDefaultCC = setDefaultCC;
    }

    public String getSetCC() {
        return setCC;
    }

    public void setSetCC(String setCC) {
        this.setCC = setCC;
    }

    public String getSaveEmailForm() {
        return saveEmailForm;
    }

    public void setSaveEmailForm(String saveEmailForm) {
        this.saveEmailForm = saveEmailForm;
    }

    public String getDeleteEmail() {
        return deleteEmail;
    }

    public void setDeleteEmail(String deleteEmail) {
        this.deleteEmail = deleteEmail;
    }

    public String getUpdateEmail() {
        return updateEmail;
    }

    public void setUpdateEmail(String updateEmail) {
        this.updateEmail = updateEmail;
    }


    public String getAddEmail() {
        return addEmail;
    }

    public void setAddEmail(String addEmail) {
        this.addEmail = addEmail;
    }

    public String getUpdateIndentWithoutNextDate() {
        return updateIndentWithoutNextDate;
    }

    public void setUpdateIndentWithoutNextDate(String updateIndentWithoutNextDate) {
        this.updateIndentWithoutNextDate = updateIndentWithoutNextDate;
    }

    public DbIndentUpdateQuery() {
    }

    public String getUpdateNextActionUser() {
        return updateNextActionUser;
    }

    public void setUpdateNextActionUser(String updateNextActionUser) {
        this.updateNextActionUser = updateNextActionUser;
    }

    public String getGetPrevPmtSts() {
        return getPrevPmtSts;
    }

    public void setGetPrevPmtSts(String getPrevPmtSts) {
        this.getPrevPmtSts = getPrevPmtSts;
    }

    public String getCheckIfIndentExist() {
        return checkIfIndentExist;
    }

    public void setCheckIfIndentExist(String checkIfIndentExist) {
        this.checkIfIndentExist = checkIfIndentExist;
    }

    public String getAllIndentList() {
        return AllIndentList;
    }

    public void setAllIndentList(String allIndentList) {
        AllIndentList = allIndentList;
    }

    public String getAllIndentListASC() {
        return AllIndentListASC;
    }

    public void setAllIndentListASC(String allIndentListASC) {
        AllIndentListASC = allIndentListASC;
    }

    public String getUpdatePIData() {
        return updatePIData;
    }

    public void setUpdatePIData(String updatePIData) {
        this.updatePIData = updatePIData;
    }

    public String getUpdateIIPOData() {
        return updateIIPOData;
    }

    public void setUpdateIIPOData(String updateIIPOData) {
        this.updateIIPOData = updateIIPOData;
    }

    public String getUpdateOCData() {
        return updateOCData;
    }

    public void setUpdateOCData(String updateOCData) {
        this.updateOCData = updateOCData;
    }

    public String getUpdateIIOCData() {
        return updateIIOCData;
    }

    public void setUpdateIIOCData(String updateIIOCData) {
        this.updateIIOCData = updateIIOCData;
    }

    public String getUpdateIIEXFData() {
        return updateIIEXFData;
    }

    public void setUpdateIIEXFData(String updateIIEXFData) {
        this.updateIIEXFData = updateIIEXFData;
    }

    public String getUpdateBGData() {
        return updateBGData;
    }

    public void setUpdateBGData(String updateBGData) {
        this.updateBGData = updateBGData;
    }

    public String getUpdateINVData() {
        return updateINVData;
    }

    public void setUpdateINVData(String updateINVData) {
        this.updateINVData = updateINVData;
    }

    public String getInsertINVData() {
        return insertINVData;
    }

    public void setInsertINVData(String insertINVData) {
        this.insertINVData = insertINVData;
    }

    public String getUpdateEXFData() {
        return updateEXFData;
    }

    public void setUpdateEXFData(String updateEXFData) {
        this.updateEXFData = updateEXFData;
    }


    public String getUpdateLCData() {
        return updateLCData;
    }

    public void setUpdateLCData(String updateLCData) {
        this.updateLCData = updateLCData;
    }

    public String getUpdateCOMData() {
        return updateCOMData;
    }

    public void setUpdateCOMData(String updateCOMData) {
        this.updateCOMData = updateCOMData;
    }

    public String getUpdateSHPorINVData() {
        return updateSHPorINVData;
    }

    public void setUpdateSHPorINVData(String updateSHPorINVData) {
        this.updateSHPorINVData = updateSHPorINVData;
    }

    public String getUpdateNextActionData() {
        return updateNextActionData;
    }

    public void setUpdateNextActionData(String updateNextActionData) {
        this.updateNextActionData = updateNextActionData;
    }

    public String getCheckNextDate() {
        return checkNextDate;
    }

    public void setCheckNextDate(String checkNextDate) {
        this.checkNextDate = checkNextDate;
    }

    public String getGetInformationFromDB() {
        return getInformationFromDB;
    }

    public void setGetInformationFromDB(String getInformationFromDB) {
        this.getInformationFromDB = getInformationFromDB;
    }

    public String getIndentActionData() {
        return indentActionData;
    }

    public void setIndentActionData(String indentActionData) {
        this.indentActionData = indentActionData;
    }

    public String getInsertIndentAction() {
        return insertIndentAction;
    }

    public void setInsertIndentAction(String insertIndentAction) {
        this.insertIndentAction = insertIndentAction;
    }

    public String getInvewbIndentData() {
        return invewbIndentData;
    }

    public void setInvewbIndentData(String invewbIndentData) {
        this.invewbIndentData = invewbIndentData;
    }

    public String getDeleteInvoiceData() {
        return deleteInvoiceData;
    }

    public void setDeleteInvoiceData(String deleteInvoiceData) {
        this.deleteInvoiceData = deleteInvoiceData;
    }

    public String getUpdatePMTsts() {
        return updatePMTsts;
    }

    public void setUpdatePMTsts(String updatePMTsts) {
        this.updatePMTsts = updatePMTsts;
    }

    public String getListOfIndentFromInvoiceNo() {
        return listOfIndentFromInvoiceNo;
    }

    public void setListOfIndentFromInvoiceNo(String listOfIndentFromInvoiceNo) {
        this.listOfIndentFromInvoiceNo = listOfIndentFromInvoiceNo;
    }

    public String getIndentFromInvoiceNo() {
        return IndentFromInvoiceNo;
    }

    public void setIndentFromInvoiceNo(String indentFromInvoiceNo) {
        IndentFromInvoiceNo = indentFromInvoiceNo;
    }

    public String getQueryUpdateDelStatusOfMaster() {
        return queryUpdateDelStatusOfMaster;
    }

    public void setQueryUpdateDelStatusOfMaster(String queryUpdateDelStatusOfMaster) {
        this.queryUpdateDelStatusOfMaster = queryUpdateDelStatusOfMaster;
    }


    public String getAllPaymentData() {
        return allPaymentData;
    }

    public void setAllPaymentData(String allPaymentData) {
        this.allPaymentData = allPaymentData;
    }


    public String getQueryCreatePaymentData() {
        return queryCreatePaymentData;
    }


    public String getQueryUpdatePaymentData() {
        return queryUpdatePaymentData;
    }

    public String getQueryDeletePaymentData() {
        return queryDeletePaymentData;
    }

    public void setQueryCreatePaymentData(String queryCreatePaymentData) {
        this.queryCreatePaymentData = queryCreatePaymentData;
    }


    public void setQueryUpdatePaymentData(String queryUpdatePaymentData) {
        this.queryUpdatePaymentData = queryUpdatePaymentData;
    }

    public void setQueryDeletePaymentData(String queryDeletePaymentData) {
        this.queryDeletePaymentData = queryDeletePaymentData;
    }

    public String getOpenIndentList() {
        return OpenIndentList;
    }

    public String getClosedIndentList() {
        return ClosedIndentList;
    }

    public String getCancelledIndentList() {
        return CancelledIndentList;
    }

    public void setOpenIndentList(String openIndentList) {
        OpenIndentList = openIndentList;
    }

    public void setClosedIndentList(String closedIndentList) {
        ClosedIndentList = closedIndentList;
    }

    public void setCancelledIndentList(String cancelledIndentList) {
        CancelledIndentList = cancelledIndentList;
    }

    public String getQueryGetInvoiceFilterData() {
        return queryGetInvoiceFilterData;
    }

    public String getQueryPaymentCancel() {
        return queryPaymentCancel;
    }

    public String getUpdatePmtStsUsingPoNumber() {
        return updatePmtStsUsingPoNumber;
    }


    public String getUpdateIndentPosition() {
        return UpdateIndentPosition;
    }

    public void setUpdateIndentPosition(String updateIndentPosition) {
        UpdateIndentPosition = updateIndentPosition;
    }


    public String getAllPriorityIndentList() {
        return AllPriorityIndentList;
    }

    public void setAllPriorityIndentList(String allPriorityIndentList) {
        AllPriorityIndentList = allPriorityIndentList;
    }

    public String getINDENTDETAIL() {
        return INDENTDETAIL;
    }

    public void setINDENTDETAIL(String INDENTDETAIL) {
        this.INDENTDETAIL = INDENTDETAIL;
    }

    public String getSetIndentPriority() {
        return SetIndentPriority;
    }

    public void setSetIndentPriority(String setIndentPriority) {
        SetIndentPriority = setIndentPriority;
    }

    public String getINDENTNUM() {
        return INDENTNUM;
    }

    public void setINDENTNUM(String INDENTNUM) {
        this.INDENTNUM = INDENTNUM;
    }

    public String getSETINDENTPOSITION() {
        return SETINDENTPOSITION;
    }

    public void setSETINDENTPOSITION(String SETINDENTPOSITION) {
        this.SETINDENTPOSITION = SETINDENTPOSITION;
    }

    public String getSETDEFAULTPOSITION() {
        return SETDEFAULTPOSITION;
    }

    public void setSETDEFAULTPOSITION(String SETDEFAULTPOSITION) {
        this.SETDEFAULTPOSITION = SETDEFAULTPOSITION;
    }


}
