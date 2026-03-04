package controller;


import Services.PlanningService;
import interceptor.interceptorLogging;
import model.PlanModal;
import model.SegmapAPIResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.List;


@ComponentScan(basePackages = { "Services" })

@RestController
public class Planning {


    private static final String masterAccounts = "/master_accounts";
    private static final String planningAccounts = "/planning_accounts";

    private static final String addingPlans = "/add_plan";



    @Autowired
    private PlanningService planService;

    static final Logger log = LogManager.getLogger(interceptorLogging.class);



    @RequestMapping(method = RequestMethod.GET, path = masterAccounts, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Object> getAccounts(HttpServletRequest req, HttpServletResponse res) {

        List<Object> accountList = planService.getAccounts();
        return accountList;
    }


    @RequestMapping(method = RequestMethod.GET, path = planningAccounts, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Object> getPlanAccounts(HttpServletRequest req, HttpServletResponse res) {

        List<Object> planAccountList = planService.getPlanAccounts();
        return planAccountList;
    }

//    @PostMapping(path = addingPlans)
    @RequestMapping(method = RequestMethod.POST, value = addingPlans, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody SegmapAPIResponse addPlan(@RequestBody List<PlanModal> planModal, HttpServletRequest req,
                                                   HttpServletResponse res) {

        SegmapAPIResponse apiResponse = planService.addPlan(planModal);

        return apiResponse;
    }



}
