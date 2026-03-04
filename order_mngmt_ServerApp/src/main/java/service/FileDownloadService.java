package service;

import java.util.List;

public interface FileDownloadService {

	List<Object> getYearList();

	List<Object> getYearDetails(String id);

	List<Object> getAllFilterDtails(String specNotFinal, String advPending, String letterCredPending,
			String befShpPending, String outstanding, String prodNotStarted, String lcCheckPending, String pExfPending,
			String fExfPending, String shpSchPendning, String shpAdvicePending, String yearList);
}
