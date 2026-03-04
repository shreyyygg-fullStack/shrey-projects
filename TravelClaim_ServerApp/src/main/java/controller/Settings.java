package controller;

import configuration.DbQuery;
import encrypt.AES;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import model.Allowance;
import model.OrganizationProfile;
import model.UpdateResponse;
import model.UserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import service.GetColumnsService;
import service.SettingsService;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

//@ComponentScan(basePackages = { "service" })
@RestController
@RequestMapping("/setting")
public class Settings {

    DbQuery dbQuery = new DbQuery();
    @Autowired
    private JavaMailSender sender;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SettingsService settingService;

    private static final long EXPIRATION_TIME = 10 * 60 * 1000; // 15 minutes
    final String Key = "mysecretkey12345";

    @RequestMapping(method = RequestMethod.POST, path = "/save-orgInfo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody UpdateResponse updateOrgInfo(@ModelAttribute OrganizationProfile orgInfo, @RequestParam(value = "image", required = false) MultipartFile image, HttpServletRequest req,
                                                      HttpServletResponse res) {

        UpdateResponse updateresp = new UpdateResponse();
        int affectdRows;

        try {
            if (image == null) {
                String sql1 = dbQuery.getSaveOrgInfo();
                affectdRows = jdbcTemplate.update(sql1,
                        new Object[]{orgInfo.getCompanyName(), orgInfo.getCompanyAddress(), orgInfo.getPhoneNo(), orgInfo.getCity(), orgInfo.getState(), orgInfo.getZipCode(), orgInfo.getCountry(), orgInfo.getCompanyWebsiteName(), orgInfo.getApplicationDomain(), orgInfo.getPrimaryContactEmail(), orgInfo.getCompanySupportEmail(), orgInfo.getBaseCurrency(), orgInfo.getFiscalYear(), orgInfo.getDateFormat()});

            } else {
                byte[] Filebytes = image.getBytes();
                Base64.Encoder encoder = Base64.getEncoder();
                String encodedData = encoder.encodeToString(Filebytes);

                String sql2 = dbQuery.getSaveOrgInfo2();

                affectdRows = jdbcTemplate.update(sql2,
                        new Object[]{encodedData, orgInfo.getCompanyName(), orgInfo.getCompanyAddress(), orgInfo.getPhoneNo(), orgInfo.getCity(), orgInfo.getState(), orgInfo.getZipCode(), orgInfo.getCountry(), orgInfo.getCompanyWebsiteName(), orgInfo.getApplicationDomain(), orgInfo.getPrimaryContactEmail(), orgInfo.getCompanySupportEmail(), orgInfo.getBaseCurrency(), orgInfo.getFiscalYear(), orgInfo.getDateFormat()});

            }
            if (affectdRows == 1) {
                updateresp.setAffectedRows(1);
                System.out.println("Successfully submitted organization info");
            }
        } catch (Exception e) {
            System.out.println("Failed to submit the rganization info" + e);
            return updateresp;
        }
        return updateresp;
    }


    @RequestMapping(method = RequestMethod.GET, path = "/get-orgInfo", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody String getOrgInfo(HttpServletRequest req, HttpServletResponse res) {

        List<Object> filesList = new ArrayList<>();
        String sql = dbQuery.getGetOrgInfo();
        String encryptedData = null;

        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            filesList = new ArrayList<>(rows);

            // Encrypt the data
            encryptedData = AES.encryptData(filesList);

        } catch (Exception exc) {

        }
        return encryptedData;
    }


    @RequestMapping(method = RequestMethod.GET, path = "/get-userList", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody String getUsersList(HttpServletRequest req, HttpServletResponse res) {
        List<Object> usersList = new ArrayList<>();
        String sql = dbQuery.getGetUsersList();
        String encryptedData = null;
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            usersList = new ArrayList<>(rows);

            // Encrypt the data
            encryptedData = AES.encryptData(usersList);

        } catch (Exception exc) {

        }
        return encryptedData;
    }

    @RequestMapping(method = RequestMethod.POST, path = "/add-user", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody UpdateResponse addUser(UserDetails userDetails, HttpServletRequest req,
                                                HttpServletResponse res) {

        UpdateResponse updateresp = new UpdateResponse();
        int affectdRows;

        if((userDetails.getMiddleName().equals("undefined")) || userDetails.getMiddleName() == null){
            userDetails.setMiddleName(" ");
        }

        if(userDetails.getLastName().equals("undefined") || userDetails.getLastName() == null){
            userDetails.setLastName(" ");
        }

        try {
            Object[] params = new Object[]{userDetails.getEmpId()};
            String sql1 = dbQuery.getGetUser();
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql1, params);

            if (rows.isEmpty()) {
                String sql = dbQuery.getAddUser();
                affectdRows = jdbcTemplate.update(sql,
                        new Object[]{userDetails.getEmpId(), userDetails.getFirstName(), userDetails.getMiddleName(), userDetails.getLastName(), userDetails.getEmailAddress(), userDetails.getMobileNo(), userDetails.getEmpDesignation(), userDetails.getEmpDepartment(), userDetails.getReportingTo(), userDetails.getEmpLocation(), userDetails.getEmpDojDate(), userDetails.getEmpStatus()});

                if (affectdRows == 1) {
                    updateresp.setAffectedRows(1);
                    System.out.println("Successfully User Added");
                }
            } else {
                updateresp.setMessage("Duplicate ID");
                System.out.println("A User with same Id is already present.");
            }

        } catch (Exception e) {
            System.out.println("Failed to add user" + e);
            return updateresp;
        }
        return updateresp;
    }


    @RequestMapping("/get-userDetail/{empId}")
    public @ResponseBody String getUserDetail(@PathVariable String empId, HttpServletRequest req, HttpServletResponse res) {

        List<Object> empDetail = new ArrayList<>();
        String sql = dbQuery.getGetUser();
        Object[] params = new Object[]{empId};
        String encryptedData = null;
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
            empDetail = new ArrayList<>(rows);

            // Encrypt the data
            encryptedData = AES.encryptData(empDetail);
        } catch (Exception e) {

        }
        return encryptedData;
    }

    @RequestMapping(method = RequestMethod.POST, path = "/edit-user", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody UpdateResponse editUser(UserDetails userDetails, HttpServletRequest req,
                                                 HttpServletResponse res) {

        UpdateResponse updateresp = new UpdateResponse();
        int affectdRows;
        if((userDetails.getMiddleName().equals("undefined")) || userDetails.getMiddleName() == null){
            userDetails.setMiddleName(" ");
        }

        if(userDetails.getLastName().equals("undefined") || userDetails.getLastName() == null){
            userDetails.setLastName(" ");
        }


        try {
            String sql = dbQuery.getEditUser();
            affectdRows = jdbcTemplate.update(sql,
                    new Object[]{userDetails.getFirstName(), userDetails.getMiddleName(), userDetails.getLastName(), userDetails.getEmailAddress(), userDetails.getMobileNo(), userDetails.getEmpDesignation(), userDetails.getEmpDepartment(), userDetails.getReportingTo(), userDetails.getEmpLocation(), userDetails.getEmpDojDate(), userDetails.getEmpStatus(), userDetails.getEmpId(),});

            if (affectdRows == 1) {
                updateresp.setAffectedRows(1);
                System.out.println("Successfully User Details Updated");
            }
        } catch (Exception e) {
            System.out.println("Failed to Update user details" + e);
            return updateresp;
        }
        return updateresp;
    }

    @RequestMapping("/delete-user/{empId}")
    public @ResponseBody UpdateResponse deleteUser(@PathVariable String empId, HttpServletRequest req, HttpServletResponse res) {

        UpdateResponse updateresp = new UpdateResponse();
        int affectdRows;
        String sql = dbQuery.getDeleteUser();
        Object[] params = new Object[]{empId};

        try {
            affectdRows = jdbcTemplate.update(sql, params);

            if (affectdRows == 1) {
                updateresp.setAffectedRows(1);
                System.out.println("Successfully User Deleted");
            }
        } catch (Exception e) {
            updateresp.setAffectedRows(0);
            System.out.println("Failed to Delete User");
            return updateresp;
        }
        return updateresp;
    }

    @RequestMapping(method = RequestMethod.GET, path = "/get-setting-data", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody String getSettingData(@RequestParam Integer id, HttpServletRequest req, HttpServletResponse res){

        return settingService.getSettingData(id);

    }

    @RequestMapping(method = RequestMethod.GET, path = "/get-active-setting-data", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody String getActiveSettingData(@RequestParam Integer id, HttpServletRequest req, HttpServletResponse res){

        return settingService.getActiveSettingData(id);

    }

    @RequestMapping(method = RequestMethod.POST, path = "/insert-global-setting-data", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody UpdateResponse insertGlobalSettingData(@RequestParam Integer id, @RequestParam String name,HttpServletRequest req, HttpServletResponse res){
        return settingService.insertGlobalSettingData(id,name);
    }

//
//    @RequestMapping(method = RequestMethod.GET, path = "/get-departmentList", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody String getAllDepartmentList(HttpServletRequest req, HttpServletResponse res){
//
//        return settingService.getAllDepartmentList();
//
//    }
//    @RequestMapping(method = RequestMethod.GET, path = "/get-active-departmentList", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody String getAllActiveDepartmentList(HttpServletRequest req, HttpServletResponse res){
//
//        return settingService.getAllActiveDepartmentList();
//
//    }
//
//
//    @RequestMapping(method = RequestMethod.GET, path = "/get-designationList", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody String getAllDesignation(HttpServletRequest req, HttpServletResponse res){
//
//        return settingService.getAllDesignation();
//
//    }
//
//    @RequestMapping(method = RequestMethod.GET, path = "/get-allGrade", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody String getAllGrade(HttpServletRequest req, HttpServletResponse res){
//        return settingService.getAllGrade();
//
//    }
//
//    @RequestMapping(method = RequestMethod.GET, path = "/get-ishida-role-list", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody String getAllIRoleList(HttpServletRequest req, HttpServletResponse res){
//        return settingService.getAllIRoleList();
//    }
//
//
//    @RequestMapping(method = RequestMethod.GET, path = "/get-employment-status", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody String getEmploymentSts(HttpServletRequest req, HttpServletResponse res){
//        return settingService.getEmploymentSts();
//
//    }
//
//    @RequestMapping(method = RequestMethod.GET, path = "/get-ishida-location", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody String getIshidaLocation(HttpServletRequest req, HttpServletResponse res){
//        return settingService.getIshidaLocation();
//
//    }


//    @RequestMapping(method = RequestMethod.POST, path = "/insert-department", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody UpdateResponse insertGlobalDepartment( @RequestParam String newDept,HttpServletRequest req, HttpServletResponse res){
//        return settingService.insertGlobalDepartment(newDept);
//    }
//    @RequestMapping(method = RequestMethod.POST, path = "/insert-designation", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody UpdateResponse insertGlobalDesignation( @RequestParam String newDesg,HttpServletRequest req, HttpServletResponse res){
//        return settingService.insertGlobalDesignation(newDesg);
//
//    }
//
//    @RequestMapping(method = RequestMethod.POST, path = "/insert-grade", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody UpdateResponse insertGlobalNewGrade( @RequestParam String newGrade,HttpServletRequest req, HttpServletResponse res){
//        return settingService.insertGlobalNewGrade(newGrade);
//    }
//
//    @RequestMapping(method = RequestMethod.POST, path = "/insert-role", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody UpdateResponse insertGlobalNewRole( @RequestParam String newRole,HttpServletRequest req, HttpServletResponse res){
//        return settingService.insertGlobalNewRole(newRole);
//    }
//
//    @RequestMapping(method = RequestMethod.POST, path = "/insert-location", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody UpdateResponse insertGlobalNewLocation( @RequestParam String newLocation,HttpServletRequest req, HttpServletResponse res){
//        return settingService.insertGlobalNewLocation(newLocation);
//    }
//
//    @RequestMapping(method = RequestMethod.POST, path = "/insert-empt-sts", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody UpdateResponse insertGlobalNewEmptSts( @RequestParam String newEmptSts,HttpServletRequest req, HttpServletResponse res){
//        return settingService.insertGlobalNewEmptSts(newEmptSts);
//
//
//    }

    @RequestMapping(method = RequestMethod.PUT, path = "/update-global-setting-data", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody UpdateResponse updateGlobalSettingData(
            @RequestParam Integer settingId, @RequestParam Integer tableId, @RequestParam String name,
            @RequestParam String isActive, HttpServletRequest req, HttpServletResponse res){
        return settingService.updateGlobalSettingData(settingId,tableId,name, isActive);
    }

//    @RequestMapping(method = RequestMethod.PUT, path = "/update-department", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody UpdateResponse updateGlobalDepartment(@RequestParam Integer id, @RequestParam String Dept, @RequestParam String isActive, HttpServletRequest req, HttpServletResponse res){
//        return settingService.updateGlobalDepartment(id,Dept, isActive);
//    }

    @RequestMapping(method = RequestMethod.PUT, path = "/update-designation", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody UpdateResponse updateGlobalDesignation(@RequestParam Integer id, @RequestParam String Desg, @RequestParam String isActive, HttpServletRequest req, HttpServletResponse res){
        return settingService.updateGlobalDesignation(id,Desg, isActive);
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/update-location", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody UpdateResponse updateGlobalIshidaLocation(@RequestParam Integer id, @RequestParam String location, @RequestParam String isActive, HttpServletRequest req, HttpServletResponse res){
        return settingService.updateGlobalIshidaLocation(id,location, isActive);
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/update-grade", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody UpdateResponse updateGlobalGrade(@RequestParam Integer sn, @RequestParam String grade, @RequestParam String isActive, HttpServletRequest req, HttpServletResponse res){
        return settingService.updateGlobalGrade(sn,grade, isActive);
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/update-role", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody UpdateResponse updateGlobalRole(@RequestParam Integer id, @RequestParam String role, @RequestParam String isActive, HttpServletRequest req, HttpServletResponse res){
        return settingService.updateGlobalRole(id,role, isActive);
    }



    @RequestMapping(method = RequestMethod.PUT, path = "/update-employment-status", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody UpdateResponse updateGlobalemploymentSts(@RequestParam Integer id, @RequestParam String empt, @RequestParam String isActive, HttpServletRequest req, HttpServletResponse res){
        return settingService.updateGlobalemploymentSts(id,empt, isActive);
    }





//    @RequestMapping(method = RequestMethod.GET, path = "/get-departmentList", produces = MediaType.APPLICATION_JSON_VALUE)
//    public @ResponseBody String getDepartmentList(HttpServletRequest req, HttpServletResponse res) {
//
//        List<Object> departmentList = new ArrayList<>();
//        String sql = dbQuery.getGetDepartmentList();
//        String encryptedData = null;
//
//        try {
//            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
//            departmentList = new ArrayList<>(rows);
//            // Encrypt the data
//            encryptedData = AES.encryptData(departmentList);
//
//        } catch (Exception exc) {
//
//        }
//        return encryptedData;
//    }




    @RequestMapping(method = RequestMethod.GET, path = "/get-gradesList", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody String getGradesList(HttpServletRequest req, HttpServletResponse res) {
        List<Object> gradeList = new ArrayList<>();
        String sql = dbQuery.getGetGradesList();
        String encryptedData = null;

        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            gradeList = new ArrayList<>(rows);

            // Encrypt the data
            encryptedData = AES.encryptData(gradeList);

        } catch (Exception exc) {

        }
        return encryptedData;
    }


    @RequestMapping(method = RequestMethod.POST, path = "/save-allowance", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody UpdateResponse saveAllowance(@RequestBody List<Allowance> allowances, HttpServletRequest req, HttpServletResponse res) {

        UpdateResponse updateresp = new UpdateResponse();

//        System.out.println(allowance.getClassAPlus());

        try {
            String sql1 = dbQuery.getSaveAllowanceData();

            int affectedRows = 0;
            for (Allowance allowance : allowances) {
                if (allowance.getSelectedGrade() == null || allowance.getSelectedGrade().trim().isEmpty()) {
                    System.out.println("Skipping record due to empty GRADE: " + allowance);
                    continue;
                }

                affectedRows += jdbcTemplate.update(sql1,
                        allowance.getSelectedGrade(),
                        allowance.getClassAPlus(),
                        allowance.getClassA(),
                        allowance.getClassB(),
                        allowance.getDomesticDa(),
                        allowance.getDomesticFa(),
                        allowance.getOverseasDa(),
                        allowance.getOverseasFa());
            }

            if (affectedRows > 0) {
                updateresp.setAffectedRows(1);
                System.out.println("Successfully Allowance Policy Saved");
            }
        } catch (Exception e) {
            System.out.println("Failed to save the Allowance Policy " + e);
            return updateresp;
        }
        return updateresp;
    }

    @RequestMapping(method = RequestMethod.GET, path = "/get-allowanceData", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody String getAllowanceData(HttpServletRequest req, HttpServletResponse res) {
        List<Object> allowanceData = new ArrayList<>();
        String sql = dbQuery.getGetAllowanceData();
        String encryptedData = null;

        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            allowanceData = new ArrayList<>(rows);
            // Encrypt the data
            encryptedData = AES.encryptData(allowanceData);

        } catch (Exception exc) {

        }
        return encryptedData;
    }

    @RequestMapping("/delete-gradeRow/{grade}")
    public @ResponseBody UpdateResponse deleteGradeRow(@PathVariable String grade, HttpServletRequest req, HttpServletResponse res) {

        UpdateResponse updateresp = new UpdateResponse();
        int affectdRows;
        String sql = dbQuery.getDeleteAllowanceRow();
        Object[] params = new Object[]{grade};

        try {
            affectdRows = jdbcTemplate.update(sql, params);
            if (affectdRows == 1) {
                updateresp.setAffectedRows(1);
                System.out.println("Successfully Grade Row Deleted");
            }
        } catch (Exception e) {
            updateresp.setAffectedRows(0);
            System.out.println("Failed to Delete Grade Row");
            return updateresp;
        }
        return updateresp;
    }


    @RequestMapping(method = RequestMethod.GET, path = "/search_class_aplus_location/{query}")
    public @ResponseBody List<Map<String, Object>> searchClassAPlusLocation(@PathVariable String query, HttpServletRequest req, HttpServletResponse res) {

        List<Map<String, Object>> results = null;
        try {
            if (query != null || query != "") {
                String sql = "SELECT * FROM iexpense.ilocations WHERE LOCATION LIKE ? AND TYPE_STS = 1 LIMIT 10"; // Fetch limited records
                results = jdbcTemplate.queryForList(sql, "%" + query + "%");
            } else {
                System.out.println("Query is empty");
            }
            return results;
        } catch (Exception e) {
            System.out.println("error" + e);
            return results;
        }
    }

    @RequestMapping(method = RequestMethod.GET, path = "/search_class_a_location/{query}")
    public @ResponseBody List<Map<String, Object>> searchClassALocation(@PathVariable String query, HttpServletRequest req, HttpServletResponse res) {

        List<Map<String, Object>> results = null;
        try {
            if (query != null || query != "") {
                String sql = "SELECT * FROM iexpense.ilocations WHERE LOCATION LIKE ? AND TYPE_STS = 2 LIMIT 10"; // Fetch limited records
                results = jdbcTemplate.queryForList(sql, "%" + query + "%");
            } else {
                System.out.println("Query is empty");
            }

            return results;
        } catch (Exception e) {
            System.out.println("error" + e);
            return results;
        }
    }

    @RequestMapping(method = RequestMethod.GET, path = "/search_locations/{query}")
    public @ResponseBody List<Map<String, Object>> searchLocations(@PathVariable String query, HttpServletRequest req, HttpServletResponse res) {

        List<Map<String, Object>> results = null;
        try {
            if (query != null || query != "") {
                String sql = "SELECT * FROM iexpense.ilocations WHERE LOCATION LIKE ? LIMIT 20"; // Fetch limited records
                results = jdbcTemplate.queryForList(sql, "%" + query + "%");
            } else {
                System.out.println("Query is empty");
            }
            return results;
        } catch (Exception e) {
            System.out.println("error" + e);
            return results;
        }
    }

    @RequestMapping(method = RequestMethod.POST, path = "/send-invite")
    public @ResponseBody UpdateResponse sendSignUpMail(@RequestBody Map<String, String> UserDetails) {

        UpdateResponse updateresp = new UpdateResponse();

        String userID = UserDetails.get("userID");
        String userEmail = UserDetails.get("userEmail");

        try {
//            sendEmail(userID, userEmail);
            userID = AES.encrypt(userID, Key);
            sendInvitationLink(userEmail, userID);

            updateresp.setMessage("Invite Sent Successfully");
            System.out.println("Invite Sent Successfully");

            return updateresp;
        } catch (Exception e) {

            updateresp.setMessage("Failed to send the Invite");
            System.out.println("Failed to send the Invite");
            return updateresp;
        }

    }


    public void sendInvitationLink(String email, String userID) throws MessagingException {
        String token = UUID.randomUUID().toString();
        Timestamp expiryTime = Timestamp.from(Instant.now().plusMillis(EXPIRATION_TIME));

        String sql = dbQuery.getInsertToken();
        // Save token in database
        jdbcTemplate.update(sql, email, token, expiryTime, "INVITATION");

        String link = "http://localhost:4200/login?token=" + token + "&empId=" + userID;

        String text = "<p>Click the link below to set your passowrd on IExpense Application :</p>" +
                "<p><a href='" + link + "'>Sign Up</a></p>";

        sendEmail(email, "IExpense - Invitation ", text);
    }

    private void sendEmail(String to, String subject, String text) throws MessagingException {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name());

        helper.setFrom("ioss@ishidaindia.co.in");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, true);
        sender.send(message);
    }

//    public void sendEmail(String userId, String userEmail) throws MailException, MessagingException {
//        MimeMessage message = sender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
//                StandardCharsets.UTF_8.name());
//
//        String frontendUrl = "http://localhost:4200";
//        String userDetailsLink = frontendUrl + "/login/" + userId;
//
//        String subject = "Invitation for IExpense";
//        String text = "<p>Click the link below to set your passowrd on IExpense Application for :</p>" + userId +
//                "<p><a href='" + userDetailsLink + "'>View Details</a></p>";
//
//
//        try {
//            helper.setFrom("ioss@ishidaindia.co.in");
//            helper.setTo(userEmail);
//            helper.setSubject(subject);
//            helper.setText(text, true);
//
//            sender.send(message);
//
//        } catch (MessagingException e) {
//            e.printStackTrace();
//
//        }
//
//    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestParam String token) {

        String sql = dbQuery.getGetToken();
        Optional<Map<String, Object>> result = jdbcTemplate.queryForList(sql, token)
                .stream().findFirst();

        Map<String, String> response = new HashMap<>();

        if (result.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid or expired link.");
        }

        Timestamp expiryTime = (Timestamp) result.get().get("expiry_time");
        if (expiryTime.before(new Timestamp(System.currentTimeMillis()))) {
            return ResponseEntity.badRequest().body("Link has expired.");
        }
        response.put("status", "valid");
        return ResponseEntity.ok(response);
    }


}
