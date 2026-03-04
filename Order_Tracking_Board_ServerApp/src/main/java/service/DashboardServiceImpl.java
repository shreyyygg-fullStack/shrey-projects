package service;

import configure.DBQUERY;
import mapper.IdashboardMapper;
import mapper.PollingServiceMapper;
import model.IDashboardMaster;
import model.PollingServiceFlag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@ComponentScan(basePackages = { "exception" })
@Service
public class DashboardServiceImpl implements DashboardService {
    DBQUERY dbQuery = new DBQUERY();
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<IDashboardMaster> getIDashboardMasterList1() {
        List<IDashboardMaster> list = new ArrayList<>();
        String sql1 = dbQuery.updateQueryIDashboardMasterAll();
        String sql2 = dbQuery.getQueryIDashboardMasterAll();
        try{
            int afftectedRow = jdbcTemplate.update(sql1);


            List<IDashboardMaster> rows = jdbcTemplate.query(sql2 , new IdashboardMapper());
            list = new ArrayList<>(rows);
        } catch (Exception exception){
            System.out.println(exception);
        }
        return list;
    }

    @Override
    public List<PollingServiceFlag> getPollingServiceFlag() {
        List<PollingServiceFlag> list = new ArrayList<>();
        String sql =  dbQuery.deleteQueryFordbM_audit();
        String sql1 = dbQuery.getQueryPollingSericeFlag();


        try {
            int afftectedRow = jdbcTemplate.update(sql);
            List<PollingServiceFlag> rows = jdbcTemplate.query(sql1, new PollingServiceMapper());
            list = new ArrayList<>(rows);

        } catch (Exception exception) {
            System.out.println(exception);

        }
        return list;
    }




}


