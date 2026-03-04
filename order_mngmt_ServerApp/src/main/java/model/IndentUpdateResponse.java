package model;

public class IndentUpdateResponse {

	int affectedRows;
	String message;

	public IndentUpdateResponse() {
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
