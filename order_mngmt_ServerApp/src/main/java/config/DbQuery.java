package config;

public enum DbQuery {

	LOGINQUERY("select * from indentmaster.user_registration where user_id='%s' and BINARY password = '%s'"),
	/* Home Component Database Query */
	ALLNOTCOMNXTACTLIST(
			"select next_action_date, indent_sheet_number, sos_summary, user_accnt_name, for_info, updated_by from indent_number_action  WHERE completed_date is null ORDER BY indent_sheet_number DESC"),
	INDVREVNXTACTLIST(
			"select next_action_date, updated_by from indent_number_action  WHERE indent_sheet_number = ? and completed_date is null ORDER BY next_action_date DESC"),

	/* Dashboard Component Database Query */

	SNFSIGNALCNT("select count(*) from master_data WHERE sa_date='0000-00-00'"),
	APSIGNALCNT("select count(*) from master_data WHERE pmt_sts='P-0' and adv_amount > 0"),
	LCSIGNALCNT(
			"select count(*) As lcSignal from master_data WHERE (pmt_sts='P-0' or pmt_sts='P-1') and ash_type like '%LC%' and lc_open_date is null"),
	BPSIGNALCNT(
			"select count(*) As bpSignal from master_data WHERE (pmt_sts='P-0' or pmt_sts='P-1') and bsh_amount > 0"),
	OUTSIGNALCNT("select count(*) As outSignal from master_data WHERE pmt_sts='P-2' and del_sts='D-3'"),
	PNSSIGNALCNT("select count(*) As pnsSignal from master_data  WHERE oc_date is null"),
	LCPSIGNALCNT(
			"select count(*) As lcpSignal from `master_data` WHERE `ash_type` like '%LC%'  and lc_chk_date_by_ij is null"),
	PEXFSIGNALCNT(
			"select count(*) As pexfpSignal from master_data WHERE exf1 is null and exf2 is null and exf3 is null"),
	FEXFSIGNALCNT("select count(*) As fexfpSignal from master_data WHERE del_sts='D-0'"),
	SSPSIGNALCNT("select count(*) As sspSignal from master_data WHERE del_sts='D-1'"),
	SAPSIGNALCNT("select count(*) As sapSignal from master_data WHERE del_sts='D-3'"),

	YLLSNFSIGNALCNT(
			"SELECT COUNT(*) AS snfSignal FROM master_data WHERE sa_date='0000-00-00' and DATEDIFF( CURDATE(),indent_issue_date) >= 5"),
	YLLAPSIGNALCNT(
			"SELECT COUNT(*) AS apSignal FROM master_data WHERE pmt_sts='P-0' and adv_amount > 0 and DATEDIFF( CURDATE(),indent_issue_date) >=10 "),
	YLLLCSIGNALCNT(
			"SELECT COUNT(*) AS lcSignal FROM master_data WHERE (pmt_sts='P-0' or pmt_sts='P-1') and ash_type like '%LC%' and lc_open_date is null and DATEDIFF( CURDATE(),indent_issue_date) >=30 "),
	YLLBPSIGNALCNT(
			"SELECT COUNT(*) AS bpSignal FROM master_data WHERE  (pmt_sts='P-0' or pmt_sts='P-1') and bsh_amount > 0 and DATEDIFF( CURDATE(),(select min(least(exf1,exf2,exf3)) from  indentmaster.master_data)) <=14 "),
	YLLOUTSIGNALCNT(
			"SELECT COUNT(*) AS outSignal FROM master_data WHERE pmt_sts='P-2' and del_sts='D-3' and DATEDIFF( CURDATE(),(select max(GREATEST(etd1,etd2,etd3)) from  indentmaster.master_data)) >=30 "),
	YLLPNSSIGNALCNT(
			"SELECT COUNT(*) AS pnsSignal FROM `master_data` WHERE `oc_date` IS NULL AND DATEDIFF( CURDATE(),`indent_issue_date`) >= 7"),
	YLLLCPSIGNALCNT(
			"SELECT COUNT(*) AS lcpSignal FROM `master_data` WHERE `ash_type` like '%LC%'  and lc_chk_date_by_ij is null and DATEDIFF( CURDATE(),`indent_issue_date`) >= 14"),
	YLLPEXFSIGNALCNT(
			"SELECT COUNT(*) AS pexfpSignal FROM master_data WHERE exf1 is null and exf2 is null and exf3 is null and DATEDIFF( CURDATE(),sa_date) >= 21"),
	YLLFEXFSIGNALCNT(
			"SELECT COUNT(*) AS fexfpSignal FROM master_data WHERE del_sts='D-0' is null and DATEDIFF( CURDATE(),sa_date) >= 25"),
	YLLSSPSIGNALCNT(
			"SELECT COUNT(*) AS sspSignal FROM master_data WHERE del_sts='D-1' and DATEDIFF( CURDATE(),(select min(least(exf1,exf2,exf3)) from  indentmaster.master_data)) <=14 "),
	YLLSAPSIGNALCNT(
			"SELECT COUNT(*) AS sapSignal FROM master_data WHERE del_sts='D-3' and DATEDIFF( CURDATE(),etd1) >= 2 "),

	BLUFILTERSNF("SELECT * FROM master_data WHERE sa_date='0000-00-00' ORDER BY indent_sheet_num DESC"),
	BLUFILTERADV("SELECT * FROM master_data WHERE pmt_sts='P-0' and adv_amount > 0  ORDER BY indent_sheet_num DESC"),
	BLUFILTERLC(
			"SELECT * FROM master_data WHERE (pmt_sts='P-0' or pmt_sts='P-1') and ash_type like '%LC%' and lc_open_date is null  ORDER BY indent_sheet_num DESC"),
	BLUFILTERBSH(
			"SELECT * FROM master_data WHERE (pmt_sts='P-0' or pmt_sts='P-1') and bsh_amount> 0  ORDER BY indent_sheet_num DESC"),
	BLUFILTEROUT("SELECT * FROM master_data WHERE pmt_sts='P-2' and del_sts='D-3' ORDER BY indent_sheet_num DESC"),
	BLUFILTERPNS("select * from master_data  WHERE oc_date is null ORDER BY indent_sheet_num DESC"),
	BLUFILTERLCP(
			"SELECT * FROM `master_data` WHERE `ash_type` like '%LC%'  and lc_chk_date_by_ij is null ORDER BY indent_sheet_num DESC"),
	BLUFILTERPXEF(
			"SELECT * FROM master_data WHERE exf1 is null and exf2 is null and exf3 is null ORDER BY indent_sheet_num DESC"),
	BLUFILTERFEXF("SELECT * FROM master_data WHERE del_sts='D-0' ORDER BY indent_sheet_num DESC"),
	BLUFILTERSSP("SELECT * FROM master_data WHERE del_sts='D-1' ORDER BY indent_sheet_num DESC"),
	BLUFILTERSAP("SELECT * FROM master_data WHERE del_sts='D-3' ORDER BY indent_sheet_num DESC"),

	YELLFILTERSNF(
			"SELECT * FROM master_data WHERE sa_date is null and DATEDIFF( CURDATE(),indent_issue_date) >= 5  ORDER BY indent_sheet_num DESC"),
	YELLFILTERADV(
			"SELECT * FROM master_data WHERE pmt_sts='P-0' and adv_amount > 0 and DATEDIFF( CURDATE(),indent_issue_date) >=10  ORDER BY indent_sheet_num DESC"),
	YELLFILTERLC(
			"SELECT * FROM master_data WHERE (pmt_sts='P-0' or pmt_sts='P-1') and ash_type like '%LC%' and lc_open_date is null and DATEDIFF( CURDATE(),indent_issue_date) >=30  ORDER BY indent_sheet_num DESC"),
	YELLFILTERBSH(
			"SELECT * FROM master_data WHERE  (pmt_sts='P-0' or pmt_sts='P-1') and bsh_amount> 0 and DATEDIFF( CURDATE(),(select min(least(exf1,exf2,exf3)) from  indentmaster.master_data)) <=14  ORDER BY indent_sheet_num DESC"),
	YELLFILTEROUT(
			"SELECT * FROM master_data WHERE pmt_sts='P-2' and del_sts='D-3' and DATEDIFF( CURDATE(),(select max(GREATEST(etd1,etd2,etd3)) from  indentmaster.master_data)) >=30  ORDER BY indent_sheet_num DESC"),
	YELLFILTERPNS(
			"SELECT * FROM `master_data` WHERE `oc_date` IS NULL AND DATEDIFF( CURDATE(),`indent_issue_date`) >= 7 ORDER BY indent_sheet_num DESC"),
	YELLFILTERLCP(
			"SELECT * FROM `master_data` WHERE `ash_type` like '%LC%'  and lc_chk_date_by_ij is null and DATEDIFF( CURDATE(),`indent_issue_date`) >= 14 ORDER BY indent_sheet_num DESC"),
	YELLFILTERPXEF(
			"SELECT * FROM master_data WHERE exf1 is null and exf2 is null and exf3 is null and DATEDIFF( CURDATE(),sa_date) >= 21 ORDER BY indent_sheet_num DESC"),
	YELLFILTERFEXF(
			"SELECT * FROM master_data WHERE del_sts='D-0' is null and DATEDIFF( CURDATE(),sa_date) >= 25 ORDER BY indent_sheet_num DESC"),
	YELLFILTERSSP(
			"SELECT * FROM master_data WHERE del_sts='D-1' and DATEDIFF( CURDATE(),(select min(least(exf1,exf2,exf3)) from  indentmaster.master_data)) <=14  ORDER BY indent_sheet_num DESC"),
	YELLFILTERSAP(
			"SELECT * FROM master_data WHERE del_sts='D-3' and DATEDIFF( CURDATE(),etd1) >= 2 ORDER BY indent_sheet_num DESC"),

	ALLINDENTLIST("select * from indentmaster.master_data"),
	INDVINDENTDETAIL("select * from master_data where indent_sheet_num = '%s'");

	private String query;

	private DbQuery(String query) {

		this.query = query;
	}

	public String getQuery() {
		return query;
	}
}
