package model;

import java.util.Date;

public class IDashboardMaster {
    private String indentSheetNum;
    private String sosSummary;
    private String sales1Id;
    private String sales1Name;
    private String orderType;
    private String contractAcntName;
    private String iipoNo;
    private String exf1;
    private String exf1Sts;
//    private String exfIjAccment1;
    private String invoiceNo1;
    private Date etd1;
    private Date eta1;
    private Date checkedOn;
    private Date nextCheck;
    private String forInfo;
    private String pmtSts;
    private String delSts;
    private Date prodDate;
    private String prodSts;

    private String remark1;
    private String remark2;
    private Date eventDate1;
    private String flag1Sts;
    private String priorityType;
    private String priorityPosition;
    private String region;
    private String payment_sts;
    private String delevery_sts;



    public String getPayment_sts() {
        return payment_sts;
    }

    public void setPayment_sts(String payment_sts) {
        this.payment_sts = payment_sts;
    }

    public String getDelevery_sts() {
        return delevery_sts;
    }

    public void setDelevery_sts(String delevery_sts) {
        this.delevery_sts = delevery_sts;
    }

//    public String getRegion() {
//        return region;
//    }
//
//    public void setRegion(String region) {
//        this.region = region;
//    }

    public String getIndentSheetNum() {
        return indentSheetNum;
    }

    public void setIndentSheetNum(String indentSheetNum) {
        this.indentSheetNum = indentSheetNum;
    }

    public String getSosSummary() {
        return sosSummary;
    }

    public void setSosSummary(String sosSummary) {
        this.sosSummary = sosSummary;
    }

    public String getSales1Id() {
        return sales1Id;
    }

    public void setSales1Id(String sales1Id) {
        this.sales1Id = sales1Id;
    }

    public String getSales1Name() {
        return sales1Name;
    }

    public void setSales1Name(String sales1Name) {
        this.sales1Name = sales1Name;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public String getContractAcntName() {
        return contractAcntName;
    }

    public void setContractAcntName(String contractAcntName) {
        this.contractAcntName = contractAcntName;
    }

    public String getIipoNo() {
        return iipoNo;
    }

    public void setIipoNo(String iipoNo) {
        this.iipoNo = iipoNo;
    }

    public String getExf1() {
        return exf1;
    }

    public void setExf1(String exf1) {
        this.exf1 = exf1;
    }

    public String getExf1Sts() {
        return exf1Sts;
    }

    public void setExf1Sts(String exf1Sts) {
        this.exf1Sts = exf1Sts;
    }

//    public String getExfIjAccment1() {
//        return exfIjAccment1;
//    }
//
//    public void setExfIjAccment1(String exfIjAccment1) {
//        this.exfIjAccment1 = exfIjAccment1;
//    }

    public String getInvoiceNo1() {
        return invoiceNo1;
    }

    public void setInvoiceNo1(String invoiceNo1) {
        this.invoiceNo1 = invoiceNo1;
    }

    public Date getEtd1() {
        return etd1;
    }

    public void setEtd1(Date etd1) {
        this.etd1 = etd1;
    }

    public Date getEta1() {
        return eta1;
    }

    public void setEta1(Date eta1) {
        this.eta1 = eta1;
    }

    public Date getCheckedOn() {
        return checkedOn;
    }

    public void setCheckedOn(Date checkedOn) {
        this.checkedOn = checkedOn;
    }

    public Date getNextCheck() {
        return nextCheck;
    }

    public void setNextCheck(Date nextCheck) {
        this.nextCheck = nextCheck;
    }

    public String getForInfo() {
        return forInfo;
    }

    public void setForInfo(String forInfo) {
        this.forInfo = forInfo;
    }

    public String getPmtSts() {
        return pmtSts;
    }

    public void setPmtSts(String pmtSts) {
        this.pmtSts = pmtSts;
    }

    public String getDelSts() {
        return delSts;
    }

    public void setDelSts(String delSts) {
        this.delSts = delSts;
    }

    public Date getProdDate() {
        return prodDate;
    }

    public void setProdDate(Date prodDate) {
        this.prodDate = prodDate;
    }

    public String getProdSts() {
        return prodSts;
    }

    public void setProdSts(String prodSts) {
        this.prodSts = prodSts;
    }



    public String getRemark1() {
        return remark1;
    }

    public void setRemark1(String remark1) {
        this.remark1 = remark1;
    }

    public String getRemark2() {
        return remark2;
    }

    public void setRemark2(String remark2) {
        this.remark2 = remark2;
    }

    public Date getEventDate1() {
        return eventDate1;
    }

    public void setEventDate1(Date eventDate1) {
        this.eventDate1 = eventDate1;
    }

    public String getFlag1Sts() {
        return flag1Sts;
    }

    public void setFlag1Sts(String flag1Sts) {
        this.flag1Sts = flag1Sts;
    }

    public String getPriorityType() {
        return priorityType;
    }

    public void setPriorityType(String priorityType) {
        this.priorityType = priorityType;
    }

    public String getPriorityPosition() {
        return priorityPosition;
    }

    public void setPriorityPosition(String priorityPosition) {
        this.priorityPosition = priorityPosition;
    }

    public String getRegion() {return region;}

    public void setRegion(String region) {this.region = region;}

    public IDashboardMaster() {
    }

    public IDashboardMaster(String indentSheetNum, String sosSummary, String sales1Id, String sales1Name, String orderType, String contractAcntName, String iipoNo, String exf1, String exf1Sts, String invoiceNo1, Date etd1, Date eta1, Date checkedOn, Date nextCheck, String forInfo, String pmtSts, String delSts, Date prodDate, String prodSts, String remark1, String remark2, Date eventDate1, String flag1Sts, String priorityType, String priorityPosition, String region, String payment_sts, String delevery_sts) {
        this.indentSheetNum = indentSheetNum;
        this.sosSummary = sosSummary;
        this.sales1Id = sales1Id;
        this.sales1Name = sales1Name;
        this.orderType = orderType;
        this.contractAcntName = contractAcntName;
        this.iipoNo = iipoNo;
        this.exf1 = exf1;
        this.exf1Sts = exf1Sts;
//        this.exfIjAccment1 = exfIjAccment1;
        this.invoiceNo1 = invoiceNo1;
        this.etd1 = etd1;
        this.eta1 = eta1;
        this.checkedOn = checkedOn;
        this.nextCheck = nextCheck;
        this.forInfo = forInfo;
        this.pmtSts = pmtSts;
        this.delSts = delSts;
        this.prodDate = prodDate;
        this.prodSts = prodSts;
        this.remark1 = remark1;
        this.remark2 = remark2;
        this.eventDate1 = eventDate1;
        this.flag1Sts = flag1Sts;
        this.priorityType = priorityType;
        this.priorityPosition = priorityPosition;
        this.region = region;
        this.payment_sts = payment_sts;
        this.delevery_sts = delevery_sts;
    }
}
