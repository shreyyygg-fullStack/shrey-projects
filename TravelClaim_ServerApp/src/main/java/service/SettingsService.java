package service;

import model.UpdateResponse;
import org.springframework.stereotype.Service;

@Service
public interface SettingsService {


//    saveorgInfo();
String getSettingData(Integer id);
String getActiveSettingData(Integer id);
//String getAllDepartmentList();
//String getAllActiveDepartmentList();
//
//String getAllDesignation();
//
//String getAllGrade();
//
//String getEmploymentSts();
//
//String getIshidaLocation();
//String getAllIRoleList();
UpdateResponse insertGlobalSettingData(Integer id, String name);
//UpdateResponse insertGlobalDepartment(String newDept);
//
//UpdateResponse insertGlobalDesignation(String newDeg);
//UpdateResponse insertGlobalNewGrade(String grade);
//UpdateResponse insertGlobalNewRole(String newRole);
//UpdateResponse insertGlobalNewLocation(String newLocation);
//UpdateResponse insertGlobalNewEmptSts(String newEmptSts);
UpdateResponse updateGlobalSettingData(Integer settingId,Integer tableId, String name, String isActive);
UpdateResponse updateGlobalDepartment(Integer id,String dept, String isActive);
UpdateResponse updateGlobalDesignation(Integer id,String Desg, String isActive);
UpdateResponse updateGlobalGrade(Integer sn,String grade, String isActive);
UpdateResponse updateGlobalRole(Integer id,String role, String isActive);

UpdateResponse updateGlobalIshidaLocation(Integer id,String location, String isActive);

UpdateResponse updateGlobalemploymentSts(Integer id,String empt, String isActive);

}
