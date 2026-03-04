package service;

import config.*;
import model.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class EXFemailSender {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final Logger logger = LoggerFactory.getLogger(EXFemailSender.class);

    JwtTokenDetail user = JwtTokenDetail.getInstance();
    DBGetQuery getQuery = new DBGetQuery();
    DbIndentUpdateQuery updateQuery = new DbIndentUpdateQuery();
    Logs logs = new Logs();
    private final JavaMailSender javaMailSender;

    public EXFemailSender(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    //getting emails for IIEXF to send
    public List<String> getEmails() {

        List<String> emailList = null;
        try {
            String sql = getQuery.getEmailForIIEXF();
            emailList = jdbcTemplate.queryForList(sql, String.class);

        } catch (Exception e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + "\t" + "Failed to get TO Emails");
        }
        return emailList;
    }

    //getting cc emails for IIEXF to send
    public List<String> getCcEmails() {

        List<String> CcemailList = null;
        try {
            String sql = getQuery.getCcmailForIIEXF();
            CcemailList = jdbcTemplate.queryForList(sql, String.class);

        } catch (Exception e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + "\t" + "Failed to get CC Emails");
        }
        return CcemailList;
    }

    //getting email data for email to send
    public List<EmailRequest> getAllEmailFormData() {
        List<EmailRequest> result = new ArrayList<>();
        try {
            String id = "1";
            Object[] params = new Object[]{id};
            String sql = getQuery.getEmailData();
            List<EmailRequest> rows = jdbcTemplate.query(sql,params, emailFormDataRowMapper());
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

    //html email content for IIEXF
    public String getEmailData(List<PreviousExfData> preExfData, List<UpdatedExfData> updExfData, List<CustomerAccountInfo> accountInfo) {

        StringBuilder htmlPara = new StringBuilder();

        for (CustomerAccountInfo customerAccountInfoData : accountInfo) {

            htmlPara.append("<strong>Customer Name</strong>").append(" :- ").append("<strong>").append(customerAccountInfoData.getCustomerName()).append("</strong>");
            htmlPara.append("<br>");
            htmlPara.append("<br>");
        }


        for (PreviousExfData previousExfData : preExfData) {

            if (previousExfData.getPreExfDate() == null) {

                htmlPara.append("<table style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<thead style=\"border: 1px solid black; border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<tr style=\"border: 1px solid black; padding: 5px;\">");

                htmlPara.append("<th style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<strong>").append("Annc").append("</strong>");
                htmlPara.append("</th>");

                htmlPara.append("<th style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<strong>").append("Indent Sheet No.").append("</strong>");
                htmlPara.append("</th>");

                htmlPara.append("<th style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<strong>").append("SOS Summary").append("</strong>");
                htmlPara.append("</th>");

                htmlPara.append("<th style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<strong>").append("EXF Date").append("</strong>");
                htmlPara.append("</th>");

                htmlPara.append("<th style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<strong>").append("EXF Status").append("</strong>");
                htmlPara.append("</th>");

                htmlPara.append("</tr style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("</thead>");

                htmlPara.append("<tbody style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");

                for (CustomerAccountInfo customerAccountInfoData : accountInfo) {
                    htmlPara.append("<tr  style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");

                    htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                    htmlPara.append("<strong>").append("Latest").append("</strong>");
                    htmlPara.append("</td>");

                    htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                    htmlPara.append("<strong>").append(customerAccountInfoData.getIndent_sheet_num()).append("</strong>").append("</td>").append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">").append("<strong>").append(customerAccountInfoData.getSosSum()).append("</strong>").append("</td>");

                }

                for (UpdatedExfData updatedExfData : updExfData) {

                    htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                    htmlPara.append("<strong>").append(updatedExfData.getUpdExfDate()).append("</strong>").append("</td>");

                    if (updatedExfData.getUpdExfSts() == null) {
                        htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">").append("<strong>").append("Estimated").append("</strong>").append("</td>");
                    } else {
                        htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">").append("<strong>").append(updatedExfData.getUpdExfSts()).append("</strong>").append("</td>");
                    }

                    htmlPara.append("</tr>");
                }

                htmlPara.append("</tbody>");
                htmlPara.append("</table>");

            } else {

                htmlPara.append("<table style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");

                htmlPara.append("<thead style=\"border: 1px solid black; border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<tr style=\"border: 1px solid black; padding: 5px;\">");

                htmlPara.append("<th style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<strong>").append("Annc").append("</strong>");
                htmlPara.append("</th>");

                htmlPara.append("<th style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<strong>").append("Indent Sheet No.").append("</strong>");
                htmlPara.append("</th>");

                htmlPara.append("<th style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<strong>").append("SOS Summary").append("</strong>");
                htmlPara.append("</th>");

                htmlPara.append("<th style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<strong>").append("EXF Date").append("</strong>");
                htmlPara.append("</th>");

                htmlPara.append("<th style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<strong>").append("EXF Status").append("</strong>");
                htmlPara.append("</th>");

                htmlPara.append("</tr style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("</thead>");

                htmlPara.append("<tbody style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");

                for (CustomerAccountInfo customerAccountInfoData : accountInfo) {

                    htmlPara.append("<tr style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");

                    htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                    htmlPara.append("<strong>").append("Prev").append("</strong>");
                    htmlPara.append("</td>");

                    htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                    htmlPara.append("<strong>").append(customerAccountInfoData.getIndent_sheet_num()).append("</strong>").append("</td>").append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">").append("<strong>").append(customerAccountInfoData.getSosSum()).append("</strong>").append("</td>");

                }
                htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                htmlPara.append("<strong>").append(previousExfData.getPreExfDate()).append("</strong>").append("</td>");

                if (previousExfData.getPreExfSts() == null) {
                    htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">").append("<strong>").append("Estimated").append("</strong>").append("</td>");
                } else {
                    htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">").append("<strong>").append(previousExfData.getPreExfSts()).append("</strong>").append("</td>");
                }
                htmlPara.append("</tr>");

                for (CustomerAccountInfo customerAccountInfoData : accountInfo) {
                    htmlPara.append("<tr  style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");

                    htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                    htmlPara.append("<strong>").append("Latest").append("</strong>");
                    htmlPara.append("</td>");

                    htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                    htmlPara.append("<strong>").append(customerAccountInfoData.getIndent_sheet_num()).append("</strong>").append("</td>").append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">").append("<strong>").append(customerAccountInfoData.getSosSum()).append("</strong>").append("</td>");

                }
                for (UpdatedExfData updatedExfData : updExfData) {

                    htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">");
                    htmlPara.append("<strong>").append(updatedExfData.getUpdExfDate()).append("</strong>").append("</td>");

                    if (updatedExfData.getUpdExfSts() == null) {
                        htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">").append("<strong>").append("Estimated").append("</strong>").append("</td>");
                    } else {
                        htmlPara.append("<td style=\"border: 1px solid black;border-collapse: collapse; padding: 5px;\">").append("<strong>").append(updatedExfData.getUpdExfSts()).append("</strong>").append("</td>");
                    }

                    htmlPara.append("</tr>");
                }
                htmlPara.append("</tbody>");
                htmlPara.append("</table>");
            }
        }


        return htmlPara.toString();
    }

    //getting the email id of sales person respective of indent no.
    public String getEmailInfo(List<CustomerAccountInfo> accountInfo) {

        String sql = getQuery.getEmailId();
        String salesEmail = "";

        try {
            for (CustomerAccountInfo info : accountInfo) {
                String sales1 = info.getSales1(); // Assuming sales1 is the user ID
                salesEmail = jdbcTemplate.queryForObject(sql, new Object[]{sales1}, String.class);
            }
        } catch (Exception e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + "\t" + "Failed to get Sales Email ID");
        }
        return salesEmail;
    }

    //setting the parameter values and calling the send email function in it
    public String Emailsender(List<CustomerAccountInfo> accountInfoList, List<PreviousExfData> preExfDataList, List<UpdatedExfData> updExfDataList, String indentNo) throws MessagingException {

        String result = "";
        try {
            List<String> emails = getEmails();
            List<String> CCEmails = getCcEmails();
            String htmlContent = getEmailData(preExfDataList, updExfDataList, accountInfoList);
            String salesEmail = getEmailInfo(accountInfoList);
            List<String> toList = new ArrayList<>(emails);

            String customerName="";
            for (CustomerAccountInfo info : accountInfoList) {
               customerName = info.getCustomerName(); // Assuming sales1 is the user ID
            }
            List<EmailRequest> formDataList = getAllEmailFormData();

            if (!salesEmail.isEmpty()) {
                toList.add(salesEmail);
            }
            if (!toList.isEmpty()) {
                for (EmailRequest emailRequest : formDataList) {
                    result = sendEmail(toList, CCEmails, emailRequest, htmlContent, indentNo);
                }
            }
            if (salesEmail == null || salesEmail.isEmpty()) {
                result = result + "(with empty User Id)";
            }
        } catch (MessagingException e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + logs.getIIEXFemailFail(), e);
        }
        return result;
    }

    //main email sender method
    public String sendEmail(List<String> to, List<String> CCEmails, EmailRequest emailRequest, String htmlContent, String indentNo) throws MessagingException {

        String result;
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");

            String sentences = emailRequest.getBody();

            String formattedSentence = "";
            if (sentences.length() > 59) {
                String lastCharacters = sentences.substring(sentences.length() - 60); // Get the last 60 characters
                String remainingCharacters = sentences.substring(0, sentences.length() - 60); // Get the characters before the last 60 characters

                formattedSentence = remainingCharacters + "<br><br>" + lastCharacters;
            }

            helper.setFrom("ioss@ishidaindia.co.in");
            helper.setTo(to.toArray(new String[0]));
            helper.setCc(CCEmails.toArray(new String[0]));
            helper.setSubject(emailRequest.getSubject() +" | "+ indentNo);

            String emailBody = htmlContent + "<br> " + "<b>" + formattedSentence + "</b>";
            helper.setText(emailBody, true);
            javaMailSender.send(message);

            result = "Success";

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + logs.getIIEXFemailSent());

            return result;
        } catch (MessagingException e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + logs.getIIEXFemailFail());

            result = "Failed";

            return result;
        }
    }
}
