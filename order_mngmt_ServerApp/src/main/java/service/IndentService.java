package service;

import java.util.List;

public interface IndentService {

	List<Object> filter_NextAction_Today();

	List<Object> getAllRevisedNextDate(String id);

	List<Object> indentDetail(String id);

	List<Object> getAllIndentList();
	List<Object> getCategoryList();

	List<Object> getOpenIndentList();

	List<Object> getClosedIndentList();

	List<Object> getCancelledIndentList();

	List<Object> getAllIndentListASC(String indentType);
	List<Object> getIndentOtherFileList(String indentNo);

	List<Object> getServiceMasterIndents();

}

