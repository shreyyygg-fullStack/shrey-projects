package service;

import java.nio.file.Path;
import java.util.stream.Stream;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import model.FileUploadRequest;
import model.FileUploadResponse;
import model.IndentStatusResponce;

public interface FileUploadService {

	public FileUploadResponse init();

	public FileUploadResponse save(MultipartFile file);

	public Resource load(String filename);

//	public void deleteAll();

	public Stream<Path> loadAll();

	public FileUploadResponse insertIndentData(FileUploadRequest fileUploadReq, MultipartFile file);
	
//    public IndentStatusResponce ckhCurIndNoSts(String indentNum);
    
    public IndentStatusResponce ckhRevIndNoSts(String indentNum);
}
