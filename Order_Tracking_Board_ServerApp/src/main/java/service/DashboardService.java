package service;

import model.IBoardApiResponse;
import model.IDashboardMaster;
import model.PollingServiceFlag;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface DashboardService {


    List<IDashboardMaster> getIDashboardMasterList1();
    List<PollingServiceFlag> getPollingServiceFlag();



}
