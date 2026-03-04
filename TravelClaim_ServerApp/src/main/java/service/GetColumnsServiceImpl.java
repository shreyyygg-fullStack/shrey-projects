package service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class GetColumnsServiceImpl implements GetColumnsService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

   public List<Map<String, Object>> getSelectedColumns(List<String> columns){

       String columnString = String.join(", ", columns);
       String query = "SELECT " + columnString + " FROM iexpense.all_claims";

       return jdbcTemplate.queryForList(query);

    }

}
