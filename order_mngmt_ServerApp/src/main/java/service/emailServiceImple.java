package service;

import config.*;
import model.EmailRequest;
import model.Email_model;
import model.APIResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class emailServiceImple implements emailService {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    private final Logger logger = LoggerFactory.getLogger(emailServiceImple.class);

    JwtTokenDetail user = JwtTokenDetail.getInstance();
    DBGetQuery getQuery = new DBGetQuery();

    DbIndentUpdateQuery updateQuery = new DbIndentUpdateQuery();
    Logs logs = new Logs();


    @Override
    public APIResponse addEmail(Email_model email_id) {

        APIResponse apiResponse = new APIResponse();

        if (email_id.getEmail_id().equals("") || email_id.getEmail_id().equals("null")) {
            apiResponse.setAffectedRows(0);
            apiResponse.setMessage("Failed to add e-mail in database: Null e-mail has been passed.");

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + apiResponse.getMessage());
            return apiResponse;
        }
        try {
            String email = email_id.getEmail_id();
            String sql = updateQuery.getAddEmail();
            int affectedRows = jdbcTemplate.update(sql, email);

            if (affectedRows == 1) {
                apiResponse.setAffectedRows(1);
                apiResponse.setMessage(
                        " E-mail '" + email + "' has been added successfully.");
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getAddEmail());
            } else {
                apiResponse.setAffectedRows(0);
                apiResponse.setMessage(
                        "Failed to add e-mail");

                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getFailaddEmail());
            }
        } catch (Exception e) {
            apiResponse.setAffectedRows(0);
            apiResponse.setMessage("Failed to add email.");

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getFailaddEmail());

            return apiResponse;
        }
        return apiResponse;
    }

    @Override
    public List<Object> getEmailsList() {
        String sql = getQuery.getEmailList();

        List<Object> emailList = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            emailList = new ArrayList<>(rows);

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getEmailList());
        } catch (Exception exc) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getFailEmailList());
        }
        return emailList;
    }

    @Override
    public APIResponse updateEmail(String email_id, String updatedEmail) {
        APIResponse apiResponse = new APIResponse();
        try {
            String sql = updateQuery.getUpdateEmail();
            int affectedRows = jdbcTemplate.update(sql, updatedEmail, email_id);

            if (affectedRows == 1) {
                apiResponse.setAffectedRows(1);
                apiResponse.setMessage(
                        "Email '" + updatedEmail + "' has been updated successfully.");
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getUpdateEmail());
            } else {
                apiResponse.setAffectedRows(0);
                apiResponse.setMessage(
                        "Failed to update email");
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getFailUpdateEmail());
            }
        } catch (Exception e) {
            apiResponse.setAffectedRows(0);
            apiResponse.setMessage("Failed to update email.");
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getFailUpdateEmail());

            return apiResponse;
        }
        return apiResponse;
    }

    @Override
    public List<Object> getEmailData(String id) {
        String sql = getQuery.getEmailData();

        List<Object> emailData = new ArrayList<>();
        try {
            Object[] params = new Object[]{id};
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
            emailData = new ArrayList<>(rows);

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getEmailData());
        } catch (Exception exc) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getFailEmailData());
        }
        return emailData;
    }

    @Override
    public APIResponse deleteEmail(String email_id_num) {
        APIResponse apiResponse = new APIResponse();

        String query = updateQuery.getDeleteEmail();
        try {
            Object[] params = new Object[]{email_id_num};
            int affectedRows = jdbcTemplate.update(query, params);
            if (affectedRows > 0) {
                apiResponse.setMessage("Email Deleted Successfully.");
                apiResponse.setAffectedRows(affectedRows);
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getDeleteEmail());
            } else {
                apiResponse.setMessage("Failed to delete email.");
                apiResponse.setAffectedRows(0);
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getFailDeleteEmail());
            }
        } catch (Exception exception) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + logs.getFailDeleteEmail());

            apiResponse.setMessage("Failed to delete email.");
            apiResponse.setAffectedRows(0);
        }
        return apiResponse;
    }

    //saving email form data
    public APIResponse saveEmailFormData(EmailRequest emailRequest) {
        APIResponse apiResponse = new APIResponse();

        try {
            String sql = updateQuery.getSaveEmailForm();
            int affectedRows = jdbcTemplate.update(sql, emailRequest.getSubject(), emailRequest.getBody(), emailRequest.getEmail_flag(), emailRequest.getId());

            if (affectedRows == 1) {
                apiResponse.setAffectedRows(1);
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + logs.getSaveEmailData());
            }
        } catch (Exception e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + logs.getFailSaveEmailData());
        }
        return apiResponse;
    }

    // saving/checking the email in the email list for cc and  setting 1(IIEXF)
    public APIResponse saveEmail(String[] emails, String[] ccmail, String id) {
        APIResponse apiResponse = new APIResponse();

        try {
            int affectedRows1 = 0;
            int affectedRows2 = 0;
            int affectedRows3 = 0;
            int affectedRows4 = 0;

            if (Objects.equals(id, "1")) {

                String sql3 = updateQuery.getSetDefaultCC();
                affectedRows1 = jdbcTemplate.update(sql3);

                String sql4 = updateQuery.getSetCC();
                for (String email : ccmail) {
                    affectedRows2 = jdbcTemplate.update(sql4, email);
                }

                String sql2 = updateQuery.getSetDefaultEmailforIIEXF();
                affectedRows3 = jdbcTemplate.update(sql2);

                String sql1 = updateQuery.getSetIIEXFemail();
                for (String email : emails) {
                    affectedRows4 = jdbcTemplate.update(sql1, email);
                }
                if (affectedRows1 > 0 || affectedRows2 > 0 || affectedRows3 > 0 || affectedRows4 > 0) {
                    apiResponse.setAffectedRows(1);
                    Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + logs.getSaveEmail());
                }

            } else if (Objects.equals(id, "2")) {

                String sql3 = updateQuery.getSetDefaultCC2();
                affectedRows1 = jdbcTemplate.update(sql3);

                String sql4 = updateQuery.getSetCC2();
                for (String email : ccmail) {
                    affectedRows2 = jdbcTemplate.update(sql4, email);
                }

                String sql2 = updateQuery.getSetDefaultEmail2();
                affectedRows3 = jdbcTemplate.update(sql2);

                String sql1 = updateQuery.getSeEmail2();
                for (String email : emails) {
                    affectedRows4 = jdbcTemplate.update(sql1, email);
                }
                if (affectedRows1 > 0 || affectedRows2 > 0 || affectedRows3 > 0 || affectedRows4 > 0) {
                    apiResponse.setAffectedRows(1);
                    Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + logs.getSaveEmail());
                }

            }

        } catch (Exception e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + EXFemailSender.class.getName() + logs.getFailSaveEmail());
        }
        return apiResponse;
    }


    public APIResponse saveRegionEmails(String region, String emails, String email_flag) {
        APIResponse apiResponse = new APIResponse();

        try {
            int flag;
            if ("true".equals(email_flag)) {
                flag = 1;
            } else {
                flag = 0;
            }
            String sql = getQuery.getSetEmailFlag2();
            int affectedRows1 = jdbcTemplate.update(sql, flag);

            String sql1 = getQuery.getSaveRegionEmails();
            int affectedRows = jdbcTemplate.update(sql1, emails, region);

            if (affectedRows == 1 && affectedRows1 == 1) {
                apiResponse.setAffectedRows(1);
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + " Region Emails Saved Successfully.");
            }
        } catch (Exception e) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + " Failed to save Region Emails.");
        }
        return apiResponse;
    }

    @Override
    public APIResponse addRegion(String region) {

        APIResponse apiResponse = new APIResponse();

        try {
            String sql = getQuery.getAddRegion();
            int affectedRows = jdbcTemplate.update(sql, region);

            if (affectedRows == 1) {
                apiResponse.setAffectedRows(1);
                apiResponse.setMessage(
                        " Region '" + region + "' has been added successfully.");
                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + apiResponse.getMessage());
            } else {
                apiResponse.setAffectedRows(0);
                apiResponse.setMessage(
                        " Failed to add region");

                Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + apiResponse.getMessage());
            }
        } catch (Exception e) {
            apiResponse.setAffectedRows(0);
            apiResponse.setMessage(" Failed to add email.");

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + apiResponse.getMessage());

            return apiResponse;
        }
        return apiResponse;
    }


    @Override
    public List<Object> getRegionEmailsList() {
        String sql = getQuery.getRegionEmailList();

        List<Object> emailList = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            emailList = new ArrayList<>(rows);

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + " Get Region Emails");
        } catch (Exception exc) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + " Failed to Get Region Emails");
        }
        return emailList;
    }

    @Override
    public List<Object> getEmailFlag2() {
        String sql = getQuery.getGetEmailFlags2();

        List<Object> emailList = new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            emailList = new ArrayList<>(rows);

            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + " Get Email Flag Setting 2");
        } catch (Exception exc) {
            Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t" + emailServiceImple.class.getName() + " Failed to Get Email Flag Setting 2");
        }
        return emailList;
    }


}
