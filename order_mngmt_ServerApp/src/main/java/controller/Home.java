package controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import config.JwtTokenDetail;
import config.Log4j2;
import config.Logs;
import service.IndentService;

@RestController
public class Home {
	JwtTokenDetail user = JwtTokenDetail.getInstance();
	Logs logs = new Logs();

	@Autowired
	IndentService indService;

	String strDateFormat = "yyyy-MM-dd E HH:mm:ss.SSS";
	String formattedDate;

	static final Logger log = LogManager.getLogger(Home.class);
	private static final String GET_NEXTACTIONTODAY = "/filter_NextAction_Today";
	private static final String GET_ALLREVISEDNEXTDATE_WITHINDENT = "/getAllRevisedNextDate/{id}";   //never used as an api call from front end. 
	private static final String GET_INDENTDETAIL_WITHNUMBER = "/indentDetail/{id}";                 

	@RequestMapping(value = GET_NEXTACTIONTODAY, method = RequestMethod.GET, produces = "application/json")
	public List<Object> filter_NextAction_Today() {
		List<Object> NextActionData = indService.filter_NextAction_Today();
		getCurrentTimeUsingDate();

		if (NextActionData.isEmpty()) {

			Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ Home.class.getName() + logs.getEmptyNextActionLog());
		} else {
			Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ Home.class.getName() + logs.getNonEmptyNextActionLog());
		}
		return NextActionData;
	}

	@RequestMapping(value = GET_ALLREVISEDNEXTDATE_WITHINDENT, method = RequestMethod.GET, produces = "application/json")
	public List<Object> getAllRevisedNextDate(@PathVariable String id) {
		List<Object> AllRevisedNextDate = indService.getAllRevisedNextDate(id);
	
		getCurrentTimeUsingDate();

		if (AllRevisedNextDate.isEmpty()) {
			Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ Home.class.getName() + logs.getEmptyAllRevisedNextDate());
		} else {
			Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ Home.class.getName() + logs.getNonEmptyAllRevisedNextData());
		}
		return AllRevisedNextDate;
	}

	@RequestMapping(value = GET_INDENTDETAIL_WITHNUMBER, method = RequestMethod.GET, produces = "application/json")
	public List<Object> indentDetail(@PathVariable String id) {
		List<Object> indentDetail = indService.indentDetail(id);
		getCurrentTimeUsingDate();

		if (indentDetail.isEmpty()) {
			Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ Home.class.getName() + logs.getEmptyIndentDetailLog());
		} else {
			Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ Home.class.getName() + logs.getNonEmptyIndentDetailLog());
		}
		return indentDetail;
	}

	private void getCurrentTimeUsingDate() {
		Date date = new Date();
		DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
		formattedDate = dateFormat.format(date);
	}

}
