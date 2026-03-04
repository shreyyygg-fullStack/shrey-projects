package service;

import model.EmailRequest;
import model.Email_model;
import model.APIResponse;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
public interface emailService {

    APIResponse addEmail(Email_model modal);
    List<Object> getEmailsList();
    APIResponse updateEmail(String email_id, String updatedEmail);
    List<Object> getEmailData(String id);
    APIResponse deleteEmail(String email_id_num);
    APIResponse saveEmailFormData(EmailRequest emailRequest);
    APIResponse saveEmail(String[] emails, String[] ccmail, String id);
    APIResponse saveRegionEmails(String region, String emails, String email_flag);
    APIResponse addRegion(String region);
    List<Object> getRegionEmailsList();
    List<Object> getEmailFlag2();


}
