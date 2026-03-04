package service;

import config.*;
import model.CustomerAccountInfo;
import model.EmailRequest;
import model.PreviousExfData;
import model.UpdatedExfData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.SplittableRandom;

@Service
public class INVeWBemailSender {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final Logger logger = LoggerFactory.getLogger(EXFemailSender.class);

    JwtTokenDetail user = JwtTokenDetail.getInstance();
    DBGetQuery getQuery = new DBGetQuery();
    DbIndentUpdateQuery updateQuery = new DbIndentUpdateQuery();
    Logs logs = new Logs();
    private final JavaMailSender javaMailSender;


    public INVeWBemailSender(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    //getting emails for InvEwb to send
    public List<String> getInvEwbEmails() {

        List<String> emailList = null;
        try {
            String sql = getQuery.getEmailForInvEwb();
            emailList = jdbcTemplate.queryForList(sql, String.class);

        } catch (Exception e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + "\t" + "Failed to get TO Emails");
        }
        return emailList;
    }

    //getting cc emails for InvEwb to send
    public List<String> getInvEwbCcEmails() {

        List<String> CcemailList = null;
        try {
            String sql = getQuery.getCcEmailForInvEwb();
            CcemailList = jdbcTemplate.queryForList(sql, String.class);

        } catch (Exception e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + "\t" + "Failed to get CC Emails");
        }
        return CcemailList;
    }

    //getting email data for email to send
    public List<EmailRequest> getInvEwbEmailFormData() {
        List<EmailRequest> result = new ArrayList<>();
        try {
            String id = "2";
            Object[] params = new Object[]{id};
            String sql = getQuery.getEmailData();
            List<EmailRequest> rows = jdbcTemplate.query(sql, params, emailFormDataRowMapper());
            result = new ArrayList<EmailRequest>(rows);

        } catch (Exception e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + "\t" + "Failed to get Email Form Data");
        }
        return result;
    }

    private RowMapper<EmailRequest> emailFormDataRowMapper() {
        return (rs, rowNum) -> {
            EmailRequest emailRequest = new EmailRequest();
            emailRequest.setSubject(rs.getString("subject"));
            emailRequest.setBody(rs.getString("body"));
            return emailRequest;
        };
    }

    //setting data format for email
    public String getEmailData(String customerName, String indentNo, String invIssuanceDate, String invNo, byte[] invDocBytes,
                               String invoiceFileName, String dispatchDate, String ewbIssuanceDate, String ewbNo, byte[] ewbDocBytes, String ewbFileName, String userName, String delSts, String pmtSts) {

        StringBuilder htmlPara = new StringBuilder();

        if (userName == null || userName == "") {
            userName = "Blank";
        }

        String invDocFlag = "";
        String ewbDocFlag = "";

        if (invDocBytes == null) {
            invDocFlag = "No";
        } else {
            invDocFlag = "Yes";
        }

        if (ewbDocBytes == null) {
            ewbDocFlag = "No";
        } else {
            ewbDocFlag = "Yes";
        }

        if (invIssuanceDate == null || invIssuanceDate == "") {
            invIssuanceDate = "No Date";
        }
        if (invNo == null || invNo == "") {
            invNo = "None";
        }
        if (dispatchDate == null || dispatchDate == "") {
            dispatchDate = "No Date";
        }
        if (ewbIssuanceDate == null || ewbIssuanceDate == "") {
            ewbIssuanceDate = "No Date";
        }
        if (ewbNo == null || ewbNo == "") {
            ewbNo = "None";
        }


        htmlPara.append("<div class='container' style='font-family: Arial, sans-serif;'>");

        htmlPara.append("<strong>Customer Name</strong> :- <strong>").append(customerName).append("</strong><br><br>");

        htmlPara.append("<table style='width: 100%; border-collapse: collapse;'>");
        htmlPara.append("<tr>");

        htmlPara.append("<td style='width: 50%; padding: 10px; border: 1px solid black;'>");
        htmlPara.append("<table style='width: 100%;'>");
        htmlPara.append("<tr><td><strong>INDENT NO. :-</strong></td><td>").append(indentNo).append("</td></tr>");
        htmlPara.append("<tr><td><strong>INV ISSUANCE DATE :-</strong></td><td>").append(invIssuanceDate).append("</td></tr>");
        htmlPara.append("<tr><td><strong>INV NO. :-</strong></td><td>").append(invNo).append("</td></tr>");
        htmlPara.append("<tr><td><strong>INV DOCUMENT ATTACHED :-</strong></td><td >").append(invDocFlag).append("</td></tr>");
        htmlPara.append("<tr><td><strong>PMT STATUS :-</strong></td><td >").append(pmtSts).append("</td></tr>");
        htmlPara.append("</table>");
        htmlPara.append("</td>");

        htmlPara.append("<td style='width: 50%; padding: 10px; border: 1px solid black;'>");
        htmlPara.append("<table style='width: 100%;'>");
        htmlPara.append("<tr><td><strong>DISPATCH DATE :-</strong></td><td>").append(dispatchDate).append("</td></tr>");
        htmlPara.append("<tr><td><strong>EWB ISSUANCE DATE :-</strong></td><td >").append(ewbIssuanceDate).append("</td></tr>");
        htmlPara.append("<tr><td><strong>EWB NO. :-</strong></td><td >").append(ewbNo).append("</td></tr>");
        htmlPara.append("<tr><td><strong>EWB DOCUMENT ATTACHED :-</strong></td><td>").append(ewbDocFlag).append("</td></tr>");
        htmlPara.append("<tr><td><strong>DEL STATUS :-</strong></td><td >").append(delSts).append("</td></tr>");
        htmlPara.append("</table>");
        htmlPara.append("</td>");

        htmlPara.append("</tr>");
        htmlPara.append("</table>");

        htmlPara.append("<br>");
        htmlPara.append("<strong>Verified By :- </strong>").append(userName);
        htmlPara.append("</div>");

        return htmlPara.toString();
    }


    public String triggerINVeWBEmail(List<String> emails, String subject, String body, String customerName, String indentNo, String invIssuanceDate, String invNo, byte[] invDocBytes,
                                     String invoiceFileName, String dispatchDate, String ewbIssuanceDate, String ewbNo, byte[] ewbDocBytes, String ewbFileName, String userName, String delSts, String pmtSts) {

        String result = "";
        try {

//            TO ADD SALES1 EMAIL ID IN EXISTING SELECTED EMAIL IDS

            String sql = getQuery.getGetSales1Id();
            Object[] params = new Object[]{indentNo};

            Map<String, Object> result2 = jdbcTemplate.queryForMap(sql, params);
            String sales1Id = (String) result2.get("sales1_id");
            String sales2Id = (String) result2.get("sales2_id");

            String sales1EmailId = null;
            if (sales1Id != null && !sales1Id.isEmpty()) {
                String sql1 = getQuery.getGetSales1EmailId();
                Object[] params1 = new Object[]{sales1Id};
                List<Map<String, Object>> result3 = jdbcTemplate.queryForList(sql1, params1);
                if (!result3.isEmpty()) {
                    sales1EmailId = (String) result3.get(0).get("EMAIL");
                }
            }

            String sales2EmailId = null;
            if (sales2Id != null && !sales2Id.isEmpty()) {
                String sql2 = getQuery.getGetSales1EmailId();
                Object[] params2 = new Object[]{sales2Id};
                List<Map<String, Object>> result4 = jdbcTemplate.queryForList(sql2, params2);
                if (!result4.isEmpty()) {
                    sales2EmailId = (String) result4.get(0).get("EMAIL");
                }
            }


            emails = new ArrayList<>(emails);

            if (sales1EmailId != null && !sales1EmailId.isEmpty()) {
                emails.add(sales1EmailId);
            }

            if (sales2EmailId != null && !sales2EmailId.isEmpty()) {
                emails.add(sales2EmailId);
            }

            String htmlContent = getEmailData(customerName, indentNo, invIssuanceDate, invNo, invDocBytes, invoiceFileName, dispatchDate,
                    ewbIssuanceDate, ewbNo, ewbDocBytes, ewbFileName, userName, delSts, pmtSts);


            result = sendEmail(emails, subject, body, htmlContent, invDocBytes, invoiceFileName, ewbDocBytes, ewbFileName, indentNo);

        } catch (Exception e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + INVeWBemailSender.class.getName() + " Error sending INV/eWB email", e);
        }


        return result;
    }

    public String sendEmail(List<String> toEmails, String subject, String body, String htmlContent, byte[] invDocBytes,
                            String invoiceFileName, byte[] ewbDocBytes, String ewbFileName, String indentNo) {

        String result;
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");

            String sentences = body;

            String formattedSentence = "";
            if (sentences.length() > 59) {
                String lastCharacters = sentences.substring(sentences.length() - 60); // Get the last 60 characters
                String remainingCharacters = sentences.substring(0, sentences.length() - 60); // Get the characters before the last 60 characters

                formattedSentence = remainingCharacters + "<br><br>" + lastCharacters;
            }

            helper.setFrom("ioss@ishidaindia.co.in");
            helper.setTo(toEmails.toArray(new String[0]));
//            helper.setCc(CCEmails.toArray(new String[0]));
            helper.setSubject(subject +" | "+ indentNo);


            String emailBody = htmlContent + "<br>" + "<b>" + formattedSentence + "</b>";
            helper.setText(emailBody, true);

            // Attach Invoice bill if present
            if (invDocBytes != null && invoiceFileName != null) {
                helper.addAttachment(invoiceFileName, new ByteArrayResource(invDocBytes));
            }

            // Attach EWB bill if present
            if (ewbDocBytes != null && ewbFileName != null) {
                helper.addAttachment(ewbFileName, new ByteArrayResource(ewbDocBytes));
            }

            javaMailSender.send(message);


            result = "Success";

            return result;

        } catch (MessagingException e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + INVeWBemailSender.class.getName() + "Error sending INV/eWB email");

            result = "Failed";

            return result;

        }


    }


}
