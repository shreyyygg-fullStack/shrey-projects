package controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.IBoardApiResponse;
import model.IDashboardMaster;
import model.PollingServiceFlag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import service.DashboardService;

import java.util.List;

@ComponentScan(basePackages = { "service" })
@RestController
public class DashboardController {
    private static final String I_DASHBOARD_MASTER = "api/v1/idashboard-master";
    private static final String POLLING_SERVICE_FLAG = "api/v1/server-data-flag";


    @Autowired
    DashboardService dashboardService;

    @CrossOrigin(origins = "http://localhost:4200")

    @RequestMapping(method = RequestMethod.GET, path = I_DASHBOARD_MASTER, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    List<IDashboardMaster> getIDashboardMasterList(HttpServletRequest req, HttpServletResponse res) {
        List<IDashboardMaster> DashBMasters = dashboardService.getIDashboardMasterList1();
        return DashBMasters;
    }

    @RequestMapping(method = RequestMethod.GET, path = POLLING_SERVICE_FLAG, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    List<PollingServiceFlag> getPollingServiceFlag(HttpServletRequest req, HttpServletResponse res) {
        List<PollingServiceFlag> flagData = dashboardService.getPollingServiceFlag();
        return flagData;
    }




}
