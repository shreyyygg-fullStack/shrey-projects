package service;

import configuration.DbQuery;
import encrypt.AES;
import model.UpdateResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
@Service
public class SettingsServiceImpl implements SettingsService{

    DbQuery dbQuery = new DbQuery();
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public String getSettingData(Integer id) {
        List<Object> settingList = new ArrayList<>();
        String encryptedData = null;

        try {
            String sql = DynamicQueryGenerator.SelectAllDataQuery(id);
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            settingList = new ArrayList<>(rows);

            // Encrypt the data
            encryptedData = AES.encryptData(settingList);

        } catch (Exception exc) {
            exc.printStackTrace();
        }

        return encryptedData;
    }

    @Override
    public String getActiveSettingData(Integer id) {
        List<Object> settingActiveList = new ArrayList<>();
        String encryptedData = null;

        try {
            String sql = DynamicQueryGenerator.SelectAllActiveDataQuery(id);
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            settingActiveList = new ArrayList<>(rows);

            // Encrypt the data
            encryptedData = AES.encryptData(settingActiveList);

        } catch (Exception exc) {
            exc.printStackTrace();
        }

        return encryptedData;
    }


//    @Override
//    public String getAllDepartmentList() {
//
//        List<Object> departmentList = new ArrayList<>();
//        String sql = dbQuery.getGetDepartmentList();
//        String encryptedData = null;
//
//        try {
//            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
//            departmentList = new ArrayList<>(rows);
//            // Encrypt the data
//            encryptedData = AES.encryptData(departmentList);
//
//        } catch (Exception exc) {
//
//        }
//        return encryptedData;
//
//    }

//    @Override
//    public String getAllActiveDepartmentList() {
//        List<Object> activeDepartmentList = new ArrayList<>();
//        String sql = dbQuery.getActiveDepartmentList();
//        String encryptedData = null;
//
//        try {
//            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
//            activeDepartmentList = new ArrayList<>(rows);
//            // Encrypt the data
//            encryptedData = AES.encryptData(activeDepartmentList);
//
//        } catch (Exception exc) {
//
//        }
//        return encryptedData;
//    }

//    @Override
//    public String getAllDesignation() {
//
//        List<Object> designationList = new ArrayList<>();
//        String sql = dbQuery.getGetDesignationList();
//        String encryptedData = null;
//
//        try {
//            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
//            designationList = new ArrayList<>(rows);
//            // Encrypt the data
//            encryptedData = AES.encryptData(designationList);
//
//        } catch (Exception exc) {
//
//        }
//        return encryptedData;
//
//    }

//    @Override
//    public String getAllGrade() {
//        List<Object> gradeList = new ArrayList<>();
//        String sql = dbQuery.getAllGrade();
//        String encryptedData = null;
//
//        try {
//            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
//            gradeList = new ArrayList<>(rows);
//            // Encrypt the data
//            encryptedData = AES.encryptData(gradeList);
//
//        } catch (Exception exc) {
//
//        }
//        return encryptedData;
//    }

//    @Override
//    public String getEmploymentSts() {
//        List<Object> employmentList = new ArrayList<>();
//        String sql = dbQuery.getEmploymentSts();
//        String encryptedData = null;
//
//        try {
//            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
//            employmentList = new ArrayList<>(rows);
//            // Encrypt the data
//            encryptedData = AES.encryptData(employmentList);
//
//        } catch (Exception exc) {
//            System.out.println(exc);
//        }
//        return encryptedData;
//    }

//    @Override
//    public String getIshidaLocation() {
//        List<Object> ishidaLocationList = new ArrayList<>();
//        String sql = dbQuery.getIshidaLocation();
//        String encryptedData = null;
//
//        try {
//            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
//            ishidaLocationList = new ArrayList<>(rows);
//            // Encrypt the data
//            encryptedData = AES.encryptData(ishidaLocationList);
//
//        } catch (Exception exc) {
//            System.out.println(exc);
//        }
//        return encryptedData;
//    }

//    @Override
//    public String getAllIRoleList() {
//        List<Object> ishidaRoleList = new ArrayList<>();
//        String sql = dbQuery.getIshidaRoleList();
//        String encryptedData = null;
//
//        try {
//            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
//            ishidaRoleList = new ArrayList<>(rows);
//            // Encrypt the data
//            encryptedData = AES.encryptData(ishidaRoleList);
//
//        } catch (Exception exc) {
//            System.out.println(exc);
//        }
//        return encryptedData;
//    }

    public Integer checkSettingData(Integer id, String name){
        String newValue = name.trim();
        String checkSql = DynamicQueryGenerator.CheckSettingDataQuery(id);
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, newValue);
        return  count;
    }



    @Override
    public UpdateResponse insertGlobalSettingData(Integer id, String name) {
        UpdateResponse updateresp = new UpdateResponse();

        if (name == null || name.trim().isEmpty()) {
            updateresp.setAffectedRows(0);
            System.out.println("Cannot add empty setting data");
            return updateresp;
        }

        // Check if data already exists
        Integer count = this.checkSettingData(id, name);

        if (count > 0) {
            updateresp.setAffectedRows(0);
            System.out.println("Data already exists");
        } else {
            // Insert the new department
            String insertSql = DynamicQueryGenerator.insertQuery(id);
            int result = jdbcTemplate.update(insertSql, name);
            if (result > 0) {
                updateresp.setAffectedRows(1);
                System.out.println("Setting Data added successfully");
            } else {
                updateresp.setAffectedRows(0);
                System.out.println("Failed to add Setting Data");
            }
        }

        return updateresp;
    }

//    @Override
//    public UpdateResponse insertGlobalDepartment(String department) {
//        String dept = department.trim();
//        UpdateResponse updateresp = new UpdateResponse();
//        String sql = dbQuery.insertIDepartment();
//
//        int result = jdbcTemplate.update(sql, department);
//
//        if (result > 0) {
//            updateresp.setAffectedRows(1);
//            System.out.println("Department added Successfully");
//        }
//
//
//
//        return updateresp;
//    }

    public Integer checkIshidaLocation(String newLocation){
        String location = newLocation.trim();
        String checkSql = dbQuery.checkIshidaLocation();
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, location);
        return  count;
    }

    public Integer checkEmploymentSts(String empt){
        String newEmpt = empt.trim();
        String checkSql = dbQuery.CheckEmtSts();
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, newEmpt);
        return  count;
    }

    public Integer checkGlobalDepartment(String newDept){
        String dept = newDept.trim();
        String checkSql = dbQuery.CheckIDepartment();
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, dept);
        return  count;
    }

    public Integer checkGlobalDesignation(String newDeg){
        String newDesignation = newDeg.trim();
        String checkSql = dbQuery.CheckIDesignation();
        Integer count = jdbcTemplate.queryForObject(checkSql,Integer.class, newDesignation);
        return  count;
    }

    public Integer checkGlobalIGrade(String grade){
        String newGrade = grade.trim();
        String checkSql = dbQuery.CheckIGrade();
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, newGrade);
        return  count;
    }

//    @Override
//    public UpdateResponse insertGlobalDepartment(String newDept) {
//
//        UpdateResponse updateresp = new UpdateResponse();
//
//
//        // Check if the department already exists
//        Integer count = this.checkGlobalDepartment(newDept);
//
//        if (count > 0) {
//            updateresp.setAffectedRows(0);
//            System.out.println("Department already exists");
//        } else {
//            // Insert the new department
//            String insertSql = dbQuery.insertIDepartment();
//            int result = jdbcTemplate.update(insertSql, newDept);
//            if (result > 0) {
//                updateresp.setAffectedRows(1);
//                System.out.println("Department added successfully");
//            } else {
//                updateresp.setAffectedRows(0);
//                System.out.println("Failed to add department");
//            }
//        }
//
//        return updateresp;
//    }



//    @Override
//    public UpdateResponse insertGlobalDesignation(String newDeg) {
//
//        UpdateResponse updateresp = new UpdateResponse();
//        Integer count = this.checkGlobalDesignation(newDeg);
//
//        if (count > 0) {
//            updateresp.setAffectedRows(0);
//            System.out.println("Designation already exists");
//        } else {
//            // Insert the new department
//            String insertSql = dbQuery.insertIDesignation();
//            int result = jdbcTemplate.update(insertSql, newDeg);
//            if (result > 0) {
//                updateresp.setAffectedRows(1);
//                System.out.println("Designation added successfully");
//            } else {
//                updateresp.setAffectedRows(0);
//                System.out.println("Failed to add Designation");
//            }
//        }
//
//        return updateresp;
//    }



//    @Override
//    public UpdateResponse insertGlobalNewGrade(String grade) {
//
//        UpdateResponse updateresp = new UpdateResponse();
//
//        Integer count = this.checkGlobalIGrade(grade);
//
//        if (count > 0) {
//            updateresp.setAffectedRows(0);
//            System.out.println("Grade already exists");
//        } else {
//            // Insert the new department
//            String insertSql = dbQuery.insertIGrade();
//            int result = jdbcTemplate.update(insertSql, grade);
//            if (result > 0) {
//                updateresp.setAffectedRows(1);
//                System.out.println("Grade added successfully");
//            } else {
//                updateresp.setAffectedRows(0);
//                System.out.println("Failed to add Grade");
//            }
//        }
//
//        return updateresp;
//    }

    public Integer checkGlobalIRole(String newRole){
        String role = newRole.trim();
        String checkSql = dbQuery.CheckIRole();
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, role);
        return  count;
    }

//    @Override
//    public UpdateResponse insertGlobalNewRole(String newRole) {
//
//        UpdateResponse updateresp = new UpdateResponse();
//
//        Integer count = this.checkGlobalIRole(newRole);
//
//        if (count > 0) {
//            updateresp.setAffectedRows(0);
//            System.out.println("Role already exists");
//        } else {
//            // Insert the new role
//            String insertSql = dbQuery.insertIRole();
//            int result = jdbcTemplate.update(insertSql, newRole);
//            if (result > 0) {
//                updateresp.setAffectedRows(1);
//                System.out.println("Role added successfully");
//            } else {
//                updateresp.setAffectedRows(0);
//                System.out.println("Failed to add Role");
//            }
//        }
//
//        return updateresp;
//    }

//    @Override
//    public UpdateResponse insertGlobalNewLocation(String newLocation) {
//
//        UpdateResponse updateresp = new UpdateResponse();
//        Integer count = this.checkIshidaLocation(newLocation);
//
//        if (count > 0) {
//            updateresp.setAffectedRows(0);
//            System.out.println("Location already exists");
//        } else {
//            // Insert the new location
//            String insertSql = dbQuery.insertIshidaLocation();
//            int result = jdbcTemplate.update(insertSql, newLocation);
//            if (result > 0) {
//                updateresp.setAffectedRows(1);
//                System.out.println("Location added successfully");
//            } else {
//                updateresp.setAffectedRows(0);
//                System.out.println("Failed to add Location");
//            }
//        }
//
//        return updateresp;
//    }



//    @Override
//    public UpdateResponse insertGlobalNewEmptSts(String newEmptSts) {
//        UpdateResponse updateresp = new UpdateResponse();
//        // Check if the employment sts already exists
//        Integer count = this.checkEmploymentSts(newEmptSts);
//
//        if (count > 0) {
//            updateresp.setAffectedRows(0);
//            System.out.println("Employment status already exists");
//        } else {
//            // Insert the new empt
//            String insertSql = dbQuery.insertIEmptSts();
//            int result = jdbcTemplate.update(insertSql, newEmptSts);
//            if (result > 0) {
//                updateresp.setAffectedRows(1);
//                System.out.println("Employment status added successfully");
//            } else {
//                updateresp.setAffectedRows(0);
//                System.out.println("Failed to add Employment status");
//            }
//        }
//
//        return updateresp;
//    }

    public String checkSettingDataNameChanged(Integer settingId, Integer tableId){
        String checkSql = DynamicQueryGenerator.isSettingDataChangedQuery(settingId);
        String existingName = jdbcTemplate.queryForObject(checkSql, String.class, tableId);
        return  existingName;
    }

    @Override
    public UpdateResponse updateGlobalSettingData(Integer settingId, Integer tableId, String name, String isActive) {
        UpdateResponse updateresp = new UpdateResponse();
        String ExistingName = this.checkSettingDataNameChanged(settingId,tableId);
        boolean isNameChanged =  name != null && !ExistingName.trim().equalsIgnoreCase(name.trim());

        if (isNameChanged) {
            Integer count = this.checkSettingData(settingId,name);
            if (count > 0) {
                updateresp.setAffectedRows(0);
                System.out.println(" Setting Data already exists");
                return updateresp;
            }
        }

        String Sql = DynamicQueryGenerator.updateGlobalSettingQuery(settingId);
        int result = jdbcTemplate.update(Sql, name, isActive, tableId);
        if (result > 0) {
            updateresp.setAffectedRows(1);
            System.out.println("Setting Data updated successfully");
        } else {
            updateresp.setAffectedRows(0);
            System.out.println("Failed to updated Setting Data");
        }

        return updateresp;
    }

    @Override
    public UpdateResponse updateGlobalDepartment(Integer id,String dept, String isActive) {

        UpdateResponse updateresp = new UpdateResponse();
        String queryGetDept = dbQuery.getDeptById();
        String existingDept = jdbcTemplate.queryForObject(queryGetDept, String.class, id);
        boolean isDeptChanged =  dept != null && !existingDept.trim().equalsIgnoreCase(dept.trim());

        if (isDeptChanged) {
            Integer count = this.checkGlobalDepartment(dept);
            if (count > 0) {
                updateresp.setAffectedRows(0);
                System.out.println("Designation already exists");
                return updateresp;
            }
        }

            // Insert the new department
            String Sql = dbQuery.updateIDepartment();
            int result = jdbcTemplate.update(Sql, dept, isActive, id);
            if (result > 0) {
                updateresp.setAffectedRows(1);
                System.out.println("Department updated successfully");
            } else {
                updateresp.setAffectedRows(0);
                System.out.println("Failed to updated department");
            }

        return updateresp;
    }

    @Override
    public UpdateResponse updateGlobalDesignation(Integer id,String Desg, String isActive) {
        UpdateResponse updateresp = new UpdateResponse();

        String queryGetDesg =  dbQuery.getDesgById();
        String existingDesg = jdbcTemplate.queryForObject(queryGetDesg, String.class, id);
        boolean isDesgChanged =  Desg != null && !existingDesg.trim().equalsIgnoreCase(Desg.trim());

        if (isDesgChanged) {
            Integer count = this.checkGlobalDesignation(Desg);
            if (count > 0) {
                updateresp.setAffectedRows(0);
                System.out.println("Designation already exists");
                return updateresp;
            }
        }
            String Sql = dbQuery.updateIDesignation();
            int result = jdbcTemplate.update(Sql, Desg, isActive, id);
            if (result > 0) {
                updateresp.setAffectedRows(1);
                System.out.println("Designation updated successfully");
            } else {
                updateresp.setAffectedRows(0);
                System.out.println("Failed to updated Designation");
            }



        return updateresp;
    }

    @Override
    public UpdateResponse updateGlobalGrade(Integer sn,String grade, String isActive) {
        UpdateResponse updateresp = new UpdateResponse();

        String queryGrade = dbQuery.getGradeById();
        String existingGrade = jdbcTemplate.queryForObject(queryGrade, String.class, sn);
        boolean isGradeChanged =  grade != null && !existingGrade.trim().equalsIgnoreCase(grade.trim());

        if (isGradeChanged) {
            Integer count = this.checkGlobalIGrade(grade);
            if (count > 0) {
                updateresp.setAffectedRows(0);
                System.out.println("Grade already exists");
                return updateresp;
            }
        }


            String Sql = dbQuery.updateIGrade();
            int result = jdbcTemplate.update(Sql, grade, isActive, sn);
            if (result > 0) {
                updateresp.setAffectedRows(1);
                System.out.println("Grade updated successfully");
            } else {
                updateresp.setAffectedRows(0);
                System.out.println("Failed to updated Grade");
            }


        return updateresp;
    }

    @Override
    public UpdateResponse updateGlobalRole(Integer id, String role, String isActive) {
        UpdateResponse updateresp = new UpdateResponse();

        String getQueryRole = dbQuery.getRoleById();
        String existingRole = jdbcTemplate.queryForObject(getQueryRole, String.class, id);
        boolean isRoleChanged =  role != null && !existingRole.trim().equalsIgnoreCase(role.trim());

        if (isRoleChanged) {
            Integer count = this.checkGlobalIRole(role);
            if (count > 0) {
                updateresp.setAffectedRows(0);
                System.out.println("Role already exists");
                return updateresp;
            }
        }
            String Sql = dbQuery.updateIRole();
            int result = jdbcTemplate.update(Sql, role, isActive, id);
            if (result > 0) {
                updateresp.setAffectedRows(1);
                System.out.println("Role updated successfully");
            } else {
                updateresp.setAffectedRows(0);
                System.out.println("Failed to updated Role");
            }
        return updateresp;
    }

    @Override
    public UpdateResponse updateGlobalIshidaLocation(Integer id,String location, String isActive) {
        UpdateResponse updateresp = new UpdateResponse();
        String getQueryLocation = dbQuery.getLocationById();
        String existingLocation = jdbcTemplate.queryForObject(getQueryLocation, String.class, id);
        boolean isLocationChanged =  location != null && !existingLocation.trim().equalsIgnoreCase(location.trim());

        if (isLocationChanged) {
            // Step 3: Check if new location already exists in DB
            Integer count = this.checkIshidaLocation(location);

            if (count > 0) {
                updateresp.setAffectedRows(0);
                System.out.println("Location already exists");
                return updateresp;
            }
        }

        // Step 4: Update either location, isActive, or both
        String Sql = dbQuery.updateIshidaLocation();
        int result = jdbcTemplate.update(Sql, location, isActive, id);
        if (result > 0) {
            updateresp.setAffectedRows(1);
            System.out.println("Location updated successfully");
        } else {
            updateresp.setAffectedRows(0);
            System.out.println("Failed to update location");
        }

        return updateresp;
    }

    @Override
    public UpdateResponse updateGlobalemploymentSts(Integer id,String empt, String isActive) {
        UpdateResponse updateresp = new UpdateResponse();

        String getQueryEmpt = dbQuery.getemploymentById();
        String existingEmpt = jdbcTemplate.queryForObject(getQueryEmpt, String.class, id);
        boolean isEmptChanged =  empt != null && !existingEmpt.trim().equalsIgnoreCase(empt.trim());

        if (isEmptChanged) {
            // Step 3: Check if new empt already exists in DB
            Integer count = this.checkEmploymentSts(empt);

            if (count > 0) {
                updateresp.setAffectedRows(0);
                System.out.println("Employment already exists");
                return updateresp;
            }
        }

            String Sql = dbQuery.updateIEmptSts();
            int result = jdbcTemplate.update(Sql, empt, isActive, id);
            if (result > 0) {
                updateresp.setAffectedRows(1);
                System.out.println("employment updated successfully");
            } else {
                updateresp.setAffectedRows(0);
                System.out.println("Failed to updated employment");
            }

        return updateresp;
    }

}
