package model;

import com.sun.org.apache.xpath.internal.operations.Bool;

public class EmailRequest {

    private String subject;
    private String body;
    private Boolean email_flag;
    private String id;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public Boolean getEmail_flag() {
        return email_flag;
    }

    public void setEmail_flag(Boolean email_flag) {
        this.email_flag = email_flag;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }


}
