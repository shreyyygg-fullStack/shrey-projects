package mapper;

import model.IDashboardMaster;
import model.PollingServiceFlag;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class PollingServiceMapper implements RowMapper<PollingServiceFlag> {

    @Override
    public PollingServiceFlag mapRow(ResultSet rs, int rowNum) throws SQLException {
        PollingServiceFlag serviceFlag = new PollingServiceFlag();
        serviceFlag.setId(rs.getInt("ID"));
        serviceFlag.setIschangeflag(rs.getInt("UPFLAG"));
        serviceFlag.setIndentNo(rs.getString("INDENT_NO"));
        serviceFlag.setStatusFlag(rs.getInt("STATUS_FLAG"));
        serviceFlag.setMessage(rs.getString("MESSAGE"));
        serviceFlag.setUpdatedOn(rs.getString("UPDATED_ON"));



        return serviceFlag;
    }
}