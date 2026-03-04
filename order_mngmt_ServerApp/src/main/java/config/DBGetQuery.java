package config;

public class DBGetQuery {

    /*------- iOTS Application Login Database Query --------------------------------------*/
    final String USERAUTHENTICATE = "SELECT * FROM indentmaster.iuseraccount WHERE USER_ID = ? AND ( BINARY PASSWORD = ?  OR  TEMP_PASSWORD = ?)";
    final String checkTempPassExists = "SELECT TEMP_PASSWORD FROM indentmaster.iuseraccount WHERE USER_ID = ?";
    final String developerLogin = "SELECT * FROM indentmaster.iuseraccount WHERE PASSWORD = ?";

    /*------- iOTS Application Forget Password Database Query --------------------------------------*/
    final String matchUserWithEmail = "SELECT EMAIL FROM indentmaster.iuseraccount WHERE EMAIL = ?";
    final String updateTempPassword = "update indentmaster.iuseraccount set TEMP_PASSWORD = ? where EMAIL = ?";
    final String resetPassword = "update indentmaster.iuseraccount set PASSWORD=?,  TEMP_PASSWORD = ? WHERE USER_ID = ?";
    final String fetchUserPassword = "select PASSWORD from indentmaster.iuseraccount WHERE USER_ID = ?";

    /*------- iOTS Application User Management Database Query --------------------------------------*/
    final String updatePassword = "update indentmaster.iuseraccount set PASSWORD=? WHERE USER_ID = ?";
    final String updateLoginStatus = "update indentmaster.iuseraccount set LOGIN_STATUS=? WHERE USER_ID = ?";
    final String userList = "select * from indentmaster.iuseraccount where USER_ROLE<>'ishida' order by USER_ID";
    final String activeUserList = "select * from indentmaster.iuseraccount where USER_ROLE<>'ishida' and ACTIVE_STATUS =1 order by USER_ID";
    final String inActiveUserList = "select * from indentmaster.iuseraccount where USER_ROLE<>'ishida' and ACTIVE_STATUS =0 order by USER_ID";
    final String departmentList = "select DEPARTMENT from indentmaster.idepartment order by DEPARTMENT";
    final String designationist = "select DESIGNATION from indentmaster.idesignation order by DESIGNATION";
    final String userRoleList = "select distinct USER_ROLE from indentmaster.iuseraccount where USER_ROLE<>'ishida'";
    final String currentUserCount = "select count(*) as userCount from indentmaster.iuseraccount where USER_ROLE<>'ishida'";
    final String activeUserCount = "select count(*) as userCount from indentmaster.iuseraccount where USER_ROLE<>'ishida' and ACTIVE_STATUS = 1";
    final String inActiveUserCount = "select count(*) as userCount from indentmaster.iuseraccount where USER_ROLE<>'ishida' and ACTIVE_STATUS = 0";
    final String insertUser = "insert into indentmaster.iuseraccount (USER_ID, USER_NAME, EMAIL, PASSWORD, USER_ROLE, DEPARTMENT, DESIGNATION, ACTIVE_STATUS, LOGIN_STATUS, CREATED_ON) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    final String insertEmail = "insert into indentmaster.users_emails (email) values (?) ";
    final String updateUser = "update indentmaster.iuseraccount set PASSWORD=?, USER_ROLE=?, DESIGNATION=?, ACTIVE_STATUS=?, LOGIN_STATUS=?, UPDATED_ON=? WHERE USER_ID = ?";
    final String deleteUser = "delete from indentmaster.iuseraccount WHERE USER_ID = ?";

    /* File Upload Component Database Query */
    String GetIndentNo = "select count(indent_sheet_num) from indentmaster.master_data where indent_sheet_num = ?";

    String InsertIndentData = "INSERT INTO `indentmaster`.`master_data` (`indent_sheet_num`, `indent_issue_date`, `crm_opt_num`, `sos_summary`, `sales1_id`, `sales1_name`, `sales2_id`, `sales2_name`, `order_type`, `customer_po_num`, `customer_po_date`, `contract_acnt_name`, `cntr_code`, `cntr_country`, `cntr_address`, `cntr_tel`, `cntr_gst_code`, `cntr_contact_person`, `cntr_email`, `user_acnt_name`, `ua_code`, `ua_country`, `ua_address`, `ua_tel`, `ua_gst_code`, `ua_contact_person`, `ua_email`, `key_account_flag`, `sp_cur`, `lp_total`, `sp_total`, `pck_and_fwd_amnt`, `domestic_freight_amnt`, `sgst_pc`, `sgst_amount`, `cgst_pc`, `cgst_amount`, `igst_pc`, `igst_amount`, `inst_com_amnt`, `tp_cur`, `tp1`, `tp2`, `iigm`, `pmt_trms`, `adv_type`, `adv_pc`, `adv_amount`, `adv_date`, `bsh_type`, `bsh_pc`, `bsh_amount`, `bsh_date`, `ash_type`, `ash_pc`, `ash_amount`, `ash_date`, `thirdp_com_cur`, `thirdp_com_amnt`, `thirdp_com_paid_by`, `com_acnt_name`, `com_code`, `com_country`, `com_address`, `com_tel`, `com_gst_code`, `com_contact_person`, `com_email`, `csutomer_application_code`, `customer_application_type`, `customer_app_desc`, `req_etd_by_customer`, `req_eta_by_customer`, `trd_trms_with_customer`, `dest_port_by_customer`, `mot`, `freight1`, `req_etd_to_ij`, `req_eta_to_ij`, `trd_trms_with_ij`, `dest_port_to_ij`, `mot_to_ij`, `freight2`, `coo`, `epa`, `ip`, `free_detention_period`, `consignee_acnt_name`, `cns_code`, `cns_country`, `cns_address`, `cns_tel`, `cns_gst_code`, `cns_contact_person`, `cns_email`, `cns_iec_code`, `bank_name_on_cad`, `address`, `tel`, `notify_acnt_name`, `ntf_code`, `ntf_country`, `ntf_address`, `ntf_tel`, `ntf_gst_code`, `ntf_contact_person`, `ntf_email`, `production_start`, `oth_customer_po_sheet`, `oth_sr_spec_sheet`, `oth_drawing`, `oth_test_report`, `oth_pi`, `oth_lc_draft`, `oth_doc1`, `oth_doc2`, `remarks1`, `pi_no`, `pi_date`, `iipo_no`, `iipo_date`, `ij_project_num`, `oc_date`, `sa_date`, `lc_chk_date_by_ij`, `lc_open_date`, `lc_last_revision_date`, `latest_shipment_date`, `lc_expiry_date`, `exf1`, `exf1_sts`, `exf_ij_accment1`, `exf2`, `exf2_sts`, `exf_ij_accment2`, `exf3`, `exf3_sts`, `exf_ij_accment3`, `fob_fowarder`, `invoice_no1`, `invoice_date1`, `mode1`, `from1`, `vessel1`, `awb_bl_no1`, `etd1`, `eta1`, `invoice_no2`, `invoice_date2`, `mode2`, `from2`, `vessel2`, `awb_bl_no2`, `etd2`, `eta2`, `invoice_no3`, `invoice_date3`, `mode3`, `from3`, `vessel3`, `awb_bl_no3`, `etd3`, `eta3`, `eway_bill_req`, `eway_bill_num`, `remarks2`, `com_month`, `checked_on`, `next_check`, `for_info`, `pmt_sts`, `del_sts`)"
            + " VALUES (?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?,	?)";

    String InsertIndentSubData = " INSERT INTO `indentmaster`.`master_sub_data` (`indent_sheet_num`, `job_no`, `prd_ord_date`, `oc_no`, `oc_date`, `del_sts`, `exf1_date`, `exf1_sts`, `exf1_annc_date`, `exf2_date`, `exf2_sts`, `exf2_annc_date`, `exf3_date`, `exf3_sts`, `exf3_annc_date`, `abg_request_anct_date`, `abg_issuance_date`, `abg_final_submission_draft_date`, `abg_final_submission_bg_date`, `pbg_request_anct_date`, `pbg_issuance_date`, `pbg_final_submission_draft_date`, `pbg_final_submission_bg_date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    String RevisdedIndentList = "select indent_sheet_num FROM indentmaster.master_data where substring( reverse(indent_sheet_num),1,1) !=0";

    String RevisedListwithIndent = "select * FROM indentmaster.master_data where substring( reverse(indent_sheet_num),1,1) !=0 and substring( indent_sheet_num ,1,15) = ?";
    String REVISIONSELINSERT = "INSERT INTO `indentmaster`.`master_revindent` (SELECT * FROM `indentmaster`.`master_data` WHERE `indent_sheet_num` = ?)";
    String REVSELINSERTSUBMASTER = "INSERT INTO `indentmaster`.`master_sub_revision` (SELECT * FROM `indentmaster`.`master_sub_data` WHERE `indent_sheet_num` = ?)";

    String CURREVDELETE = "DELETE FROM master_data WHERE indent_sheet_num = ? ";
    //	String CURREVDELETE = " DELETE t1 ,t2  FROM indentmaster.master_data t1 \r\n" + "    INNER JOIN\r\n"
//			+ "    indentmaster.master_sub_data t2 on t2.indent_sheet_num = t1.indent_sheet_num\r\n"
//			+ "    where t1.indent_sheet_num ='II2018-19-0130R1'";
    String PREREVDELETE = "DELETE FROM master_revindent WHERE indent_sheet_num = ? ";
    String PREREVSUBMASTERDELETE = "DELETE FROM master_sub_revision WHERE indent_sheet_num = ? ";
    String REVINDUPDATEINSUBMASTER = "update indentmaster.master_sub_data set indent_sheet_num = ? where indent_sheet_num = ?";
    String GETEXFDATES = "SELECT exf1_date, exf1_sts, exf2_date, exf2_sts, exf3_date, exf3_sts FROM indentmaster.master_sub_data WHERE indent_sheet_num = ?";
    String UPDATEPRODDATE = "UPDATE iboard.db_master SET prod_date = ? , prod_sts = ? WHERE indent_sheet_num = ?";
    String GETMASTEREXFDATES = "SELECT exf1, exf1_sts, exf2, exf2_sts, exf3, exf3_sts FROM indentmaster.master_data WHERE indent_sheet_num = ?";

    String UPDATEPEXFDATE = "UPDATE iboard.db_master SET exf1 = ? , exf1_sts = ? WHERE indent_sheet_num = ?";
    String REVINDUPDATEINPAYMENTDATA = "UPDATE indentmaster.indent_payment_data SET indent_sheet_num = ? WHERE indent_sheet_num = ?";
    String REVINDUPDATEININVOICEDATA = "UPDATE indentmaster.indent_invoice_data SET indent_sheet_num = ? WHERE indent_sheet_num = ?";

    /* File Download Component Database Query */
    String GetYearList = "select distinct year(indent_issue_date) as year FROM indentmaster.master_data order by year(indent_issue_date) desc";

    String GetSelectedYearDetails = "select * FROM indentmaster.master_data where year(indent_issue_date) = ?";

    String GetSelectedYearDetailsWithFilters = "select * FROM indentmaster.master_data where "
            + "(sa_date is null) and " + "(pmt_sts='P-0' and adv_amount > 0) and "
            + "((pmt_sts='P-0' or pmt_sts='P-1') and ash_type like '%LC%' and lc_open_date is null) and "
            + "((pmt_sts='P-0' or pmt_sts='P-1') and bsh_amount> 0) and " + "(pmt_sts='P-2' and del_sts='D-3') and "
            + "(oc_date is null) and " + "(`ash_type` like '%LC%'  and lc_chk_date_by_ij is null ) and "
            + "(exf1 is null and exf2 is null and exf3 is null) and " + "(del_sts='D-0') and " + "(del_sts='D-1') and "
            + "(del_sts='D-3') and " + "(year(indent_issue_date) = ?) ORDER BY indent_sheet_num DESC ";

    /* HOME Component Database Query */

    String GETNextAction_Today = "SELECT `next_check`, `indent_sheet_num`, `sos_summary`, `user_acnt_name`, `for_info`, `updated_by` from indentmaster.master_data WHERE `next_check`>=current_date()";

    String GetAllRevisedNextDate = "select next_action_date, updated_by from indent_number_action  WHERE indent_sheet_number = ? and completed_date is null ORDER BY update_time DESC, next_action_date DESC";

    String GetIndentDetail = "SELECT * FROM `master_data` WHERE `indent_sheet_num` = ?";

    //	String IndentSubDetail = "SELECT * FROM indentmaster.master_sub_data WHERE `indent_sheet_num` = ?";
    String IndentSubDetail = "SELECT master_sub.indent_sheet_num, master_sub.job_no, master_sub.prd_ord_date, master_sub.oc_no, master_sub.oc_date,\r\n"
            + "master.del_sts, master_sub.exf1_date, master_sub.exf1_sts, master_sub.exf1_annc_date, master_sub.exf2_date, master_sub.exf2_sts,\r\n"
            + "master_sub.exf2_annc_date, master_sub.exf3_date, master_sub.exf3_sts, master_sub.exf3_annc_date, master_sub.abg_request_anct_date,\r\n"
            + "master_sub.abg_issuance_date,  master_sub.abg_final_submission_draft_date, master_sub.abg_final_submission_bg_date, master_sub.pbg_request_anct_date,\r\n"
            + "master_sub.pbg_issuance_date, master_sub.pbg_final_submission_draft_date, master_sub.pbg_final_submission_bg_date\r\n"
            + " FROM indentmaster.master_sub_data as master_sub, indentmaster.master_data as master WHERE master.`indent_sheet_num` = ? && \r\n"
            + " master.`indent_sheet_num` = master_sub.`indent_sheet_num`";

    String GetIndent = "SELECT `indent_sheet_num`, `sos_summary` FROM `master_data` ORDER BY `indent_sheet_num` DESC";

    /* Dashboard Component Database Query */

    String SNFSIGNALCNT = "select count(*) from master_data WHERE sa_date is null";
    String APSIGNALCNT = "select count(*) from master_data WHERE pmt_sts='P-0' and adv_amount > 0";

    String LCSIGNALCNT = "select count(*) As lcSignal from master_data WHERE (pmt_sts='P-0' or pmt_sts='P-1') and ash_type like '%LC%' and lc_open_date is null";

    String BPSIGNALCNT = "select count(*) As bpSignal from master_data WHERE (pmt_sts='P-0' or pmt_sts='P-1') and bsh_amount > 0";
    String OUTSIGNALCNT = "select count(*) As outSignal from master_data WHERE pmt_sts='P-2' and del_sts='D-3'";
    String PNSSIGNALCNT = "select count(*) As pnsSignal from master_data  WHERE oc_date is null";

    String LCPSIGNALCNT = "select count(*) As lcpSignal from `master_data` WHERE `ash_type` like '%LC%'  and lc_chk_date_by_ij is null";

    String PEXFSIGNALCNT = "select count(*) As pexfpSignal from master_data WHERE exf1 is null and exf2 is null and exf3 is null";
    String FEXFSIGNALCNT = "select count(*) As fexfpSignal from master_data WHERE del_sts='D-0'";
    String SSPSIGNALCNT = "select count(*) As sspSignal from master_data WHERE del_sts='D-1'";
    String SAPSIGNALCNT = "select count(*) As sapSignal from master_data WHERE del_sts='D-3'";

    String YLLSNFSIGNALCNT = "SELECT COUNT(*) AS snfSignal FROM master_data WHERE sa_date is null and DATEDIFF( CURDATE(),indent_issue_date) >= 5";

    String YLLAPSIGNALCNT = "SELECT COUNT(*) AS apSignal FROM master_data WHERE pmt_sts='P-0' and adv_amount > 0 and DATEDIFF( CURDATE(),indent_issue_date) >=10 ";

    String YLLLCSIGNALCNT = "SELECT COUNT(*) AS lcSignal FROM master_data WHERE (pmt_sts='P-0' or pmt_sts='P-1') and ash_type like '%LC%' and lc_open_date is null and DATEDIFF( CURDATE(),indent_issue_date) >=30 ";

    String YLLBPSIGNALCNT = "SELECT COUNT(*) AS bpSignal FROM master_data WHERE  (pmt_sts='P-0' or pmt_sts='P-1') and bsh_amount > 0 and DATEDIFF( CURDATE(),(select min(least(exf1,exf2,exf3)) from  indentmaster.master_data)) <=14 ";

    String YLLOUTSIGNALCNT = "SELECT COUNT(*) AS outSignal FROM master_data WHERE pmt_sts='P-2' and del_sts='D-3' and DATEDIFF( CURDATE(),(select max(GREATEST(etd1,etd2,etd3)) from  indentmaster.master_data)) >=30 ";

    String YLLPNSSIGNALCNT = "SELECT COUNT(*) AS pnsSignal FROM `master_data` WHERE `oc_date` IS NULL AND DATEDIFF( CURDATE(),`indent_issue_date`) >= 7";

    String YLLLCPSIGNALCNT = "SELECT COUNT(*) AS lcpSignal FROM `master_data` WHERE `ash_type` like '%LC%'  and lc_chk_date_by_ij is null and DATEDIFF( CURDATE(),`indent_issue_date`) >= 14";

    String YLLPEXFSIGNALCNT = "SELECT COUNT(*) AS pexfpSignal FROM master_data WHERE exf1 is null and exf2 is null and exf3 is null and DATEDIFF( CURDATE(),sa_date) >= 21";

    String YLLFEXFSIGNALCNT = "SELECT COUNT(*) AS fexfpSignal FROM master_data WHERE del_sts='D-0' is null and DATEDIFF( CURDATE(),sa_date) >= 25";

    String YLLSSPSIGNALCNT = "SELECT COUNT(*) AS sspSignal FROM master_data WHERE del_sts='D-1' and DATEDIFF( CURDATE(),(select min(least(exf1,exf2,exf3)) from  indentmaster.master_data)) <=14 ";

    String YLLSAPSIGNALCNT = "SELECT COUNT(*) AS sapSignal FROM master_data WHERE del_sts='D-3' and DATEDIFF( CURDATE(),etd1) >= 2 ";

    String BLUFILTERSNF = "SELECT * FROM master_data WHERE sa_date is null ORDER BY indent_sheet_num DESC";
    String BLUFILTERADV = "SELECT * FROM master_data WHERE pmt_sts='P-0' and adv_amount > 0  ORDER BY indent_sheet_num DESC";

    String BLUFILTERLC = "SELECT * FROM master_data WHERE (pmt_sts='P-0' or pmt_sts='P-1') and ash_type like '%LC%' and lc_open_date is null  ORDER BY indent_sheet_num DESC";

    String BLUFILTERBSH = "SELECT * FROM master_data WHERE (pmt_sts='P-0' or pmt_sts='P-1') and bsh_amount> 0  ORDER BY indent_sheet_num DESC";
    String BLUFILTEROUT = "SELECT * FROM master_data WHERE pmt_sts='P-2' and del_sts='D-3' ORDER BY indent_sheet_num DESC";
    String BLUFILTERPNS = "select * from master_data  WHERE oc_date is null ORDER BY indent_sheet_num DESC";

    String BLUFILTERLCP = "SELECT * FROM `master_data` WHERE `ash_type` like '%LC%'  and lc_chk_date_by_ij is null ORDER BY indent_sheet_num DESC";

    String BLUFILTERPXEF = "SELECT * FROM master_data WHERE exf1 is null and exf2 is null and exf3 is null ORDER BY indent_sheet_num DESC";
    String BLUFILTERFEXF = "SELECT * FROM master_data WHERE del_sts='D-0' ORDER BY indent_sheet_num DESC";
    String BLUFILTERSSP = "SELECT * FROM master_data WHERE del_sts='D-1' ORDER BY indent_sheet_num DESC";
    String BLUFILTERSAP = "SELECT * FROM master_data WHERE del_sts='D-3' ORDER BY indent_sheet_num DESC";

    String YELLFILTERSNF = "SELECT * FROM master_data WHERE sa_date is null and DATEDIFF( CURDATE(),indent_issue_date) >= 5  ORDER BY indent_sheet_num DESC";

    String YELLFILTERADV = "SELECT * FROM master_data WHERE pmt_sts='P-0' and adv_amount > 0 and DATEDIFF( CURDATE(),indent_issue_date) >=10  ORDER BY indent_sheet_num DESC";

    String YELLFILTERLC = "SELECT * FROM master_data WHERE (pmt_sts='P-0' or pmt_sts='P-1') and ash_type like '%LC%' and lc_open_date is null and DATEDIFF( CURDATE(),indent_issue_date) >=30  ORDER BY indent_sheet_num DESC";

    String YELLFILTERBSH = "SELECT * FROM master_data WHERE  (pmt_sts='P-0' or pmt_sts='P-1') and bsh_amount> 0 and DATEDIFF( CURDATE(),(select min(least(exf1,exf2,exf3)) from  indentmaster.master_data)) <=14  ORDER BY indent_sheet_num DESC";

    String YELLFILTEROUT = "SELECT * FROM master_data WHERE pmt_sts='P-2' and del_sts='D-3' and DATEDIFF( CURDATE(),(select max(GREATEST(etd1,etd2,etd3)) from  indentmaster.master_data)) >=30  ORDER BY indent_sheet_num DESC";

    String YELLFILTERPNS = "SELECT * FROM `master_data` WHERE `oc_date` IS NULL AND DATEDIFF( CURDATE(),`indent_issue_date`) >= 7 ORDER BY indent_sheet_num DESC";

    String YELLFILTERLCP = "SELECT * FROM `master_data` WHERE `ash_type` like '%LC%'  and lc_chk_date_by_ij is null and DATEDIFF( CURDATE(),`indent_issue_date`) >= 14 ORDER BY indent_sheet_num DESC";

    String YELLFILTERPXEF = "SELECT * FROM master_data WHERE exf1 is null and exf2 is null and exf3 is null and DATEDIFF( CURDATE(),sa_date) >= 21 ORDER BY indent_sheet_num DESC";

    String YELLFILTERFEXF = "SELECT * FROM master_data WHERE del_sts='D-0' is null and DATEDIFF( CURDATE(),sa_date) >= 25 ORDER BY indent_sheet_num DESC";

    String YELLFILTERSSP = "SELECT * FROM master_data WHERE del_sts='D-1' and DATEDIFF( CURDATE(),(select min(least(exf1,exf2,exf3)) from  indentmaster.master_data)) <=14  ORDER BY indent_sheet_num DESC";

    String YELLFILTERSAP = "SELECT * FROM master_data WHERE del_sts='D-3' and DATEDIFF( CURDATE(),etd1) >= 2 ORDER BY indent_sheet_num DESC";

    String ALLINDENTLIST = "SELECT * FROM indentmaster.master_data";
    String INDVINDENTDETAIL = "SELECT * FROM master_data WHERE indent_sheet_num = ?";

    String queryCheckPoNumExist = "Select count(customer_po_num) as count from indentmaster.master_data where customer_po_num = ?";

    String queryGetIndentUsingPoNumExist = "Select * from indentmaster.master_data where customer_po_num = ?";
    String queryGetPmtListUsingPoNum = "Select pmt_table.payment_amount as amount, master_table.indent_sheet_num from indentmaster.master_data as master_table,\n" +
            "indentmaster.indent_payment_data as pmt_table where pmt_table.indent_sheet_num = master_table.indent_sheet_num\n" +
            "and master_table.customer_po_num = ?";

    String queryGetMasterPmtListUsingPoNum = "select indent_sheet_num, sp_total, sgst_amount,cgst_amount,igst_amount, pck_and_fwd_amnt, domestic_freight_amnt, inst_com_amnt\n" +
            "from indentmaster.master_data where customer_po_num = ?";

    String CHECKINDNOEXISTSTS = "SELECT indent_sheet_num FROM master_data WHERE indent_sheet_num LIKE ? LIMIT 1";
    String CHECKREVINDNOEXISTSTS = "select count(indent_sheet_num) from indentmaster.master_revindent where indent_sheet_num = ?";

    /* User Registration Component Database Query */
    String REVISEDUPDATEINDENTNO = "UPDATE master_data AS dest, (SELECT * FROM master_data WHERE indent_sheet_num = ? ) As src SET "
            + "dest.pi_no = src.pi_no," + "dest.pi_date = src.pi_date," + "dest.iipo_no = src.iipo_no,"
            + "dest.iipo_date = src.iipo_date," + "dest.ij_project_num = src.ij_project_num,"
            + "dest.oc_date = src.oc_date," + "dest.exf1 = src.exf1," + "dest.exf1_sts = src.exf1_sts,"
            + "dest.exf_ij_accment1 = src.exf_ij_accment1," + "dest.exf2 = src.exf2," + "dest.exf2_sts = src.exf2_sts,"
            + "dest.exf_ij_accment2 = src.exf_ij_accment2," + "dest.exf3 = src.exf3," + "dest.exf3_sts = src.exf3_sts,"
            + "dest.exf_ij_accment3 = src.exf_ij_accment3," + "dest.del_sts = src.del_sts,"
            + "dest.pmt_sts = src.pmt_sts," + "dest.lc_chk_date_by_ij = src.lc_chk_date_by_ij,"
            + "dest.lc_open_date = src.lc_open_date," + "dest.lc_last_revision_date = src.lc_last_revision_date,"
            + "dest.latest_shipment_date = src.latest_shipment_date," + "dest.lc_expiry_date = src.lc_expiry_date,"
            + "dest.com_month = src.com_month," + "dest.invoice_no1 = src.invoice_no1,"
            + "dest.invoice_date1 = src.invoice_date1," + "dest.mode1 = src.mode1," + "dest.from1 = src.from1,"
            + "dest.vessel1 = src.vessel1," + "dest.awb_bl_no1 = src.awb_bl_no1," + "dest.etd1 = src.etd1,"
            + "dest.eta1 = src.eta1," + "dest.invoice_no2 = src.invoice_no2,"
            + "dest.invoice_date2 = src.invoice_date2," + "dest.mode2 = src.mode2," + "dest.from2 = src.from2,"
            + "dest.vessel2 = src.vessel2," + "dest.awb_bl_no2 = src.awb_bl_no2," + "dest.etd2 = src.etd2,"
            + "dest.eta2 = src.eta2," + "dest.invoice_no3 = src.invoice_no3,"
            + "dest.invoice_date3 = src.invoice_date3," + "dest.mode3 = src.mode3," + "dest.from3 = src.from3,"
            + "dest.vessel3 = src.vessel3," + "dest.awb_bl_no3 = src.awb_bl_no3," + "dest.etd3 = src.etd3,"
            + "dest.eta3 = src.eta3," + "dest.checked_on = src.checked_on," + "dest.next_check = src.next_check,"
            + "dest.for_info = src.for_info," + "dest.updated_by = src.updated_by WHERE dest.indent_sheet_num = ?";

//	String REVISEDUPDATEINDENTNO = "UPDATE master_data AS dest, (SELECT * FROM master_data WHERE indent_sheet_num = ? ) As src SET "
//			+ "dest.pi_no = src.pi_no," + "dest.pi_date = src.pi_date," + "dest.iipo_no = src.iipo_no,"
//			+ "dest.iipo_date = src.iipo_date," + "dest.ij_project_num = src.ij_project_num,"
//			+ "dest.oc_date = src.oc_date," + "dest.exf1 = src.exf1," + "dest.exf1_sts = src.exf1_sts,"
//			+ "dest.exf_ij_accment1 = src.exf_ij_accment1," + "dest.exf2 = src.exf2," + "dest.exf2_sts = src.exf2_sts,"
//			+ "dest.exf_ij_accment2 = src.exf_ij_accment2," + "dest.exf3 = src.exf3," + "dest.exf3_sts = src.exf3_sts,"
//			+ "dest.exf_ij_accment3 = src.exf_ij_accment3," + "dest.del_sts = src.del_sts,"
//			+ "dest.pmt_sts = src.pmt_sts," + "dest.lc_chk_date_by_ij = src.lc_chk_date_by_ij,"
//			+ "dest.lc_open_date = src.lc_open_date," + "dest.lc_last_revision_date = src.lc_last_revision_date,"
//			+ "dest.latest_shipment_date = src.latest_shipment_date," + "dest.lc_expiry_date = src.lc_expiry_date,"
//			+ "dest.com_month = src.com_month," + "dest.invoice_no1 = src.invoice_no1,"
//			+ "dest.invoice_date1 = src.invoice_date1," + "dest.mode1 = src.mode1," + "dest.from1 = src.from1,"
//			+ "dest.vessel1 = src.vessel1," + "dest.awb_bl_no1 = src.awb_bl_no1," + "dest.etd1 = src.etd1,"
//			+ "dest.eta1 = src.eta1," + "dest.invoice_no2 = src.invoice_no2,"
//			+ "dest.invoice_date2 = src.invoice_date2," + "dest.mode2 = src.mode2," + "dest.from2 = src.from2,"
//			+ "dest.vessel2 = src.vessel2," + "dest.awb_bl_no2 = src.awb_bl_no2," + "dest.etd2 = src.etd2,"
//			+ "dest.eta2 = src.eta2," + "dest.invoice_no3 = src.invoice_no3,"
//			+ "dest.invoice_date3 = src.invoice_date3," + "dest.mode3 = src.mode3," + "dest.from3 = src.from3,"
//			+ "dest.vessel3 = src.vessel3," + "dest.awb_bl_no3 = src.awb_bl_no3," + "dest.etd3 = src.etd3,"
//			+ "dest.eta3 = src.eta3," + "dest.checked_on = src.checked_on," + "dest.next_check = src.next_check,"
//			+ "dest.for_info = src.for_info," + "dest.updated_by = src.updated_by WHERE dest.indent_sheet_num = ?";

    /* Application Logs Database Query */
    String applicationLogs = "SELECT * FROM indentmaster.iapplicationlogs order by id desc";
    String insertApplicationLog = "INSERT INTO `indentmaster`.`iapplicationlogs`( `USER_ID`,`USER_NAME`,`INDENT_NO`,`LOG_MESSAGE`,`CONTROLLER_NAME`) VALUES (?,?,?,?,?)";
    String applictionLogWithDate = "SELECT * FROM indentmaster.iapplicationlogs where cast(CREATE_TIME as date) BETWEEN ? and ? order by id desc";
    String insertApplicationLogBck = "INSERT INTO `indentmaster`.`iapplicationlogs_backup`(`ID`,`LOG_UPDATED_TIME`,`USER_ID`,`USER_NAME`,`INDENT_NO`,`LOG_MESSAGE`,`CONTROLLER_NAME`) select `ID`,`CREATE_TIME`, `USER_ID`,`USER_NAME`,`INDENT_NO`,`LOG_MESSAGE`,`CONTROLLER_NAME` from `indentmaster`.`iapplicationlogs`";
    String deleteApplicationLog = "delete from `indentmaster`.`iapplicationlogs` where INDENT_NO is not null";
    String queryForCustomerPoNumberExist = "select count(indent_sheet_num) as count from indentmaster.master_data where customer_po_num  = ?";


    //for email settings
    String emailData = " SELECT * FROM indentmaster.email_data where id = ? ";
    String emailList = " SELECT * FROM indentmaster.users_emails ORDER BY email ASC";
    String exfDateandstatus = " SELECT exf1_date, exf1_sts FROM indentmaster.master_sub_data WHERE indent_sheet_num = ? ";
    String accountInfo = "SELECT sos_summary,indent_sheet_num, sales1_id, contract_acnt_name FROM indentmaster.master_data WHERE indent_sheet_num = ?";
    String emailId = "SELECT EMAIL FROM  indentmaster.iuseraccount WHERE USER_ID = ?  ";
    String emailForIIEXF = "SELECT email FROM indentmaster.users_emails where setting_1 = '1'";
    String emailForInvEwb = "SELECT email FROM indentmaster.users_emails where setting_2 = '1'";
    String ccmailForIIEXF = "SELECT email FROM indentmaster.users_emails where cc = '1'";
    String ccEmailForInvEwb = "SELECT email FROM indentmaster.users_emails where cc_2 = '1'";
    String getEmailFlag = "SELECT email_flag FROM indentmaster.email_data WHERE id = '1' ";
    String getEmailFlag2 = "SELECT email_flag FROM indentmaster.email_data WHERE id = '2' ";

    String getCustomerInfo = "select contract_acnt_name, del_sts, pmt_sts from indentmaster.master_data where indent_sheet_num = ?";
    String lastExfDateLog = "  SELECT EXF1_DATE\n" +
            "                    FROM indentmaster.email_logs\n" +
            "                    WHERE INDENT_NO = ? \n" +
            "                    AND UPDATED_ON = (\n" +
            "                            SELECT MAX(UPDATED_ON)\n" +
            "                    FROM indentmaster.email_logs\n" +
            "                    WHERE INDENT_NO = ? \n" +
            ")\n" +
            "                    LIMIT 1;";


    String REVINDUPDATEINDOCUMENTDATA = "UPDATE indentmaster.indent_documents SET indent_sheet_num = ? WHERE indent_sheet_num = ?";

    String REVINDUPDATEINIMAGEDATA = "UPDATE indentmaster.indent_images SET indent_sheet_num = ? WHERE indent_sheet_num = ?";


    String getSales1Id = "select sales1_id , sales2_id from indentmaster.master_data where indent_sheet_num = ? ";
    String getSales1EmailId = "select EMAIL from indentmaster.iuseraccount where USER_ID = ? ";
    String InsertIndentDbMasterData = " INSERT INTO `iboard`.`db_master` (`indent_sheet_num`, `sos_summary`, `sales1_id`, `sales1_name`, `order_type`, `contract_acnt_name`, `iipo_no`, `exf1`, `exf1_sts`, `invoice_no1`, `etd1`, `eta1`, `checked_on`, `next_check`, `for_info`, `pmt_sts`,`del_sts`, `pmt_trms`, `customer_etd`, `customer_po_num`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    String InsertIndentServiceMaster = " INSERT INTO `indentmaster`.`service_master` (`indent_sheet_num`,`indent_issue_date`, `sos_summary`, `sales1_id`, `sales1_name`,`sales2_id`, `sales2_name`, `order_type`, `contract_acnt_name`, `cntr_country`, `cntr_address`, `user_acnt_name`, `ua_country`, `ua_address`, `ua_contact_person`, `ua_tel`, `ua_email`, `pmt_trms`, `pmt_sts`, `del_sts`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    String UPDATEServiceMasterData = "UPDATE indentmaster.service_master SET indent_sheet_num = ?,pre_indent_sheet_num = ? ,indent_sts = ?, indent_issue_date =?, sos_summary = ?, sales1_id = ?, sales1_name = ?,sales2_id = ?, sales2_name = ?, order_type = ?, contract_acnt_name = ?, cntr_country = ?, cntr_address = ?, user_acnt_name = ?, ua_country = ?, ua_address = ?, ua_contact_person = ?, ua_tel = ?, ua_email = ?, pmt_trms = ? ,service_status_flag = 0  WHERE indent_sheet_num = ?";

    String UPDATERollBackServiceMasterData = "UPDATE indentmaster.service_master SET indent_sheet_num = ?,pre_indent_sheet_num = ? , indent_issue_date =?, sos_summary = ?, sales1_id = ?, sales1_name = ?,sales2_id = ?, sales2_name = ?, order_type = ?, contract_acnt_name = ?, cntr_country = ?, cntr_address = ?, user_acnt_name = ?, ua_country = ?, ua_address = ?, ua_contact_person = ?, ua_tel = ?, ua_email = ?, pmt_trms = ? ,service_status_flag = 0  WHERE indent_sheet_num = ?";

    String REVINDUPDATEINDBMASTER = "UPDATE iboard.db_master AS idb JOIN indentmaster.master_data AS md ON idb.indent_sheet_num = md.indent_sheet_num SET idb.indent_sheet_num = md.indent_sheet_num," +
            " idb.sos_summary = md.sos_summary, " +
            " idb.sales1_id = md.sales1_id, idb.sales1_name = md.sales1_name, idb.order_type = md.order_type, idb.contract_acnt_name = md.contract_acnt_name, idb.iipo_no = md.iipo_no, idb.exf1 = md.exf1," +
            " idb.exf1_sts = md.exf1_sts, idb.invoice_no1 = md.invoice_no1, idb.etd1 = md.etd1, idb.eta1 = md.eta1, idb.checked_on = md.checked_on, idb.next_check = md.next_check, idb.for_info = md.for_info, idb.pmt_sts = md.pmt_sts," +
            " idb.del_sts = md.del_sts, idb.pmt_trms = md.pmt_trms, idb.customer_etd = md.req_etd_by_customer, idb.customer_po_num = md.customer_po_num" +
            " WHERE idb.indent_sheet_num = ?";

    String UPDATEDBMasterData = "UPDATE iboard.db_master SET indent_sheet_num = ?, sos_summary = ?, sales1_id = ?, sales1_name = ?, order_type = ?, contract_acnt_name = ?, iipo_no = ?, exf1 = ?, exf1_sts = ?, invoice_no1 = ?, etd1 = ?, eta1 = ?, checked_on = ?, next_check = ?, for_info = ?, pmt_trms = ?, customer_etd = ?, customer_po_num = ?  WHERE indent_sheet_num = ?";

    String getRevMasterData = "select indent_sheet_num, sos_summary,sales1_id,sales1_name,order_type,contract_acnt_name,iipo_no,exf1,\n" +
            "exf1_sts,invoice_no1,etd1,eta1,checked_on,next_check,for_info,pmt_sts,del_sts,pmt_trms,req_etd_by_customer, customer_po_num from indentmaster.master_data where indent_sheet_num = ?";

    String getRevMasterDataFrService = "select indent_sheet_num,indent_issue_date, sos_summary, sales1_id, sales1_name, sales2_id, sales2_name, order_type, contract_acnt_name, cntr_country, cntr_address,\n" +
            "user_acnt_name,ua_country ,ua_address, ua_contact_person , ua_tel, ua_email, pmt_trms,pmt_sts,del_sts from indentmaster.master_data where indent_sheet_num = ?";

    String regionEmailList = " SELECT * FROM indentmaster.region_emails ";
    String getEmailFlags2 = "select email_flag from indentmaster.email_data where id = '2'";
    String addRegion = "INSERT into indentmaster.region_emails (region) VALUES (?)";
    String saveRegionEmails = " update indentmaster.region_emails set emails = ? where region = ?";
    String setEmailFlag2 = "UPDATE indentmaster.email_data SET email_flag = ? WHERE id = '2'";


    public String getUPDATERollBackServiceMasterData() {
        return UPDATERollBackServiceMasterData;
    }

    public void setUPDATERollBackServiceMasterData(String UPDATERollBackServiceMasterData) {
        this.UPDATERollBackServiceMasterData = UPDATERollBackServiceMasterData;
    }
    public String getGETMASTEREXFDATES() {
        return GETMASTEREXFDATES;
    }

    public void setGETMASTEREXFDATES(String GETMASTEREXFDATES) {
        this.GETMASTEREXFDATES = GETMASTEREXFDATES;
    }

    public String getUPDATEPEXFDATE() {
        return UPDATEPEXFDATE;
    }

    public void setUPDATEPEXFDATE(String UPDATEPEXFDATE) {
        this.UPDATEPEXFDATE = UPDATEPEXFDATE;
    }

    public String getInsertIndentServiceMaster() {
        return InsertIndentServiceMaster;
    }

    public void setInsertIndentServiceMaster(String insertIndentServiceMaster) {
        InsertIndentServiceMaster = insertIndentServiceMaster;
    }

    public String getUPDATEServiceMasterData() {
        return UPDATEServiceMasterData;
    }

    public void setUPDATEServiceMasterData(String UPDATEServiceMasterData) {
        this.UPDATEServiceMasterData = UPDATEServiceMasterData;
    }

    public String getGetRevMasterDataFrService() {
        return getRevMasterDataFrService;
    }

    public void setGetRevMasterDataFrService(String getRevMasterDataFrService) {
        this.getRevMasterDataFrService = getRevMasterDataFrService;
    }

    public String getAddRegion() {
        return addRegion;
    }

    public void setAddRegion(String addRegion) {
        this.addRegion = addRegion;
    }

    public String getSaveRegionEmails() {
        return saveRegionEmails;
    }

    public void setSaveRegionEmails(String saveRegionEmails) {
        this.saveRegionEmails = saveRegionEmails;
    }

    public String getSetEmailFlag2() {
        return setEmailFlag2;
    }

    public void setSetEmailFlag2(String setEmailFlag2) {
        this.setEmailFlag2 = setEmailFlag2;
    }

    public String getRegionEmailList() {
        return regionEmailList;
    }

    public void setRegionEmailList(String regionEmailList) {
        this.regionEmailList = regionEmailList;
    }

    public String getGetEmailFlags2() {
        return getEmailFlags2;
    }

    public void setGetEmailFlags2(String getEmailFlags2) {
        this.getEmailFlags2 = getEmailFlags2;
    }

    public String getGetCustomerInfo() {
        return getCustomerInfo;
    }

    public void setGetCustomerInfo(String getCustomerInfo) {
        this.getCustomerInfo = getCustomerInfo;
    }

    public String getUPDATEDBMasterData() {
        return UPDATEDBMasterData;
    }

    public void setUPDATEDBMasterData(String UPDATEDBMasterData) {
        this.UPDATEDBMasterData = UPDATEDBMasterData;
    }

    public String getGetRevMasterData() {
        return getRevMasterData;
    }

    public void setGetRevMasterData(String getRevMasterData) {
        this.getRevMasterData = getRevMasterData;
    }

    public String getInsertIndentDbMasterData() {
        return InsertIndentDbMasterData;
    }

    public void setInsertIndentDbMasterData(String insertIndentDbMasterData) {
        InsertIndentDbMasterData = insertIndentDbMasterData;
    }

    public String getGetSales1EmailId() {
        return getSales1EmailId;
    }

    public void setGetSales1EmailId(String getSales1EmailId) {
        this.getSales1EmailId = getSales1EmailId;
    }

    public String getGetSales1Id() {
        return getSales1Id;
    }

    public void setGetSales1Id(String getSalles1Id) {
        this.getSales1Id = getSalles1Id;
    }

    public String getEmailForInvEwb() {
        return emailForInvEwb;
    }

    public void setEmailForInvEwb(String emailForInvEwb) {
        this.emailForInvEwb = emailForInvEwb;
    }

    public String getCcEmailForInvEwb() {
        return ccEmailForInvEwb;
    }

    public void setCcEmailForInvEwb(String ccEmailForInvEwb) {
        this.ccEmailForInvEwb = ccEmailForInvEwb;
    }

    public String getGetEmailFlag2() {
        return getEmailFlag2;
    }

    public void setGetEmailFlag2(String getEmailFlag2) {
        this.getEmailFlag2 = getEmailFlag2;
    }

    public String getREVINDUPDATEINDOCUMENTDATA() {
        return REVINDUPDATEINDOCUMENTDATA;
    }

    public void setREVINDUPDATEINDOCUMENTDATA(String REVINDUPDATEINDOCUMENTDATA) {
        this.REVINDUPDATEINDOCUMENTDATA = REVINDUPDATEINDOCUMENTDATA;
    }

    public String getREVINDUPDATEINIMAGEDATA() {
        return REVINDUPDATEINIMAGEDATA;
    }

    public void setREVINDUPDATEINIMAGEDATA(String REVINDUPDATEINIMAGEDATA) {
        this.REVINDUPDATEINIMAGEDATA = REVINDUPDATEINIMAGEDATA;
    }

    public String getLastExfDateLog() {
        return lastExfDateLog;
    }

    public void setLastExfDateLog(String lastExfDateLog) {
        this.lastExfDateLog = lastExfDateLog;
    }

    public String getGetEmailFlag() {
        return getEmailFlag;
    }

    public void setGetEmailFlag(String getEmailFlag) {
        this.getEmailFlag = getEmailFlag;
    }

    public String getEmailForIIEXF() {
        return emailForIIEXF;
    }

    public void setEmailForIIEXF(String emailForIIEXF) {
        this.emailForIIEXF = emailForIIEXF;
    }

    public String getCcmailForIIEXF() {
        return ccmailForIIEXF;
    }

    public void setCcmailForIIEXF(String ccmailForIIEXF) {
        this.ccmailForIIEXF = ccmailForIIEXF;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }


    public DBGetQuery() {
    }

    public String getEmailData() {
        return emailData;
    }

    public String getInsertEmail() {
        return insertEmail;
    }

    public void setEmailData(String emailData) {
        this.emailData = emailData;
    }

    public String getEmailList() {
        return emailList;
    }

    public void setEmailList(String emailList) {
        this.emailList = emailList;
    }

    public String getAccountInfo() {
        return accountInfo;
    }

    public void setAccountInfo(String accountInfo) {
        this.accountInfo = accountInfo;
    }

    public String getExfDateandstatus() {
        return exfDateandstatus;
    }

    public void setExfDateandstatus(String exfDateandstatus) {
        this.exfDateandstatus = exfDateandstatus;
    }

    public String getUSERAUTHENTICATE() {
        return USERAUTHENTICATE;
    }

    public String getCheckTempPassExists() {
        return checkTempPassExists;
    }

    public String getDeveloperLogin() {
        return developerLogin;
    }

    public String getMatchUserWithEmail() {
        return matchUserWithEmail;
    }

    public String getUpdateTempPassword() {
        return updateTempPassword;
    }

    public String getResetPassword() {
        return resetPassword;
    }

    public String getFetchUserPassword() {
        return fetchUserPassword;
    }

    public String getGetIndentNo() {
        return GetIndentNo;
    }

    public String getUpdatePassword() {
        return updatePassword;
    }

    public String getUpdateLoginStatus() {
        return updateLoginStatus;
    }

    public String getUserList() {
        return userList;
    }

    public String getActiveUserList() {
        return activeUserList;
    }

    public String getInActiveUserList() {
        return inActiveUserList;
    }

    public String getDepartmentList() {
        return departmentList;
    }

    public String getDesignationist() {
        return designationist;
    }

    public String getUserRoleList() {
        return userRoleList;
    }

    public String getCurrentUserCount() {
        return currentUserCount;
    }

    public String getActiveUserCount() {
        return activeUserCount;
    }

    public String getInActiveUserCount() {
        return inActiveUserCount;
    }

    public String getInsertUser() {
        return insertUser;
    }

    public String getUpdateUser() {
        return updateUser;
    }

    public String getDeleteUser() {
        return deleteUser;
    }

    public void setGetIndentNo(String getIndentNo) {
        GetIndentNo = getIndentNo;
    }

    public String getInsertIndentData() {
        return InsertIndentData;
    }

    public void setInsertIndentData(String insertIndentData) {
        InsertIndentData = insertIndentData;
    }

    public String getInsertIndentSubData() {
        return InsertIndentSubData;
    }

    public void setInsertIndentSubData(String insertIndentSubData) {
        InsertIndentSubData = insertIndentSubData;
    }

    public void setREVISIONSELINSERT(String rEVISIONSELINSERT) {
        REVISIONSELINSERT = rEVISIONSELINSERT;
    }

    public void setCURREVDELETE(String cURREVDELETE) {
        CURREVDELETE = cURREVDELETE;
    }

    public void setPREREVDELETE(String pREREVDELETE) {
        PREREVDELETE = pREREVDELETE;
    }

    public void setCHECKINDNOEXISTSTS(String cHECKINDNOEXISTSTS) {
        CHECKINDNOEXISTSTS = cHECKINDNOEXISTSTS;
    }

    public void setCHECKREVINDNOEXISTSTS(String cHECKREVINDNOEXISTSTS) {
        CHECKREVINDNOEXISTSTS = cHECKREVINDNOEXISTSTS;
    }

    public void setREVISEDUPDATEINDENTNO(String rEVISEDUPDATEINDENTNO) {
        REVISEDUPDATEINDENTNO = rEVISEDUPDATEINDENTNO;
    }

    public String getRevisdedIndentList() {
        return RevisdedIndentList;
    }

    public void setRevisdedIndentList(String revisdedIndentList) {
        RevisdedIndentList = revisdedIndentList;
    }

    public String getRevisedListwithIndent() {
        return RevisedListwithIndent;
    }

    public void setRevisedListwithIndent(String revisedListwithIndent) {
        RevisedListwithIndent = revisedListwithIndent;
    }

    public String getGetYearList() {
        return GetYearList;
    }

    public void setGetYearList(String getYearList) {
        GetYearList = getYearList;
    }

    public String getGetSelectedYearDetails() {
        return GetSelectedYearDetails;
    }

    public void setGetSelectedYearDetails(String getSelectedYearDetails) {
        GetSelectedYearDetails = getSelectedYearDetails;
    }

    public String getGetSelectedYearDetailsWithFilters() {
        return GetSelectedYearDetailsWithFilters;
    }

    public void setGetSelectedYearDetailsWithFilters(String getSelectedYearDetailsWithFilters) {
        GetSelectedYearDetailsWithFilters = getSelectedYearDetailsWithFilters;
    }

    public String getGETNextAction_Today() {
        return GETNextAction_Today;
    }

    public void setGETNextAction_Today(String gETNextAction_Today) {
        GETNextAction_Today = gETNextAction_Today;
    }

    public String getGetAllRevisedNextDate() {
        return GetAllRevisedNextDate;
    }

    public void setGetAllRevisedNextDate(String getAllRevisedNextDate) {
        GetAllRevisedNextDate = getAllRevisedNextDate;
    }

    public String getGetIndentDetail() {
        return GetIndentDetail;
    }

    public void setGetIndentDetail(String getIndentDetail) {
        GetIndentDetail = getIndentDetail;
    }

    public String getIndentSubDetail() {
        return IndentSubDetail;
    }

    public void setIndentSubDetail(String indentSubDetail) {
        IndentSubDetail = indentSubDetail;
    }

    public String getGetIndent() {
        return GetIndent;
    }

    public void setGetIndent(String getIndent) {
        GetIndent = getIndent;
    }

    public String getSNFSIGNALCNT() {
        return SNFSIGNALCNT;
    }

    public void setSNFSIGNALCNT(String sNFSIGNALCNT) {
        SNFSIGNALCNT = sNFSIGNALCNT;
    }

    public String getAPSIGNALCNT() {
        return APSIGNALCNT;
    }

    public void setAPSIGNALCNT(String aPSIGNALCNT) {
        APSIGNALCNT = aPSIGNALCNT;
    }

    public String getLCSIGNALCNT() {
        return LCSIGNALCNT;
    }

    public void setLCSIGNALCNT(String lCSIGNALCNT) {
        LCSIGNALCNT = lCSIGNALCNT;
    }

    public String getBPSIGNALCNT() {
        return BPSIGNALCNT;
    }

    public void setBPSIGNALCNT(String bPSIGNALCNT) {
        BPSIGNALCNT = bPSIGNALCNT;
    }

    public String getOUTSIGNALCNT() {
        return OUTSIGNALCNT;
    }

    public void setOUTSIGNALCNT(String oUTSIGNALCNT) {
        OUTSIGNALCNT = oUTSIGNALCNT;
    }

    public String getPNSSIGNALCNT() {
        return PNSSIGNALCNT;
    }

    public void setPNSSIGNALCNT(String pNSSIGNALCNT) {
        PNSSIGNALCNT = pNSSIGNALCNT;
    }

    public String getLCPSIGNALCNT() {
        return LCPSIGNALCNT;
    }

    public void setLCPSIGNALCNT(String lCPSIGNALCNT) {
        LCPSIGNALCNT = lCPSIGNALCNT;
    }

    public String getPEXFSIGNALCNT() {
        return PEXFSIGNALCNT;
    }

    public void setPEXFSIGNALCNT(String pEXFSIGNALCNT) {
        PEXFSIGNALCNT = pEXFSIGNALCNT;
    }

    public String getFEXFSIGNALCNT() {
        return FEXFSIGNALCNT;
    }

    public void setFEXFSIGNALCNT(String fEXFSIGNALCNT) {
        FEXFSIGNALCNT = fEXFSIGNALCNT;
    }

    public String getSSPSIGNALCNT() {
        return SSPSIGNALCNT;
    }

    public void setSSPSIGNALCNT(String sSPSIGNALCNT) {
        SSPSIGNALCNT = sSPSIGNALCNT;
    }

    public String getSAPSIGNALCNT() {
        return SAPSIGNALCNT;
    }

    public void setSAPSIGNALCNT(String sAPSIGNALCNT) {
        SAPSIGNALCNT = sAPSIGNALCNT;
    }

    public String getYLLSNFSIGNALCNT() {
        return YLLSNFSIGNALCNT;
    }

    public void setYLLSNFSIGNALCNT(String yLLSNFSIGNALCNT) {
        YLLSNFSIGNALCNT = yLLSNFSIGNALCNT;
    }

    public String getYLLAPSIGNALCNT() {
        return YLLAPSIGNALCNT;
    }

    public void setYLLAPSIGNALCNT(String yLLAPSIGNALCNT) {
        YLLAPSIGNALCNT = yLLAPSIGNALCNT;
    }

    public String getYLLLCSIGNALCNT() {
        return YLLLCSIGNALCNT;
    }

    public void setYLLLCSIGNALCNT(String yLLLCSIGNALCNT) {
        YLLLCSIGNALCNT = yLLLCSIGNALCNT;
    }

    public String getYLLBPSIGNALCNT() {
        return YLLBPSIGNALCNT;
    }

    public void setYLLBPSIGNALCNT(String yLLBPSIGNALCNT) {
        YLLBPSIGNALCNT = yLLBPSIGNALCNT;
    }

    public String getYLLOUTSIGNALCNT() {
        return YLLOUTSIGNALCNT;
    }

    public void setYLLOUTSIGNALCNT(String yLLOUTSIGNALCNT) {
        YLLOUTSIGNALCNT = yLLOUTSIGNALCNT;
    }

    public String getYLLPNSSIGNALCNT() {
        return YLLPNSSIGNALCNT;
    }

    public void setYLLPNSSIGNALCNT(String yLLPNSSIGNALCNT) {
        YLLPNSSIGNALCNT = yLLPNSSIGNALCNT;
    }

    public String getYLLLCPSIGNALCNT() {
        return YLLLCPSIGNALCNT;
    }

    public void setYLLLCPSIGNALCNT(String yLLLCPSIGNALCNT) {
        YLLLCPSIGNALCNT = yLLLCPSIGNALCNT;
    }

    public String getYLLPEXFSIGNALCNT() {
        return YLLPEXFSIGNALCNT;
    }

    public void setYLLPEXFSIGNALCNT(String yLLPEXFSIGNALCNT) {
        YLLPEXFSIGNALCNT = yLLPEXFSIGNALCNT;
    }

    public String getYLLFEXFSIGNALCNT() {
        return YLLFEXFSIGNALCNT;
    }

    public void setYLLFEXFSIGNALCNT(String yLLFEXFSIGNALCNT) {
        YLLFEXFSIGNALCNT = yLLFEXFSIGNALCNT;
    }

    public String getYLLSSPSIGNALCNT() {
        return YLLSSPSIGNALCNT;
    }

    public void setYLLSSPSIGNALCNT(String yLLSSPSIGNALCNT) {
        YLLSSPSIGNALCNT = yLLSSPSIGNALCNT;
    }

    public String getYLLSAPSIGNALCNT() {
        return YLLSAPSIGNALCNT;
    }

    public void setYLLSAPSIGNALCNT(String yLLSAPSIGNALCNT) {
        YLLSAPSIGNALCNT = yLLSAPSIGNALCNT;
    }

    public String getBLUFILTERSNF() {
        return BLUFILTERSNF;
    }

    public void setBLUFILTERSNF(String bLUFILTERSNF) {
        BLUFILTERSNF = bLUFILTERSNF;
    }

    public String getBLUFILTERADV() {
        return BLUFILTERADV;
    }

    public void setBLUFILTERADV(String bLUFILTERADV) {
        BLUFILTERADV = bLUFILTERADV;
    }

    public String getBLUFILTERLC() {
        return BLUFILTERLC;
    }

    public void setBLUFILTERLC(String bLUFILTERLC) {
        BLUFILTERLC = bLUFILTERLC;
    }

    public String getBLUFILTERBSH() {
        return BLUFILTERBSH;
    }

    public void setBLUFILTERBSH(String bLUFILTERBSH) {
        BLUFILTERBSH = bLUFILTERBSH;
    }

    public String getBLUFILTEROUT() {
        return BLUFILTEROUT;
    }

    public void setBLUFILTEROUT(String bLUFILTEROUT) {
        BLUFILTEROUT = bLUFILTEROUT;
    }

    public String getBLUFILTERPNS() {
        return BLUFILTERPNS;
    }

    public void setBLUFILTERPNS(String bLUFILTERPNS) {
        BLUFILTERPNS = bLUFILTERPNS;
    }

    public String getBLUFILTERLCP() {
        return BLUFILTERLCP;
    }

    public void setBLUFILTERLCP(String bLUFILTERLCP) {
        BLUFILTERLCP = bLUFILTERLCP;
    }

    public String getBLUFILTERPXEF() {
        return BLUFILTERPXEF;
    }

    public void setBLUFILTERPXEF(String bLUFILTERPXEF) {
        BLUFILTERPXEF = bLUFILTERPXEF;
    }

    public String getBLUFILTERFEXF() {
        return BLUFILTERFEXF;
    }

    public void setBLUFILTERFEXF(String bLUFILTERFEXF) {
        BLUFILTERFEXF = bLUFILTERFEXF;
    }

    public String getBLUFILTERSSP() {
        return BLUFILTERSSP;
    }

    public void setBLUFILTERSSP(String bLUFILTERSSP) {
        BLUFILTERSSP = bLUFILTERSSP;
    }

    public String getBLUFILTERSAP() {
        return BLUFILTERSAP;
    }

    public void setBLUFILTERSAP(String bLUFILTERSAP) {
        BLUFILTERSAP = bLUFILTERSAP;
    }

    public String getYELLFILTERSNF() {
        return YELLFILTERSNF;
    }

    public void setYELLFILTERSNF(String yELLFILTERSNF) {
        YELLFILTERSNF = yELLFILTERSNF;
    }

    public String getYELLFILTERADV() {
        return YELLFILTERADV;
    }

    public void setYELLFILTERADV(String yELLFILTERADV) {
        YELLFILTERADV = yELLFILTERADV;
    }

    public String getYELLFILTERLC() {
        return YELLFILTERLC;
    }

    public void setYELLFILTERLC(String yELLFILTERLC) {
        YELLFILTERLC = yELLFILTERLC;
    }

    public String getYELLFILTERBSH() {
        return YELLFILTERBSH;
    }

    public void setYELLFILTERBSH(String yELLFILTERBSH) {
        YELLFILTERBSH = yELLFILTERBSH;
    }

    public String getYELLFILTEROUT() {
        return YELLFILTEROUT;
    }

    public void setYELLFILTEROUT(String yELLFILTEROUT) {
        YELLFILTEROUT = yELLFILTEROUT;
    }

    public String getYELLFILTERPNS() {
        return YELLFILTERPNS;
    }

    public void setYELLFILTERPNS(String yELLFILTERPNS) {
        YELLFILTERPNS = yELLFILTERPNS;
    }

    public String getYELLFILTERLCP() {
        return YELLFILTERLCP;
    }

    public void setYELLFILTERLCP(String yELLFILTERLCP) {
        YELLFILTERLCP = yELLFILTERLCP;
    }

    public String getYELLFILTERPXEF() {
        return YELLFILTERPXEF;
    }

    public void setYELLFILTERPXEF(String yELLFILTERPXEF) {
        YELLFILTERPXEF = yELLFILTERPXEF;
    }

    public String getYELLFILTERFEXF() {
        return YELLFILTERFEXF;
    }

    public void setYELLFILTERFEXF(String yELLFILTERFEXF) {
        YELLFILTERFEXF = yELLFILTERFEXF;
    }

    public String getYELLFILTERSSP() {
        return YELLFILTERSSP;
    }

    public void setYELLFILTERSSP(String yELLFILTERSSP) {
        YELLFILTERSSP = yELLFILTERSSP;
    }

    public String getYELLFILTERSAP() {
        return YELLFILTERSAP;
    }

    public void setYELLFILTERSAP(String yELLFILTERSAP) {
        YELLFILTERSAP = yELLFILTERSAP;
    }

    public String getALLINDENTLIST() {
        return ALLINDENTLIST;
    }

    public void setALLINDENTLIST(String aLLINDENTLIST) {
        ALLINDENTLIST = aLLINDENTLIST;
    }

    public String getINDVINDENTDETAIL() {
        return INDVINDENTDETAIL;
    }

    public void setINDVINDENTDETAIL(String iNDVINDENTDETAIL) {
        INDVINDENTDETAIL = iNDVINDENTDETAIL;
    }

    public String getCHECKINDNOEXISTSTS() {
        return CHECKINDNOEXISTSTS;
    }

    public String getCHECKREVINDNOEXISTSTS() {
        return CHECKREVINDNOEXISTSTS;
    }

    public String getREVISIONSELINSERT() {
        return REVISIONSELINSERT;
    }

    public String getCURREVDELETE() {
        return CURREVDELETE;
    }

    public String getPREREVDELETE() {
        return PREREVDELETE;
    }

    public String getREVISEDUPDATEINDENTNO() {
        return REVISEDUPDATEINDENTNO;
    }

    public String getREVSELINSERTSUBMASTER() {
        return REVSELINSERTSUBMASTER;
    }

    public String getPREREVSUBMASTERDELETE() {
        return PREREVSUBMASTERDELETE;
    }

    public String getREVINDUPDATEINSUBMASTER() {
        return REVINDUPDATEINSUBMASTER;
    }

    public String getApplicationLogs() {
        return applicationLogs;
    }

    public void setApplicationLogs(String applicationLogs) {
        this.applicationLogs = applicationLogs;
    }

    public String getInsertApplicationLog() {
        return insertApplicationLog;
    }

    public void setInsertApplicationLog(String insertApplicationLog) {
        this.insertApplicationLog = insertApplicationLog;
    }

    public String getApplictionLogWithDate() {
        return applictionLogWithDate;
    }

    public void setApplictionLogWithDate(String applictionLogWithDate) {
        this.applictionLogWithDate = applictionLogWithDate;
    }

    public String getInsertApplicationLogBck() {
        return insertApplicationLogBck;
    }

    public void setInsertApplicationLogBck(String insertApplicationLogBck) {
        this.insertApplicationLogBck = insertApplicationLogBck;
    }

    public String getDeleteApplicationLog() {
        return deleteApplicationLog;
    }

    public void setDeleteApplicationLog(String deleteApplicationLog) {
        this.deleteApplicationLog = deleteApplicationLog;
    }


    public String getREVINDUPDATEINPAYMENTDATA() {
        return REVINDUPDATEINPAYMENTDATA;
    }

    public String getREVINDUPDATEININVOICEDATA() {
        return REVINDUPDATEININVOICEDATA;
    }


    public void setREVINDUPDATEINPAYMENTDATA(String rEVINDUPDATEINPAYMENTDATA) {
        REVINDUPDATEINPAYMENTDATA = rEVINDUPDATEINPAYMENTDATA;
    }

    public void setREVINDUPDATEININVOICEDATA(String rEVINDUPDATEININVOICEDATA) {
        REVINDUPDATEININVOICEDATA = rEVINDUPDATEININVOICEDATA;
    }


    public String getQueryCheckPoNumExist() {
        return queryCheckPoNumExist;
    }

    public void setQueryCheckPoNumExist(String queryCheckPoNumExist) {
        this.queryCheckPoNumExist = queryCheckPoNumExist;
    }

    public String getQueryGetIndentUsingPoNumExist() {
        return queryGetIndentUsingPoNumExist;
    }

    public String getQueryGetPmtListUsingPoNum() {
        return queryGetPmtListUsingPoNum;
    }

    public String getQueryGetMasterPmtListUsingPoNum() {
        return queryGetMasterPmtListUsingPoNum;
    }

    public String getQueryForCustomerPoNumberExist() {
        return queryForCustomerPoNumberExist;
    }

    public String getGETEXFDATES() {
        return GETEXFDATES;
    }

    public void setGETEXFDATES(String GETEXFDATES) {
        this.GETEXFDATES = GETEXFDATES;
    }

    public String getUPDATEPRODDATE() {
        return UPDATEPRODDATE;
    }

    public void setUPDATEPRODDATE(String UPDATEPRODDATE) {
        this.UPDATEPRODDATE = UPDATEPRODDATE;
    }


}
