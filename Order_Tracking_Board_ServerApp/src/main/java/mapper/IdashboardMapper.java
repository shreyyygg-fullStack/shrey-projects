package mapper;

import model.IDashboardMaster;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class IdashboardMapper implements RowMapper<IDashboardMaster> {

    @Override
    public IDashboardMaster mapRow(ResultSet rs, int rowNum) throws SQLException {
        IDashboardMaster dashboard = new IDashboardMaster();
        dashboard.setIndentSheetNum(rs.getString("indent_sheet_num"));
        dashboard.setSosSummary(rs.getString("sos_summary"));
        dashboard.setSales1Id(rs.getString("sales1_id"));
        dashboard.setSales1Name(rs.getString("sales1_name"));
        dashboard.setOrderType(rs.getString("order_type"));
        dashboard.setContractAcntName(rs.getString("contract_acnt_name"));
        dashboard.setIipoNo(rs.getString("iipo_no"));
        dashboard.setExf1(rs.getString("exf1"));
        dashboard.setExf1Sts(rs.getString("exf1_sts"));
//        dashboard.setExfIjAccment1(rs.getString("exf_ij_accment1"));
        dashboard.setInvoiceNo1(rs.getString("invoice_no1"));
        dashboard.setEtd1(rs.getDate("etd1"));
        dashboard.setEta1(rs.getDate("eta1"));
        dashboard.setCheckedOn(rs.getDate("checked_on"));
        dashboard.setNextCheck(rs.getDate("next_check"));
        dashboard.setForInfo(rs.getString("for_info"));
        dashboard.setPmtSts(rs.getString("pmt_sts"));
        dashboard.setDelSts(rs.getString("del_sts"));
        dashboard.setProdDate(rs.getDate("prod_date"));
        dashboard.setProdSts(rs.getString("prod_sts"));
        dashboard.setRemark1(rs.getString("remark1"));
        dashboard.setRemark2(rs.getString("remark2"));
        dashboard.setEventDate1(rs.getDate("event_date1"));
        dashboard.setFlag1Sts(rs.getString("flag1_sts"));
        dashboard.setPriorityType(rs.getString("priority_type"));
        dashboard.setPriorityPosition(rs.getString("priority_position"));
        dashboard.setRegion(rs.getString("region"));
        dashboard.setPayment_sts(rs.getString("payment_sts"));
        dashboard.setDelevery_sts(rs.getString("delevery_sts"));
        return dashboard;
    }
}
