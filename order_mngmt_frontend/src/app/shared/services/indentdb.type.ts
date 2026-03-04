export interface IndentData {
  indent_sheet_num: string;
  sos_summary: string;
  order_type: string;
  ij_project_num: string;
  contract_acnt_name: string;
  user_acnt_name: string;
  customer_po_num?: string;
}

export interface IndFilterCountA {
  snfSignal: number;
  apSignal: number;
  lcSignal: number;
  bpSignal: number;
  outSignal: number;
  pnsSignal: number;
  lcpSignal: number;
  pexfpSignal: number;
  fexfpSignal: number;
  sspSignal: number;
  sapSignal: number;
}
export interface Indent {
  value: string;
  visible: boolean;
}

export interface IndentDetail {
  indent_sheet_num: Indent;
  indent_issue_date: Indent;
  crm_opt_num: Indent;
  sos_summary: Indent;
  sales1_id: Indent;
  sales1_name: Indent;
  sales2_id: Indent;
  sales2_name: Indent;
  order_type: Indent;
  customer_po_num: Indent;
  customer_po_date: Indent;
  contract_acnt_name: Indent;
  cntr_code: Indent;
  cntr_country: Indent;
  cntr_address: Indent;
  cntr_tel: Indent;
  cntr_gst_code: Indent;
  cntr_contact_person: Indent;
  cntr_email: Indent;
  user_acnt_name: Indent;
  ua_code: Indent;
  ua_country: Indent;
  ua_address: Indent;
  ua_tel: Indent;
  ua_gst_code: Indent;
  ua_contact_person: Indent;
  ua_email: Indent;
  key_account_flag: Indent;
  sp_cur: Indent;
  lp_total: Indent;
  sp_total: Indent;
  pck_and_fwd_amnt: Indent;
  domestic_freight_amnt: Indent;
  sgst_pc: Indent;
  sgst_amount: Indent;
  cgst_pc: Indent;
  cgst_amount: Indent;
  igst_pc: Indent;
  igst_amount: Indent;
  inst_com_amnt: Indent;
  tp_cur: Indent;
  tp1: Indent;
  tp2: Indent;
  iigm: Indent;
  pmt_trms: Indent;
  adv_type: Indent;
  adv_pc: Indent;
  adv_amount: Indent;
  adv_date: Indent;
  bsh_type: Indent;
  bsh_pc: Indent;
  bsh_amount: Indent;
  bsh_date: Indent;
  ash_type: Indent;
  ash_pc: Indent;
  ash_amount: Indent;
  ash_date: Indent;
  thirdp_com_cur: Indent;
  thirdp_com_amnt: Indent;
  thirdp_com_paid_by: Indent;
  com_acnt_name: Indent;
  com_code: Indent;
  com_country: Indent;
  com_address: Indent;
  com_tel: Indent;
  com_gst_code: Indent;
  com_contact_person: Indent;
  com_email: Indent;
  csutomer_application_code: Indent;
  customer_application_type: Indent;
  customer_app_desc: Indent;
  req_etd_by_customer: Indent;
  req_eta_by_customer: Indent;
  trd_trms_with_customer: Indent;
  dest_port_by_customer: Indent;
  mot: Indent;
  freight1: Indent;
  req_etd_to_ij: Indent;
  req_eta_to_ij: Indent;
  trd_trms_with_ij: Indent;
  dest_port_to_ij: Indent;
  mot_to_ij: Indent;
  freight2: Indent;
  coo: Indent;
  epa: Indent;
  ip: Indent;
  free_detention_period: Indent;
  consignee_acnt_name: Indent;
  cns_code: Indent;
  cns_country: Indent;
  cns_address: Indent;
  cns_tel: Indent;
  cns_gst_code: Indent;
  cns_contact_person: Indent;
  cns_email: Indent;
  cns_iec_code: Indent;
  bank_name_on_cad: Indent;
  address: Indent;
  tel: Indent;
  notify_acnt_name: Indent;
  ntf_code: Indent;
  ntf_country: Indent;
  ntf_address: Indent;
  ntf_tel: Indent;
  ntf_gst_code: Indent;
  ntf_contact_person: Indent;
  ntf_email: Indent;
  production_start: Indent;
  oth_customer_po_sheet: Indent;
  oth_sr_spec_sheet: Indent;
  oth_drawing: Indent;
  oth_test_report: Indent;
  oth_pi: Indent;
  oth_lc_draft: Indent;
  oth_doc1: Indent;
  oth_doc2: Indent;
  remarks1: Indent;
  pi_no: Indent;
  pi_date: Indent;
  iipo_no: Indent;
  iipo_date: Indent;
  ij_project_num: Indent;
  oc_date: Indent;
  sa_date: Indent;
  lc_chk_date_by_ij: Indent;
  lc_open_date: Indent;
  lc_last_revision_date: Indent;
  latest_shipment_date: Indent;
  lc_expiry_date: Indent;
  exf1: Indent;
  exf1_sts: Indent;
  exf_ij_accment1: Indent;
  exf2: Indent;
  exf2_sts: Indent;
  exf_ij_accment2: Indent;
  exf3: Indent;
  exf3_sts: Indent;
  exf_ij_accment3: Indent;
  fob_fowarder: Indent;
  invoice_no1: Indent;
  invoice_date1: Indent;
  mode1: Indent;
  from1: Indent;
  vessel1: Indent;
  awb_bl_no1: Indent;
  etd1: Indent;
  eta1: Indent;
  invoice_no2: Indent;
  invoice_date2: Indent;
  mode2: Indent;
  from2: Indent;
  vessel2: Indent;
  awb_bl_no2: Indent;
  etd2: Indent;
  eta2: Indent;
  invoice_no3: Indent;
  invoice_date3: Indent;
  mode3: Indent;
  from3: Indent;
  vessel3: Indent;
  awb_bl_no3: Indent;
  etd3: Indent;
  eta3: Indent;
  eway_bill_req: Indent;
  eway_bill_num: Indent;
  remarks2: Indent;
  com_month: Indent;
  checked_on: Indent;
  next_check: Indent;
  for_info: Indent;
  pmt_sts: Indent;
  del_sts: Indent;

  job_no: Indent;
  prd_ord_date: Indent;
  oc_no: Indent;
  s_oc_date: Indent;
  s_del_sts: Indent;
  exf1_date: Indent;
  s_exf1_sts: Indent;
  exf1_annc_date: Indent;
  exf2_date: Indent;
  s_exf2_sts: Indent;
  exf2_annc_date: Indent;
  exf3_date: Indent;
  s_exf3_sts: Indent;
  exf3_annc_date: Indent;
  abg_request_anct_date: Indent;
  abg_issuance_date: Indent;
  abg_final_submission_draft_date: Indent;
  abg_final_submission_bg_date: Indent;
  pbg_request_anct_date: Indent;
  pbg_issuance_date: Indent;
  pbg_final_submission_draft_date: Indent;
  pbg_final_submission_bg_date: Indent;
}

export interface IndFilterCountB {
  snfSignal: number;
  apSignal: number;
  lcSignal: number;
  bpSignal: number;
  outSignal: number;
  pnsSignal: number;
  lcpSignal: number;
  pexfpSignal: number;
  fexfpSignal: number;
  sspSignal: number;
  sapSignal: number;
}

export interface DetailDialogDataSet {
  indent_sheet_num: string;
  indent_issue_date: string;
  crm_opt_num: string;
  sos_summary: string;
  sales1_id: string;
  sales1_name: string;
  sales2_id: string;
  sales2_name: string;
  order_type: string;
  customer_po_num: string;
  customer_po_date: string;
  contract_acnt_name: string;
  cntr_code: string;
  cntr_country: string;
  cntr_address: string;
  cntr_tel: string;
  cntr_gst_code: string;
  cntr_contact_person: string;
  cntr_email: string;
  user_acnt_name: string;
  ua_code: string;
  ua_country: string;
  ua_address: string;
  ua_tel: string;
  ua_gst_code: string;
  ua_contact_person: string;
  ua_email: string;
  key_account_flag: string;
  sp_cur: string;
  lp_total: string;
  sp_total: string;
  pck_and_fwd_amnt: string;
  domestic_freight_amnt: string;
  sgst_pc: string;
  sgst_amount: string;
  cgst_pc: string;
  cgst_amount: string;
  igst_pc: string;
  igst_amount: string;
  inst_com_amnt: string;
  tp_cur: string;
  tp1: string;
  tp2: string;
  iigm: string;
  pmt_trms: string;
  adv_type: string;
  adv_pc: string;
  adv_amount: string;
  adv_date: string;
  bsh_type: string;
  bsh_pc: string;
  bsh_amount: string;
  bsh_date: string;
  ash_type: string;
  ash_pc: string;
  ash_amount: string;
  ash_date: string;
  thirdp_com_cur: string;
  thirdp_com_amnt: string;
  thirdp_com_paid_by: string;
  com_acnt_name: string;
  com_code: string;
  com_country: string;
  com_address: string;
  com_tel: string;
  com_gst_code: string;
  com_contact_person: string;
  com_email: string;
  csutomer_application_code: string;
  customer_application_type: string;
  customer_app_desc: string;
  req_etd_by_customer: string;
  req_eta_by_customer: string;
  trd_trms_with_customer: string;
  dest_port_by_customer: string;
  mot: string;
  freight1: string;
  req_etd_to_ij: string;
  req_eta_to_ij: string;
  trd_trms_with_ij: string;
  dest_port_to_ij: string;
  mot_to_ij: string;
  freight2: string;
  coo: string;
  epa: string;
  ip: string;
  free_detention_period: string;
  consignee_acnt_name: string;
  cns_code: string;
  cns_country: string;
  cns_address: string;
  cns_tel: string;
  cns_gst_code: string;
  cns_contact_person: string;
  cns_email: string;
  cns_iec_code: string;
  bank_name_on_cad: string;
  address: string;
  tel: string;
  notify_acnt_name: string;
  ntf_code: string;
  ntf_country: string;
  ntf_address: string;
  ntf_tel: string;
  ntf_gst_code: string;
  ntf_contact_person: string;
  ntf_email: string;
  production_start: string;
  oth_customer_po_sheet: string;
  oth_sr_spec_sheet: string;
  oth_drawing: string;
  oth_test_report: string;
  oth_pi: string;
  oth_lc_draft: string;
  oth_doc1: string;
  oth_doc2: string;
  remarks1: string;
  pi_no: string;
  pi_date: string;
  iipo_no: string;
  iipo_date: string;
  ij_project_num: string;
  oc_date: string;
  sa_date: string;
  lc_chk_date_by_ij: string;
  lc_open_date: string;
  lc_last_revision_date: string;
  latest_shipment_date: string;
  lc_expiry_date: string;
  exf1: string;
  exf1_sts: string;
  exf_ij_accment1: string;
  exf2: string;
  exf2_sts: string;
  exf_ij_accment2: string;
  exf3: string;
  exf3_sts: string;
  exf_ij_accment3: string;
  fob_fowarder: string;
  invoice_no1: string;
  invoice_date1: string;
  mode1: string;
  from1: string;
  vessel1: string;
  awb_bl_no1: string;
  etd1: string;
  eta1: string;
  invoice_no2: string;
  invoice_date2: string;
  mode2: string;
  from2: string;
  vessel2: string;
  awb_bl_no2: string;
  etd2: string;
  eta2: string;
  invoice_no3: string;
  invoice_date3: string;
  mode3: string;
  from3: string;
  vessel3: string;
  awb_bl_no3: string;
  etd3: string;
  eta3: string;
  eway_bill_req: string;
  eway_bill_num: string;
  remarks2: string;
  com_month: string;
  checked_on: string;
  next_check: string;
  for_info: string;
  pmt_sts: string;
  del_sts: string;
}

// never used
export interface IndentUpdateDataSet {
  pi_no: string;
  pi_date: string;
  iipo_no: string;
  iipo_date: string;
  ij_project_num: string;
  oc_date: string;
  exf1: string;
  exf1_sts: string;
  exf_ij_accment1: string;
  exf2: string;
  exf2_sts: string;
  exf_ij_accment2: string;
  exf3: string;
  exf3_sts: string;
  exf_ij_accment3: string;
  del_sts: string;
  adv_type: string;
  adv_pc: string;
  adv_amount: string;
  adv_date: string;
  bsh_type: string;
  bsh_pc: string;
  bsh_amount: string;
  bsh_date: string;
  ash_type: string;
  ash_pc: string;
  ash_amount: string;
  ash_date: string;
  pmt_sts: string;
  lc_chk_date_by_ij: string;
  lc_open_date: string;
  lc_last_revision_date: string;
  latest_shipment_date: string;
  lc_expiry_date: string;
  com_month: string;
  invoice_no1: string;
  invoice_no2: string;
  invoice_no3: string;
  invoice_date1: string;
  invoice_date2: string;
  invoice_date3: string;
  mode1: string;
  mode2: string;
  mode3: string;
  from1: string;
  from2: string;
  from3: string;
  vessel1: string;
  vessel2: string;
  vessel3: string;
  awb_bl_no1: string;
  awb_bl_no2: string;
  awb_bl_no3: string;
  etd1: string;
  etd2: string;
  etd3: string;
  eta1: string;
  eta2: string;
  eta3: string;
  checked_on: string;
  next_check: string;
  for_info: string;
}

export interface IndentUpdateNewTabs {
  indent_sheet_num: string;
  job_no: string;
  prd_ord_date: string;
  oc_no: string;
  oc_date: string;
  del_sts: string;
  exf1_date: string;
  exf1_sts: string;
  exf1_annc_date: string;
  exf2_date: string;
  exf2_sts: string;
  exf2_annc_date: string;
  exf3_date: string;
  exf3_sts: string;
  exf3_annc_date: string;
  abg_request_anct_date: string;
  abg_issuance_date: string;
  abg_final_submission_draft_date: string;
  abg_final_submission_bg_date: string;
  pbg_request_anct_date: string;
  pbg_issuance_date: string;
  pbg_final_submission_draft_date: string;
  pbg_final_submission_bg_date: string;
}

export interface IndentUpdateINVEWB {
  id: string;
  invoice_id: string;
  indent_sheet_num: string;
  inv_request_anct_date: string;
  inv_issuance_date: string;
  inv_no: string;
  ewb_no: string;
  ewb_issuance_date: string;
  transportation_method: string;
  dispatch_date: string;
  dispatch_from_indent: string;
  dispatch_from_origin: string;
  dispatch_to_indent: string;
  dispatch_to_destination: string;
  machine_sn: string;

  invoice_doc: string;
  ewb_doc: string;
  inv_doc_name: string;
  ewb_doc_name: string;
  email_sent: string;

}

export interface IndentUpdatePMT {
  id: string;
  indent_sheet_num: string;
  payment_type: string;
  payment_amount: string;
  payment_date: string;
}

export interface indentFormUpdate {
  pi_no: string;
  pi_date: string;
  iipo_no: string;
  iipo_date: string;
  ij_project_num: string;
  oc_date: string;
  exf1: string;
  exf1_sts: string;
  exf_ij_accment1: string;
  exf2: string;
  exf2_sts: string;
  exf_ij_accment2: string;
  exf3: string;
  exf3_sts: string;
  exf_ij_accment3: string;
  del_sts: string;
  adv_type: string;
  adv_pc: string;
  adv_amount: string;
  adv_date: string;
  bsh_type: string;
  bsh_pc: string;
  bsh_amount: string;
  bsh_date: string;
  ash_type: string;
  ash_pc: string;
  ash_amount: string;
  ash_date: string;
  pmt_sts: string;
  lc_chk_date_by_ij: string;
  lc_open_date: string;
  lc_last_revision_date: string;
  latest_shipment_date: string;
  lc_expiry_date: string;
  com_month: string;
  invoice_no1: string;
  invoice_date1: string;
  mode1: string;
  from1: string;
  vessel1: string;
  awb_bl_no1: string;
  etd1: string;
  eta1: string;
  invoice_no2: string;
  invoice_date2: string;
  mode2: string;
  from2: string;
  vessel2: string;
  awb_bl_no2: string;
  etd2: string;
  eta2: string;
  invoice_no3: string;
  invoice_date3: string;
  mode3: string;
  from3: string;
  vessel3: string;
  awb_bl_no3: string;
  etd3: string;
  eta3: string;
  checked_on: string;
  next_check: string;
  for_info: string;
}

export interface IndentUpdateStatus {
  fieldCount: string;
  affectedRows: string;
  insertId: string;
  serverStatus: string;
  warningCount: string;
  message: string;
  protocol41: string;
  changedRows: string;
}

export interface getUserLoginInfo {
  userid: string;
  status: string;
  token: string;
  username: string;
  email: string;
  department: string;
  userstatus: string;
  loginstatus: string;
  userrole: string;
}

export interface gethttpResponseError {
  errorCode: string;
  errorMessage: string;
  rowCount: string;
  data: string;
}

export interface updateIndentData {
  name: string;
  value: string;
}

// never used
export interface getUserId {
  user_id_key: string;
  user_id_value: string;
}

export interface getYear {
  year_key: string;
  year_value: string;
}


export interface UserDetails {
  userId: string;
  userName: string;
  email: string;
  password: string;
  department: string;
  userStatus: string;
  userRole: string;
}

export interface numberOfUserDetails {
  currentUsers: string;
  activeUsers: string;
}

// never used
export interface getUserDetails {
  user_id: string;
  user_name: string;
  email: string;
  password: string;
  create_time: string;
  update_time: string;
  department: string;
  user_status: string;
  login_status: string;
  access_level: string;
}

export interface NextActionDataList {
  next_check: string;
  indent_sheet_num: string;
  sos_summary: string;
  user_acnt_name: string;
  for_info: string;
  updated_by: string;
}

export interface revisedDateList {
  next_action_date: string;
  updated_by: string;
}

//  never used
export interface IndentUpdateDialogItemData {
  itemName: string;
  itemValue: string;
}

export interface GetFileList {
  listString: string;
}

// never used
export interface GetFileUploadResponse {
  title: String;
  message: String;
  listOfMultErrMsg: String[];
}

export class HttpError {
  static ServerError = 0;
  static BadRequest = 400;
  static Unauthorized = 401;
  static Forbidden = 403;
  static NotFound = 404;
  static TimeOut = 408;
  static Conflict = 409;
  static InternalServerError = 500;
}

export interface GetAllFilterDownloadList {
  specNotFinal: string;
  advPending: string;
  letterCredPending: string;
  befShpPending: string;
  outstanding: string;
  prodNotStarted: string;
  lcCheckPending: string;
  pExfPending: string;
  fExfPending: string;
  shpSchPendning: string;
  shpAdvicePending: string;
  yearList: string;
  filterList: string;
}

export interface SelectedFileIndentSts {
  selFileNotExistFlag: string;
  selFileExistAndEqualFlag: string;
  selFileRevisedFileExist: string;
  existingIndentFile: string;
}

export interface UserDetails {
  userId: string;
  userName: string;
  email: string;
  password: string;
  department: string;
  userStatus: string;
  userRole: string;
}

export interface numberOfUserDetails {
  currentUsers: string;
  activeUsers: string;
}

export interface getUserLoginInfo {
  status: string;
  userID: string;
  userName: string;
  email: string;
  password: string;
  userRole: string;
  department: string;
  designation: string;
  userLoginStatus: string;
  userActiveStatus: string;
  token: string;
}

export interface getApplicationLog {
  CREATE_TIME: string;
  USER_ID: string;
  USER_NAME: string;
  INDENT_NO: string;
  LOG_MESSAGE: string;
  CONTROLLER_NAME: string;
}

export interface PaymentDetail {

  indent_sheet_num: Indent;
  indent_issue_date: Indent;
  crm_opt_num: Indent;
  sos_summary: Indent;
  sales1_id: Indent;
  sales1_name: Indent;
  sales2_id: Indent;
  sales2_name: Indent;
  order_type: Indent;
  customer_po_num: Indent;
  customer_po_date: Indent;
  contract_acnt_name: Indent;
  cntr_code: Indent;
  cntr_country: Indent;
  cntr_address: Indent;
  cntr_tel: Indent;
  cntr_gst_code: Indent;
  cntr_contact_person: Indent;
  cntr_email: Indent;
  user_acnt_name: Indent;
  ua_code: Indent;
  ua_country: Indent;
  ua_address: Indent;
  ua_tel: Indent;
  ua_gst_code: Indent;
  ua_contact_person: Indent;
  ua_email: Indent;
  key_account_flag: Indent;
  sp_cur: Indent;
  lp_total: Indent;
  sp_total: Indent;
  pck_and_fwd_amnt: Indent;
  domestic_freight_amnt: Indent;
  sgst_pc: Indent;
  sgst_amount: Indent;
  cgst_pc: Indent;
  cgst_amount: Indent;
  igst_pc: Indent;
  igst_amount: Indent;
  inst_com_amnt: Indent;
  tp_cur: Indent;
  tp1: Indent;
  tp2: Indent;
  iigm: Indent;
  pmt_trms: Indent;
  adv_type: Indent;
  adv_pc: Indent;
  adv_amount: Indent;
  adv_date: Indent;
  bsh_type: Indent;
  bsh_pc: Indent;
  bsh_amount: Indent;
  bsh_date: Indent;
  ash_type: Indent;
  ash_pc: Indent;
  ash_amount: Indent;
  ash_date: Indent;
  thirdp_com_cur: Indent;
  thirdp_com_amnt: Indent;
  thirdp_com_paid_by: Indent;
  com_acnt_name: Indent;
  com_code: Indent;
  com_country: Indent;
  com_address: Indent;
  com_tel: Indent;
  com_gst_code: Indent;
  com_contact_person: Indent;
  com_email: Indent;
  csutomer_application_code: Indent;
  customer_application_type: Indent;
  customer_app_desc: Indent;
  req_etd_by_customer: Indent;
  req_eta_by_customer: Indent;
  trd_trms_with_customer: Indent;
  dest_port_by_customer: Indent;
  mot: Indent;
  freight1: Indent;
  req_etd_to_ij: Indent;
  req_eta_to_ij: Indent;
  trd_trms_with_ij: Indent;
  dest_port_to_ij: Indent;
  mot_to_ij: Indent;
  freight2: Indent;
  coo: Indent;
  epa: Indent;
  ip: Indent;
  free_detention_period: Indent;
  consignee_acnt_name: Indent;
  cns_code: Indent;
  cns_country: Indent;
  cns_address: Indent;
  cns_tel: Indent;
  cns_gst_code: Indent;
  cns_contact_person: Indent;
  cns_email: Indent;
  cns_iec_code: Indent;
  bank_name_on_cad: Indent;
  address: Indent;
  tel: Indent;
  notify_acnt_name: Indent;
  ntf_code: Indent;
  ntf_country: Indent;
  ntf_address: Indent;
  ntf_tel: Indent;
  ntf_gst_code: Indent;
  ntf_contact_person: Indent;
  ntf_email: Indent;
  production_start: Indent;
  oth_customer_po_sheet: Indent;
  oth_sr_spec_sheet: Indent;
  oth_drawing: Indent;
  oth_test_report: Indent;
  oth_pi: Indent;
  oth_lc_draft: Indent;
  oth_doc1: Indent;
  oth_doc2: Indent;
  remarks1: Indent;
  pi_no: Indent;
  pi_date: Indent;
  iipo_no: Indent;
  iipo_date: Indent;
  ij_project_num: Indent;
  oc_date: Indent;
  sa_date: Indent;
  lc_chk_date_by_ij: Indent;
  lc_open_date: Indent;
  lc_last_revision_date: Indent;
  latest_shipment_date: Indent;
  lc_expiry_date: Indent;
  exf1: Indent;
  exf1_sts: Indent;
  exf_ij_accment1: Indent;
  exf2: Indent;
  exf2_sts: Indent;
  exf_ij_accment2: Indent;
  exf3: Indent;
  exf3_sts: Indent;
  exf_ij_accment3: Indent;
  fob_fowarder: Indent;
  invoice_no1: Indent;
  invoice_date1: Indent;
  mode1: Indent;
  from1: Indent;
  vessel1: Indent;
  awb_bl_no1: Indent;
  etd1: Indent;
  eta1: Indent;
  invoice_no2: Indent;
  invoice_date2: Indent;
  mode2: Indent;
  from2: Indent;
  vessel2: Indent;
  awb_bl_no2: Indent;
  etd2: Indent;
  eta2: Indent;
  invoice_no3: Indent;
  invoice_date3: Indent;
  mode3: Indent;
  from3: Indent;
  vessel3: Indent;
  awb_bl_no3: Indent;
  etd3: Indent;
  eta3: Indent;
  eway_bill_req: Indent;
  eway_bill_num: Indent;
  remarks2: Indent;
  com_month: Indent;
  checked_on: Indent;
  next_check: Indent;
  for_info: Indent;
  pmt_sts: Indent;
  del_sts: Indent;
  id: Indent;
  payment_type: Indent;
  payment_date: Indent;
  payment_amount: Indent;
}

export interface InvoiceDetail {

  indent_sheet_num: Indent;
  indent_issue_date: Indent;
  crm_opt_num: Indent;
  sos_summary: Indent;
  sales1_id: Indent;
  sales1_name: Indent;
  sales2_id: Indent;
  sales2_name: Indent;
  order_type: Indent;
  customer_po_num: Indent;
  customer_po_date: Indent;
  contract_acnt_name: Indent;
  cntr_code: Indent;
  cntr_country: Indent;
  cntr_address: Indent;
  cntr_tel: Indent;
  cntr_gst_code: Indent;
  cntr_contact_person: Indent;
  cntr_email: Indent;
  user_acnt_name: Indent;
  ua_code: Indent;
  ua_country: Indent;
  ua_address: Indent;
  ua_tel: Indent;
  ua_gst_code: Indent;
  ua_contact_person: Indent;
  ua_email: Indent;
  key_account_flag: Indent;
  sp_cur: Indent;
  lp_total: Indent;
  sp_total: Indent;
  pck_and_fwd_amnt: Indent;
  domestic_freight_amnt: Indent;
  sgst_pc: Indent;
  sgst_amount: Indent;
  cgst_pc: Indent;
  cgst_amount: Indent;
  igst_pc: Indent;
  igst_amount: Indent;
  inst_com_amnt: Indent;
  tp_cur: Indent;
  tp1: Indent;
  tp2: Indent;
  iigm: Indent;
  pmt_trms: Indent;
  adv_type: Indent;
  adv_pc: Indent;
  adv_amount: Indent;
  adv_date: Indent;
  bsh_type: Indent;
  bsh_pc: Indent;
  bsh_amount: Indent;
  bsh_date: Indent;
  ash_type: Indent;
  ash_pc: Indent;
  ash_amount: Indent;
  ash_date: Indent;
  thirdp_com_cur: Indent;
  thirdp_com_amnt: Indent;
  thirdp_com_paid_by: Indent;
  com_acnt_name: Indent;
  com_code: Indent;
  com_country: Indent;
  com_address: Indent;
  com_tel: Indent;
  com_gst_code: Indent;
  com_contact_person: Indent;
  com_email: Indent;
  csutomer_application_code: Indent;
  customer_application_type: Indent;
  customer_app_desc: Indent;
  req_etd_by_customer: Indent;
  req_eta_by_customer: Indent;
  trd_trms_with_customer: Indent;
  dest_port_by_customer: Indent;
  mot: Indent;
  freight1: Indent;
  req_etd_to_ij: Indent;
  req_eta_to_ij: Indent;
  trd_trms_with_ij: Indent;
  dest_port_to_ij: Indent;
  mot_to_ij: Indent;
  freight2: Indent;
  coo: Indent;
  epa: Indent;
  ip: Indent;
  free_detention_period: Indent;
  consignee_acnt_name: Indent;
  cns_code: Indent;
  cns_country: Indent;
  cns_address: Indent;
  cns_tel: Indent;
  cns_gst_code: Indent;
  cns_contact_person: Indent;
  cns_email: Indent;
  cns_iec_code: Indent;
  bank_name_on_cad: Indent;
  address: Indent;
  tel: Indent;
  notify_acnt_name: Indent;
  ntf_code: Indent;
  ntf_country: Indent;
  ntf_address: Indent;
  ntf_tel: Indent;
  ntf_gst_code: Indent;
  ntf_contact_person: Indent;
  ntf_email: Indent;
  production_start: Indent;
  oth_customer_po_sheet: Indent;
  oth_sr_spec_sheet: Indent;
  oth_drawing: Indent;
  oth_test_report: Indent;
  oth_pi: Indent;
  oth_lc_draft: Indent;
  oth_doc1: Indent;
  oth_doc2: Indent;
  remarks1: Indent;
  pi_no: Indent;
  pi_date: Indent;
  iipo_no: Indent;
  iipo_date: Indent;
  ij_project_num: Indent;
  oc_date: Indent;
  sa_date: Indent;
  lc_chk_date_by_ij: Indent;
  lc_open_date: Indent;
  lc_last_revision_date: Indent;
  latest_shipment_date: Indent;
  lc_expiry_date: Indent;
  exf1: Indent;
  exf1_sts: Indent;
  exf_ij_accment1: Indent;
  exf2: Indent;
  exf2_sts: Indent;
  exf_ij_accment2: Indent;
  exf3: Indent;
  exf3_sts: Indent;
  exf_ij_accment3: Indent;
  fob_fowarder: Indent;
  invoice_no1: Indent;
  invoice_date1: Indent;
  mode1: Indent;
  from1: Indent;
  vessel1: Indent;
  awb_bl_no1: Indent;
  etd1: Indent;
  eta1: Indent;
  invoice_no2: Indent;
  invoice_date2: Indent;
  mode2: Indent;
  from2: Indent;
  vessel2: Indent;
  awb_bl_no2: Indent;
  etd2: Indent;
  eta2: Indent;
  invoice_no3: Indent;
  invoice_date3: Indent;
  mode3: Indent;
  from3: Indent;
  vessel3: Indent;
  awb_bl_no3: Indent;
  etd3: Indent;
  eta3: Indent;
  eway_bill_req: Indent;
  eway_bill_num: Indent;
  remarks2: Indent;
  com_month: Indent;
  checked_on: Indent;
  next_check: Indent;
  for_info: Indent;
  pmt_sts: Indent;
  del_sts: Indent;
  id: Indent;
  invoice_id: Indent;
  inv_request_anct_date: Indent;
  inv_issuance_date: Indent;
  inv_no: Indent;
  ewb_no: Indent;
  ewb_issuance_date: Indent;
  transportation_method: Indent;
  dispatch_date: Indent;
  dispatch_from_indent: Indent;
  dispatch_from_origin: Indent;
  dispatch_to_indent: Indent;
  dispatch_to_destination: Indent;
  machine_sn: Indent;
}

export interface IndentFromInvoice {
  indent_sheet_num: Indent;
  sos_summary: Indent;
  contract_acnt_name: Indent;
}

export interface InvoiceFilterDataType {
  indent_sheet_num: string;
  invoice_no1: string;
  invoice_no2: string;
  invoice_no3: string;
  inv_no: string;
}

export interface SegmapEmails {
  id_num: number;
  email: string;
  cc: boolean;
  setting_1: boolean;
  cc_2: boolean;
  setting_2: boolean;
  cc_3: boolean;
  setting_3: boolean;
  cc_4: boolean;
  setting_4: boolean;
  cc_5: boolean;
  setting_5: boolean;
  checked: boolean;
}


export interface SegmapEmailData {
  subject: string;
  body: string;
  email_flag: boolean;
}

export interface PriorityIndents {

  indent_sheet_num: string;
  indent_issue_date: string;
  contract_acnt_name: string;
  sos_summary: string;
  sales1_name: string;
  order_type: string;
  iipo_no: string;
  invoice_no1: string;
  exf1_sts: string;
  etd1: string;
  exf1: string;
  priority_type: number;
  priority_position: number;
  remark1: string;
  prod_date: string;
  prod_sts: string;
  del_sts: string;
  pmt_sts: string;
  for_info: string;
  region: string;
  linked_indents: string;
  frieght_trms: string;
  dispatch_location: string;
  pmt_trms: string;
  customer_etd: string;
  customer_po_num: string;

}

export interface HighPriorityIndents {

  indent_sheet_num: string;
  contract_acnt_name: string;
  sos_summary: string;
  sales1_name: string;
  order_type: string;
  iipo_no: string;
  invoice_no1: string;
  exf1_sts: string;
  etd1: string;
  exf1: string;
  priority_type: number;
  priority_position: number;
  updatePosition: number;
  remark1: string;
  isAdded?: boolean;
  region: string;

}


export interface PaginationDetails {

  ID: number;
  PSTATUS: boolean;
  PTIMER: number;
  PJUMPSTATUS: boolean;
  PJUMPNUMBER: number;
  TOTALPCOUNT: number;

}

export interface Regions {

  REGION_ID: number;
  REGION_NAME: string;
}