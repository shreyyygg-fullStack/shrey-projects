package model;

import java.util.List;

public class FileUploadResponse {

	// ARRAYlIST
	List<String> responseList;

	// FOR MESSAGE
	private String message;

	// FOR TITLE
	private String error_title;
	
	//FOR CONDITION ENUM
	private String cust_po;




	public String getCust_po() {
		return cust_po;
	}

	public void setCust_po(String cust_po) {
		this.cust_po = cust_po;
	}

	public FileUploadResponse() {
		super();
	}

	public FileUploadResponse(String title, String message) {
		this.error_title = title;
		this.message = message;
	}
	
	public List<String> getResponseList() {
		return responseList;
	}

	public void setResponseList(List<String> responseList) {
		this.responseList = responseList;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getError_title() {
		return error_title;
	}

	public void setError_title(String error_title) {
		this.error_title = error_title;
	}

}
