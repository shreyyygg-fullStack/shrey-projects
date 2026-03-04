package controller;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import encrypt.AES;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import config.DBGetQuery;
import config.JwtTokenDetail;
import config.Log4j2;
import config.Logs;
import model.EmailDetails;
import model.ApiResultResponse;

@RestController
public class emailSender {

	@Autowired
	private JavaMailSender sender;

	@Autowired
	private JdbcTemplate jdbcTemplate;
	DBGetQuery dbquery = new DBGetQuery();
	Logs logs = new Logs();

	static final Logger log = LogManager.getLogger(emailSender.class);
	String strDateFormat = "yyyy-MM-dd E HH:mm:ss.SSS";
	String formattedDate;

	final String Key = "mysecretkey12345";

	private static final String forgetPasswordMailSendApi = "/forgetPasswordSendMail/{email}";
	String tempPass;
	JwtTokenDetail user = JwtTokenDetail.getInstance();

	public emailSender() {
		super();
	}

	@RequestMapping(method = RequestMethod.POST, path = forgetPasswordMailSendApi, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody ApiResultResponse forgetPasswordMailSend(@ModelAttribute("EmailDetails") EmailDetails email,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		ApiResultResponse apiResponse = new ApiResultResponse();

		if (email.getEMAIL().equals("") || email.getEMAIL().equals("null")) {
			email.setEMAIL(null);
		}

		try {
			sendEmail(email);

			// encrypting the temp password to save in the database
			tempPass = AES.encrypt(tempPass,Key);

			String sql = dbquery.getUpdateTempPassword();
			int affectdRows = jdbcTemplate.update(sql, new Object[] { tempPass, email.getEMAIL() });
			if (affectdRows == 1) {
				apiResponse.setAffectedRows(1);
				apiResponse.setMessage("Email sent, Temp Password Updated successfully.");
				Log4j2.logger.log(Log4j2.LEVEL, "INFO " + "\t" + user.getJwt_userId() + "\t" + user.getJwt_userName()
						+ "\t" + emailSender.class.getName() + "\t" + apiResponse.getMessage());
			}
			return apiResponse;

		} catch (Exception e) {
			e.printStackTrace();
			apiResponse.setAffectedRows(0);
			apiResponse.setMessage("Forget Password Operation Failed.");
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + "\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ emailSender.class.getName() + "\t" + apiResponse.getMessage());
			return apiResponse;
		}
	}

	public void sendEmail(EmailDetails email) throws MailException, MessagingException {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
				StandardCharsets.UTF_8.name());
		tempPass = null;
		tempPass = shortUUID(); 

		String html = "<html><body>" + "<div>\r\n" + "  <div>\r\n" + "    <div>\r\n" + "      <br><br>\r\n"
				+ "    </div>\r\n" + "    Dear Recipient,<br>We have received your request for reset password.\r\n"
				+ "    <br>To reset, please use the below temporary password:<br><br>\r\n"
				+ "    <b>Temporary Password:<strong> " + tempPass + "</strong></b><br><br><br>\r\n"
				+ "    Regards,<br>\r\n" + "    <b>Ishida India Support Team</b>\r\n"
				+ "    <br><br>Note: This is a system generated e-mail, please do not reply to it.<br>\r\n"
				+ "</div></body></html>";

		try {
			helper.setFrom("ioss@ishidaindia.co.in");
			helper.setTo(email.getEMAIL());
			helper.setSubject("iOTS - Password Reset Email");
			helper.setText(html, true);
			sender.send(message);
			Log4j2.logger.log(Log4j2.LEVEL, "INFO " + "\t" + user.getJwt_userId() + "\t" + user.getJwt_userName()
			+ "\t" + emailSender.class.getName() + "\t" + logs.getSentMailLog());
		} catch (javax.mail.MessagingException e) {
			e.printStackTrace();
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ emailSender.class.getName()+"\t"+e);
		}

	}

	public String randomPassword() {

		String ALPHA_NUMERIC_STRING = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&?{}*";
		StringBuilder builder = new StringBuilder();

		int count = 8;

		while (count-- != 0) {
			int character = (int) (Math.random() * ALPHA_NUMERIC_STRING.length());
			builder.append(ALPHA_NUMERIC_STRING.charAt(character));
		}
		return builder.toString();

	}

	public static String shortUUID() {
		UUID uuid = UUID.randomUUID();
		long l = ByteBuffer.wrap(uuid.toString().getBytes()).getLong();
		return Long.toString(l, Character.MAX_RADIX);
	}
}
