package config;

public class DBFileManagementQuery {
	
	// Query String of joined master and submaster data:    this string is used in the following getIndentByDate, getAllIndent and all other following queries. 
	String joinMasterAndSubMasterQuery ="Select master.indent_sheet_num, "
			+ "master.indent_issue_date, "
			+ "master.crm_opt_num, "
			+ "master.sos_summary, "
			+ "master.sales1_id, "
			+ "master.sales1_name, "
			+ "master.sales2_id, "
			+ "master.sales2_name, "
			+ "master.order_type, "
			+ "master.customer_po_num, "
			+ "master.customer_po_date, "
			+ "master.contract_acnt_name, "
			+ "master.cntr_code, "
			+ "master.cntr_country, "
			+ "master.cntr_address, "
			+ "master.cntr_tel, "
			+ "master.cntr_gst_code, "
			+ "master.cntr_contact_person, "
			+ "master.cntr_email, "
			+ "master.user_acnt_name, "
			+ "master.ua_code, "
			+ "master.ua_country, "
			+ "master.ua_address, "
			+ "master.ua_tel, "
			+ "master.ua_gst_code, "
			+ "master.ua_contact_person, "
			+ "master.ua_email, "
			+ "master.key_account_flag, "
			+ "master.sp_cur, "
			+ "master.lp_total, "
			+ "master.sp_total, "
			+ "master.pck_and_fwd_amnt, "
			+ "master.domestic_freight_amnt, "
			+ "master.sgst_pc, "
			+ "master.sgst_amount, "
			+ "master.cgst_pc, "
			+ "master.cgst_amount, "
			+ "master.igst_pc, "
			+ "master.igst_amount, "
			+ "master.inst_com_amnt, "
			+ "master.tp_cur, "
			+ "master.tp1, "
			+ "master.tp2, "
			+ "master.iigm, "
			+ "master.pmt_trms, "
			+ "master.adv_type, "
			+ "master.adv_pc, "
			+ "master.adv_amount, "
			+ "master.adv_date, "
			+ "master.bsh_type, "
			+ "master.bsh_pc, "
			+ "master.bsh_amount, "
			+ "master.bsh_date, "
			+ "master.ash_type, "
			+ "master.ash_pc, "
			+ "master.ash_amount, "
			+ "master.ash_date, "
			+ "master.thirdp_com_cur, "
			+ "master.thirdp_com_amnt, "
			+ "master.thirdp_com_paid_by, "
			+ "master.com_acnt_name, "
			+ "master.com_code, "
			+ "master.com_country, "
			+ "master.com_address, "
			+ "master.com_tel, "
			+ "master.com_gst_code, "
			+ "master.com_contact_person, "
			+ "master.com_email, "
			+ "master.csutomer_application_code, "
			+ "master.customer_application_type, "
			+ "master.customer_app_desc, "
			+ "master.req_etd_by_customer, "
			+ "master.req_eta_by_customer, "
			+ "master.trd_trms_with_customer, "
			+ "master.dest_port_by_customer, "
			+ "master.mot, "
			+ "master.freight1, "
			+ "master.req_etd_to_ij, "
			+ "master.req_eta_to_ij, "
			+ "master.trd_trms_with_ij, "
			+ "master.dest_port_to_ij, "
			+ "master.mot_to_ij, "
			+ "master.freight2, "
			+ "master.coo, "
			+ "master.epa, "
			+ "master.ip, "
			+ "master.free_detention_period, "
			+ "master.consignee_acnt_name, "
			+ "master.cns_code, "
			+ "master.cns_country, "
			+ "master.cns_address, "
			+ "master.cns_tel, "
			+ "master.cns_gst_code, "
			+ "master.cns_contact_person, "
			+ "master.cns_email, "
			+ "master.cns_iec_code, "
			+ "master.bank_name_on_cad, "
			+ "master.address, "
			+ "master.tel, "
			+ "master.notify_acnt_name, "
			+ "master.ntf_code, "
			+ "master.ntf_country, "
			+ "master.ntf_address, "
			+ "master.ntf_tel, "
			+ "master.ntf_gst_code, "
			+ "master.ntf_contact_person, "
			+ "master.ntf_email, "
			+ "master.production_start, "
			+ "master.oth_customer_po_sheet, "
			+ "master.oth_sr_spec_sheet, "
			+ "master.oth_drawing, "
			+ "master.oth_test_report, "
			+ "master.oth_pi, "
			+ "master.oth_lc_draft, "
			+ "master.oth_doc1, "
			+ "master.oth_doc2, "
			+ "master.remarks1, "
			+ "master.pi_no, "
			+ "master.pi_date, "
			+ "master.iipo_no, "
			+ "master.iipo_date, "
			+ "master.ij_project_num, "
			+ "master.oc_date, "
			+ "master.sa_date, "
			+ "master.lc_chk_date_by_ij, "
			+ "master.lc_open_date, "
			+ "master.lc_last_revision_date, "
			+ "master.latest_shipment_date, "
			+ "master.lc_expiry_date, "
			+ "master.exf1, "
			+ "master.exf1_sts, "
			+ "master.exf_ij_accment1, "
			+ "master.exf2, "
			+ "master.exf2_sts, "
			+ "master.exf_ij_accment2, "
			+ "master.exf3, "
			+ "master.exf3_sts, "
			+ "master.exf_ij_accment3, "
			+ "master.fob_fowarder, "
			+ "master.invoice_no1, "
			+ "master.invoice_date1, "
			+ "master.mode1, "
			+ "master.from1, "
			+ "master.vessel1, "
			+ "master.awb_bl_no1, "
			+ "master.etd1, "
			+ "master.eta1, "
			+ "master.invoice_no2, "
			+ "master.invoice_date2, "
			+ "master.mode2, "
			+ "master.from2, "
			+ "master.vessel2, "
			+ "master.awb_bl_no2, "
			+ "master.etd2, "
			+ "master.eta2, "
			+ "master.invoice_no3, "
			+ "master.invoice_date3, "
			+ "master.mode3, "
			+ "master.from3, "
			+ "master.vessel3, "
			+ "master.awb_bl_no3, "
			+ "master.etd3, "
			+ "master.eta3, "
			+ "master.eway_bill_req, "
			+ "master.eway_bill_num, "
			+ "master.remarks2, "
			+ "master.com_month, "
			+ "master.checked_on, "
			+ "master.next_check, "
			+ "master.for_info, "
			+ "master.pmt_sts, "
			+ "master.del_sts, "
			+ "master.updated_by, "
			+ "sub_data.job_no,  "
			+ "sub_data.prd_ord_date,  "
			+ "sub_data.oc_no,  "
			+ "sub_data.oc_date as s_oc_date,  "
			+ "sub_data.del_sts as s_del_sts,  "
			+ "sub_data.exf1_date,  "
			+ "sub_data.exf1_sts as s_exf1_sts,  "
			+ "sub_data.exf1_annc_date,  "
			+ "sub_data.exf2_date,  "
			+ "sub_data.exf2_sts as s_exf2_sts,  "
			+ "sub_data.exf2_annc_date,  "
			+ "sub_data.exf3_date,  "
			+ "sub_data.exf3_sts as s_exf3_sts,  "
			+ "sub_data.exf3_annc_date,  "
			+ "sub_data.abg_request_anct_date,  "
			+ "sub_data.abg_issuance_date,  "
			+ "sub_data.abg_final_submission_draft_date,  "
			+ "sub_data.abg_final_submission_bg_date,  "
			+ "sub_data.pbg_request_anct_date,  "
			+ "sub_data.pbg_issuance_date,  "
			+ "sub_data.pbg_final_submission_draft_date,  "
			+ "sub_data.pbg_final_submission_bg_date "
			+ " "
			+ "from indentmaster.master_data AS master  "
			+ "INNER JOIN indentmaster.master_sub_data as sub_data  "
			+ "ON master.indent_sheet_num = sub_data.indent_sheet_num ";
	String getIndentsByDate =joinMasterAndSubMasterQuery+" where indent_issue_date between ? and ?";
//	String getAllIndents ="SELECT * FROM master_data";
	String getAllIndents =joinMasterAndSubMasterQuery;
	
	String orderBeforeSalesIndent = joinMasterAndSubMasterQuery+" WHERE master.del_sts in ('D-0', 'D-1', 'D-2')";
	String outstandingIndent = joinMasterAndSubMasterQuery+" WHERE master.del_sts = 'D-3' AND master.pmt_sts in ('P-0', 'P-1', 'P-2')";
	String noBshAfterFexfIndent = joinMasterAndSubMasterQuery+" WHERE master.del_sts in ('D-1', 'D-2') AND master.pmt_sts in ('P-0', 'P-1')";
	String noAdvIndent =joinMasterAndSubMasterQuery+" WHERE master.adv_amount>0 AND master.pmt_sts = 'P-0'";
	String noFexfIndent =joinMasterAndSubMasterQuery+" WHERE datediff(CURDATE(), master.indent_issue_date) > 14 AND master.del_sts = 'D-0'";
	String noShpScheduleFixIndent =joinMasterAndSubMasterQuery+" WHERE master.del_sts = 'D-2' AND master.pmt_sts ='P-2'";
	String cancelledIndent =joinMasterAndSubMasterQuery+" WHERE master.del_sts = 'D-9' AND master.pmt_sts ='P-9'";
	
	String indentInvoiceData = "select\r\n"
			+ "master.indent_sheet_num,\r\n"
			+ "master.indent_issue_date, "
			+ "master.crm_opt_num, "
			+ "master.sos_summary, "
			+ "master.sales1_id, "
			+ "master.sales1_name, "
			+ "master.sales2_id, "
			+ "master.sales2_name, "
			+ "master.order_type, "
			+ "master.customer_po_num, "
			+ "master.customer_po_date, "
			+ "master.contract_acnt_name, "
			+ "master.cntr_code, "
			+ "master.cntr_country, "
			+ "master.cntr_address, "
			+ "master.cntr_tel, "
			+ "master.cntr_gst_code, "
			+ "master.cntr_contact_person, "
			+ "master.cntr_email, "
			+ "master.user_acnt_name, "
			+ "master.ua_code, "
			+ "master.ua_country, "
			+ "master.ua_address, "
			+ "master.ua_tel, "
			+ "master.ua_gst_code, "
			+ "master.ua_contact_person, "
			+ "master.ua_email, "
			+ "master.key_account_flag, "
			+ "master.sp_cur, "
			+ "master.lp_total, "
			+ "master.sp_total, "
			+ "master.pck_and_fwd_amnt, "
			+ "master.domestic_freight_amnt, "
			+ "master.sgst_pc, "
			+ "master.sgst_amount, "
			+ "master.cgst_pc, "
			+ "master.cgst_amount, "
			+ "master.igst_pc, "
			+ "master.igst_amount, "
			+ "master.inst_com_amnt, "
			+ "master.tp_cur, "
			+ "master.tp1, "
			+ "master.tp2, "
			+ "master.iigm, "
			+ "master.pmt_trms, "
			+ "master.adv_type, "
			+ "master.adv_pc, "
			+ "master.adv_amount, "
			+ "master.adv_date, "
			+ "master.bsh_type, "
			+ "master.bsh_pc, "
			+ "master.bsh_amount, "
			+ "master.bsh_date, "
			+ "master.ash_type, "
			+ "master.ash_pc, "
			+ "master.ash_amount, "
			+ "master.ash_date, "
			+ "master.thirdp_com_cur, "
			+ "master.thirdp_com_amnt, "
			+ "master.thirdp_com_paid_by, "
			+ "master.com_acnt_name, "
			+ "master.com_code, "
			+ "master.com_country, "
			+ "master.com_address, "
			+ "master.com_tel, "
			+ "master.com_gst_code, "
			+ "master.com_contact_person, "
			+ "master.com_email, "
			+ "master.csutomer_application_code, "
			+ "master.customer_application_type, "
			+ "master.customer_app_desc, "
			+ "master.req_etd_by_customer, "
			+ "master.req_eta_by_customer, "
			+ "master.trd_trms_with_customer, "
			+ "master.dest_port_by_customer, "
			+ "master.mot, "
			+ "master.freight1, "
			+ "master.req_etd_to_ij, "
			+ "master.req_eta_to_ij, "
			+ "master.trd_trms_with_ij, "
			+ "master.dest_port_to_ij, "
			+ "master.mot_to_ij, "
			+ "master.freight2, "
			+ "master.coo, "
			+ "master.epa, "
			+ "master.ip, "
			+ "master.free_detention_period, "
			+ "master.consignee_acnt_name, "
			+ "master.cns_code, "
			+ "master.cns_country, "
			+ "master.cns_address, "
			+ "master.cns_tel, "
			+ "master.cns_gst_code, "
			+ "master.cns_contact_person, "
			+ "master.cns_email, "
			+ "master.cns_iec_code, "
			+ "master.bank_name_on_cad, "
			+ "master.address, "
			+ "master.tel, "
			+ "master.notify_acnt_name, "
			+ "master.ntf_code, "
			+ "master.ntf_country, "
			+ "master.ntf_address, "
			+ "master.ntf_tel, "
			+ "master.ntf_gst_code, "
			+ "master.ntf_contact_person, "
			+ "master.ntf_email, "
			+ "master.production_start, "
			+ "master.oth_customer_po_sheet, "
			+ "master.oth_sr_spec_sheet, "
			+ "master.oth_drawing, "
			+ "master.oth_test_report, "
			+ "master.oth_pi, "
			+ "master.oth_lc_draft, "
			+ "master.oth_doc1, "
			+ "master.oth_doc2, "
			+ "master.remarks1, "
			+ "master.pi_no, "
			+ "master.pi_date, "
			+ "master.iipo_no, "
			+ "master.iipo_date, "
			+ "master.ij_project_num, "
			+ "master.oc_date, "
			+ "master.sa_date, "
			+ "master.lc_chk_date_by_ij, "
			+ "master.lc_open_date, "
			+ "master.lc_last_revision_date, "
			+ "master.latest_shipment_date, "
			+ "master.lc_expiry_date, "
			+ "master.exf1, "
			+ "master.exf1_sts, "
			+ "master.exf_ij_accment1, "
			+ "master.exf2, "
			+ "master.exf2_sts, "
			+ "master.exf_ij_accment2, "
			+ "master.exf3, "
			+ "master.exf3_sts, "
			+ "master.exf_ij_accment3, "
			+ "master.fob_fowarder, "
			+ "master.invoice_no1, "
			+ "master.invoice_date1, "
			+ "master.mode1, "
			+ "master.from1, "
			+ "master.vessel1, "
			+ "master.awb_bl_no1, "
			+ "master.etd1, "
			+ "master.eta1, "
			+ "master.invoice_no2, "
			+ "master.invoice_date2, "
			+ "master.mode2, "
			+ "master.from2, "
			+ "master.vessel2, "
			+ "master.awb_bl_no2, "
			+ "master.etd2, "
			+ "master.eta2, "
			+ "master.invoice_no3, "
			+ "master.invoice_date3, "
			+ "master.mode3, "
			+ "master.from3, "
			+ "master.vessel3, "
			+ "master.awb_bl_no3, "
			+ "master.etd3, "
			+ "master.eta3, "
			+ "master.eway_bill_req, "
			+ "master.eway_bill_num, "
			+ "master.remarks2, "
			+ "master.com_month, "
			+ "master.checked_on, "
			+ "master.next_check, "
			+ "master.for_info, "
			+ "master.pmt_sts, "
			+ "master.del_sts, "
			+ "invoice_data.id,\r\n"
			+ "invoice_data.invoice_id,\r\n"
			+ "invoice_data.inv_request_anct_date,\r\n"
			+ "invoice_data.inv_issuance_date,\r\n"
			+ "invoice_data.inv_no,\r\n"
			+ "invoice_data.ewb_no,\r\n"
			+ "invoice_data.ewb_issuance_date,\r\n"
			+ "invoice_data.transportation_method,\r\n"
			+ "invoice_data.dispatch_date,\r\n"
			+ "invoice_data.dispatch_from_indent,\r\n"
			+ "invoice_data.dispatch_from_origin,\r\n"
			+ "invoice_data.dispatch_to_indent,\r\n"
			+ "invoice_data.dispatch_to_destination,\r\n"
			+ "invoice_data.machine_sn\r\n"
			+ "from indentmaster.master_data AS master \r\n"
			+ "LEFT JOIN indentmaster.indent_invoice_data as invoice_data \r\n"
			+ "ON master.indent_sheet_num = invoice_data.indent_sheet_num ";
	
	String indentPaymentData = "select \r\n"
			+ "master.indent_sheet_num,\r\n"
			+ "master.indent_issue_date, "
			+ "master.crm_opt_num, "
			+ "master.sos_summary, "
			+ "master.sales1_id, "
			+ "master.sales1_name, "
			+ "master.sales2_id, "
			+ "master.sales2_name, "
			+ "master.order_type, "
			+ "master.customer_po_num, "
			+ "master.customer_po_date, "
			+ "master.contract_acnt_name, "
			+ "master.cntr_code, "
			+ "master.cntr_country, "
			+ "master.cntr_address, "
			+ "master.cntr_tel, "
			+ "master.cntr_gst_code, "
			+ "master.cntr_contact_person, "
			+ "master.cntr_email, "
			+ "master.user_acnt_name, "
			+ "master.ua_code, "
			+ "master.ua_country, "
			+ "master.ua_address, "
			+ "master.ua_tel, "
			+ "master.ua_gst_code, "
			+ "master.ua_contact_person, "
			+ "master.ua_email, "
			+ "master.key_account_flag, "
			+ "master.sp_cur, "
			+ "master.lp_total, "
			+ "master.sp_total, "
			+ "master.pck_and_fwd_amnt, "
			+ "master.domestic_freight_amnt, "
			+ "master.sgst_pc, "
			+ "master.sgst_amount, "
			+ "master.cgst_pc, "
			+ "master.cgst_amount, "
			+ "master.igst_pc, "
			+ "master.igst_amount, "
			+ "master.inst_com_amnt, "
			+ "master.tp_cur, "
			+ "master.tp1, "
			+ "master.tp2, "
			+ "master.iigm, "
			+ "master.pmt_trms, "
			+ "master.adv_type, "
			+ "master.adv_pc, "
			+ "master.adv_amount, "
			+ "master.adv_date, "
			+ "master.bsh_type, "
			+ "master.bsh_pc, "
			+ "master.bsh_amount, "
			+ "master.bsh_date, "
			+ "master.ash_type, "
			+ "master.ash_pc, "
			+ "master.ash_amount, "
			+ "master.ash_date, "
			+ "master.thirdp_com_cur, "
			+ "master.thirdp_com_amnt, "
			+ "master.thirdp_com_paid_by, "
			+ "master.com_acnt_name, "
			+ "master.com_code, "
			+ "master.com_country, "
			+ "master.com_address, "
			+ "master.com_tel, "
			+ "master.com_gst_code, "
			+ "master.com_contact_person, "
			+ "master.com_email, "
			+ "master.csutomer_application_code, "
			+ "master.customer_application_type, "
			+ "master.customer_app_desc, "
			+ "master.req_etd_by_customer, "
			+ "master.req_eta_by_customer, "
			+ "master.trd_trms_with_customer, "
			+ "master.dest_port_by_customer, "
			+ "master.mot, "
			+ "master.freight1, "
			+ "master.req_etd_to_ij, "
			+ "master.req_eta_to_ij, "
			+ "master.trd_trms_with_ij, "
			+ "master.dest_port_to_ij, "
			+ "master.mot_to_ij, "
			+ "master.freight2, "
			+ "master.coo, "
			+ "master.epa, "
			+ "master.ip, "
			+ "master.free_detention_period, "
			+ "master.consignee_acnt_name, "
			+ "master.cns_code, "
			+ "master.cns_country, "
			+ "master.cns_address, "
			+ "master.cns_tel, "
			+ "master.cns_gst_code, "
			+ "master.cns_contact_person, "
			+ "master.cns_email, "
			+ "master.cns_iec_code, "
			+ "master.bank_name_on_cad, "
			+ "master.address, "
			+ "master.tel, "
			+ "master.notify_acnt_name, "
			+ "master.ntf_code, "
			+ "master.ntf_country, "
			+ "master.ntf_address, "
			+ "master.ntf_tel, "
			+ "master.ntf_gst_code, "
			+ "master.ntf_contact_person, "
			+ "master.ntf_email, "
			+ "master.production_start, "
			+ "master.oth_customer_po_sheet, "
			+ "master.oth_sr_spec_sheet, "
			+ "master.oth_drawing, "
			+ "master.oth_test_report, "
			+ "master.oth_pi, "
			+ "master.oth_lc_draft, "
			+ "master.oth_doc1, "
			+ "master.oth_doc2, "
			+ "master.remarks1, "
			+ "master.pi_no, "
			+ "master.pi_date, "
			+ "master.iipo_no, "
			+ "master.iipo_date, "
			+ "master.ij_project_num, "
			+ "master.oc_date, "
			+ "master.sa_date, "
			+ "master.lc_chk_date_by_ij, "
			+ "master.lc_open_date, "
			+ "master.lc_last_revision_date, "
			+ "master.latest_shipment_date, "
			+ "master.lc_expiry_date, "
			+ "master.exf1, "
			+ "master.exf1_sts, "
			+ "master.exf_ij_accment1, "
			+ "master.exf2, "
			+ "master.exf2_sts, "
			+ "master.exf_ij_accment2, "
			+ "master.exf3, "
			+ "master.exf3_sts, "
			+ "master.exf_ij_accment3, "
			+ "master.fob_fowarder, "
			+ "master.invoice_no1, "
			+ "master.invoice_date1, "
			+ "master.mode1, "
			+ "master.from1, "
			+ "master.vessel1, "
			+ "master.awb_bl_no1, "
			+ "master.etd1, "
			+ "master.eta1, "
			+ "master.invoice_no2, "
			+ "master.invoice_date2, "
			+ "master.mode2, "
			+ "master.from2, "
			+ "master.vessel2, "
			+ "master.awb_bl_no2, "
			+ "master.etd2, "
			+ "master.eta2, "
			+ "master.invoice_no3, "
			+ "master.invoice_date3, "
			+ "master.mode3, "
			+ "master.from3, "
			+ "master.vessel3, "
			+ "master.awb_bl_no3, "
			+ "master.etd3, "
			+ "master.eta3, "
			+ "master.eway_bill_req, "
			+ "master.eway_bill_num, "
			+ "master.remarks2, "
			+ "master.com_month, "
			+ "master.checked_on, "
			+ "master.next_check, "
			+ "master.for_info, "
			+ "master.pmt_sts, "
			+ "master.del_sts, "
			+ "payment_data.id,\r\n"
			+ "payment_data.payment_type as payment_type, "
			+ "payment_data.payment_date as payment_date, "
			+ "payment_data.payment_amount as payment_amount "
			+ "from indentmaster.master_data AS master "
			+ "LEFT JOIN indentmaster.indent_payment_data as payment_data \r\n"
			+ "ON master.indent_sheet_num = payment_data.indent_sheet_num";
	
	
	//   Invoice DATA with filters

	String allIndentInvoiceData = indentInvoiceData;
	String dateRangeIndentInvoiceData = indentInvoiceData + " where indent_issue_date between ? and ?  ";
	
	String orderBeforeSalesIndentInvoiceData = indentInvoiceData+" WHERE master.del_sts in ('D-0', 'D-1', 'D-2')  ";
	String outstandingIndentInvoiceData = indentInvoiceData+" WHERE master.del_sts = 'D-3' AND master.pmt_sts in ('P-0', 'P-1', 'P-2')  ";
	String noBshAfterFexfIndentInvoiceData = indentInvoiceData+" WHERE master.del_sts in ('D-1', 'D-2') AND master.pmt_sts in ('P-0', 'P-1')  ";
	String noAdvIndentInvoiceData =indentInvoiceData+" WHERE master.adv_amount>0 AND master.pmt_sts = 'P-0' ";
	String noFexfIndentInvoiceData =indentInvoiceData+" WHERE datediff(CURDATE(), master.indent_issue_date) > 14 AND master.del_sts = 'D-0' ";
	String noShpScheduleFixIndentInvoiceData =indentInvoiceData+" WHERE master.del_sts = 'D-2' AND master.pmt_sts ='P-2' ";
	String cancelledIndentInvoiceData =indentInvoiceData+" WHERE master.del_sts = 'D-9' AND master.pmt_sts ='P-9'";
	
	// payment Data with Filters
	String allIndentPaymentData = indentPaymentData ;
	String dateRangeIndentPaymentData = indentPaymentData + " where indent_issue_date between ? and ? ";
	
	String orderBeforeSalesIndentPaymentData = indentPaymentData+" WHERE master.del_sts in ('D-0', 'D-1', 'D-2') ";
	String outstandingIndentPaymentData = indentPaymentData+" WHERE master.del_sts = 'D-3' AND master.pmt_sts in ('P-0', 'P-1', 'P-2') ";
	String noBshAfterFexfIndentPaymentData = indentPaymentData+" WHERE master.del_sts in ('D-1', 'D-2') AND master.pmt_sts in ('P-0', 'P-1') ";
	String noAdvIndentPaymentData =indentPaymentData+" WHERE master.adv_amount>0 AND master.pmt_sts = 'P-0' ";
	String noFexfIndentPaymentData =indentPaymentData+" WHERE datediff(CURDATE(), master.indent_issue_date) > 14 AND master.del_sts = 'D-0' ";
	String noShpScheduleFixIndentPaymentData =indentPaymentData+" WHERE master.del_sts = 'D-2' AND master.pmt_sts ='P-2' ";
	String cancelledIndentPaymentData =indentPaymentData+" WHERE master.del_sts = 'D-9' AND master.pmt_sts ='P-9' ";
	
	public String getGetIndentsByDate() {
		return getIndentsByDate;
	}

	// unused
	public void setGetIndentsByDate(String getIndentsByDate) {
		this.getIndentsByDate = getIndentsByDate;
	}
	public String getGetAllIndents() {
		return getAllIndents;
	}

	//unused
	public void setGetAllIndents(String getAllIndents) {
		this.getAllIndents = getAllIndents;
	}

	public String getOrderBeforeSalesIndent() {
		return orderBeforeSalesIndent;
	}

	public String getOutstandingIndent() {
		return outstandingIndent;
	}

	public String getNoBshAfterFexfIndent() {
		return noBshAfterFexfIndent;
	}

	public String getNoAdvIndent() {
		return noAdvIndent;
	}

	public String getNoFexfIndent() {
		return noFexfIndent;
	}

	public String getNoShpScheduleFixIndent() {
		return noShpScheduleFixIndent;
	}

	public String getCancelledIndent() {
		return cancelledIndent;
	}

	public void setOrderBeforeSalesIndent(String orderBeforeSalesIndent) {
		this.orderBeforeSalesIndent = orderBeforeSalesIndent;
	}

	public void setOutstandingIndent(String outstandingIndent) {
		this.outstandingIndent = outstandingIndent;
	}

	public void setNoBshAfterFexfIndent(String noBshAfterFexfIndent) {
		this.noBshAfterFexfIndent = noBshAfterFexfIndent;
	}

	public void setNoAdvIndent(String noAdvIndent) {
		this.noAdvIndent = noAdvIndent;
	}

	public void setNoFexfIndent(String noFexfIndent) {
		this.noFexfIndent = noFexfIndent;
	}

	public void setNoShpScheduleFixIndent(String noShpScheduleFixIndent) {
		this.noShpScheduleFixIndent = noShpScheduleFixIndent;
	}

	public void setCancelledIndent(String cancelledIndent) {
		this.cancelledIndent = cancelledIndent;
	}

	public String getAllIndentInvoiceData() {
		return allIndentInvoiceData;
	}

	public String getDateRangeIndentInvoiceData() {
		return dateRangeIndentInvoiceData;
	}

	public String getOrderBeforeSalesIndentInvoiceData() {
		return orderBeforeSalesIndentInvoiceData;
	}

	public String getOutstandingIndentInvoiceData() {
		return outstandingIndentInvoiceData;
	}

	public String getNoBshAfterFexfIndentInvoiceData() {
		return noBshAfterFexfIndentInvoiceData;
	}

	public String getNoAdvIndentInvoiceData() {
		return noAdvIndentInvoiceData;
	}

	public String getNoFexfIndentInvoiceData() {
		return noFexfIndentInvoiceData;
	}

	public String getNoShpScheduleFixIndentInvoiceData() {
		return noShpScheduleFixIndentInvoiceData;
	}

	public String getCancelledIndentInvoiceData() {
		return cancelledIndentInvoiceData;
	}

	public String getAllIndentPaymentData() {
		return allIndentPaymentData;
	}

	public String getDateRangeIndentPaymentData() {
		return dateRangeIndentPaymentData;
	}

	public String getOrderBeforeSalesIndentPaymentData() {
		return orderBeforeSalesIndentPaymentData;
	}

	public String getOutstandingIndentPaymentData() {
		return outstandingIndentPaymentData;
	}

	public String getNoBshAfterFexfIndentPaymentData() {
		return noBshAfterFexfIndentPaymentData;
	}

	public String getNoAdvIndentPaymentData() {
		return noAdvIndentPaymentData;
	}

	public String getNoFexfIndentPaymentData() {
		return noFexfIndentPaymentData;
	}

	public String getNoShpScheduleFixIndentPaymentData() {
		return noShpScheduleFixIndentPaymentData;
	}

	public String getCancelledIndentPaymentData() {
		return cancelledIndentPaymentData;
	}

	public void setAllIndentInvoiceData(String allIndentInvoiceData) {
		this.allIndentInvoiceData = allIndentInvoiceData;
	}

	public void setDateRangeIndentInvoiceData(String dateRangeIndentInvoiceData) {
		this.dateRangeIndentInvoiceData = dateRangeIndentInvoiceData;
	}

	public void setOrderBeforeSalesIndentInvoiceData(String orderBeforeSalesIndentInvoiceData) {
		this.orderBeforeSalesIndentInvoiceData = orderBeforeSalesIndentInvoiceData;
	}

	public void setOutstandingIndentInvoiceData(String outstandingIndentInvoiceData) {
		this.outstandingIndentInvoiceData = outstandingIndentInvoiceData;
	}

	public void setNoBshAfterFexfIndentInvoiceData(String noBshAfterFexfIndentInvoiceData) {
		this.noBshAfterFexfIndentInvoiceData = noBshAfterFexfIndentInvoiceData;
	}

	public void setNoAdvIndentInvoiceData(String noAdvIndentInvoiceData) {
		this.noAdvIndentInvoiceData = noAdvIndentInvoiceData;
	}

	public void setNoFexfIndentInvoiceData(String noFexfIndentInvoiceData) {
		this.noFexfIndentInvoiceData = noFexfIndentInvoiceData;
	}

	public void setNoShpScheduleFixIndentInvoiceData(String noShpScheduleFixIndentInvoiceData) {
		this.noShpScheduleFixIndentInvoiceData = noShpScheduleFixIndentInvoiceData;
	}

	public void setCancelledIndentInvoiceData(String cancelledIndentInvoiceData) {
		this.cancelledIndentInvoiceData = cancelledIndentInvoiceData;
	}

	public void setAllIndentPaymentData(String allIndentPaymentData) {
		this.allIndentPaymentData = allIndentPaymentData;
	}

	public void setDateRangeIndentPaymentData(String dateRangeIndentPaymentData) {
		this.dateRangeIndentPaymentData = dateRangeIndentPaymentData;
	}

	public void setOrderBeforeSalesIndentPaymentData(String orderBeforeSalesIndentPaymentData) {
		this.orderBeforeSalesIndentPaymentData = orderBeforeSalesIndentPaymentData;
	}

	public void setOutstandingIndentPaymentData(String outstandingIndentPaymentData) {
		this.outstandingIndentPaymentData = outstandingIndentPaymentData;
	}

	public void setNoBshAfterFexfIndentPaymentData(String noBshAfterFexfIndentPaymentData) {
		this.noBshAfterFexfIndentPaymentData = noBshAfterFexfIndentPaymentData;
	}

	public void setNoAdvIndentPaymentData(String noAdvIndentPaymentData) {
		this.noAdvIndentPaymentData = noAdvIndentPaymentData;
	}

	public void setNoFexfIndentPaymentData(String noFexfIndentPaymentData) {
		this.noFexfIndentPaymentData = noFexfIndentPaymentData;
	}

	public void setNoShpScheduleFixIndentPaymentData(String noShpScheduleFixIndentPaymentData) {
		this.noShpScheduleFixIndentPaymentData = noShpScheduleFixIndentPaymentData;
	}

	public void setCancelledIndentPaymentData(String cancelledIndentPaymentData) {
		this.cancelledIndentPaymentData = cancelledIndentPaymentData;
	}


	

	
	
}
