package controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import config.DBGetQuery;
import config.JwtTokenDetail;
import config.Log4j2;
import config.Logs;
import model.FilterSignalCntResp;
import service.DashboardService;

@ComponentScan(basePackages = { "service" })
@RestController
public class Dashboard {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	DashboardService dashboardService;

	DBGetQuery getQuery = new DBGetQuery();
	Logs logs = new Logs();

	String strDateFormat = "yyyy-MM-dd E HH:mm:ss.SSS";
	String formattedDate;


	private static final String GET_BLUSIGNALCOUNT = "/filter_AllCount";
	private static final String GET_YELLSIGNALCOUNT = "/filter_AllYellowCount";

	private static final String GET_BLUFILTERSNF = "/blufiltersnf";
	private static final String GET_BLUFILTERADV = "/blufilteradv";
	private static final String GET_BLUFILTERLC = "/blufilterlc";
	private static final String GET_BLUFILTERBSH = "/blufilterbsh";
	private static final String GET_BLUFILTEROUT = "/blufilterout";
	private static final String GET_BLUFILTERPNS = "/blufilterpns";
	private static final String GET_BLUFILTERLCP = "/blufilterlcp";
	private static final String GET_BLUFILTERPXEF = "/blufilterpxef";
	private static final String GET_BLUFILTERFEXF = "/blufilterfexf";
	private static final String GET_BLUFILTERSSP = "/blufilterssp";
	private static final String GET_BLUFILTERSAP = "/blufiltersap";

	private static final String GET_YELLFILTERSNF = "/yellfiltersnf";
	private static final String GET_YELLFILTERADV = "/yellfilteradv";
	private static final String GET_YELLFILTERLC = "/yellfilterlc";
	private static final String GET_YELLFILTERBSH = "/yellfilterbsh";
	private static final String GET_YELLFILTEROUT = "/yellfilterout";
	private static final String GET_YELLFILTERPNS = "/yellfilterpns";
	private static final String GET_YELLFILTERLCP = "/yellfilterlcp";
	private static final String GET_YELLFILTERPXEF = "/yellfilterpxef";
	private static final String GET_YELLFILTERFEXF = "/yellfilterfexf";
	private static final String GET_YELLFILTERSSP = "/yellfilterssp";
	private static final String GET_YELLFILTERSAP = "/yellfiltersap";

	private static final String GET_INDVINDENTDETAIL = "/indentDetail/{indentNum}";
	private static final String CHECK_PO_NUMBER_EXIST = "/checkPoNumberExist";
	private static final String GET_INDENT_USING_PO_NUM = "/getIndentListUsingPoNumber";
	private static final String GET_PMT_LIST_USING_PO_NUM = "/getListOfPmtUsingPoNumber";
	private static final String GET_MASTER_PMT_LIST_USING_PO_NUM = "/getListOfMasterPmtUsingPoNumber";

	JwtTokenDetail user=JwtTokenDetail.getInstance();



	@RequestMapping(GET_BLUSIGNALCOUNT)
	public @ResponseBody FilterSignalCntResp getAllBluSignalCount(HttpServletRequest req, HttpServletResponse res) {
		FilterSignalCntResp bluesignalcnt = new FilterSignalCntResp();
	
		try {
			List<Map<String, Object>> l1 = jdbcTemplate.queryForList(getQuery.getSNFSIGNALCNT());
			List<Map<String, Object>> l2 = jdbcTemplate.queryForList(getQuery.getAPSIGNALCNT());
			List<Map<String, Object>> l3 = jdbcTemplate.queryForList(getQuery.getLCSIGNALCNT());
			List<Map<String, Object>> l4 = jdbcTemplate.queryForList(getQuery.getBPSIGNALCNT());
			List<Map<String, Object>> l5 = jdbcTemplate.queryForList(getQuery.getOUTSIGNALCNT());
			List<Map<String, Object>> l6 = jdbcTemplate.queryForList(getQuery.getPNSSIGNALCNT());
			List<Map<String, Object>> l7 = jdbcTemplate.queryForList(getQuery.getLCPSIGNALCNT());
			List<Map<String, Object>> l8 = jdbcTemplate.queryForList(getQuery.getPEXFSIGNALCNT());
			List<Map<String, Object>> l9 = jdbcTemplate.queryForList(getQuery.getFEXFSIGNALCNT());
			List<Map<String, Object>> l10 = jdbcTemplate.queryForList(getQuery.getSSPSIGNALCNT());
			List<Map<String, Object>> l11 = jdbcTemplate.queryForList(getQuery.getSAPSIGNALCNT());

			bluesignalcnt.setSnfSignal(l1.get(0).toString().replaceAll("[^0-9]", ""));
			bluesignalcnt.setApSignal(l2.get(0).toString().replaceAll("[^0-9]", ""));
			bluesignalcnt.setLcSignal(l3.get(0).toString().replaceAll("[^0-9]", ""));
			bluesignalcnt.setBpSignal(l4.get(0).toString().replaceAll("[^0-9]", ""));
			bluesignalcnt.setOutSignal(l5.get(0).toString().replaceAll("[^0-9]", ""));
			bluesignalcnt.setPnsSignal(l6.get(0).toString().replaceAll("[^0-9]", ""));
			bluesignalcnt.setLcpSignal(l7.get(0).toString().replaceAll("[^0-9]", ""));
			bluesignalcnt.setPexfpSignal(l8.get(0).toString().replaceAll("[^0-9]", ""));
			bluesignalcnt.setFexfpSignal(l9.get(0).toString().replaceAll("[^0-9]", ""));
			bluesignalcnt.setSspSignal(l10.get(0).toString().replaceAll("[^0-9]", ""));
			bluesignalcnt.setSapSignal(l11.get(0).toString().replaceAll("[^0-9]", ""));
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ Dashboard.class.getName()+ logs.getBlueSignalCount());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ Dashboard.class.getName()+"\t"+e);
		}
		

		return bluesignalcnt;
	}





	@RequestMapping(GET_YELLSIGNALCOUNT)
	public @ResponseBody FilterSignalCntResp getAllYellSignalCount(HttpServletRequest req, HttpServletResponse res) {
	
		FilterSignalCntResp yellowsignalcnt = new FilterSignalCntResp();
		try {
			List<Map<String, Object>> l1 = jdbcTemplate.queryForList(getQuery.getYLLSNFSIGNALCNT());
			List<Map<String, Object>> l2 = jdbcTemplate.queryForList(getQuery.getYLLAPSIGNALCNT());
			List<Map<String, Object>> l3 = jdbcTemplate.queryForList(getQuery.getYLLLCSIGNALCNT());
			List<Map<String, Object>> l4 = jdbcTemplate.queryForList(getQuery.getYLLBPSIGNALCNT());
			List<Map<String, Object>> l5 = jdbcTemplate.queryForList(getQuery.getYLLOUTSIGNALCNT());
			List<Map<String, Object>> l6 = jdbcTemplate.queryForList(getQuery.getYLLPNSSIGNALCNT());
			List<Map<String, Object>> l7 = jdbcTemplate.queryForList(getQuery.getYLLLCPSIGNALCNT());
			List<Map<String, Object>> l8 = jdbcTemplate.queryForList(getQuery.getYLLPEXFSIGNALCNT());
			List<Map<String, Object>> l9 = jdbcTemplate.queryForList(getQuery.getYLLFEXFSIGNALCNT());
			List<Map<String, Object>> l10 = jdbcTemplate.queryForList(getQuery.getYLLSSPSIGNALCNT());
			List<Map<String, Object>> l11 = jdbcTemplate.queryForList(getQuery.getYLLSAPSIGNALCNT());

			yellowsignalcnt.setSnfSignal(l1.get(0).toString().replaceAll("[^0-9]", ""));
			yellowsignalcnt.setApSignal(l2.get(0).toString().replaceAll("[^0-9]", ""));
			yellowsignalcnt.setLcSignal(l3.get(0).toString().replaceAll("[^0-9]", ""));
			yellowsignalcnt.setBpSignal(l4.get(0).toString().replaceAll("[^0-9]", ""));
			yellowsignalcnt.setOutSignal(l5.get(0).toString().replaceAll("[^0-9]", ""));
			yellowsignalcnt.setPnsSignal(l6.get(0).toString().replaceAll("[^0-9]", ""));
			yellowsignalcnt.setLcpSignal(l7.get(0).toString().replaceAll("[^0-9]", ""));
			yellowsignalcnt.setPexfpSignal(l8.get(0).toString().replaceAll("[^0-9]", ""));
			yellowsignalcnt.setFexfpSignal(l9.get(0).toString().replaceAll("[^0-9]", ""));
			yellowsignalcnt.setSspSignal(l10.get(0).toString().replaceAll("[^0-9]", ""));
			yellowsignalcnt.setSapSignal(l11.get(0).toString().replaceAll("[^0-9]", ""));
			Log4j2.logger.info("INFO\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ Dashboard.class.getName()+logs.getYellowSignalCount());
		}catch(Exception e) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ Dashboard.class.getName()+"\t"+e);
		}
		

		return yellowsignalcnt;
	}

	@RequestMapping(GET_BLUFILTERSNF)
	public @ResponseBody List<Object> getBluFiltersnf(HttpServletRequest req, HttpServletResponse res) {
		List<Object> BLUFILTERSNF = dashboardService.getBLUFILTERSNF();
	
		return BLUFILTERSNF;
	}

	@RequestMapping(GET_BLUFILTERADV)
	public @ResponseBody List<Object> getBluFilteradv(HttpServletRequest req, HttpServletResponse res) {
		List<Object> BLUFILTERADV = dashboardService.getBLUFILTERADV();
	
		return BLUFILTERADV;
	}

	@RequestMapping(GET_BLUFILTERLC)
	public @ResponseBody List<Object> getBluFilterlc(HttpServletRequest req, HttpServletResponse res) {
		List<Object> BLUFILTERLC = dashboardService.getBLUFILTERLC();
	
		return BLUFILTERLC;
	}

	@RequestMapping(GET_BLUFILTERBSH)
	public @ResponseBody List<Object> getBluFilterbsh(HttpServletRequest req, HttpServletResponse res) {
		List<Object> BLUFILTERBSH = dashboardService.getBLUFILTERBSH();
	
		return BLUFILTERBSH;
	}

	@RequestMapping(GET_BLUFILTEROUT)
	public @ResponseBody List<Object> getBluFilterout(HttpServletRequest req, HttpServletResponse res) {
		List<Object> BLUFILTEROUT = dashboardService.getBLUFILTEROUT();
	
		return BLUFILTEROUT;
	}

	@RequestMapping(GET_BLUFILTERPNS)
	public @ResponseBody List<Object> getBluFilterpns(HttpServletRequest req, HttpServletResponse res) {
		List<Object> BLUFILTERPNS = dashboardService.getBLUFILTERPNS();
	
		return BLUFILTERPNS;
	}

	@RequestMapping(GET_BLUFILTERLCP)
	public @ResponseBody List<Object> getBluFilterlcp(HttpServletRequest req, HttpServletResponse res) {
		List<Object> BLUFILTERLCP = dashboardService.getBLUFILTERLCP();
	
		return BLUFILTERLCP;
	}

	@RequestMapping(GET_BLUFILTERPXEF)
	public @ResponseBody List<Object> getBluFilterpxef(HttpServletRequest req, HttpServletResponse res) {
		List<Object> BLUFILTERPXEF = dashboardService.getBLUFILTERPXEF();
	
		return BLUFILTERPXEF;
	}

	@RequestMapping(GET_BLUFILTERFEXF)
	public @ResponseBody List<Object> getBluFilterfexf(HttpServletRequest req, HttpServletResponse res) {
		List<Object> BLUFILTERFEXF = dashboardService.getBLUFILTERFEXF();
	
		return BLUFILTERFEXF;
	}

	@RequestMapping(GET_BLUFILTERSSP)
	public @ResponseBody List<Object> getBluFilterssp(HttpServletRequest req, HttpServletResponse res) {
		List<Object> BLUFILTERSSP = dashboardService.getBLUFILTERSSP();
	
		return BLUFILTERSSP;
	}

	@RequestMapping(GET_BLUFILTERSAP)
	public @ResponseBody List<Object> getBluFiltersap(HttpServletRequest req, HttpServletResponse res) {
		List<Object> BLUFILTERSAP = dashboardService.getBLUFILTERSAP();
	
		return BLUFILTERSAP;
	}

	@RequestMapping(GET_YELLFILTERSNF)
	public @ResponseBody List<Object> getYellFiltersnf(HttpServletRequest req, HttpServletResponse res) {
		List<Object> YELLFILTERSNF = dashboardService.getYELLFILTERSNF();
	
		return YELLFILTERSNF;
	}

	@RequestMapping(GET_YELLFILTERADV)
	public @ResponseBody List<Object> getYellFilteradv(HttpServletRequest req, HttpServletResponse res) {
		List<Object> YELLFILTERADV = dashboardService.getYELLFILTERADV();
	
		return YELLFILTERADV;
	}

	@RequestMapping(GET_YELLFILTERLC)
	public @ResponseBody List<Object> getYellFilterlc(HttpServletRequest req, HttpServletResponse res) {
		List<Object> YELLFILTERLC = dashboardService.getYELLFILTERLC();

		return YELLFILTERLC;
	}

	@RequestMapping(GET_YELLFILTERBSH)
	public @ResponseBody List<Object> getYellFilterbsh(HttpServletRequest req, HttpServletResponse res) {
		List<Object> YELLFILTERBSH = dashboardService.getYELLFILTERBSH();
	
		return YELLFILTERBSH;
	}

	@RequestMapping(GET_YELLFILTEROUT)
	public @ResponseBody List<Object> getYellFilterout(HttpServletRequest req, HttpServletResponse res) {
		List<Object> YELLFILTEROUT = dashboardService.getYELLFILTEROUT();
	
		return YELLFILTEROUT;
	}

	@RequestMapping(GET_YELLFILTERPNS)
	public @ResponseBody List<Object> getYellFilterpns(HttpServletRequest req, HttpServletResponse res) {
		List<Object> YELLFILTERPNS = dashboardService.getYELLFILTERPNS();

		return YELLFILTERPNS;
	}

	@RequestMapping(GET_YELLFILTERLCP)
	public @ResponseBody List<Object> getYellFilterlcp(HttpServletRequest req, HttpServletResponse res) {
		List<Object> YELLFILTERLCP = dashboardService.getYELLFILTERLCP();

		return YELLFILTERLCP;
	}

	@RequestMapping(GET_YELLFILTERPXEF)
	public @ResponseBody List<Object> getYellFilterpxef(HttpServletRequest req, HttpServletResponse res) {
		List<Object> YELLFILTERPXEF = dashboardService.getYELLFILTERPXEF();

		return YELLFILTERPXEF;
	}

	@RequestMapping(GET_YELLFILTERFEXF)
	public @ResponseBody List<Object> getYellFilterfexf(HttpServletRequest req, HttpServletResponse res) {
		List<Object> YELLFILTERFEXF = dashboardService.getYELLFILTERFEXF();

		return YELLFILTERFEXF;
	}

	@RequestMapping(GET_YELLFILTERSSP)
	public @ResponseBody List<Object> getYellFilterssp(HttpServletRequest req, HttpServletResponse res) {
		List<Object> YELLFILTERSSP = dashboardService.getYELLFILTERSSP();

		return YELLFILTERSSP;
	}

	@RequestMapping(GET_YELLFILTERSAP)
	public @ResponseBody List<Object> getYellFiltersap(HttpServletRequest req, HttpServletResponse res) {
		List<Object> YELLFILTERSAP = dashboardService.getYELLFILTERSAP();

		return YELLFILTERSAP;
	}

	@RequestMapping(GET_INDVINDENTDETAIL)
	public @ResponseBody List<Object> getIndentSingle(@PathVariable String indentNum, HttpServletRequest req,
			HttpServletResponse res) {
		List<Object> IndentSingle = dashboardService.getINDVINDENTDETAIL(indentNum);
		return IndentSingle;
	}

	@RequestMapping(CHECK_PO_NUMBER_EXIST)
	public @ResponseBody List<Object> checkPoNumberExist(@RequestParam String customerPoNum, HttpServletRequest req,
														 HttpServletResponse res) {
		List<Object> IndentList = dashboardService.checkPoNumberExist(customerPoNum);
		return IndentList;
	}

	@RequestMapping(GET_INDENT_USING_PO_NUM)
	public @ResponseBody List<Object> getIndentUsingPoNumber(@RequestParam String customerPoNum, HttpServletRequest req,
														 HttpServletResponse res) {
		List<Object> IndentList = dashboardService.getIndentUsingPoNumber(customerPoNum);
		return IndentList;
	}

	@RequestMapping(GET_PMT_LIST_USING_PO_NUM)
	public @ResponseBody List<Object> getPmtListUsingPoNumber(@RequestParam String customerPoNum, HttpServletRequest req,
															 HttpServletResponse res) {
		List<Object> IndentList = dashboardService.getPmtListUsingPoNumber(customerPoNum);
		return IndentList;
	}

	@RequestMapping(GET_MASTER_PMT_LIST_USING_PO_NUM)
	public @ResponseBody List<Object> getMasterPmtListUsingPoNumber(@RequestParam String customerPoNum, HttpServletRequest req,
															  HttpServletResponse res) {
		List<Object> IndentList = dashboardService.getMasterPmtListUsingPoNumber(customerPoNum);
		return IndentList;
	}
}
