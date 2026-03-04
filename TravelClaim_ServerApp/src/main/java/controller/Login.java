package controller;

import configuration.DbQuery;
import encrypt.AES;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.UpdateResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@RestController
public class Login {

    @Autowired
    private JavaMailSender sender;

    DbQuery dbQuery = new DbQuery();
    static final Logger log = LogManager.getLogger(Login.class);
    private static final long EXPIRATION_TIME = 10 * 60 * 1000; // 15 minutes
    final String Key = "mysecretkey12345";

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/redirect")
    public ResponseEntity<String> path() {
        System.out.println("path successful");

        return ResponseEntity.ok("Login Successful");
    }

    @GetMapping("/logouturl")
    public ResponseEntity<String> logoutPath() {
        System.out.println("Log out path successful");

        return ResponseEntity.ok("Logout Successful");
    }

    @RequestMapping(method = RequestMethod.POST, path = "/signUp")
    public @ResponseBody UpdateResponse signUp(@RequestBody Map<String, String> SignUpDetails) {

        UpdateResponse updateresp = new UpdateResponse();

        String userId = SignUpDetails.get("userId");
        String newPassword = SignUpDetails.get("newPassword");
        String token = SignUpDetails.get("token");
        String type = SignUpDetails.get("type");

        int affectedRows;
        String sql = dbQuery.getSIGNUP();
        Object[] params = new Object[]{newPassword, userId};

        try {
            affectedRows = jdbcTemplate.update(sql, params);

            if (affectedRows == 1) {
                updateresp.setAffectedRows(1);
                System.out.println("Sign Up Successfully");

                String sql2 = dbQuery.getDELETETOKEN();
                int affectedRows2 = jdbcTemplate.update(sql2, new Object[]{token});

                if (affectedRows2 > 0) {
                    System.out.println("Token Deleted");
                }

                if (!Objects.equals(type, "password")) {
                    String sql1 = dbQuery.getSETINVITEFLAG();
                    int affectedRows1 = jdbcTemplate.update(sql1, new Object[]{userId});
                    if (affectedRows1 > 0) {
                        System.out.println("Invitation Flag has been Updated");
                    }
                }

            }

            return updateresp;
        } catch (Exception e) {
            updateresp.setAffectedRows(0);
            System.out.println("Sign Up Failed");
            return updateresp;
        }

    }

    @RequestMapping(method = RequestMethod.POST, path = "/forgotPassword")
    public @ResponseBody Number forgotPassword(@RequestBody Map<String, String> Email) {

        Number result = 0;
        String emailAddress = Email.get("emailAddress");
        List<Object> empId = new ArrayList<>();
//        List<Object> inviteFlag = new ArrayList<>();

        String sql = dbQuery.getCHECKEMPID();
        Object[] params = new Object[]{emailAddress};

        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
            empId = new ArrayList<>(rows);

            if (empId != null && !empId.isEmpty()) {

                String empIdString = rows.isEmpty() ? "" : rows.get(0).get("username").toString();

                String sql1 = "SELECT INVITE FROM iexpense.userdetails WHERE EMP_ID = ?";
                Object[] params1 = new Object[]{empIdString};
                List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1, params1);
                String inviteFlag = rows1.isEmpty() ? "" : rows1.get(0).get("INVITE").toString();

                if (Integer.parseInt(inviteFlag) == 1) {
                    empIdString = AES.encrypt(empIdString, Key);
                    sendInvitationLink(emailAddress, empIdString);
                    System.out.println("Successfully get EMP ID and email has been sent");
                    result = 1;
                } else {
                    result = 0;
                    System.out.println("This user is not invited yet!");
                }

//                String sql1 = "update iexpense.iuseraccounts set password = ? where username = ?";
//                int affectdRows = jdbcTemplate.update(sql1, new Object[]{"", userId});
//                if (affectdRows > 0) {
//                    System.out.println("Password is set to empty.");
//                }

            } else {
                result = 0;
                System.out.println("empId list is either null or empty");
            }

            return result;
        } catch (Exception e) {
            result = 0;
            System.out.println("Failed to get EMP ID");
            return result;
        }

    }

    public void sendInvitationLink(String email, String userID) throws MessagingException {
        String token = UUID.randomUUID().toString();
        Timestamp expiryTime = Timestamp.from(Instant.now().plusMillis(EXPIRATION_TIME));

        String sql = dbQuery.getInsertToken();
        // Save token in database
        jdbcTemplate.update(sql, email, token, expiryTime, "FORGOT_PASSWORD");

        String link = "http://localhost:4200/login?token=" + token + "&empId=" + userID + "&reset=password";

        String text = "<p>Click the link below to set your new passowrd on IExpense Application :</p>" +
                "<p><a href='" + link + "'>Set New Password</a></p>";

        sendEmail1(email, "IExpense - Password Reset Email", text);
    }

    private void sendEmail1(String to, String subject, String text) throws MessagingException {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name());

        helper.setFrom("ioss@ishidaindia.co.in");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, true);
        sender.send(message);
    }

//    public void sendEmail(String email) throws MailException, MessagingException {
//        MimeMessage message = sender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
//                StandardCharsets.UTF_8.name());
//        tempPass = null;
//        tempPass = shortUUID();
//
//        String html = "<html><body>" + "<div>\r\n" + "<div>\r\n" + "<div>\r\n" + "\r\n"
//                + "    </div>\r\n" + "Dear Recipient,<br>We have received your request for reset password.\r\n"
//                + "    <br>To reset, please use the below link to set your New Password :<br><br>\r\n"
//                + "    <b>Reset Password:-<strong> " + tempPass + "</strong></b><br><br><br>\r\n"
//                + "    Regards,<br>\r\n" + "    <b>Ishida India Support Team</b>\r\n"
//                + "    <br><br>Note: This is a system generated e-mail, please do not reply to it.<br>\r\n"
//                + "</div></body></html>";
//
//        try {
//            helper.setFrom("ioss@ishidaindia.co.in");
//            helper.setTo(email);
//            helper.setSubject("IExpense - Password Reset Email");
//            helper.setText(html, true);
//            sender.send(message);
//
//
//        } catch (MessagingException e) {
//            throw new RuntimeException(e);
//        }
//
//    }


//    public static String shortUUID() {
//        UUID uuid = UUID.randomUUID();
//        long l = ByteBuffer.wrap(uuid.toString().getBytes()).getLong();
//        return Long.toString(l, Character.MAX_RADIX);
//    }

}

