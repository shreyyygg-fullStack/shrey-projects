package configuration;

public class DbQuery {

    final String SIGNUP = "UPDATE iexpense.iuseraccounts SET EMP_PWD = ?, ENABLE_STS = 1 WHERE EMP_ID = ?";
    final String SETINVITEFLAG = "update iexpense.userdetails set INVITE = 1 where EMP_ID = ?";
    final String DELETETOKEN = "delete from iexpense.user_tokens where token = ?";
    final String CHECKEMPID = "SELECT EMP_ID FROM iexpense.iuseraccounts WHERE EMP_EMAIL = ?";
    final String saveOrgInfo = "UPDATE iexpense.organization SET COMPANY_NAME=?, COMPANY_ADDRESS=?, PHONE_NO=?, CITY=?, STATE=?,ZIP_CODE=?, COUNTRY=?,COMPANY_WEBSITE_NAME=?,APPLICATION_DOMAIN=?, PRIMARY_CONTACT_EMAIL=?, COMPANY_SUPPORT_EMAIL=?, BASE_CURRENCY=?, FISCAL_YEAR=?, DATE_FORMAT=? WHERE ID = 1";
    final String saveOrgInfo2 = "UPDATE iexpense.organization SET LOGO=? , COMPANY_NAME=?, COMPANY_ADDRESS=?, PHONE_NO=?, CITY=?, STATE=?,ZIP_CODE=?, COUNTRY=?,COMPANY_WEBSITE_NAME=?,APPLICATION_DOMAIN=?, PRIMARY_CONTACT_EMAIL=?, COMPANY_SUPPORT_EMAIL=?, BASE_CURRENCY=?, FISCAL_YEAR=?, DATE_FORMAT=? WHERE ID = 1";
    final String getOrgInfo = "SELECT * FROM iexpense.organization where ID=1";
    final String getUsersList = "SELECT * FROM iexpense.userdetails";
    final String getUser = "SELECT * FROM iexpense.userdetails WHERE EMP_ID = ?";
    final String addUser = "INSERT into iexpense.userdetails (EMP_ID, FIRST_NAME,MIDDLE_NAME, LAST_NAME, EMAIL_ADDRESS, MOBILE_NO, EMP_DESIGNATION, EMP_DEPARTMENT, REPORTING_TO, EMP_LOCATION, EMP_DOJ_DATE, EMP_STATUS ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    final String editUser = "UPDATE iexpense.userdetails SET  FIRST_NAME = ?,MIDDLE_NAME = ? , LAST_NAME = ?, EMAIL_ADDRESS = ?, MOBILE_NO = ?, EMP_DESIGNATION = ?, EMP_DEPARTMENT = ?, REPORTING_TO = ?, EMP_LOCATION = ?, EMP_DOJ_DATE = ?, EMP_STATUS = ? WHERE EMP_ID = ? ";
    final String deleteUser = "delete from iexpense.userdetails where EMP_ID = ? ";
    final String getDepartmentList = "SELECT * FROM iexpense.idepartment";
    final String queryTogetActiveDepartmentList = "SELECT * FROM iexpense.idepartment WHERE ACTIVE_STS = '1'";
    final String queryToGetDesignationList = "SELECT * FROM iexpense.idesignation";
    final String queryToGetAllGrade = "SELECT * FROM iexpense.igrades";
    final String queryToGetEmploymentSts = "SELECT * FROM iexpense.iemployment_status";
    final String  queryToGetIshidaLocation = "SELECT * FROM iexpense.ishida_location";
    final String queryToGetIshidaRoleList = "SELECT * FROM iexpense.iemp_role";

    final String queryToinsertIDepartment = "INSERT INTO iexpense.idepartment(DEPARTMENT) VALUES(?)";
    final String queryToinsertIDesignation = "INSERT INTO iexpense.idesignation(DESIGNATION) VALUES(?)";
    final String queryToinsertIGrade = "INSERT INTO iexpense.igrades(GRADE) VALUES(?)";
    final String queryToinsertIRole = "INSERT INTO iexpense.iemp_role(ROLE) VALUES(?)";
    final String queryToinsertIEmptSts = "INSERT INTO iexpense.iemployment_status(EMPLOYMENT_STATUS) VALUES(?)";
    final String queryToCheckIshidaLocation = "SELECT COUNT(*) FROM iexpense.ishida_location WHERE LOWER(LOCATION) = LOWER(?)";
    final String queryToCheckEmtSts = "SELECT COUNT(*) FROM iexpense.iemployment_status WHERE LOWER(EMPLOYMENT_STATUS) = LOWER(?)";
    final String queryToCheckIGrade = "SELECT COUNT(*) FROM iexpense.igrades WHERE LOWER(GRADE) = LOWER(?)";
    final String queryToCheckIRole = "SELECT COUNT(*) FROM iexpense.iemp_role WHERE LOWER(ROLE) = LOWER(?)";
    final String queryToCHeckIDesignation = "SELECT COUNT(*) FROM iexpense.idesignation WHERE LOWER(DESIGNATION) = LOWER(?)";
    final String queryToCheckIDepartment = "SELECT COUNT(*) FROM iexpense.idepartment WHERE LOWER(DEPARTMENT) = LOWER(?)";
    final String queryToinsertIshidaLocation = "INSERT INTO iexpense.ishida_location(LOCATION) VALUES(?)";
    final String queryTogetDeptById = "SELECT DEPARTMENT FROM iexpense.idepartment WHERE ID = ?";
    final String queryTogetDesgById = "SELECT DESIGNATION FROM iexpense.idesignation WHERE ID = ?";
    final String queryTogetGradeById = "SELECT GRADE FROM iexpense.igrades WHERE SN = ?";
    final String queryTogetRoleById = "SELECT ROLE FROM iexpense.iemp_role WHERE ID = ?";
    final String queryTogetLocationById =  "SELECT LOCATION FROM iexpense.ishida_location WHERE ID = ?";
    final String queryTogetemploymentById = "SELECT EMPLOYMENT_STATUS FROM iexpense.iemployment_status WHERE ID = ?";

    final String queryToUpdateIDepartment = "UPDATE iexpense.idepartment SET DEPARTMENT = ?,  ACTIVE_STS = ? WHERE ID = ? ";

    final String queryToupdateIDesignation = "UPDATE iexpense.idesignation SET DESIGNATION = ?,  ACTIVE_STS = ? WHERE ID = ? ";
    final String queryToupdateIGrade = "UPDATE iexpense.igrades SET GRADE = ?,   ACTIVE_STS = ? WHERE SN = ? ";
    final String queryToupdateIRole = "UPDATE iexpense.iemp_role SET ROLE = ?, ACTIVE_STS = ? WHERE ID = ? ";
    final String queryToupdateIshidaLocation = "UPDATE iexpense.ishida_location SET LOCATION = ?,  ACTIVE_STS = ? WHERE ID = ? ";
    final String queryToupdateIEmptSts = "UPDATE iexpense.iemployment_status SET EMPLOYMENT_STATUS = ?,  ACTIVE_STS = ? WHERE ID = ? ";

    final String getGradesList = "SELECT * FROM iexpense.igrades";
    final String saveAllowanceData = "INSERT INTO iexpense.allowance (GRADE, HS1, HS2, HS3, DDA, DFA, ODA, OFA)\n" +
            "    VALUES (?,?,?,?,?,?,?,?)\n" +
            "    ON DUPLICATE KEY UPDATE\n" +
            "      HS1 = VALUES(HS1),\n" +
            "      HS2 = VALUES(HS2),\n" +
            "      HS3 = VALUES(HS3),\n" +
            "      DDA = VALUES(DDA),\n" +
            "      DFA = VALUES(DFA),\n" +
            "      ODA = VALUES(ODA),\n" +
            "      OFA = VALUES(OFA);";
    final String getAllowanceData = "SELECT * FROM iexpense.allowance";
    final String deleteAllowanceRow = "delete from iexpense.allowance where GRADE = ? ";
    final String getToken = "SELECT * FROM iexpense.user_tokens WHERE token = ?";
    final String insertToken = "INSERT INTO iexpense.user_tokens (email, token, expiry_time, type) VALUES (?, ?, ?, ?)";

    public String getInsertToken() {
        return insertToken;
    }

    public String getSaveOrgInfo() {
        return saveOrgInfo;
    }

    public String getSaveOrgInfo2() {
        return saveOrgInfo2;
    }

    public String getGetOrgInfo() {
        return getOrgInfo;
    }

    public String getGetUsersList() {
        return getUsersList;
    }

    public String getGetUser() {
        return getUser;
    }

    public String getAddUser() {
        return addUser;
    }

    public String getEditUser() {
        return editUser;
    }

    public String getDeleteUser() {
        return deleteUser;
    }

    public String getGetDepartmentList() {
        return getDepartmentList;
    }
    public String getActiveDepartmentList() {
        return queryTogetActiveDepartmentList;
    }

    public String getGetDesignationList() {
        return queryToGetDesignationList;
    }

    public String getAllGrade() {
        return queryToGetAllGrade;
    }

    public String getEmploymentSts() {
        return queryToGetEmploymentSts;
    }
    public String getIshidaLocation() {
        return queryToGetIshidaLocation;
    }
    public String getIshidaRoleList() {
        return queryToGetIshidaRoleList;
    }

    public String insertIDepartment() {
        return queryToinsertIDepartment;
    }
    public String insertIDesignation() {
        return queryToinsertIDesignation;
    }
    public String insertIGrade() {
        return queryToinsertIGrade;
    }
    public String insertIRole() {
        return queryToinsertIRole;
    }

    public String insertIEmptSts() {
        return queryToinsertIEmptSts;
    }
    public String checkIshidaLocation() {
        return queryToCheckIshidaLocation;
    }
    public String CheckEmtSts() {
        return queryToCheckEmtSts;
    }
    public String CheckIGrade() {
        return queryToCheckIGrade;
    }
    public String CheckIRole() {
        return queryToCheckIRole;
    }

    public String CheckIDesignation() {
        return queryToCHeckIDesignation;
    }
    public String CheckIDepartment() {
        return queryToCheckIDepartment;
    }

    public String insertIshidaLocation() {
        return queryToinsertIshidaLocation;
    }
    public String getDeptById() {
        return queryTogetDeptById;
    }
    public String getDesgById() {
        return queryTogetDesgById;
    }
    public String getGradeById() {
        return queryTogetGradeById;
    }
    public String getRoleById() {
        return queryTogetRoleById;
    }
    public String getLocationById() {
        return queryTogetLocationById;
    }
    public String getemploymentById() {
        return queryTogetemploymentById;
    }









    public String updateIDepartment(){
        return queryToUpdateIDepartment;
    }

    public String updateIDesignation(){
        return queryToupdateIDesignation;
    }

    public String updateIGrade(){
        return queryToupdateIGrade;
    }
    public String updateIRole(){
        return queryToupdateIRole;
    }


    public String updateIshidaLocation(){
        return queryToupdateIshidaLocation;
    }

    public String updateIEmptSts(){
        return queryToupdateIEmptSts;
    }
















    public String getGetGradesList() {
        return getGradesList;
    }

    public String getSaveAllowanceData() {
        return saveAllowanceData;
    }

    public String getGetAllowanceData() {
        return getAllowanceData;
    }

    public String getDeleteAllowanceRow() {
        return deleteAllowanceRow;
    }

    public String getGetToken() {
        return getToken;
    }


    public String getDELETETOKEN() {
        return DELETETOKEN;
    }

    public String getSIGNUP() {
        return SIGNUP;
    }

    public String getSETINVITEFLAG() {
        return SETINVITEFLAG;
    }

    public String getCHECKEMPID() {
        return CHECKEMPID;
    }


}
