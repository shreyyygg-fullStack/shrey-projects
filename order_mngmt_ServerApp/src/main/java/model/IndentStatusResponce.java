package model;

public class IndentStatusResponce {
	
	private String selFileNotExistFlag = "0";
	private String selFileExistAndEqualFlag = "0";
	private String selFileRevisedFileExist = "0";
	private String existingIndentFile = "0";
	
	public IndentStatusResponce() {
		super();
	}



	public String getSelFileNotExistFlag() {
		return selFileNotExistFlag;
	}


	public void setSelFileNotExistFlag(String selFileNotExistFlag) {
		this.selFileNotExistFlag = selFileNotExistFlag;
	}



	public String getSelFileExistAndEqualFlag() {
		return selFileExistAndEqualFlag;
	}

	public void setSelFileExistAndEqualFlag(String selFileExistAndEqualFlag) {
		this.selFileExistAndEqualFlag = selFileExistAndEqualFlag;
	}

	public String getSelFileRevisedFileExist() {
		return selFileRevisedFileExist;
	}

	public void setSelFileRevisedFileExist(String selFileRevisedFileExist) {
		this.selFileRevisedFileExist = selFileRevisedFileExist;
	}

	public String getExistingIndentFile() {
		return existingIndentFile;
	}

	public void setExistingIndentFile(String existingIndentFile) {
		this.existingIndentFile = existingIndentFile;
	}


	
	
	
	
}
