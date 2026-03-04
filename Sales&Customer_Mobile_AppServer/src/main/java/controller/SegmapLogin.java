package controller;

import interceptor.interceptorLogging;
import jwttoken.JwtTokenUtil;
import model.LoginRequest;
import model.LoginResponse;
import model.LoginUserDetail;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class SegmapLogin {
    private static final String authenticate = "/authenticate";

    private static final String accountData = "/account-data";

    @Autowired
    private JdbcTemplate jdbcTemplate;
    JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
    static final Logger log = LogManager.getLogger(interceptorLogging.class);

    @RequestMapping(method = RequestMethod.POST, value = authenticate, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody LoginResponse authenticate2(@RequestBody LoginRequest loginRequest, HttpServletRequest req,
                                                     HttpServletResponse res) {

        System.out.println("Received login request - UserId: " + loginRequest.getUserId() + ", Password: " + loginRequest.getUserPwd());
        LoginResponse loginResponse = new LoginResponse();

        String userId = loginRequest.getUserId();
        String password = loginRequest.getUserPwd();

        String query = "SELECT * FROM segmap.iuseraccount WHERE USER_ID = ? AND PASSWORD = ? ";
        Object[] params = new Object[] { userId, password };

        try {

            List<LoginUserDetail> list = jdbcTemplate.query(query, params, new GetUserStatusRowMapper());

            if (list.isEmpty()) {
                loginResponse.setStatus("Failed");
            } else {

                loginResponse.setStatus("Success");
                loginResponse.setUserID(list.get(0).getUserID());
                loginResponse.setUserName(list.get(0).getUserName());
                loginResponse.setUserLoginStatus(list.get(0).getUserLoginStatus());
                loginResponse.setUserActiveStatus(list.get(0).getUserActiveStatus());
                loginResponse.setUserRole(list.get(0).getUserRole());
                loginResponse.setUserDepartment(list.get(0).getUserDepartment());
                loginResponse.setSalesMark(list.get(0).getSalesMark());
                loginResponse.setRegion(list.get(0).getRegion());
                loginResponse.setToken(jwtTokenUtil.generateToken(loginRequest, loginResponse));
                loginResponse.setEmail(list.get(0).getEmail());
                loginResponse.setDepartment(list.get(0).getDepartment());
                loginResponse.setDesignation(list.get(0).getDesignation());
                loginResponse.setTempPassword(list.get(0).getTempPassword());
                loginResponse.setPassword(list.get(0).getPassword());
                log.info("Succesfully Login");
            }

        } catch (Exception e) {
            log.warn("Error in Logging In");

        }

        return loginResponse;

    }


    @RequestMapping(method = RequestMethod.GET, path = accountData, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody List<Object> getAccountlist(HttpServletRequest req, HttpServletResponse res) {

        String sql = "SELECT * FROM segmap.iuseraccount";
        List<Object> accountList= new ArrayList<>();
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            accountList = new ArrayList<>(rows);

            log.info("fetched data");

        }
        catch(Exception exc) {
            log.warn("ERROR fetching data");
        }
        return accountList;
    }






    class GetUserStatusRowMapper implements RowMapper<LoginUserDetail> {

        LoginUserDetail loginuserdetail = new LoginUserDetail();

        public LoginUserDetail mapRow(ResultSet rs, int rowNum) throws SQLException {

            loginuserdetail.setUserID(rs.getString("USER_ID"));
            loginuserdetail.setUserName(rs.getString("USER_NAME"));
            loginuserdetail.setUserLoginStatus(rs.getString("LOGIN_STATUS"));
            loginuserdetail.setUserActiveStatus(rs.getString("ACTIVE_STATUS"));
            loginuserdetail.setUserRole(rs.getString("USER_ROLE"));
            loginuserdetail.setUserDepartment(rs.getString("DEPARTMENT"));
            loginuserdetail.setEmail(rs.getString("EMAIL"));
            loginuserdetail.setDepartment(rs.getString("DEPARTMENT"));
            loginuserdetail.setDesignation(rs.getString("DESIGNATION"));
            loginuserdetail.setSalesMark(rs.getString("sales_mark"));
            loginuserdetail.setRegion(rs.getString("region"));
            loginuserdetail.setTempPassword(rs.getString("TEMP_PASSWORD"));
            loginuserdetail.setPassword(rs.getString("PASSWORD"));
            return loginuserdetail;
        }

    }
}
