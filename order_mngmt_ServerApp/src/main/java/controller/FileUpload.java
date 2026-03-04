package controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import config.JwtTokenDetail;
import config.Log4j2;
import config.Logs;
import model.FileUploadRequest;
import model.FileUploadResponse;
import model.IndentStatusResponce;
import service.FileUploadService;

@RestController
public class FileUpload {
	JwtTokenDetail user=JwtTokenDetail.getInstance();
	@Autowired
	FileUploadService uploadService;

	String strDateFormat = "yyyy-MM-dd E HH:mm:ss.SSS";
	String formattedDate;

	static final Logger log = LogManager.getLogger(Home.class);
	Logs logs = new Logs();

	public String defdate_fmt = "0000-00-00";
public String revChk = "";

	private static final String UPLOAD_FILE = "/upload";
	private static final String GET_FILELIST = "/files";
	private static final String GET_FILE = "/files/{filename:.+}";
	private static final String GET_INDENTNOSTATUS = "/chkIndentNoSts/{indentNum}";

	@RequestMapping(method = RequestMethod.POST, value = UPLOAD_FILE)
	public ResponseEntity<FileUploadResponse> uploadFile(@RequestParam("file") MultipartFile file) {
		String message = "";
		String title = "";
		FileUploadResponse result = null;

		try {
			result = null;
			result = uploadService.save(file);

			if (result.getMessage() == "1") {
				title = "File Uploaded Successfully";
				message = "File : " + file.getOriginalFilename();
				result.setError_title(title);
				result.setMessage(message);	
			}
//			else if(result.getMessage() == "2"){
//				title = "File Uploaded Successfully";
//				message = "File Uploaded: Customer PO number Already Exist";
//				result.setError_title(title);
//				result.setMessage(message);
//			}
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileUpload.class.getName()+ logs.getUploadFileLog());
			return ResponseEntity.status(HttpStatus.OK).body(result);
		} catch (Exception e) {
			message = "Could not upload the file: " + file.getOriginalFilename();
			result.setError_title("Upload Error!");
			result.setMessage(message);
			Log4j2.logger.error("Error\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileUpload.class.getName()+"\t"+e);
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(result);
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = GET_FILELIST)
	public ResponseEntity<List<FileUploadRequest>> getListFiles() {
		List<FileUploadRequest> fileInfos = uploadService.loadAll().map(path -> {
			String filename = path.getFileName().toString();
			String url = MvcUriComponentsBuilder
					.fromMethodName(FileUpload.class, "getFile", path.getFileName().toString()).build().toString();

			return new FileUploadRequest(filename, url);
		}).collect(Collectors.toList());

		return ResponseEntity.status(HttpStatus.OK).body(fileInfos);
	}

	@RequestMapping(method = RequestMethod.GET, value = GET_FILE)
	@ResponseBody
	public ResponseEntity<Resource> getFile(@PathVariable String filename) {
		Resource file = uploadService.load(filename);
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
				.body(file);
	}

	@RequestMapping(GET_INDENTNOSTATUS)
	public @ResponseBody IndentStatusResponce getFileSelIndentNoSts(@PathVariable String indentNum, HttpServletRequest req,
			HttpServletResponse res) {
		IndentStatusResponce indentstsres = new IndentStatusResponce();
		

		indentstsres = uploadService.ckhRevIndNoSts(indentNum);
				
		return indentstsres;
	}


}
