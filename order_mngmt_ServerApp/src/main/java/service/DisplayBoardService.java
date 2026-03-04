package service;

import model.PriorityIndents;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DisplayBoardService {


    List<PriorityIndents> getAllPriorityIndentList();
    List<Object> getRegionList();
    List<Object> getINDENTDETAIL(String indentNum);

    List<Object> getINDENTPOSITION(String indentPosition);
    List<Object> getPaginationDetails();


}
