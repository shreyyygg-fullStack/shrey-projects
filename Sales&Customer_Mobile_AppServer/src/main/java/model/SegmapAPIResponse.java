package model;

public class SegmapAPIResponse {

    int affectedRows;
    String message;

    public SegmapAPIResponse() {
        super();
    }

    public int getAffectedRows() {
        return affectedRows;
    }

    public void setAffectedRows(int affectedRows) {
        this.affectedRows = affectedRows;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
