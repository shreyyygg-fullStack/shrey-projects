package model;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class IndentUpdateRequest {

	String pi_no;
	String pi_date;
	String iipo_no;
	String iipo_date;
	String ij_project_num;
	String oc_date;
	String exf1;
	String exf1_sts;
	String exf_ij_accment1;
	String exf2;
	String exf2_sts;
	String exf_ij_accment2;
	String exf3;
	String exf3_sts;
	String exf_ij_accment3;
	String del_sts;
	String adv_type;
	String adv_pc;
	String adv_amount;
	String adv_date;
	String bsh_type;
	String bsh_pc;
	String bsh_amount;
	String bsh_date;
	String ash_type;
	String ash_pc;
	String ash_amount;
	String ash_date;
	String pmt_sts;
	String lc_chk_date_by_ij;
	String lc_open_date;
	String lc_last_revision_date;
	String latest_shipment_date;
	String lc_expiry_date;
	String com_month;
	String invoice_no1;
	String invoice_date1;
	String mode1;
	String from1;
	String vessel1;
	String awb_bl_no1;
	String etd1;
	String eta1;
	String invoice_no2;
	String invoice_date2;
	String mode2;
	String from2;
	String vessel2;
	String awb_bl_no2;
	String etd2;
	String eta2;
	String invoice_no3;
	String invoice_date3;
	String mode3;
	String from3;
	String vessel3;
	String awb_bl_no3;
	String etd3;
	String eta3;
	String checked_on;
	String next_check;
	String for_info;
	String indent_sheet_num;

	String sos_summary;
	String user_acnt_name;
	String updated_by;

	String job_no;
	String prd_ord_date;
	String oc_no;
	String exf1_date;
	String exf1_annc_date;
	String exf2_date;
	String exf2_annc_date;
	String exf3_date;
	String exf3_annc_date;
	String abg_request_anct_date;
	String abg_issuance_date;
	String abg_final_submission_draft_date;
	String abg_final_submission_bg_date;
	String pbg_request_anct_date;
	String pbg_issuance_date;
	String pbg_final_submission_draft_date;
	String pbg_final_submission_bg_date;

	String invoice_id;
	String invoice_no;
	String invoice_date;
	String inv_request_anct_date;
	String inv_issuance_date;
	String inv_no;
	String ewb_no;
	String ewb_issuance_date;
	String transportation_method;
	String dispatch_date;
	String dispatch_from_indent;
	String dispatch_from_origin;
	String dispatch_to_indent;
	String dispatch_to_destination;

	String payment_id;
	String machine_sn;

	String id;
	String payment_type;
	String payment_date;
	String payment_amount;
	String customer_po_num;


	MultipartFile invoice_doc;
	MultipartFile ewb_doc;
	String inv_doc_name;
	String ewb_doc_name;

	public MultipartFile getInvoice_doc() {
		return invoice_doc;
	}

	public void setInvoice_doc(MultipartFile invoice_doc) {
		this.invoice_doc = invoice_doc;
	}

	public MultipartFile getEwb_doc() {
		return ewb_doc;
	}

	public void setEwb_doc(MultipartFile ewb_doc) {
		this.ewb_doc = ewb_doc;
	}

	public String getInv_doc_name() {
		return inv_doc_name;
	}

	public void setInv_doc_name(String inv_doc_name) {
		this.inv_doc_name = inv_doc_name;
	}

	public String getEwb_doc_name() {
		return ewb_doc_name;
	}

	public void setEwb_doc_name(String ewb_doc_name) {
		this.ewb_doc_name = ewb_doc_name;
	}

	public IndentUpdateRequest() {
		super();
	}

	public String getPi_no() {
		return pi_no;
	}

	public String getPayment_date() {
		return payment_date;
	}

	public String getPayment_amount() {
		return payment_amount;
	}

	public void setPayment_date(String payment_date) {
		this.payment_date = payment_date;
	}

	public void setPayment_amount(String payment_amount) {
		this.payment_amount = payment_amount;
	}

	public void setPi_no(String pi_no) {
		this.pi_no = pi_no;
	}

	public String getPi_date() {
		return pi_date;
	}

	public void setPi_date(String pi_date) {
		this.pi_date = pi_date;
	}

	public String getIipo_no() {
		return iipo_no;
	}

	public void setIipo_no(String iipo_no) {
		this.iipo_no = iipo_no;
	}

	public String getIipo_date() {
		return iipo_date;
	}

	public void setIipo_date(String iipo_date) {
		this.iipo_date = iipo_date;
	}

	public String getIj_project_num() {
		return ij_project_num;
	}

	public void setIj_project_num(String ij_project_num) {
		this.ij_project_num = ij_project_num;
	}

	public String getOc_date() {
		return oc_date;
	}

	public void setOc_date(String oc_date) {
		this.oc_date = oc_date;
	}

	public String getExf1() {
		return exf1;
	}

	public void setExf1(String exf1) {
		this.exf1 = exf1;
	}

	public String getExf1_sts() {
		return exf1_sts;
	}

	public void setExf1_sts(String exf1_sts) {
		this.exf1_sts = exf1_sts;
	}

	public String getExf_ij_accment1() {
		return exf_ij_accment1;
	}

	public void setExf_ij_accment1(String exf_ij_accment1) {
		this.exf_ij_accment1 = exf_ij_accment1;
	}

	public String getExf2() {
		return exf2;
	}

	public void setExf2(String exf2) {
		this.exf2 = exf2;
	}

	public String getExf2_sts() {
		return exf2_sts;
	}

	public void setExf2_sts(String exf2_sts) {
		this.exf2_sts = exf2_sts;
	}

	public String getExf_ij_accment2() {
		return exf_ij_accment2;
	}

	public void setExf_ij_accment2(String exf_ij_accment2) {
		this.exf_ij_accment2 = exf_ij_accment2;
	}

	public String getExf3() {
		return exf3;
	}

	public void setExf3(String exf3) {
		this.exf3 = exf3;
	}

	public String getExf3_sts() {
		return exf3_sts;
	}

	public void setExf3_sts(String exf3_sts) {
		this.exf3_sts = exf3_sts;
	}

	public String getExf_ij_accment3() {
		return exf_ij_accment3;
	}

	public void setExf_ij_accment3(String exf_ij_accment3) {
		this.exf_ij_accment3 = exf_ij_accment3;
	}

	public String getDel_sts() {
		return del_sts;
	}

	public void setDel_sts(String del_sts) {
		this.del_sts = del_sts;
	}

	public String getAdv_type() {
		return adv_type;
	}

	public void setAdv_type(String adv_type) {
		this.adv_type = adv_type;
	}

	public String getAdv_pc() {
		return adv_pc;
	}

	public void setAdv_pc(String adv_pc) {
		this.adv_pc = adv_pc;
	}

	public String getAdv_amount() {
		return adv_amount;
	}

	public void setAdv_amount(String adv_amount) {
		this.adv_amount = adv_amount;
	}

	public String getAdv_date() {
		return adv_date;
	}

	public void setAdv_date(String adv_date) {
		this.adv_date = adv_date;
	}

	public String getBsh_type() {
		return bsh_type;
	}

	public void setBsh_type(String bsh_type) {
		this.bsh_type = bsh_type;
	}

	public String getBsh_pc() {
		return bsh_pc;
	}

	public void setBsh_pc(String bsh_pc) {
		this.bsh_pc = bsh_pc;
	}

	public String getBsh_amount() {
		return bsh_amount;
	}

	public void setBsh_amount(String bsh_amount) {
		this.bsh_amount = bsh_amount;
	}

	public String getBsh_date() {
		return bsh_date;
	}

	public void setBsh_date(String bsh_date) {
		this.bsh_date = bsh_date;
	}

	public String getAsh_type() {
		return ash_type;
	}

	public void setAsh_type(String ash_type) {
		this.ash_type = ash_type;
	}

	public String getAsh_pc() {
		return ash_pc;
	}

	public void setAsh_pc(String ash_pc) {
		this.ash_pc = ash_pc;
	}

	public String getAsh_amount() {
		return ash_amount;
	}

	public void setAsh_amount(String ash_amount) {
		this.ash_amount = ash_amount;
	}

	public String getAsh_date() {
		return ash_date;
	}

	public void setAsh_date(String ash_date) {
		this.ash_date = ash_date;
	}

	public String getPmt_sts() {
		return pmt_sts;
	}

	public void setPmt_sts(String pmt_sts) {
		this.pmt_sts = pmt_sts;
	}

	public String getLc_chk_date_by_ij() {
		return lc_chk_date_by_ij;
	}

	public void setLc_chk_date_by_ij(String lc_chk_date_by_ij) {
		this.lc_chk_date_by_ij = lc_chk_date_by_ij;
	}

	public String getLc_open_date() {
		return lc_open_date;
	}

	public void setLc_open_date(String lc_open_date) {
		this.lc_open_date = lc_open_date;
	}

	public String getLc_last_revision_date() {
		return lc_last_revision_date;
	}

	public void setLc_last_revision_date(String lc_last_revision_date) {
		this.lc_last_revision_date = lc_last_revision_date;
	}

	public String getLatest_shipment_date() {
		return latest_shipment_date;
	}

	public void setLatest_shipment_date(String latest_shipment_date) {
		this.latest_shipment_date = latest_shipment_date;
	}

	public String getLc_expiry_date() {
		return lc_expiry_date;
	}

	public void setLc_expiry_date(String lc_expiry_date) {
		this.lc_expiry_date = lc_expiry_date;
	}

	public String getCom_month() {
		return com_month;
	}

	public void setCom_month(String com_month) {
		this.com_month = com_month;
	}

	public String getInvoice_no1() {
		return invoice_no1;
	}

	public void setInvoice_no1(String invoice_no1) {
		this.invoice_no1 = invoice_no1;
	}

	public String getInvoice_date1() {
		return invoice_date1;
	}

	public void setInvoice_date1(String invoice_date1) {
		this.invoice_date1 = invoice_date1;
	}

	public String getMode1() {
		return mode1;
	}

	public void setMode1(String mode11) {
		this.mode1 = mode11;
	}

	public String getFrom1() {
		return from1;
	}

	public void setFrom1(String from1) {
		this.from1 = from1;
	}

	public String getVessel1() {
		return vessel1;
	}

	public void setVessel1(String vessel1) {
		this.vessel1 = vessel1;
	}

	public String getAwb_bl_no1() {
		return awb_bl_no1;
	}

	public void setAwb_bl_no1(String awb_bl_no1) {
		this.awb_bl_no1 = awb_bl_no1;
	}

	public String getEtd1() {
		return etd1;
	}

	public void setEtd1(String etd1) {
		this.etd1 = etd1;
	}

	public String getEta1() {
		return eta1;
	}

	public void setEta1(String eta1) {
		this.eta1 = eta1;
	}

	public String getInvoice_no2() {
		return invoice_no2;
	}

	public void setInvoice_no2(String invoice_no2) {
		this.invoice_no2 = invoice_no2;
	}

	public String getInvoice_date2() {
		return invoice_date2;
	}

	public void setInvoice_date2(String invoice_date2) {
		this.invoice_date2 = invoice_date2;
	}

	public String getMode2() {
		return mode2;
	}

	public void setMode2(String mode2) {
		this.mode2 = mode2;
	}

	public String getFrom2() {
		return from2;
	}

	public void setFrom2(String from2) {
		this.from2 = from2;
	}

	public String getVessel2() {
		return vessel2;
	}

	public void setVessel2(String vessel2) {
		this.vessel2 = vessel2;
	}

	public String getAwb_bl_no2() {
		return awb_bl_no2;
	}

	public void setAwb_bl_no2(String awb_bl_no2) {
		this.awb_bl_no2 = awb_bl_no2;
	}

	public String getEtd2() {
		return etd2;
	}

	public void setEtd2(String etd2) {
		this.etd2 = etd2;
	}

	public String getEta2() {
		return eta2;
	}

	public void setEta2(String eta2) {
		this.eta2 = eta2;
	}

	public String getInvoice_no3() {
		return invoice_no3;
	}

	public void setInvoice_no3(String invoice_no3) {
		this.invoice_no3 = invoice_no3;
	}

	public String getInvoice_date3() {
		return invoice_date3;
	}

	public void setInvoice_date3(String invoice_date3) {
		this.invoice_date3 = invoice_date3;
	}

	public String getMode3() {
		return mode3;
	}

	public void setMode3(String mode3) {
		this.mode3 = mode3;
	}

	public String getFrom3() {
		return from3;
	}

	public void setFrom3(String from3) {
		this.from3 = from3;
	}

	public String getVessel3() {
		return vessel3;
	}

	public void setVessel3(String vessel3) {
		this.vessel3 = vessel3;
	}

	public String getAwb_bl_no3() {
		return awb_bl_no3;
	}

	public void setAwb_bl_no3(String awb_bl_no3) {
		this.awb_bl_no3 = awb_bl_no3;
	}

	public String getEtd3() {
		return etd3;
	}

	public void setEtd3(String etd3) {
		this.etd3 = etd3;
	}

	public String getEta3() {
		return eta3;
	}

	public void setEta3(String eta3) {
		this.eta3 = eta3;
	}

	public String getChecked_on() {
		return checked_on;
	}

	public void setChecked_on(String checked_on) {
		this.checked_on = checked_on;
	}

	public String getNext_check() {
		return next_check;
	}

	public void setNext_check(String next_check) {
		this.next_check = next_check;
	}

	public String getFor_info() {
		return for_info;
	}

	public void setFor_info(String for_info) {
		this.for_info = for_info;
	}

	public String getIndent_sheet_num() {
		return indent_sheet_num;
	}

	public void setIndent_sheet_num(String indent_sheet_num) {
		this.indent_sheet_num = indent_sheet_num;
	}

	public String getSos_summary() {
		return sos_summary;
	}

	public void setSos_summary(String sos_summary) {
		this.sos_summary = sos_summary;
	}

	public String getUser_acnt_name() {
		return user_acnt_name;
	}

	public void setUser_acnt_name(String user_acnt_name) {
		this.user_acnt_name = user_acnt_name;
	}

	public String getUpdated_by() {
		return updated_by;
	}

	public void setUpdated_by(String updated_by) {
		this.updated_by = updated_by;
	}

	public String getJob_no() {
		return job_no;
	}

	public void setJob_no(String job_no) {
		this.job_no = job_no;
	}

	public String getPrd_ord_date() {
		return prd_ord_date;
	}

	public void setPrd_ord_date(String prd_ord_date) {
		this.prd_ord_date = prd_ord_date;
	}

	public String getOc_no() {
		return oc_no;
	}

	public void setOc_no(String oc_no) {
		this.oc_no = oc_no;
	}

	public String getExf1_date() {
		return exf1_date;
	}

	public void setExf1_date(String exf1_date) {
		this.exf1_date = exf1_date;
	}

	public String getExf1_annc_date() {
		return exf1_annc_date;
	}

	public void setExf1_annc_date(String exf1_annc_date) {
		this.exf1_annc_date = exf1_annc_date;
	}

	public String getExf2_date() {
		return exf2_date;
	}

	public void setExf2_date(String exf2_date) {
		this.exf2_date = exf2_date;
	}

	public String getExf2_annc_date() {
		return exf2_annc_date;
	}

	public void setExf2_annc_date(String exf2_annc_date) {
		this.exf2_annc_date = exf2_annc_date;
	}

	public String getExf3_date() {
		return exf3_date;
	}

	public void setExf3_date(String exf3_date) {
		this.exf3_date = exf3_date;
	}

	public String getExf3_annc_date() {
		return exf3_annc_date;
	}

	public void setExf3_annc_date(String exf3_annc_date) {
		this.exf3_annc_date = exf3_annc_date;
	}

	public String getAbg_request_anct_date() {
		return abg_request_anct_date;
	}

	public void setAbg_request_anct_date(String abg_request_anct_date) {
		this.abg_request_anct_date = abg_request_anct_date;
	}

	public String getAbg_issuance_date() {
		return abg_issuance_date;
	}

	public void setAbg_issuance_date(String abg_issuance_date) {
		this.abg_issuance_date = abg_issuance_date;
	}

	public String getAbg_final_submission_draft_date() {
		return abg_final_submission_draft_date;
	}

	public void setAbg_final_submission_draft_date(String abg_final_submission_draft_date) {
		this.abg_final_submission_draft_date = abg_final_submission_draft_date;
	}

	public String getAbg_final_submission_bg_date() {
		return abg_final_submission_bg_date;
	}

	public void setAbg_final_submission_bg_date(String abg_final_submission_bg_date) {
		this.abg_final_submission_bg_date = abg_final_submission_bg_date;
	}

	public String getPbg_request_anct_date() {
		return pbg_request_anct_date;
	}

	public void setPbg_request_anct_date(String pbg_request_anct_date) {
		this.pbg_request_anct_date = pbg_request_anct_date;
	}

	public String getPbg_issuance_date() {
		return pbg_issuance_date;
	}

	public void setPbg_issuance_date(String pbg_issuance_date) {
		this.pbg_issuance_date = pbg_issuance_date;
	}

	public String getPbg_final_submission_draft_date() {
		return pbg_final_submission_draft_date;
	}

	public void setPbg_final_submission_draft_date(String pbg_final_submission_draft_date) {
		this.pbg_final_submission_draft_date = pbg_final_submission_draft_date;
	}

	public String getPbg_final_submission_bg_date() {
		return pbg_final_submission_bg_date;
	}

	public void setPbg_final_submission_bg_date(String pbg_final_submission_bg_date) {
		this.pbg_final_submission_bg_date = pbg_final_submission_bg_date;
	}

	public String getInvoice_id() {
		return invoice_id;
	}

	public void setInvoice_id(String invoice_id) {
		this.invoice_id = invoice_id;
	}

	public String getInvoice_no() {
		return invoice_no;
	}

	public void setInvoice_no(String invoice_no) {
		this.invoice_no = invoice_no;
	}

	public String getInvoice_date() {
		return invoice_date;
	}

	public void setInvoice_date(String invoice_date) {
		this.invoice_date = invoice_date;
	}

	public String getInv_request_anct_date() {
		return inv_request_anct_date;
	}

	public void setInv_request_anct_date(String inv_request_anct_date) {
		this.inv_request_anct_date = inv_request_anct_date;
	}

	public String getInv_issuance_date() {
		return inv_issuance_date;
	}

	public void setInv_issuance_date(String inv_issuance_date) {
		this.inv_issuance_date = inv_issuance_date;
	}

	public String getInv_no() {
		return inv_no;
	}

	public void setInv_no(String inv_no) {
		this.inv_no = inv_no;
	}

	public String getEwb_no() {
		return ewb_no;
	}

	public void setEwb_no(String ewb_no) {
		this.ewb_no = ewb_no;
	}

	public String getEwb_issuance_date() {
		return ewb_issuance_date;
	}

	public void setEwb_issuance_date(String ewb_issuance_date) {
		this.ewb_issuance_date = ewb_issuance_date;
	}

	public String getTransportation_method() {
		return transportation_method;
	}

	public void setTransportation_method(String transportation_method) {
		this.transportation_method = transportation_method;
	}

	public String getDispatch_date() {
		return dispatch_date;
	}

	public void setDispatch_date(String dispatch_date) {
		this.dispatch_date = dispatch_date;
	}

	public String getDispatch_from_indent() {
		return dispatch_from_indent;
	}

	public void setDispatch_from_indent(String dispatch_from_indent) {
		this.dispatch_from_indent = dispatch_from_indent;
	}

	public String getDispatch_from_origin() {
		return dispatch_from_origin;
	}

	public void setDispatch_from_origin(String dispatch_from_origin) {
		this.dispatch_from_origin = dispatch_from_origin;
	}

	public String getDispatch_to_indent() {
		return dispatch_to_indent;
	}

	public void setDispatch_to_indent(String dispatch_to_indent) {
		this.dispatch_to_indent = dispatch_to_indent;
	}

	public String getDispatch_to_destination() {
		return dispatch_to_destination;
	}

	public void setDispatch_to_destination(String dispatch_to_destination) {
		this.dispatch_to_destination = dispatch_to_destination;
	}

	public String getPayment_id() {
		return payment_id;
	}

	public void setPayment_id(String payment_id) {
		this.payment_id = payment_id;
	}

	public String getMachine_sn() {
		return machine_sn;
	}

	public void setMachine_sn(String machine_sn) {
		this.machine_sn = machine_sn;
	}


	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPayment_type() {
		return payment_type;
	}

	public void setPayment_type(String payment_type) {
		this.payment_type = payment_type;
	}


	public String getCustomer_po_num() {
		return customer_po_num;
	}

	public void setCustomer_po_num(String customer_po_num) {
		this.customer_po_num = customer_po_num;
	}
}
