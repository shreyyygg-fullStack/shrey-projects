package controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.order.iotServerApp.iotServerApplication;

import config.DBFileManagementQuery;
import config.DBGetQuery;
import config.JwtTokenDetail;
import model.FileDownloadRequest;
import service.FileDownloadService;
import config.Log4j2;
import config.Logs;

@RestController
public class FileDownload {

	private final String OPEN_TYPE_WHERE_APPEND_STRING = "  where ( master.pmt_sts <> 'P-9' OR master.del_sts <> 'D-9') and (master.pmt_sts <> 'P-3' OR master.del_sts <> 'D-4') order by master.indent_sheet_num ";
	private final String OPEN_TYPE_AND_APPEND_STRING = "  and ( master.pmt_sts <> 'P-9' OR master.del_sts <> 'D-9') and ( master.pmt_sts <> 'P-3' OR master.del_sts <> 'D-4' ) order by master.indent_sheet_num";
	private final String CLOSED_TYPE_WHERE_APPEND_STRING = " where master.pmt_sts = 'P-3' AND master.del_sts = 'D-4' order by master.indent_sheet_num";
	private final String CLOSED_TYPE_AND_APPEND_STRING = " and master.pmt_sts = 'P-3' AND master.del_sts = 'D-4' order by master.indent_sheet_num ";
	private final String CANCELLED_TYPE_WHERE_APPEND_STRING = " where master.pmt_sts = 'P-9' AND master.del_sts = 'D-9' order by master.indent_sheet_num ";
	private final String CANCELLED_TYPE_AND_APPEND_STRING = " and master.pmt_sts = 'P-9' AND master.del_sts = 'D-9' order by master.indent_sheet_num";

	JwtTokenDetail user=JwtTokenDetail.getInstance();
	@Autowired
	FileDownloadService downloadService;

	@Autowired
	private JdbcTemplate jdbcTemplate;
	final Logger logger = LogManager.getLogger(iotServerApplication.class);

	DBGetQuery getQuery = new DBGetQuery();
	Logs logs = new Logs();

	String strDateFormat = "yyyy-MM-dd E HH:mm:ss.SSS";
	String formattedDate;

	static final Logger log = LogManager.getLogger(FileDownload.class);
	DBFileManagementQuery query = new DBFileManagementQuery();

	private static final String GET_YEARLIST = "/getYearList";
	private static final String GET_YEARDETAILS = "/getYearDetails/{id}";
	private static final String GET_DATAWITHALLFILTERS = "/getDatawithFilters";
	private static final String GET_DATA = "/get-data-list/{indentType}";
	private static final String GET_FILTER_DATA = "/get-filter-data-list";
	private static final String LIST_INDENT_BY_DATE = "/list-indent-by-date/{indentType}";
	private static final String LIST_INDENT_BY_CONDITIONAL_FILTER = "/list-indent-by-conditional-filter/{indentType}";
	

	private static final String GET_INDENT_INVOICE_LIST = "/get-indent-invoice-list/{indentType}";
	private static final String GET_INDENT_INVOICE_LIST_BY_DATE = "/get-indent-invoice-list-by-date/{indentType}";
	private static final String GET_INDENT_INVOICE_LIST_BY_CONDITIONAL_FILTER = "/get-indent-invoice-list-by-conditional-filter/{indentType}";
	

	private static final String GET_INDENT_PAYMENT_LIST = "/get-indent-payment-list/{indentType}";
	private static final String GET_INDENT_PAYMENT_LIST_BY_DATE = "/get-indent-payment-list-by-date/{indentType}";
	private static final String GET_INDENT_PAYMENT_LIST_BY_CONDITIONAL_FILTER = "/get-indent-payment-list-by-conditional-filter/{indentType}";
	
	

	@RequestMapping(value = GET_YEARLIST, method = RequestMethod.GET, produces = "application/json")
	public List<Object> getYearList() {
		List<Object> getYearList = downloadService.getYearList();
		getCurrentTimeUsingDate();

		if (getYearList.isEmpty()) {
			Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ FileDownload.class.getName() + logs.getEmptyYearListLog());
		} else {
			Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ FileDownload.class.getName() + logs.getYearListLog());
		}

		return getYearList;
	}

	@RequestMapping(value = GET_YEARDETAILS, method = RequestMethod.GET, produces = "application/json")
	public List<Object> getYearDetails(@PathVariable String id) {
		List<Object> getYearDetails = downloadService.getYearDetails(id);
		getCurrentTimeUsingDate();

		if (getYearDetails.isEmpty()) {
			Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ FileDownload.class.getName() + logs.getEmptyYearDetailLog());
			
		} else {
			Log4j2.logger.info("INFO\t" + user.getJwt_userId() + "\t" + user.getJwt_userName() + "\t"
					+ FileDownload.class.getName() + logs.getYearDetailLog());
		}
		return getYearDetails;
	}

	@RequestMapping(method = RequestMethod.POST, value = GET_DATAWITHALLFILTERS, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Map<String, Object>> getAllFilterDtails1(FileDownloadRequest downloadReq,
			HttpServletRequest req, HttpServletResponse res) {

		String specNotFinal = "";
		String advPending = "";
		String letterCredPending = "";
		String befShpPending = "";
		String outstanding = "";
		String prodNotStarted = "";
		String lcCheckPending = "";
		String pExfPending = "";
		String fExfPending = "";
		String shpSchPendning = "";
		String shpAdvicePending = "";
		String yearList = "";

		String QueryString = "select * FROM indentmaster.master_data where ";
		String QueryStringBuild = "";

		getCurrentTimeUsingDate();

		if (downloadReq.getYearList().equals("undefined")) {
			downloadReq.setYearList(null);
		} else {
			yearList = " (year(indent_issue_date) = " + downloadReq.getYearList() + ")";
		}

		if (downloadReq.getSpecNotFinal().equals("undefined")) {
			downloadReq.setSpecNotFinal(null);
		} else {
			specNotFinal = " and (sa_date is null)";
		}

		if (downloadReq.getAdvPending().equals("undefined")) {
			downloadReq.setAdvPending(null);
		} else {
			advPending = " and (pmt_sts='P-0' and adv_amount > 0)";
		}

		if (downloadReq.getLetterCredPending().equals("undefined")) {
			downloadReq.setLetterCredPending(null);
		} else {
			letterCredPending = " and ((pmt_sts='P-0' or pmt_sts='P-1') and ash_type like '%LC%' and lc_open_date is null)";
		}

		if (downloadReq.getBefShpPending().equals("undefined")) {
			downloadReq.setBefShpPending(null);
		} else {
			befShpPending = " and ((pmt_sts='P-0' or pmt_sts='P-1') and bsh_amount> 0)";
		}

		if (downloadReq.getOutstanding().equals("undefined")) {
			downloadReq.setOutstanding(null);
		} else {
			outstanding = " and (pmt_sts='P-2' and del_sts='D-3') ";
		}

		if (downloadReq.getProdNotStarted().equals("undefined")) {
			downloadReq.setProdNotStarted(null);
		} else {
			prodNotStarted = " and (oc_date is null)";
		}

		if (downloadReq.getLcCheckPending().equals("undefined")) {
			downloadReq.setLcCheckPending(null);
		} else {
			lcCheckPending = " and (`ash_type` like '%LC%'  and lc_chk_date_by_ij is null ) ";
		}

		if (downloadReq.getpExfPending().equals("undefined")) {
			downloadReq.setpExfPending(null);
		} else {
			pExfPending = " and (exf1 is null and exf2 is null and exf3 is null)";
		}

		if (downloadReq.getfExfPending().equals("undefined")) {
			downloadReq.setfExfPending(null);
		} else {
			fExfPending = " and (del_sts='D-0')";
		}

		if (downloadReq.getShpSchPendning().equals("undefined")) {
			downloadReq.setShpSchPendning(null);
		} else {
			shpSchPendning = " and (del_sts='D-1')";
		}

		if (downloadReq.getShpAdvicePending().equals("undefined")) {
			downloadReq.setShpAdvicePending(null);
		} else {
			shpAdvicePending = " and (del_sts='D-3')";
		}

		QueryStringBuild = yearList + specNotFinal + "" + advPending + "" + letterCredPending + "" + befShpPending + ""
				+ outstanding + "" + prodNotStarted + "" + lcCheckPending + "" + pExfPending + "" + fExfPending + ""
				+ shpSchPendning + "" + shpAdvicePending;

		String sql = QueryString + QueryStringBuild;

		List<Map<String, Object>> getAllFilterDtails = new ArrayList<>();
		try {
			getAllFilterDtails = jdbcTemplate.queryForList(sql);
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+logs.getFilterAllIndentsLog());
		}
		catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+"\t"+e);
		}
		if (getAllFilterDtails.isEmpty()) {
			
		} else {
			
		}

		return getAllFilterDtails;

	}

	private void getCurrentTimeUsingDate() {
		Date date = new Date();
		DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
		formattedDate = dateFormat.format(date);
	}

	
	 //LIST-data : API REQUEST
	@GetMapping(GET_DATA)
   public List<Map<String, Object>> findAll(@PathVariable("indentType") String indentType){
      String sql = query.getGetAllIndents();
      	if(indentType.equals("OPEN")) {
      		sql = sql + OPEN_TYPE_WHERE_APPEND_STRING;
      	}
      	if(indentType.equals("CLOSED")) {
      		sql = sql + CLOSED_TYPE_WHERE_APPEND_STRING;
      	}
      	if(indentType.equals("CANCELLED")) {
      		sql = sql + CANCELLED_TYPE_WHERE_APPEND_STRING;
      	}
        List<Map<String, Object>> data = new ArrayList<>();;
        try {
        	data = jdbcTemplate.queryForList(sql);
        	if (data.isEmpty()) {
        		Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+logs.getEmptyIndentListLog());
    	        
    		} else {
    			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getNonEmptyIndentListLog());
    	        
    		}
        	return data;
        }
        catch(Exception e) {
        	Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+"\t"+e);
        	
        }
       return data;
        
    } 
	
	
	
	
	
	
// LIST-INDENTS BY DATE: API REQUEST 

	@RequestMapping(method = RequestMethod.POST, value = LIST_INDENT_BY_DATE, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Map<String, Object>> listIndentByDate(@PathVariable("indentType") String indentType, Year year,
			HttpServletRequest req, HttpServletResponse res) {
        
      String sql = query.getGetIndentsByDate();
      if(indentType.equals("OPEN")) {
    		sql = sql + OPEN_TYPE_AND_APPEND_STRING;
    	}
    	if(indentType.equals("CLOSED")) {
    		sql = sql + CLOSED_TYPE_AND_APPEND_STRING;
    	}
    	if(indentType.equals("CANCELLED")) {
    		sql = sql + CANCELLED_TYPE_AND_APPEND_STRING;
    	}
   	List<Map<String, Object>> data = new ArrayList<>();
       try {
       	data= jdbcTemplate.queryForList(sql,year.getStartDate(), year.getEndingDate());
       	if(data.isEmpty()) {
      		Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getEmptyIndentListOnDateFilterLog());
       	}
       	else {
       			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getNonEmptyIndentListOnDateFilterLog());
    	        
        	}
        }catch(Exception e){
        	Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+"\t"+e);
        }
        return data;
    }   
	
	// List indent by conditional filter
	@RequestMapping(method = RequestMethod.POST, value = LIST_INDENT_BY_CONDITIONAL_FILTER, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Map<String, Object>> listIndentByConditionalFilter(@PathVariable("indentType") String indentType, ConditionalFilter filter,
			HttpServletRequest req, HttpServletResponse res) {
        
      String sql = query.getGetIndentsByDate();
     	List<Map<String, Object>> data = new ArrayList<>();
	    switch(filter.getOption()) {
		    case 1:
		    	sql = query.getOrderBeforeSalesIndent();
		    	break;
		    case 2:
		    	sql = query.getOutstandingIndent();
		    	break;
		    case 3:
		    	sql = query.getNoBshAfterFexfIndent();
		    	break;
		    case 4:
		    	sql = query.getNoAdvIndent();
		    	break;
		    case 5:
		    	sql = query.getNoFexfIndent();
		    	break;
		    case 6:
		    	sql = query.getNoShpScheduleFixIndent();
		    	break;
		    case 99:
		    	sql = query.getCancelledIndent();
		    	break;
	    }
       try {
    	if(indentType.equals("OPEN")) {
       		sql = sql + OPEN_TYPE_AND_APPEND_STRING;
       	}
       	if(indentType.equals("CLOSED")) {
       		sql = sql + CLOSED_TYPE_AND_APPEND_STRING;
       	}
       	if(indentType.equals("CANCELLED")) {
       		sql = sql + CANCELLED_TYPE_AND_APPEND_STRING;
       	}
       	data= jdbcTemplate.queryForList(sql);
       	if(data.isEmpty()) {
      		Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getEmptyIndentListOnConFilterLog());
       	}
       	else {
       			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getNonEmptyIndentListOnConFilterLog());
    	        
        	}
        }catch(Exception e){
        	Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+"\t"+e);
        }
        return data;
    } 


	
		
	// OLD DOWNLOAD MODULE GET FILTER DATA;
	@RequestMapping(method = RequestMethod.POST, value = GET_FILTER_DATA, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody List<Map<String, Object>> getFilterData(FileDownloadRequest downloadReq,
			HttpServletRequest req, HttpServletResponse res) {

		String specNotFinal = "";
		String advPending = "";
		String letterCredPending = "";
		String befShpPending = "";
		String outstanding = "";
		String prodNotStarted = "";
		String lcCheckPending = "";
		String pExfPending = "";
		String fExfPending = "";
		String shpSchPendning = "";
		String shpAdvicePending = "";
		String yearList = "";
		String where ="";
		String and="";

		String QueryString = "select * FROM indentmaster.master_data ";
		String QueryStringBuild = "";
		boolean isWhere = false;
		boolean isAnd= false;
		getCurrentTimeUsingDate();

		if (downloadReq.getYearList().equals("undefined")) {
			downloadReq.setYearList(null);
		} else {
			isWhere=true;
			yearList = " (year(indent_issue_date) = " + downloadReq.getYearList() + ")";
		}

		if (downloadReq.getSpecNotFinal().equals("undefined")) {
			downloadReq.setSpecNotFinal(null);
		} else {
			isAnd= true;
			specNotFinal = " (sa_date is null)";
		}

		if (downloadReq.getAdvPending().equals("undefined")) {
			downloadReq.setAdvPending(null);
		} else {
			isAnd= true;
			advPending = " (pmt_sts='P-0' and adv_amount > 0)";
		}

		if (downloadReq.getLetterCredPending().equals("undefined")) {
			downloadReq.setLetterCredPending(null);
		} else {
			isAnd= true;
			letterCredPending = " ((pmt_sts='P-0' or pmt_sts='P-1') and ash_type like '%LC%' and lc_open_date is null)";
		}

		if (downloadReq.getBefShpPending().equals("undefined")) {
			downloadReq.setBefShpPending(null);
		} else {
			isAnd= true;
			befShpPending = " ((pmt_sts='P-0' or pmt_sts='P-1') and bsh_amount> 0)";
		}

		if (downloadReq.getOutstanding().equals("undefined")) {
			downloadReq.setOutstanding(null);
		} else {
			isAnd= true;
			outstanding = " (pmt_sts='P-2' and del_sts='D-3') ";
		}

		if (downloadReq.getProdNotStarted().equals("undefined")) {
			downloadReq.setProdNotStarted(null);
		} else {
			isAnd= true;
			prodNotStarted = " (oc_date is null)";
		}

		if (downloadReq.getLcCheckPending().equals("undefined")) {
			downloadReq.setLcCheckPending(null);
		} else {
			isAnd= true;
			lcCheckPending = " (`ash_type` like '%LC%'  and lc_chk_date_by_ij is null ) ";
		}

		if (downloadReq.getpExfPending().equals("undefined")) {
			downloadReq.setpExfPending(null);
		} else {
			isAnd= true;
			pExfPending = " (exf1 is null and exf2 is null and exf3 is null)";
		}

		if (downloadReq.getfExfPending().equals("undefined")) {
			downloadReq.setfExfPending(null);
		} else {
			isAnd= true;
			fExfPending = " (del_sts='D-0')";
		}

		if (downloadReq.getShpSchPendning().equals("undefined")) {
			downloadReq.setShpSchPendning(null);
		} else {
			isAnd= true;
			shpSchPendning = " (del_sts='D-1')";
		}

		if (downloadReq.getShpAdvicePending().equals("undefined")) {
			downloadReq.setShpAdvicePending(null);
		} else {
			isAnd= true;
			shpAdvicePending = " (del_sts='D-3')";
		}

		if(isWhere) {
			where="where";
		}
		if(isAnd) {
			if(isWhere) {
				and="and";
				where="where";
			}
			where="where";
		}
		QueryStringBuild = where+ yearList +and+ specNotFinal + "" + advPending + "" + letterCredPending + "" + befShpPending + ""
				+ outstanding + "" + prodNotStarted + "" + lcCheckPending + "" + pExfPending + "" + fExfPending + ""
				+ shpSchPendning + "" + shpAdvicePending;

		String sql = QueryString + QueryStringBuild.concat(" ORDER BY indent_sheet_num DESC ");

		List<Map<String, Object>> getAllFilterDtails = new ArrayList<>();
		try {
			getAllFilterDtails = jdbcTemplate.queryForList(sql);

			if (getAllFilterDtails.isEmpty()) {
	        	Log4j2.logger.log(Log4j2.LEVEL,"INFO "+user.getJwt_userId()+" "+user.getJwt_userName()+ logs.getEmptyIndentListLogOld());
			} else {
	        	Log4j2.logger.log(Log4j2.LEVEL,"INFO "+user.getJwt_userId()+" "+user.getJwt_userName()+ logs.getNonEmptyIndentListLogOld());
			}
		}catch(Exception e) {
        	Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+"\t"+e);
		}
		

		return getAllFilterDtails;

	}
	
	
	

	
	
	
	
	
	
	// list all indent invoice data
	
	@GetMapping(GET_INDENT_INVOICE_LIST)
	   public List<Map<String, Object>> getIndentInvoiceList(@PathVariable("indentType") String indentType){

	      String sql = query.getAllIndentInvoiceData();
	      if(indentType.equals("OPEN")) {
	       		sql = sql + OPEN_TYPE_WHERE_APPEND_STRING;
	       	}
	       	if(indentType.equals("CLOSED")) {
	       		sql = sql + CLOSED_TYPE_WHERE_APPEND_STRING;
	       	}
	       	if(indentType.equals("CANCELLED")) {
	       		sql = sql + CANCELLED_TYPE_WHERE_APPEND_STRING;
	       	}
	        List<Map<String, Object>> data = new ArrayList<>();;
	        try {
	        	data = jdbcTemplate.queryForList(sql);
	        	if (data.isEmpty()) {
	        		Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+logs.getEmptyInvoiceListLog());
	    	        
	    		} else {
	    			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getNonEmptyInvoiceListLog());
	    	        
	    		}
	        	return data;
	        }
	        catch(Exception e) {
	        	Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+"\t"+e);
	        	
	        }
	       return data;
	        
	    } 
		
		
		
		
		
		
	// LIST-INDENTS invoice data BY DATE: API REQUEST 

		@RequestMapping(method = RequestMethod.POST, value = GET_INDENT_INVOICE_LIST_BY_DATE, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
		public @ResponseBody List<Map<String, Object>> getIndentInvoiceListByDate(@PathVariable("indentType") String indentType, Year year,
				HttpServletRequest req, HttpServletResponse res) {
	        
	      String sql = query.getDateRangeIndentInvoiceData();
	      if(indentType.equals("OPEN")) {
	       		sql = sql + OPEN_TYPE_AND_APPEND_STRING;
	       	}
	       	if(indentType.equals("CLOSED")) {
	       		sql = sql + CLOSED_TYPE_AND_APPEND_STRING;
	       	}
	       	if(indentType.equals("CANCELLED")) {
	       		sql = sql + CANCELLED_TYPE_AND_APPEND_STRING;
	       	}
	    
	   	List<Map<String, Object>> data = new ArrayList<>();
	       try {
	       	data= jdbcTemplate.queryForList(sql,year.getStartDate(), year.getEndingDate());
	       	if(data.isEmpty()) {
	      		Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getEmptyInvoiceListLogOnDateFilter());
	       	}
	       	else {
	       			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getNonEmptyInvoiceListLogOnDateFilter());
	    	        
	        	}
	        }catch(Exception e){
	        	Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+"\t"+e);
	        }
	        return data;
	    }   
		
		// List indent invoice data by conditional filter
		@RequestMapping(method = RequestMethod.POST, value = GET_INDENT_INVOICE_LIST_BY_CONDITIONAL_FILTER, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
		public @ResponseBody List<Map<String, Object>> getIndentInvoiceListByConditionalFilter(@PathVariable("indentType") String indentType, ConditionalFilter filter,
				HttpServletRequest req, HttpServletResponse res) {
	        
	      String sql;
	     	List<Map<String, Object>> data = new ArrayList<>();
		    switch(filter.getOption()) {
			    case 1:
			    	sql= query.getOrderBeforeSalesIndentInvoiceData();
//			    	sql = query.getOrderBeforeSalesIndent();
			    	break;
			    case 2:
			    	sql = query.getOutstandingIndentInvoiceData();
			    	break;
			    case 3:
			    	sql = query.getNoBshAfterFexfIndentInvoiceData();
			    	break;
			    case 4:
			    	sql = query.getNoAdvIndentInvoiceData();
			    	break;
			    case 5:
			    	sql = query.getNoFexfIndentInvoiceData();
			    	break;
			    case 6:
			    	sql = query.getNoShpScheduleFixIndentInvoiceData();
			    	break;
			    case 99:
			    	sql = query.getCancelledIndentInvoiceData();
			    	break;
			    default: 
			    	sql= query.getOrderBeforeSalesIndentInvoiceData();
			    	break;
		    }
	       try {
	 	      if(indentType.equals("OPEN")) {
		       		sql = sql + OPEN_TYPE_AND_APPEND_STRING;
		       	}
		       	if(indentType.equals("CLOSED")) {
		       		sql = sql + CLOSED_TYPE_AND_APPEND_STRING;
		       	}
		       	if(indentType.equals("CANCELLED")) {
		       		sql = sql + CANCELLED_TYPE_AND_APPEND_STRING;
		       	}
	       	data= jdbcTemplate.queryForList(sql);
	       	if(data.isEmpty()) {
	      		Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getEmptyInvoiceListLogOnConFilter());
	       	}
	       	else {
	       			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getNonEmptyInvoiceListLogOnConFilter());
	    	        
	        	}
	        }catch(Exception e){
	        	Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+"\t"+e);
	        }
	        return data;
	    } 

	
	
		
		// list all indent payment data
		
		@GetMapping(GET_INDENT_PAYMENT_LIST)
		   public List<Map<String, Object>> getIndentPaymentList(@PathVariable("indentType") String indentType){
			
		      String sql = query.getAllIndentPaymentData();
		      if(indentType.equals("OPEN")) {
		       		sql = sql + OPEN_TYPE_WHERE_APPEND_STRING;
		       	}
		       	if(indentType.equals("CLOSED")) {
		       		sql = sql + CLOSED_TYPE_WHERE_APPEND_STRING;
		       	}
		       	if(indentType.equals("CANCELLED")) {
		       		sql = sql + CANCELLED_TYPE_WHERE_APPEND_STRING;
		       	}
		        List<Map<String, Object>> data = new ArrayList<>();;
		        try {
		        	data = jdbcTemplate.queryForList(sql);
		        	if (data.isEmpty()) {
		        		Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+logs.getEmptyPaymentListLog());
		    	        
		    		} else {
		    			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getNonEmptyPaymentListLog());
		    	        
		    		}
		        	return data;
		        }
		        catch(Exception e) {
		        	Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+"\t"+e);
		        	
		        }
		       return data;
		        
		    } 
			
			
			
			
			
			
		// LIST-INDENTS payment data BY DATE: API REQUEST 

			@RequestMapping(method = RequestMethod.POST, value = GET_INDENT_PAYMENT_LIST_BY_DATE, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
			public @ResponseBody List<Map<String, Object>> getIndentPaymentListByDate(@PathVariable("indentType") String indentType,Year year,
					HttpServletRequest req, HttpServletResponse res) {
		        
		      String sql = query.getDateRangeIndentPaymentData();
		      if(indentType.equals("OPEN")) {
		       		sql = sql + OPEN_TYPE_AND_APPEND_STRING;
		       	}
		       	if(indentType.equals("CLOSED")) {
		       		sql = sql + CANCELLED_TYPE_AND_APPEND_STRING;
		       	}
		       	if(indentType.equals("CANCELLED")) {
		       		sql = sql + CANCELLED_TYPE_AND_APPEND_STRING;
		       	}
		    
		   	List<Map<String, Object>> data = new ArrayList<>();
		       try {
		       	data= jdbcTemplate.queryForList(sql,year.getStartDate(), year.getEndingDate());
		       	if(data.isEmpty()) {
		      		Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getEmptyPaymentListLogOnDateFilter());
		       	}
		       	else {
		       			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getNonEmptyPaymentListLogOnDateFilter());
		    	        
		        	}
		        }catch(Exception e){
		        	Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+"\t"+e);
		        }
		        return data;
		    }   
			
			// List indent payment data by conditional filter
			@RequestMapping(method = RequestMethod.POST, value = GET_INDENT_PAYMENT_LIST_BY_CONDITIONAL_FILTER, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
			public @ResponseBody List<Map<String, Object>> getIndentPaymentListByConditionalFilter(@PathVariable("indentType") String indentType,ConditionalFilter filter,
					HttpServletRequest req, HttpServletResponse res) {
		        
		      String sql;
		     	List<Map<String, Object>> data = new ArrayList<>();
			    switch(filter.getOption()) {
				    case 1:
				    	sql= query.getOrderBeforeSalesIndentPaymentData();
//				    	sql = query.getOrderBeforeSalesIndent();
				    	break;
				    case 2:
				    	sql = query.getOutstandingIndentPaymentData();
				    	break;
				    case 3:
				    	sql = query.getNoBshAfterFexfIndentPaymentData();
				    	break;
				    case 4:
				    	sql = query.getNoAdvIndentPaymentData();
				    	break;
				    case 5:
				    	sql = query.getNoFexfIndentPaymentData();
				    	break;
				    case 6:
				    	sql = query.getNoShpScheduleFixIndentPaymentData();
				    	break;
				    case 99:
				    	sql = query.getCancelledIndentPaymentData();
				    	break;
				    default: 
				    	sql= query.getOrderBeforeSalesIndentPaymentData();
				    	break;
			    }
		       try {
		 	      if(indentType.equals("OPEN")) {
			       		sql = sql + OPEN_TYPE_AND_APPEND_STRING;
			       	}
			       	if(indentType.equals("CLOSED")) {
			       		sql = sql + CLOSED_TYPE_AND_APPEND_STRING;
			       	}
			       	if(indentType.equals("CANCELLED")) {
			       		sql = sql + CANCELLED_TYPE_AND_APPEND_STRING;
			       	}
		       	data= jdbcTemplate.queryForList(sql);
		       	if(data.isEmpty()) {
		      		Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getEmptyPaymentListLogOnConFilter());
		       	}
		       	else {
		       			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+ logs.getNonEmptyPaymentListLogOnConFilter());
		    	        
		        	}
		        }catch(Exception e){
		        	Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ FileDownload.class.getName()+"\t"+e);
		        }
		        return data;
		    } 

		
		
	
	
	
}
class Year{
	String startDate;
	String endingDate;
	String year;
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndingDate() {
		return endingDate;
	}
	public void setEndingDate(String endingDate) {
		this.endingDate = endingDate;
	}
	public String getYear() {
		return year;
	}
	public void setYear(String year) {
		this.year = year;
	}
	public Year(String startDate, String endingDate, String year) {
		super();
		this.startDate = startDate;
		this.endingDate = endingDate;
		this.year = year;
	}
	public Year() {
		super();
	}
	@Override
	public String toString() {
		return "Year [startDate=" + startDate + ", endingDate=" + endingDate + ", year=" + year + "]";
	}
	
	

}

class ConditionalFilter{
	int option;

	public int getOption() {
		return option;
	}

	public void setOption(int option) {
		this.option = option;
	}

	
	
}
