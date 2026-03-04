package controller;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.time.Duration;
import java.util.*;


@RestController
@RequestMapping("/session")
public class SessionController {
    static final Logger log = LogManager.getLogger(Login.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;


    @Autowired
    HttpSession session;
    @Autowired
    private JavaMailSender sender;


    @PostMapping("/upload-file")
    @ResponseBody
    public String uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("fileName") String fileName) throws SQLException {

        try {

            log.info("Received file upload request for: " + file.getOriginalFilename());

            byte[] Filebytes = file.getBytes();
            Base64.Encoder encoder = Base64.getEncoder();
            String encodedData = encoder.encodeToString(Filebytes);


            String sql = "INSERT INTO iexpense.summary_files (FILE_NAME, SIZE, FILE_DATA) VALUES ( ?,?, ?)";

            Object[] params = new Object[] { fileName, file.getSize() , Filebytes };

            int rowsAffected = jdbcTemplate.update(sql, params);
            if (rowsAffected > 0) {
                log.info("File uploaded successfully!");
                return "success";
            } else {
                log.info("Failed to upload file!");
                return "Failed to upload file!";
            }

        } catch (IOException e) {
            log.error("Error uploading file: " + e.getMessage(), e);
            throw new RuntimeException(e);

        }
    }

    @RequestMapping(method = RequestMethod.GET, path = "/get-files", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Map<String, Object>> getUsersList(HttpServletRequest req, HttpServletResponse res) {
        List<Map<String, Object>> filesList = new ArrayList<>();
        String sql = "SELECT * FROM iexpense.summary_files";
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            filesList = new ArrayList<>(rows);

            int index = 59;

            if (index >= 0 && index < filesList.size()) {
                Map<String, Object> selectedFile = filesList.get(index);

                // Extract file data
                String fileName = (String) selectedFile.get("FILE_NAME");
                byte[] fileData = (byte[]) selectedFile.get("FILE_DATA");

//                sendEmail(fileName, fileData);

                System.out.println("File Name: " + fileName);
                log.info("File emailed successfully.");
            } else {
                log.warn("Not enough files. Less than 47 rows available.");
            }

            log.info("Files fetched Successfully.");
        }
        catch(Exception exc) {
            log.warn("Failed to fetch Files: " + exc.getMessage(), exc);
        }
        return filesList;
    }
    public void sendEmail(String fileName, byte[] fileData) throws MailException, MessagingException {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name());

        // Convert byte array to InputStreamSource
        InputStreamSource attachment = new ByteArrayResource(fileData);

        try {
            helper.setFrom("ioss@ishidaindia.co.in");
            helper.setTo("shrey.gupta@ishidaindia.co.in");
            helper.setSubject("Expense Summary PDF File");
            helper.setText("Please find the attached PDF File", true);
            helper.addAttachment(fileName, attachment, "application/pdf");
            sender.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();

        }

    }

}
