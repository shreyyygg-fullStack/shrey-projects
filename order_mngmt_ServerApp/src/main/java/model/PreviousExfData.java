package model;

public class PreviousExfData {

    String PreExfDate;
    String PreExfSts;

    public String getPreExfDate() {
        return PreExfDate;
    }

    public void setPreExfDate(String preExfDate) {
        PreExfDate = preExfDate;
    }

    public String getPreExfSts() {
        return PreExfSts;
    }

    public void setPreExfSts(String preExfSts) {
        PreExfSts = preExfSts;
    }

    public PreviousExfData(String PreExfDate, String PreExfSts){
        this.PreExfDate = PreExfDate;
        this.PreExfSts = PreExfSts;

    }

    public PreviousExfData(){

    }

    @Override
    public String toString() {
        return "PreviousExfData{" +
                "exf1_date='" + PreExfDate + '\'' +
                ", exf1_sts='" + PreExfSts + '\'' +
                '}';
    }
}
