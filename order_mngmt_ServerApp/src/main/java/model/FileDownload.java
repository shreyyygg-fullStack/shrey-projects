package model;

public class FileDownload {

	public String getIndent_sheet_num() {
		return indent_sheet_num;
	}
	public void setIndent_sheet_num(String indent_sheet_num) {
		this.indent_sheet_num = indent_sheet_num;
	}
	public String getIndent_issue_date() {
		return indent_issue_date;
	}
	public void setIndent_issue_date(String indent_issue_date) {
		this.indent_issue_date = indent_issue_date;
	}
	public String getCrm_opt_num() {
		return crm_opt_num;
	}
	public void setCrm_opt_num(String crm_opt_num) {
		this.crm_opt_num = crm_opt_num;
	}
	public String getSos_summary() {
		return sos_summary;
	}
	public void setSos_summary(String sos_summary) {
		this.sos_summary = sos_summary;
	}
	public String getSales1_id() {
		return sales1_id;
	}
	public void setSales1_id(String sales1_id) {
		this.sales1_id = sales1_id;
	}
	public String getSales1_name() {
		return sales1_name;
	}
	public void setSales1_name(String sales1_name) {
		this.sales1_name = sales1_name;
	}
	public String getSales2_id() {
		return sales2_id;
	}
	public void setSales2_id(String sales2_id) {
		this.sales2_id = sales2_id;
	}
	public String getSales2_name() {
		return sales2_name;
	}
	public void setSales2_name(String sales2_name) {
		this.sales2_name = sales2_name;
	}
	public String getOrder_type() {
		return order_type;
	}
	public FileDownload() {
		super();
	}
	public FileDownload(String indent_sheet_num, String indent_issue_date, String crm_opt_num, String sos_summary,
			String sales1_id, String sales1_name, String sales2_id, String sales2_name, String order_type,
			String customer_po_num, String customer_po_date, String contract_acnt_name, String cntr_code,
			String cntr_country, String cntr_address, String cntr_tel, String cntr_gst_code, String cntr_contact_person,
			String cntr_email, String user_acnt_name, String ua_code, String ua_country, String ua_address,
			String ua_tel, String ua_gst_code, String ua_contact_person, String ua_email, String key_account_flag,
			String sp_cur, String lp_total, String sp_total, String pck_and_fwd_amnt, String domestic_freight_amnt,
			String sgst_pc, String sgst_amount, String cgst_pc, String cgst_amount, String igst_pc, String igst_amount,
			String inst_com_amnt, String tp_cur, String tp1, String tp2, String iigm, String pmt_trms, String adv_type,
			String adv_pc, String adv_amount, String adv_date, String bsh_type, String bsh_pc, String bsh_amount,
			String bsh_date, String ash_type, String ash_pc, String ash_amount, String ash_date, String thirdp_com_cur,
			String thirdp_com_amnt, String thirdp_com_paid_by, String com_acnt_name, String com_code,
			String com_country, String com_address, String com_tel, String com_gst_code, String com_contact_person,
			String com_email, String csutomer_application_code, String customer_application_type,
			String customer_app_desc, String req_etd_by_customer, String req_eta_by_customer,
			String trd_trms_with_customer, String dest_port_by_customer, String mot, String freight1,
			String req_etd_to_ij, String req_eta_to_ij, String trd_trms_with_ij, String dest_port_to_ij,
			String mot_to_ij, String freight2, String coo, String epa, String ip, String free_detention_period,
			String consignee_acnt_name, String cns_code, String cns_country, String cns_address, String cns_tel,
			String cns_gst_code, String cns_contact_person, String cns_email, String cns_iec_code,
			String bank_name_on_cad, String address, String tel, String notify_acnt_name, String ntf_code,
			String ntf_country, String ntf_address, String ntf_tel, String ntf_gst_code, String ntf_contact_person,
			String ntf_email, String production_start, String oth_customer_po_sheet, String oth_sr_spec_sheet,
			String oth_drawing, String oth_test_report, String oth_pi, String oth_lc_draft, String oth_doc1,
			String oth_doc2, String remarks1, String pi_no, String pi_date, String iipo_no, String iipo_date,
			String ij_project_num, String oc_date, String sa_date, String lc_chk_date_by_ij, String lc_open_date,
			String lc_last_revision_date, String latest_shipment_date, String lc_expiry_date, String exf1,
			String exf1_sts, String exf_ij_accment1, String exf2, String exf2_sts, String exf_ij_accment2, String exf3,
			String exf3_sts, String exf_ij_accment3, String fob_fowarder, String invoice_no1, String invoice_date1,
			String mode1, String from1, String vessel1, String awb_bl_no1, String etd1, String eta1, String invoice_no2,
			String invoice_date2, String mode2, String from2, String vessel2, String awb_bl_no2, String etd2,
			String eta2, String invoice_no3, String invoice_date3, String mode3, String from3, String vessel3,
			String awb_bl_no3, String etd3, String eta3, String eway_bill_req, String eway_bill_num, String remarks2,
			String com_month, String checked_on, String next_check, String for_info, String pmt_sts, String del_sts) {
		super();
		this.indent_sheet_num = indent_sheet_num;
		this.indent_issue_date = indent_issue_date;
		this.crm_opt_num = crm_opt_num;
		this.sos_summary = sos_summary;
		this.sales1_id = sales1_id;
		this.sales1_name = sales1_name;
		this.sales2_id = sales2_id;
		this.sales2_name = sales2_name;
		this.order_type = order_type;
		this.customer_po_num = customer_po_num;
		this.customer_po_date = customer_po_date;
		this.contract_acnt_name = contract_acnt_name;
		this.cntr_code = cntr_code;
		this.cntr_country = cntr_country;
		this.cntr_address = cntr_address;
		this.cntr_tel = cntr_tel;
		this.cntr_gst_code = cntr_gst_code;
		this.cntr_contact_person = cntr_contact_person;
		this.cntr_email = cntr_email;
		this.user_acnt_name = user_acnt_name;
		this.ua_code = ua_code;
		this.ua_country = ua_country;
		this.ua_address = ua_address;
		this.ua_tel = ua_tel;
		this.ua_gst_code = ua_gst_code;
		this.ua_contact_person = ua_contact_person;
		this.ua_email = ua_email;
		this.key_account_flag = key_account_flag;
		this.sp_cur = sp_cur;
		this.lp_total = lp_total;
		this.sp_total = sp_total;
		this.pck_and_fwd_amnt = pck_and_fwd_amnt;
		this.domestic_freight_amnt = domestic_freight_amnt;
		this.sgst_pc = sgst_pc;
		this.sgst_amount = sgst_amount;
		this.cgst_pc = cgst_pc;
		this.cgst_amount = cgst_amount;
		this.igst_pc = igst_pc;
		this.igst_amount = igst_amount;
		this.inst_com_amnt = inst_com_amnt;
		this.tp_cur = tp_cur;
		this.tp1 = tp1;
		this.tp2 = tp2;
		this.iigm = iigm;
		this.pmt_trms = pmt_trms;
		this.adv_type = adv_type;
		this.adv_pc = adv_pc;
		this.adv_amount = adv_amount;
		this.adv_date = adv_date;
		this.bsh_type = bsh_type;
		this.bsh_pc = bsh_pc;
		this.bsh_amount = bsh_amount;
		this.bsh_date = bsh_date;
		this.ash_type = ash_type;
		this.ash_pc = ash_pc;
		this.ash_amount = ash_amount;
		this.ash_date = ash_date;
		this.thirdp_com_cur = thirdp_com_cur;
		this.thirdp_com_amnt = thirdp_com_amnt;
		this.thirdp_com_paid_by = thirdp_com_paid_by;
		this.com_acnt_name = com_acnt_name;
		this.com_code = com_code;
		this.com_country = com_country;
		this.com_address = com_address;
		this.com_tel = com_tel;
		this.com_gst_code = com_gst_code;
		this.com_contact_person = com_contact_person;
		this.com_email = com_email;
		this.csutomer_application_code = csutomer_application_code;
		this.customer_application_type = customer_application_type;
		this.customer_app_desc = customer_app_desc;
		this.req_etd_by_customer = req_etd_by_customer;
		this.req_eta_by_customer = req_eta_by_customer;
		this.trd_trms_with_customer = trd_trms_with_customer;
		this.dest_port_by_customer = dest_port_by_customer;
		this.mot = mot;
		this.freight1 = freight1;
		this.req_etd_to_ij = req_etd_to_ij;
		this.req_eta_to_ij = req_eta_to_ij;
		this.trd_trms_with_ij = trd_trms_with_ij;
		this.dest_port_to_ij = dest_port_to_ij;
		this.mot_to_ij = mot_to_ij;
		this.freight2 = freight2;
		this.coo = coo;
		this.epa = epa;
		this.ip = ip;
		this.free_detention_period = free_detention_period;
		this.consignee_acnt_name = consignee_acnt_name;
		this.cns_code = cns_code;
		this.cns_country = cns_country;
		this.cns_address = cns_address;
		this.cns_tel = cns_tel;
		this.cns_gst_code = cns_gst_code;
		this.cns_contact_person = cns_contact_person;
		this.cns_email = cns_email;
		this.cns_iec_code = cns_iec_code;
		this.bank_name_on_cad = bank_name_on_cad;
		this.address = address;
		this.tel = tel;
		this.notify_acnt_name = notify_acnt_name;
		this.ntf_code = ntf_code;
		this.ntf_country = ntf_country;
		this.ntf_address = ntf_address;
		this.ntf_tel = ntf_tel;
		this.ntf_gst_code = ntf_gst_code;
		this.ntf_contact_person = ntf_contact_person;
		this.ntf_email = ntf_email;
		this.production_start = production_start;
		this.oth_customer_po_sheet = oth_customer_po_sheet;
		this.oth_sr_spec_sheet = oth_sr_spec_sheet;
		this.oth_drawing = oth_drawing;
		this.oth_test_report = oth_test_report;
		this.oth_pi = oth_pi;
		this.oth_lc_draft = oth_lc_draft;
		this.oth_doc1 = oth_doc1;
		this.oth_doc2 = oth_doc2;
		this.remarks1 = remarks1;
		this.pi_no = pi_no;
		this.pi_date = pi_date;
		this.iipo_no = iipo_no;
		this.iipo_date = iipo_date;
		this.ij_project_num = ij_project_num;
		this.oc_date = oc_date;
		this.sa_date = sa_date;
		this.lc_chk_date_by_ij = lc_chk_date_by_ij;
		this.lc_open_date = lc_open_date;
		this.lc_last_revision_date = lc_last_revision_date;
		this.latest_shipment_date = latest_shipment_date;
		this.lc_expiry_date = lc_expiry_date;
		this.exf1 = exf1;
		this.exf1_sts = exf1_sts;
		this.exf_ij_accment1 = exf_ij_accment1;
		this.exf2 = exf2;
		this.exf2_sts = exf2_sts;
		this.exf_ij_accment2 = exf_ij_accment2;
		this.exf3 = exf3;
		this.exf3_sts = exf3_sts;
		this.exf_ij_accment3 = exf_ij_accment3;
		this.fob_fowarder = fob_fowarder;
		this.invoice_no1 = invoice_no1;
		this.invoice_date1 = invoice_date1;
		this.mode1 = mode1;
		this.from1 = from1;
		this.vessel1 = vessel1;
		this.awb_bl_no1 = awb_bl_no1;
		this.etd1 = etd1;
		this.eta1 = eta1;
		this.invoice_no2 = invoice_no2;
		this.invoice_date2 = invoice_date2;
		this.mode2 = mode2;
		this.from2 = from2;
		this.vessel2 = vessel2;
		this.awb_bl_no2 = awb_bl_no2;
		this.etd2 = etd2;
		this.eta2 = eta2;
		this.invoice_no3 = invoice_no3;
		this.invoice_date3 = invoice_date3;
		this.mode3 = mode3;
		this.from3 = from3;
		this.vessel3 = vessel3;
		this.awb_bl_no3 = awb_bl_no3;
		this.etd3 = etd3;
		this.eta3 = eta3;
		this.eway_bill_req = eway_bill_req;
		this.eway_bill_num = eway_bill_num;
		this.remarks2 = remarks2;
		this.com_month = com_month;
		this.checked_on = checked_on;
		this.next_check = next_check;
		this.for_info = for_info;
		this.pmt_sts = pmt_sts;
		this.del_sts = del_sts;
	}
	@Override
	public String toString() {
		return "FileDownload [indent_sheet_num=" + indent_sheet_num + ", indent_issue_date=" + indent_issue_date
				+ ", crm_opt_num=" + crm_opt_num + ", sos_summary=" + sos_summary + ", sales1_id=" + sales1_id
				+ ", sales1_name=" + sales1_name + ", sales2_id=" + sales2_id + ", sales2_name=" + sales2_name
				+ ", order_type=" + order_type + ", customer_po_num=" + customer_po_num + ", customer_po_date="
				+ customer_po_date + ", contract_acnt_name=" + contract_acnt_name + ", cntr_code=" + cntr_code
				+ ", cntr_country=" + cntr_country + ", cntr_address=" + cntr_address + ", cntr_tel=" + cntr_tel
				+ ", cntr_gst_code=" + cntr_gst_code + ", cntr_contact_person=" + cntr_contact_person + ", cntr_email="
				+ cntr_email + ", user_acnt_name=" + user_acnt_name + ", ua_code=" + ua_code + ", ua_country="
				+ ua_country + ", ua_address=" + ua_address + ", ua_tel=" + ua_tel + ", ua_gst_code=" + ua_gst_code
				+ ", ua_contact_person=" + ua_contact_person + ", ua_email=" + ua_email + ", key_account_flag="
				+ key_account_flag + ", sp_cur=" + sp_cur + ", lp_total=" + lp_total + ", sp_total=" + sp_total
				+ ", pck_and_fwd_amnt=" + pck_and_fwd_amnt + ", domestic_freight_amnt=" + domestic_freight_amnt
				+ ", sgst_pc=" + sgst_pc + ", sgst_amount=" + sgst_amount + ", cgst_pc=" + cgst_pc + ", cgst_amount="
				+ cgst_amount + ", igst_pc=" + igst_pc + ", igst_amount=" + igst_amount + ", inst_com_amnt="
				+ inst_com_amnt + ", tp_cur=" + tp_cur + ", tp1=" + tp1 + ", tp2=" + tp2 + ", iigm=" + iigm
				+ ", pmt_trms=" + pmt_trms + ", adv_type=" + adv_type + ", adv_pc=" + adv_pc + ", adv_amount="
				+ adv_amount + ", adv_date=" + adv_date + ", bsh_type=" + bsh_type + ", bsh_pc=" + bsh_pc
				+ ", bsh_amount=" + bsh_amount + ", bsh_date=" + bsh_date + ", ash_type=" + ash_type + ", ash_pc="
				+ ash_pc + ", ash_amount=" + ash_amount + ", ash_date=" + ash_date + ", thirdp_com_cur="
				+ thirdp_com_cur + ", thirdp_com_amnt=" + thirdp_com_amnt + ", thirdp_com_paid_by=" + thirdp_com_paid_by
				+ ", com_acnt_name=" + com_acnt_name + ", com_code=" + com_code + ", com_country=" + com_country
				+ ", com_address=" + com_address + ", com_tel=" + com_tel + ", com_gst_code=" + com_gst_code
				+ ", com_contact_person=" + com_contact_person + ", com_email=" + com_email
				+ ", csutomer_application_code=" + csutomer_application_code + ", customer_application_type="
				+ customer_application_type + ", customer_app_desc=" + customer_app_desc + ", req_etd_by_customer="
				+ req_etd_by_customer + ", req_eta_by_customer=" + req_eta_by_customer + ", trd_trms_with_customer="
				+ trd_trms_with_customer + ", dest_port_by_customer=" + dest_port_by_customer + ", mot=" + mot
				+ ", freight1=" + freight1 + ", req_etd_to_ij=" + req_etd_to_ij + ", req_eta_to_ij=" + req_eta_to_ij
				+ ", trd_trms_with_ij=" + trd_trms_with_ij + ", dest_port_to_ij=" + dest_port_to_ij + ", mot_to_ij="
				+ mot_to_ij + ", freight2=" + freight2 + ", coo=" + coo + ", epa=" + epa + ", ip=" + ip
				+ ", free_detention_period=" + free_detention_period + ", consignee_acnt_name=" + consignee_acnt_name
				+ ", cns_code=" + cns_code + ", cns_country=" + cns_country + ", cns_address=" + cns_address
				+ ", cns_tel=" + cns_tel + ", cns_gst_code=" + cns_gst_code + ", cns_contact_person="
				+ cns_contact_person + ", cns_email=" + cns_email + ", cns_iec_code=" + cns_iec_code
				+ ", bank_name_on_cad=" + bank_name_on_cad + ", address=" + address + ", tel=" + tel
				+ ", notify_acnt_name=" + notify_acnt_name + ", ntf_code=" + ntf_code + ", ntf_country=" + ntf_country
				+ ", ntf_address=" + ntf_address + ", ntf_tel=" + ntf_tel + ", ntf_gst_code=" + ntf_gst_code
				+ ", ntf_contact_person=" + ntf_contact_person + ", ntf_email=" + ntf_email + ", production_start="
				+ production_start + ", oth_customer_po_sheet=" + oth_customer_po_sheet + ", oth_sr_spec_sheet="
				+ oth_sr_spec_sheet + ", oth_drawing=" + oth_drawing + ", oth_test_report=" + oth_test_report
				+ ", oth_pi=" + oth_pi + ", oth_lc_draft=" + oth_lc_draft + ", oth_doc1=" + oth_doc1 + ", oth_doc2="
				+ oth_doc2 + ", remarks1=" + remarks1 + ", pi_no=" + pi_no + ", pi_date=" + pi_date + ", iipo_no="
				+ iipo_no + ", iipo_date=" + iipo_date + ", ij_project_num=" + ij_project_num + ", oc_date=" + oc_date
				+ ", sa_date=" + sa_date + ", lc_chk_date_by_ij=" + lc_chk_date_by_ij + ", lc_open_date=" + lc_open_date
				+ ", lc_last_revision_date=" + lc_last_revision_date + ", latest_shipment_date=" + latest_shipment_date
				+ ", lc_expiry_date=" + lc_expiry_date + ", exf1=" + exf1 + ", exf1_sts=" + exf1_sts
				+ ", exf_ij_accment1=" + exf_ij_accment1 + ", exf2=" + exf2 + ", exf2_sts=" + exf2_sts
				+ ", exf_ij_accment2=" + exf_ij_accment2 + ", exf3=" + exf3 + ", exf3_sts=" + exf3_sts
				+ ", exf_ij_accment3=" + exf_ij_accment3 + ", fob_fowarder=" + fob_fowarder + ", invoice_no1="
				+ invoice_no1 + ", invoice_date1=" + invoice_date1 + ", mode1=" + mode1 + ", from1=" + from1
				+ ", vessel1=" + vessel1 + ", awb_bl_no1=" + awb_bl_no1 + ", etd1=" + etd1 + ", eta1=" + eta1
				+ ", invoice_no2=" + invoice_no2 + ", invoice_date2=" + invoice_date2 + ", mode2=" + mode2 + ", from2="
				+ from2 + ", vessel2=" + vessel2 + ", awb_bl_no2=" + awb_bl_no2 + ", etd2=" + etd2 + ", eta2=" + eta2
				+ ", invoice_no3=" + invoice_no3 + ", invoice_date3=" + invoice_date3 + ", mode3=" + mode3 + ", from3="
				+ from3 + ", vessel3=" + vessel3 + ", awb_bl_no3=" + awb_bl_no3 + ", etd3=" + etd3 + ", eta3=" + eta3
				+ ", eway_bill_req=" + eway_bill_req + ", eway_bill_num=" + eway_bill_num + ", remarks2=" + remarks2
				+ ", com_month=" + com_month + ", checked_on=" + checked_on + ", next_check=" + next_check
				+ ", for_info=" + for_info + ", pmt_sts=" + pmt_sts + ", del_sts=" + del_sts + "]";
	}
	public void setOrder_type(String order_type) {
		this.order_type = order_type;
	}
	public String getCustomer_po_num() {
		return customer_po_num;
	}
	public void setCustomer_po_num(String customer_po_num) {
		this.customer_po_num = customer_po_num;
	}
	public String getCustomer_po_date() {
		return customer_po_date;
	}
	public void setCustomer_po_date(String customer_po_date) {
		this.customer_po_date = customer_po_date;
	}
	public String getContract_acnt_name() {
		return contract_acnt_name;
	}
	public void setContract_acnt_name(String contract_acnt_name) {
		this.contract_acnt_name = contract_acnt_name;
	}
	public String getCntr_code() {
		return cntr_code;
	}
	public void setCntr_code(String cntr_code) {
		this.cntr_code = cntr_code;
	}
	public String getCntr_country() {
		return cntr_country;
	}
	public void setCntr_country(String cntr_country) {
		this.cntr_country = cntr_country;
	}
	public String getCntr_address() {
		return cntr_address;
	}
	public void setCntr_address(String cntr_address) {
		this.cntr_address = cntr_address;
	}
	public String getCntr_tel() {
		return cntr_tel;
	}
	public void setCntr_tel(String cntr_tel) {
		this.cntr_tel = cntr_tel;
	}
	public String getCntr_gst_code() {
		return cntr_gst_code;
	}
	public void setCntr_gst_code(String cntr_gst_code) {
		this.cntr_gst_code = cntr_gst_code;
	}
	public String getCntr_contact_person() {
		return cntr_contact_person;
	}
	public void setCntr_contact_person(String cntr_contact_person) {
		this.cntr_contact_person = cntr_contact_person;
	}
	public String getCntr_email() {
		return cntr_email;
	}
	public void setCntr_email(String cntr_email) {
		this.cntr_email = cntr_email;
	}
	public String getUser_acnt_name() {
		return user_acnt_name;
	}
	public void setUser_acnt_name(String user_acnt_name) {
		this.user_acnt_name = user_acnt_name;
	}
	public String getUa_code() {
		return ua_code;
	}
	public void setUa_code(String ua_code) {
		this.ua_code = ua_code;
	}
	public String getUa_country() {
		return ua_country;
	}
	public void setUa_country(String ua_country) {
		this.ua_country = ua_country;
	}
	public String getUa_address() {
		return ua_address;
	}
	public void setUa_address(String ua_address) {
		this.ua_address = ua_address;
	}
	public String getUa_tel() {
		return ua_tel;
	}
	public void setUa_tel(String ua_tel) {
		this.ua_tel = ua_tel;
	}
	public String getUa_gst_code() {
		return ua_gst_code;
	}
	public void setUa_gst_code(String ua_gst_code) {
		this.ua_gst_code = ua_gst_code;
	}
	public String getUa_contact_person() {
		return ua_contact_person;
	}
	public void setUa_contact_person(String ua_contact_person) {
		this.ua_contact_person = ua_contact_person;
	}
	public String getUa_email() {
		return ua_email;
	}
	public void setUa_email(String ua_email) {
		this.ua_email = ua_email;
	}
	public String getKey_account_flag() {
		return key_account_flag;
	}
	public void setKey_account_flag(String key_account_flag) {
		this.key_account_flag = key_account_flag;
	}
	public String getSp_cur() {
		return sp_cur;
	}
	public void setSp_cur(String sp_cur) {
		this.sp_cur = sp_cur;
	}
	public String getLp_total() {
		return lp_total;
	}
	public void setLp_total(String lp_total) {
		this.lp_total = lp_total;
	}
	public String getSp_total() {
		return sp_total;
	}
	public void setSp_total(String sp_total) {
		this.sp_total = sp_total;
	}
	public String getPck_and_fwd_amnt() {
		return pck_and_fwd_amnt;
	}
	public void setPck_and_fwd_amnt(String pck_and_fwd_amnt) {
		this.pck_and_fwd_amnt = pck_and_fwd_amnt;
	}
	public String getDomestic_freight_amnt() {
		return domestic_freight_amnt;
	}
	public void setDomestic_freight_amnt(String domestic_freight_amnt) {
		this.domestic_freight_amnt = domestic_freight_amnt;
	}
	public String getSgst_pc() {
		return sgst_pc;
	}
	public void setSgst_pc(String sgst_pc) {
		this.sgst_pc = sgst_pc;
	}
	public String getSgst_amount() {
		return sgst_amount;
	}
	public void setSgst_amount(String sgst_amount) {
		this.sgst_amount = sgst_amount;
	}
	public String getCgst_pc() {
		return cgst_pc;
	}
	public void setCgst_pc(String cgst_pc) {
		this.cgst_pc = cgst_pc;
	}
	public String getCgst_amount() {
		return cgst_amount;
	}
	public void setCgst_amount(String cgst_amount) {
		this.cgst_amount = cgst_amount;
	}
	public String getIgst_pc() {
		return igst_pc;
	}
	public void setIgst_pc(String igst_pc) {
		this.igst_pc = igst_pc;
	}
	public String getIgst_amount() {
		return igst_amount;
	}
	public void setIgst_amount(String igst_amount) {
		this.igst_amount = igst_amount;
	}
	public String getInst_com_amnt() {
		return inst_com_amnt;
	}
	public void setInst_com_amnt(String inst_com_amnt) {
		this.inst_com_amnt = inst_com_amnt;
	}
	public String getTp_cur() {
		return tp_cur;
	}
	public void setTp_cur(String tp_cur) {
		this.tp_cur = tp_cur;
	}
	public String getTp1() {
		return tp1;
	}
	public void setTp1(String tp1) {
		this.tp1 = tp1;
	}
	public String getTp2() {
		return tp2;
	}
	public void setTp2(String tp2) {
		this.tp2 = tp2;
	}
	public String getIigm() {
		return iigm;
	}
	public void setIigm(String iigm) {
		this.iigm = iigm;
	}
	public String getPmt_trms() {
		return pmt_trms;
	}
	public void setPmt_trms(String pmt_trms) {
		this.pmt_trms = pmt_trms;
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
	public String getThirdp_com_cur() {
		return thirdp_com_cur;
	}
	public void setThirdp_com_cur(String thirdp_com_cur) {
		this.thirdp_com_cur = thirdp_com_cur;
	}
	public String getThirdp_com_amnt() {
		return thirdp_com_amnt;
	}
	public void setThirdp_com_amnt(String thirdp_com_amnt) {
		this.thirdp_com_amnt = thirdp_com_amnt;
	}
	public String getThirdp_com_paid_by() {
		return thirdp_com_paid_by;
	}
	public void setThirdp_com_paid_by(String thirdp_com_paid_by) {
		this.thirdp_com_paid_by = thirdp_com_paid_by;
	}
	public String getCom_acnt_name() {
		return com_acnt_name;
	}
	public void setCom_acnt_name(String com_acnt_name) {
		this.com_acnt_name = com_acnt_name;
	}
	public String getCom_code() {
		return com_code;
	}
	public void setCom_code(String com_code) {
		this.com_code = com_code;
	}
	public String getCom_country() {
		return com_country;
	}
	public void setCom_country(String com_country) {
		this.com_country = com_country;
	}
	public String getCom_address() {
		return com_address;
	}
	public void setCom_address(String com_address) {
		this.com_address = com_address;
	}
	public String getCom_tel() {
		return com_tel;
	}
	public void setCom_tel(String com_tel) {
		this.com_tel = com_tel;
	}
	public String getCom_gst_code() {
		return com_gst_code;
	}
	public void setCom_gst_code(String com_gst_code) {
		this.com_gst_code = com_gst_code;
	}
	public String getCom_contact_person() {
		return com_contact_person;
	}
	public void setCom_contact_person(String com_contact_person) {
		this.com_contact_person = com_contact_person;
	}
	public String getCom_email() {
		return com_email;
	}
	public void setCom_email(String com_email) {
		this.com_email = com_email;
	}
	public String getCsutomer_application_code() {
		return csutomer_application_code;
	}
	public void setCsutomer_application_code(String csutomer_application_code) {
		this.csutomer_application_code = csutomer_application_code;
	}
	public String getCustomer_application_type() {
		return customer_application_type;
	}
	public void setCustomer_application_type(String customer_application_type) {
		this.customer_application_type = customer_application_type;
	}
	public String getCustomer_app_desc() {
		return customer_app_desc;
	}
	public void setCustomer_app_desc(String customer_app_desc) {
		this.customer_app_desc = customer_app_desc;
	}
	public String getReq_etd_by_customer() {
		return req_etd_by_customer;
	}
	public void setReq_etd_by_customer(String req_etd_by_customer) {
		this.req_etd_by_customer = req_etd_by_customer;
	}
	public String getReq_eta_by_customer() {
		return req_eta_by_customer;
	}
	public void setReq_eta_by_customer(String req_eta_by_customer) {
		this.req_eta_by_customer = req_eta_by_customer;
	}
	public String getTrd_trms_with_customer() {
		return trd_trms_with_customer;
	}
	public void setTrd_trms_with_customer(String trd_trms_with_customer) {
		this.trd_trms_with_customer = trd_trms_with_customer;
	}
	public String getDest_port_by_customer() {
		return dest_port_by_customer;
	}
	public void setDest_port_by_customer(String dest_port_by_customer) {
		this.dest_port_by_customer = dest_port_by_customer;
	}
	public String getMot() {
		return mot;
	}
	public void setMot(String mot) {
		this.mot = mot;
	}
	public String getFreight1() {
		return freight1;
	}
	public void setFreight1(String freight1) {
		this.freight1 = freight1;
	}
	public String getReq_etd_to_ij() {
		return req_etd_to_ij;
	}
	public void setReq_etd_to_ij(String req_etd_to_ij) {
		this.req_etd_to_ij = req_etd_to_ij;
	}
	public String getReq_eta_to_ij() {
		return req_eta_to_ij;
	}
	public void setReq_eta_to_ij(String req_eta_to_ij) {
		this.req_eta_to_ij = req_eta_to_ij;
	}
	public String getTrd_trms_with_ij() {
		return trd_trms_with_ij;
	}
	public void setTrd_trms_with_ij(String trd_trms_with_ij) {
		this.trd_trms_with_ij = trd_trms_with_ij;
	}
	public String getDest_port_to_ij() {
		return dest_port_to_ij;
	}
	public void setDest_port_to_ij(String dest_port_to_ij) {
		this.dest_port_to_ij = dest_port_to_ij;
	}
	public String getMot_to_ij() {
		return mot_to_ij;
	}
	public void setMot_to_ij(String mot_to_ij) {
		this.mot_to_ij = mot_to_ij;
	}
	public String getFreight2() {
		return freight2;
	}
	public void setFreight2(String freight2) {
		this.freight2 = freight2;
	}
	public String getCoo() {
		return coo;
	}
	public void setCoo(String coo) {
		this.coo = coo;
	}
	public String getEpa() {
		return epa;
	}
	public void setEpa(String epa) {
		this.epa = epa;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public String getFree_detention_period() {
		return free_detention_period;
	}
	public void setFree_detention_period(String free_detention_period) {
		this.free_detention_period = free_detention_period;
	}
	public String getConsignee_acnt_name() {
		return consignee_acnt_name;
	}
	public void setConsignee_acnt_name(String consignee_acnt_name) {
		this.consignee_acnt_name = consignee_acnt_name;
	}
	public String getCns_code() {
		return cns_code;
	}
	public void setCns_code(String cns_code) {
		this.cns_code = cns_code;
	}
	public String getCns_country() {
		return cns_country;
	}
	public void setCns_country(String cns_country) {
		this.cns_country = cns_country;
	}
	public String getCns_address() {
		return cns_address;
	}
	public void setCns_address(String cns_address) {
		this.cns_address = cns_address;
	}
	public String getCns_tel() {
		return cns_tel;
	}
	public void setCns_tel(String cns_tel) {
		this.cns_tel = cns_tel;
	}
	public String getCns_gst_code() {
		return cns_gst_code;
	}
	public void setCns_gst_code(String cns_gst_code) {
		this.cns_gst_code = cns_gst_code;
	}
	public String getCns_contact_person() {
		return cns_contact_person;
	}
	public void setCns_contact_person(String cns_contact_person) {
		this.cns_contact_person = cns_contact_person;
	}
	public String getCns_email() {
		return cns_email;
	}
	public void setCns_email(String cns_email) {
		this.cns_email = cns_email;
	}
	public String getCns_iec_code() {
		return cns_iec_code;
	}
	public void setCns_iec_code(String cns_iec_code) {
		this.cns_iec_code = cns_iec_code;
	}
	public String getBank_name_on_cad() {
		return bank_name_on_cad;
	}
	public void setBank_name_on_cad(String bank_name_on_cad) {
		this.bank_name_on_cad = bank_name_on_cad;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getTel() {
		return tel;
	}
	public void setTel(String tel) {
		this.tel = tel;
	}
	public String getNotify_acnt_name() {
		return notify_acnt_name;
	}
	public void setNotify_acnt_name(String notify_acnt_name) {
		this.notify_acnt_name = notify_acnt_name;
	}
	public String getNtf_code() {
		return ntf_code;
	}
	public void setNtf_code(String ntf_code) {
		this.ntf_code = ntf_code;
	}
	public String getNtf_country() {
		return ntf_country;
	}
	public void setNtf_country(String ntf_country) {
		this.ntf_country = ntf_country;
	}
	public String getNtf_address() {
		return ntf_address;
	}
	public void setNtf_address(String ntf_address) {
		this.ntf_address = ntf_address;
	}
	public String getNtf_tel() {
		return ntf_tel;
	}
	public void setNtf_tel(String ntf_tel) {
		this.ntf_tel = ntf_tel;
	}
	public String getNtf_gst_code() {
		return ntf_gst_code;
	}
	public void setNtf_gst_code(String ntf_gst_code) {
		this.ntf_gst_code = ntf_gst_code;
	}
	public String getNtf_contact_person() {
		return ntf_contact_person;
	}
	public void setNtf_contact_person(String ntf_contact_person) {
		this.ntf_contact_person = ntf_contact_person;
	}
	public String getNtf_email() {
		return ntf_email;
	}
	public void setNtf_email(String ntf_email) {
		this.ntf_email = ntf_email;
	}
	public String getProduction_start() {
		return production_start;
	}
	public void setProduction_start(String production_start) {
		this.production_start = production_start;
	}
	public String getOth_customer_po_sheet() {
		return oth_customer_po_sheet;
	}
	public void setOth_customer_po_sheet(String oth_customer_po_sheet) {
		this.oth_customer_po_sheet = oth_customer_po_sheet;
	}
	public String getOth_sr_spec_sheet() {
		return oth_sr_spec_sheet;
	}
	public void setOth_sr_spec_sheet(String oth_sr_spec_sheet) {
		this.oth_sr_spec_sheet = oth_sr_spec_sheet;
	}
	public String getOth_drawing() {
		return oth_drawing;
	}
	public void setOth_drawing(String oth_drawing) {
		this.oth_drawing = oth_drawing;
	}
	public String getOth_test_report() {
		return oth_test_report;
	}
	public void setOth_test_report(String oth_test_report) {
		this.oth_test_report = oth_test_report;
	}
	public String getOth_pi() {
		return oth_pi;
	}
	public void setOth_pi(String oth_pi) {
		this.oth_pi = oth_pi;
	}
	public String getOth_lc_draft() {
		return oth_lc_draft;
	}
	public void setOth_lc_draft(String oth_lc_draft) {
		this.oth_lc_draft = oth_lc_draft;
	}
	public String getOth_doc1() {
		return oth_doc1;
	}
	public void setOth_doc1(String oth_doc1) {
		this.oth_doc1 = oth_doc1;
	}
	public String getOth_doc2() {
		return oth_doc2;
	}
	public void setOth_doc2(String oth_doc2) {
		this.oth_doc2 = oth_doc2;
	}
	public String getRemarks1() {
		return remarks1;
	}
	public void setRemarks1(String remarks1) {
		this.remarks1 = remarks1;
	}
	public String getPi_no() {
		return pi_no;
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
	public String getSa_date() {
		return sa_date;
	}
	public void setSa_date(String sa_date) {
		this.sa_date = sa_date;
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
	public String getFob_fowarder() {
		return fob_fowarder;
	}
	public void setFob_fowarder(String fob_fowarder) {
		this.fob_fowarder = fob_fowarder;
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
	public void setMode1(String mode1) {
		this.mode1 = mode1;
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
	public String getEway_bill_req() {
		return eway_bill_req;
	}
	public void setEway_bill_req(String eway_bill_req) {
		this.eway_bill_req = eway_bill_req;
	}
	public String getEway_bill_num() {
		return eway_bill_num;
	}
	public void setEway_bill_num(String eway_bill_num) {
		this.eway_bill_num = eway_bill_num;
	}
	public String getRemarks2() {
		return remarks2;
	}
	public void setRemarks2(String remarks2) {
		this.remarks2 = remarks2;
	}
	public String getCom_month() {
		return com_month;
	}
	public void setCom_month(String com_month) {
		this.com_month = com_month;
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
	public String getPmt_sts() {
		return pmt_sts;
	}
	public void setPmt_sts(String pmt_sts) {
		this.pmt_sts = pmt_sts;
	}
	public String getDel_sts() {
		return del_sts;
	}
	public void setDel_sts(String del_sts) {
		this.del_sts = del_sts;
	}
	private String indent_sheet_num;
	private String indent_issue_date;
	private String crm_opt_num;
	private String sos_summary;
	private String sales1_id;
	private String sales1_name;
	private String sales2_id;
	private String sales2_name;
	private String order_type;
	private String customer_po_num;
	private String customer_po_date;
	private String contract_acnt_name;
	private String cntr_code;
	private String cntr_country;
	private String cntr_address;
	private String cntr_tel;
	private String cntr_gst_code;
	private String cntr_contact_person;
	private String cntr_email;
	private String user_acnt_name;
	private String ua_code;
	private String ua_country;
	private String ua_address;
	private String ua_tel;
	private String ua_gst_code;
	private String ua_contact_person;
	private String ua_email;
	private String key_account_flag;
	private String sp_cur;
	private String lp_total;
	private String sp_total;
	private String pck_and_fwd_amnt;
	private String domestic_freight_amnt;
	private String sgst_pc;
	private String sgst_amount;
	private String cgst_pc;
	private String cgst_amount;
	private String igst_pc;
	private String igst_amount;
	private String inst_com_amnt;
	private String tp_cur;
	private String tp1;
	private String tp2;
	private String iigm;
	private String pmt_trms;
	private String adv_type;
	private String adv_pc;
	private String adv_amount;
	private String adv_date;
	private String bsh_type;
	private String bsh_pc;
	private String bsh_amount;
	private String bsh_date;
	private String ash_type;
	private String ash_pc;
	private String ash_amount;
	private String ash_date;
	private String thirdp_com_cur;
	private String thirdp_com_amnt;
	private String thirdp_com_paid_by;
	private String com_acnt_name;
	private String com_code;
	private String com_country;
	private String com_address;
	private String com_tel;
	private String com_gst_code;
	private String com_contact_person;
	private String com_email;
	private String csutomer_application_code;
	private String customer_application_type;
	private String customer_app_desc;
	private String req_etd_by_customer;
	private String req_eta_by_customer;
	private String trd_trms_with_customer;
	private String dest_port_by_customer;
	private String mot;
	private String freight1;
	private String req_etd_to_ij;
	private String req_eta_to_ij;
	private String trd_trms_with_ij;
	private String dest_port_to_ij;
	private String mot_to_ij;
	private String freight2;
	private String coo;
	private String epa;
	private String ip;
	private String free_detention_period;
	private String consignee_acnt_name;
	private String cns_code;
	private String cns_country;
	private String cns_address;
	private String cns_tel;
	private String cns_gst_code;
	private String cns_contact_person;
	private String cns_email;
	private String cns_iec_code;
	private String bank_name_on_cad;
	private String address;
	private String tel;
	private String notify_acnt_name;
	private String ntf_code;
	private String ntf_country;
	private String ntf_address;
	private String ntf_tel;
	private String ntf_gst_code;
	private String ntf_contact_person;
	private String ntf_email;
	private String production_start;
	private String oth_customer_po_sheet;
	private String oth_sr_spec_sheet;
	private String oth_drawing;
	private String oth_test_report;
	private String oth_pi;
	private String oth_lc_draft;
	private String oth_doc1;
	private String oth_doc2;
	private String remarks1;
	private String pi_no;
	private String pi_date;
	private String iipo_no;
	private String iipo_date;
	private String ij_project_num;
	private String oc_date;
	private String sa_date;
	private String lc_chk_date_by_ij;
	private String lc_open_date;
	private String lc_last_revision_date;
	private String latest_shipment_date;
	private String lc_expiry_date;
	private String exf1;
	private String exf1_sts;
	private String exf_ij_accment1;
	private String exf2;
	private String exf2_sts;
	private String exf_ij_accment2;
	private String exf3;
	private String exf3_sts;
	private String exf_ij_accment3;
	private String fob_fowarder;
	private String invoice_no1;
	private String invoice_date1;
	private String mode1;
	private String from1;
	private String vessel1;
	private String awb_bl_no1;
	private String etd1;
	private String eta1;
	private String invoice_no2;
	private String invoice_date2;
	private String mode2;
	private String from2;
	private String vessel2;
	private String awb_bl_no2;
	private String etd2;
	private String eta2;
	private String invoice_no3;
	private String invoice_date3;
	private String mode3;
	private String from3;
	private String vessel3;
	private String awb_bl_no3;
	private String etd3;
	private String eta3;
	private String eway_bill_req;
	private String eway_bill_num;
	private String remarks2;
	private String com_month;
	private String checked_on;
	private String next_check;
	private String for_info;
	private String pmt_sts;
	private String del_sts;
}
