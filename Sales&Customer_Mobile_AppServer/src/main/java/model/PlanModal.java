package model;

public class PlanModal {
    String sn;
    String segment_id;
    String p_type;
    String p_date;
    String region;
    String sales;
    String salesPerson;
    String segment;
    String state;
    String account;
    String a_type;
    String a_date;
    String act;
    String remarks;
    String pm_type;
    String opportunity_flag;
    String odr_expdate;
    String key_acc;

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public String getSegment_id() {
        return segment_id;
    }

    public void setSegment_id(String segment_id) {
        this.segment_id = segment_id;
    }

    public String getP_type() {
        return p_type;
    }

    public void setP_type(String p_type) {
        this.p_type = p_type;
    }

    public String getP_date() {
        return p_date;
    }

    public void setP_date(String p_date) {
        this.p_date = p_date;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getSales() {
        return sales;
    }

    public void setSales(String sales) {
        this.sales = sales;
    }

    public String getSalesPerson() {
        return salesPerson;
    }

    public void setSalesPerson(String salesPerson) {
        this.salesPerson = salesPerson;
    }

    public String getSegment() {
        return segment;
    }

    public void setSegment(String segment) {
        this.segment = segment;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getA_type() {
        return a_type;
    }

    public void setA_type(String a_type) {
        this.a_type = a_type;
    }

    public String getA_date() {
        return a_date;
    }

    public void setA_date(String a_date) {
        this.a_date = a_date;
    }

    public String getAct() {
        return act;
    }

    public void setAct(String act) {
        this.act = act;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getPm_type() {
        return pm_type;
    }

    public void setPm_type(String pm_type) {
        this.pm_type = pm_type;
    }

    public String getOpportunity_flag() {
        return opportunity_flag;
    }

    public void setOpportunity_flag(String opportunity_flag) {
        this.opportunity_flag = opportunity_flag;
    }

    public String getOdr_expdate() {
        return odr_expdate;
    }

    public void setOdr_expdate(String odr_expdate) {
        this.odr_expdate = odr_expdate;
    }

    public String getKey_acc() {
        return key_acc;
    }

    public void setKey_acc(String key_acc) {
        this.key_acc = key_acc;
    }

    public PlanModal(String sn, String segment_id, String p_type, String p_date, String region, String sales, String salesPerson, String segment, String state, String account, String a_type,
                     String a_date, String act, String remarks, String pm_type, String opportunity_flag,  String odr_expdate, String key_acc) {
        this.sn = sn;
        this.segment_id = segment_id;
        this.p_type = p_type;
        this.p_date = p_date;
        this.region = region;
        this.sales = sales;
        this.salesPerson = salesPerson;
        this.segment = segment;
        this.state = state;
        this.account = account;
        this.a_type = a_type;
        this.a_date = a_date;
        this.act = act;
        this.remarks = remarks;
        this.pm_type = pm_type;
        this.opportunity_flag = opportunity_flag;
        this.odr_expdate = odr_expdate;
        this.key_acc = key_acc;
    }

    @Override
    public String toString() {
        return "PlanModal{" +
                "sn='" + sn + '\'' +
                ", segment_id='" + segment_id + '\'' +
                ", p_type='" + p_type + '\'' +
                ", p_date='" + p_date + '\'' +
                ", region='" + region + '\'' +
                ", sales='" + sales + '\'' +
                ", salesPerson='" + salesPerson + '\'' +
                ", segment='" + segment + '\'' +
                ", state='" + state + '\'' +
                ", account='" + account + '\'' +
                ", a_type='" + a_type + '\'' +
                ", a_date='" + a_date + '\'' +
                ", act='" + act + '\'' +
                ", remarks='" + remarks + '\'' +
                ", pm_type='" + pm_type + '\'' +
                ", opportunity_flag='" + opportunity_flag + '\'' +
                ", odr_expdate='" + odr_expdate + '\'' +
                ", key_acc='" + key_acc + '\'' +
                '}';
    }

    public PlanModal() {
    }
}
