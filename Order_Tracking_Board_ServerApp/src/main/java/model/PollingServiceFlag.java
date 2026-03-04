package model;

public class PollingServiceFlag {
    private int id;
    private int ischangeflag;
    private String indentNo;
    private int statusFlag;
    private String message;
    private String updatedOn;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getIschangeflag() {
        return ischangeflag;
    }

    public void setIschangeflag(int ischangeflag) {
        this.ischangeflag = ischangeflag;
    }

    public String getIndentNo() {
        return indentNo;
    }

    public void setIndentNo(String indentNo) {
        this.indentNo = indentNo;
    }

    public int getStatusFlag() {
        return statusFlag;
    }

    public void setStatusFlag(int statusFlag) {
        this.statusFlag = statusFlag;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public String getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(String updatedOn) {
        this.updatedOn = updatedOn;
    }

    public PollingServiceFlag(int id, int ischangeflag, String indentNo, int statusFlag, String message, String updatedOn) {
        this.id = id;
        this.ischangeflag = ischangeflag;
        this.indentNo = indentNo;
        this.statusFlag = statusFlag;
        this.message = message;
        this.updatedOn = updatedOn;
    }

    public PollingServiceFlag() {
    }
}