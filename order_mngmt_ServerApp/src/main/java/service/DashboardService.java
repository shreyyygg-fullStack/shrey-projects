package service;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface DashboardService {

	List<Object> getBLUFILTERSNF();

	List<Object> getBLUFILTERADV();

	List<Object> getBLUFILTERLC();

	List<Object> getBLUFILTERBSH();

	List<Object> getBLUFILTEROUT();

	List<Object> getBLUFILTERPNS();

	List<Object> getBLUFILTERLCP();

	List<Object> getBLUFILTERPXEF();

	List<Object> getBLUFILTERFEXF();

	List<Object> getBLUFILTERSSP();

	List<Object> getBLUFILTERSAP();

	List<Object> getYELLFILTERSNF();

	List<Object> getYELLFILTERADV();

	List<Object> getYELLFILTERLC();

	List<Object> getYELLFILTERBSH();

	List<Object> getYELLFILTEROUT();

	List<Object> getYELLFILTERPNS();

	List<Object> getYELLFILTERLCP();

	List<Object> getYELLFILTERPXEF();

	List<Object> getYELLFILTERFEXF();

	List<Object> getYELLFILTERSSP();

	List<Object> getYELLFILTERSAP();

	List<Object> getINDVINDENTDETAIL(String indentNum);

	List<Object> checkPoNumberExist(String customerPoNumber);
	List<Object> getIndentUsingPoNumber(String customerPoNumber);
	List<Object> getPmtListUsingPoNumber(String customerPoNumber);
	List<Object> getMasterPmtListUsingPoNumber(String customerPoNumber);

}
