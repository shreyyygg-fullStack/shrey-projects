package controller;


import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model.EmailRequest;
import model.Email_model;
import model.APIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import service.emailService;

@ComponentScan(basePackages = {"model"})
@ComponentScan(basePackages = {"service"})
@RestController
public class emailController {
    @Autowired
    emailService EmailService;

    private static final String ADD_EMAIL = "/add-email";
    private static final String EMAILS = "/api/v1/emails";
    private static final String UPDATE_EMAIL = "/api/v1/update-email";
    private static final String EMAIL_DATA = "api/v1/email-data";
    private static final String DELETE_EMAIL = "/api/v1/delete-email";
    private static final String SAVE_EMAIL_DATA = "/automaticSendMail/save";
    private static final String SAVE_EMAILS = "/automaticSendMail/save_email";
    private static final String SAVE_REGION_EMAILS = "api/v1/save-region-email";
    private static final String ADD_REGION = "/add-region";
    private static final String REGION_EMAILS = "/api/v1/region-emails";
    private static final String GET_EMAIL_FLAG2 = "/getEmailFlag";

    // adding email in database
    @RequestMapping(method = RequestMethod.POST, path = ADD_EMAIL, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody APIResponse addEmail(
            @ModelAttribute("Email_Id") Email_model email_id, HttpServletRequest req,
            HttpServletResponse res) {
        APIResponse apiResponse = EmailService.addEmail(email_id);
        return apiResponse;
    }

    //getting emails from the database
    @RequestMapping(method = RequestMethod.GET, path = EMAILS, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Object> getEmailsList(HttpServletRequest req, HttpServletResponse res) {
        List<Object> emailList = EmailService.getEmailsList();
        return emailList;
    }

    //updating the email in the database
    @RequestMapping(method = RequestMethod.PUT, path = UPDATE_EMAIL, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody APIResponse updateEmail(@RequestBody Map<String, String> request,
                                                 HttpServletRequest req,
                                                 HttpServletResponse res) {
        String email_Id = request.get("emailId");
        String updatedEmail = request.get("updatedEmail");

        APIResponse apiResponse = EmailService.updateEmail(email_Id, updatedEmail);
        return apiResponse;
    }

    //saving the mail data
    @PostMapping(SAVE_EMAIL_DATA)
    public @ResponseBody APIResponse saveEmailFormData(@RequestBody EmailRequest emailRequest) {
        APIResponse apiResponse = EmailService.saveEmailFormData(emailRequest);
        return apiResponse;
    }

    //saving checked emails and cc emails
    @PostMapping(SAVE_EMAILS)
    public @ResponseBody APIResponse saveEmailFormData(@RequestBody Map<String, Object> request) {
        String[] emails = ((List<String>) request.get("emails")).toArray(new String[0]);
        String[] ccmail = ((List<String>) request.get("ccmail")).toArray(new String[0]);
        String id = (String) request.get("id");
        APIResponse apiResponse = EmailService.saveEmail(emails, ccmail, id);

        return apiResponse;
    }

    //getting the email data
    @RequestMapping(method = RequestMethod.GET, path = EMAIL_DATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Object> getEmailData(@RequestParam String id,HttpServletRequest req, HttpServletResponse res) {
        List<Object> emailData = EmailService.getEmailData(id);
        return emailData;
    }

    //to delete email from the email list
    @RequestMapping(method = RequestMethod.DELETE, path = DELETE_EMAIL, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody APIResponse deleteEmail(@RequestParam String email_id_num,
                                                 HttpServletRequest req,
                                                 HttpServletResponse res) {
        APIResponse apiResponse = EmailService.deleteEmail(email_id_num);
        return apiResponse;
    }


    @PostMapping(SAVE_REGION_EMAILS)
    public @ResponseBody APIResponse saveRegionEmails(@RequestBody Map<String, Object> request) {
        String region = (String) request.get("region"); // already string
        String emails = (String) request.get("emails"); // already string
        String email_flag = (String) request.get("email_flag");

        APIResponse apiResponse = EmailService.saveRegionEmails(region, emails, email_flag);

        return apiResponse;
    }

    @RequestMapping(method = RequestMethod.GET, path = REGION_EMAILS, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Object> getRegionEmailsList(HttpServletRequest req, HttpServletResponse res) {
        List<Object> emailList = EmailService.getRegionEmailsList();
        return emailList;
    }

    @RequestMapping(method = RequestMethod.POST, path = ADD_REGION, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody APIResponse addRegion(
            @ModelAttribute("region") String region, HttpServletRequest req,
            HttpServletResponse res) {
        APIResponse apiResponse = EmailService.addRegion(region);
        return apiResponse;
    }

    @RequestMapping(method = RequestMethod.GET, path = GET_EMAIL_FLAG2, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Object> getEmailFlag2(HttpServletRequest req, HttpServletResponse res) {
        List<Object> emailList = EmailService.getEmailFlag2();
        return emailList;
    }




}
