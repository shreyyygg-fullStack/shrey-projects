package Services;

import interceptor.interceptorLogging;
import model.PlanModal;
import model.SegmapAPIResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

@Service
public class PlanningServiceImple implements PlanningService{

    @Autowired
    private JdbcTemplate jdbcTemplate;


    static final Logger log = LogManager.getLogger(interceptorLogging.class);

    private static final String PlanIdSeqInit = "ACT";

    @Override
    public List<Object> getAccounts() {

        String sql = "SELECT * FROM segmap.segmap_master ORDER BY SN ASC";
        List<Object> accountList= new ArrayList<>();

        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            accountList = new ArrayList<>(rows);

            log.info("Master Accounts Fetched");

        }
        catch(Exception exc) {
            log.warn("ERROR fetching Master Accounts");
        }
        return accountList;
    }

    @Override
    public List<Object> getPlanAccounts() {

        String sql = "SELECT * FROM segmap.segmap_planning_sheet";
        List<Object> planAccountList= new ArrayList<>();

        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            planAccountList = new ArrayList<>(rows);

            log.info("Planning Accounts Fetched");

        }
        catch(Exception exc) {
            log.warn("ERROR fetching Planning Accounts");
        }
        return planAccountList;
    }

    @Override
    public SegmapAPIResponse addPlan(List<PlanModal>  planModal) {


        SegmapAPIResponse apiResponse = new SegmapAPIResponse();

        List<Object[]> batchPlanList = new ArrayList<Object[]>();
        try{
            int seqNo = 0;
            int year = Calendar.getInstance().get(Calendar.YEAR);  // to get current year.
            int month = Calendar.getInstance().get(Calendar.MONTH);  // to get current month.
            String yearString;                                        // for storing financial-year pattern   example- 21-22
            if(month>2){                                               // if month is greater than march
                yearString = String.valueOf(year).substring(2) + "-" + String.valueOf(year+1).substring(2);   // set financial year patter (year)-(year+1) eg. 22-21
            }
            else{
                yearString = String.valueOf(year-1).substring(2) + "-" + String.valueOf(year).substring(2);   // set financial year patter (year-1)-(year) eg. 21-22
            }
            String query = "select max(sn) as sn from segmap.segmap_planning_sheet";
            String id = (String)jdbcTemplate.queryForObject(query, String.class);
            if(id != null){   // which means there are some plans.
                if(!id.substring(4,9).equals(yearString)){   // not matched financial-year
                    seqNo = 0;
                }
                else{
                    seqNo = Integer.parseInt(id.substring(10));   // match financial-year
                }
            }
            String concatStringInit = PlanIdSeqInit;
            concatStringInit = concatStringInit+"-"+ yearString;
            String seqNoString;
            String idSeq;
            for(PlanModal plans: planModal) {
                if (plans.getP_type().equals("") || plans.getP_type().equals("null")) {
                    plans.setP_type(null);
                }
                if(plans.getP_date().equals("") || plans.getP_date().equals("null")) {
                    plans.setP_date(null);
                }

                if(plans.getKey_acc() == null ||plans.getKey_acc().equals("") || plans.getKey_acc().equals("null") ) {

                    plans.setKey_acc("NEW ACCOUNT");

                }

                seqNo++;
                seqNoString = String.valueOf(seqNo);
                while(seqNoString.length()!=5){
                    seqNoString = '0'+seqNoString;
                }
                idSeq = concatStringInit+ "-" + seqNoString;
                plans.setSn(idSeq);
                Object[] objectArray= {plans.getSn(), plans.getSegment_id(),plans.getP_type(), plans.getP_date(), plans.getRegion(), plans.getSales(), plans.getSalesPerson(), plans.getSegment(), plans.getState(), plans.getAccount(), plans.getAct(), plans.getRemarks(), plans.getKey_acc() };

                batchPlanList.add(objectArray);
            }
        }
        catch(Exception e){
            System.out.println(e);
            apiResponse.setAffectedRows(0);
            apiResponse.setMessage("Failed to add plans.");

            return apiResponse;
        }


        try {
            String sql= "  INSERT INTO `segmap`.`segmap_planning_sheet` (`sn`, `segment_id`,`p_type`, `p_date`, `region`,`sales`, `sales_person`, `segment`, `state`,`account`, `act`, `remarks`, `key_account`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
            int affectdRows[] = jdbcTemplate.batchUpdate(sql,batchPlanList);



            if (affectdRows.length>0) {
                apiResponse.setAffectedRows(1);
                apiResponse.setMessage(
                        "Plans has been added successfully.");
                log.info("Plans has been added successfully.");
            }
            else {
                apiResponse.setAffectedRows(0);
                apiResponse.setMessage(
                        "Failed to add plans");
                log.info("Failed to add plans.");
            }

        } catch (Exception e) {
            apiResponse.setAffectedRows(0);
            apiResponse.setMessage("Failed to add plans.");
            log.info("Failed to add plans with error.");
            System.out.println(e);

            return apiResponse;
        }
        return apiResponse;

    }




}
