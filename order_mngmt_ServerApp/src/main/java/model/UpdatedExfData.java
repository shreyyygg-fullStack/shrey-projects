package model;

public class UpdatedExfData {

    String UpdExfDate;
    String UpdExfSts;

    public String getUpdExfDate() {
        return UpdExfDate;
    }

    public void setUpdExfDate(String updExfDate) {
        UpdExfDate = updExfDate;
    }

    public String getUpdExfSts() {
        return UpdExfSts;
    }

    public void setUpdExfSts(String updExfSts) {
        UpdExfSts = updExfSts;
    }

    public UpdatedExfData(String UpdExfDate, String UpdExfSts){
        this.UpdExfDate = UpdExfDate;
        this.UpdExfSts = UpdExfSts;

    }


    public UpdatedExfData(){

    }

    @Override
    public String toString() {
        return "UpdatedExfData{" +
                "exf1_date='" + UpdExfDate + '\'' +
                ", exf1_sts='" + UpdExfSts + '\'' +
                '}';
    }
}
