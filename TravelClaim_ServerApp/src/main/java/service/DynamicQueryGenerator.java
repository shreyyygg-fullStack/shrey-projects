package service;

import model.SettingTableInfo;

import java.util.HashMap;
import java.util.Map;

public class DynamicQueryGenerator {

    private static final Map<Integer, SettingTableInfo> tableMap = new HashMap<>();
    static {
        tableMap.put(1, new SettingTableInfo("iexpense.idepartment", "DEPARTMENT", "ACTIVE_STS"));
        tableMap.put(2, new SettingTableInfo("iexpense.idesignation", "DESIGNATION", "ACTIVE_STS"));
        tableMap.put(3, new SettingTableInfo("iemployment_status", "EMPLOYMENT_STATUS", "ACTIVE_STS"));
        tableMap.put(4, new SettingTableInfo("iexpense.igrades", "GRADE", "ACTIVE_STS"));
        tableMap.put(5, new SettingTableInfo("iexpense.ishida_location", "LOCATION", "ACTIVE_STS"));
        tableMap.put(6, new SettingTableInfo("iexpense.ishida_role", "ROLE", "ACTIVE_STS"));
    }



    // Get table name by ID
//    public static String getTableNameById(Integer id) {
//        tableMap.put(1, "iexpense.idepartment");
//        tableMap.put(2, "iexpense.idesignation");
//        tableMap.put(3, "iemployment_status");
//        tableMap.put(4, "iexpense.igrades");
//        tableMap.put(5, "iexpense.ishida_location");
//        tableMap.put(6, "iexpense.ishida_role");
//        return tableMap.get(id);
//    }

    public static String getTableNameById(Integer id) {
        SettingTableInfo info = tableMap.get(id);
        return (info != null) ? info.getTableName() : null;
    }


//    public static String SelectAllDataQuery(Integer id) {
//        String tableName = getTableNameById(id);
//        if (tableName != null && !tableName.isEmpty()) {
//            return "SELECT * FROM " + tableName;
//        } else {
//            throw new IllegalArgumentException("Table name not found for id: " + id);
//        }
//    }

    public static String SelectAllDataQuery(Integer id) {
        SettingTableInfo info = tableMap.get(id);
        if (info != null) {
            return "SELECT * FROM " + info.getTableName();
        } else {
            throw new IllegalArgumentException("Table name not found for id: " + id);
        }
    }

    public static String SelectAllActiveDataQuery(Integer id) {
        SettingTableInfo info = tableMap.get(id);
        if (info != null) {
            return "SELECT * FROM " + info.getTableName() + " WHERE ACTIVE_STS = '1'";
        } else {
            throw new IllegalArgumentException("Table name not found for id: " + id);
        }
    }

    public static String insertQuery(Integer id) {
        SettingTableInfo info = tableMap.get(id);
        if (info != null) {
            return String.format("INSERT INTO %s (%s) VALUES (?)",
                    info.getTableName(), info.getColumn1());
        } else {
            throw new IllegalArgumentException("Invalid ID, no mapping found.");
        }
    }

    public static String updateGlobalSettingQuery(Integer settingId) {
        SettingTableInfo info = tableMap.get(settingId);
        if (info != null) {
            return String.format("UPDATE  %s SET %s = ?, %s = ? WHERE ID = ?",
                    info.getTableName(), info.getColumn1(), info.getColumn2());
        } else {
            throw new IllegalArgumentException("Invalid ID, no mapping found.");
        }
    }


    public static String CheckSettingDataQuery(Integer id) {
        SettingTableInfo info = tableMap.get(id);
        if (info != null) {
            return String.format("SELECT COUNT(*) FROM %s WHERE LOWER(%s) = LOWER(?)",
                    info.getTableName(), info.getColumn1());
        } else {
            throw new IllegalArgumentException("Invalid ID, no mapping found.");
        }
    }

    public static String isSettingDataChangedQuery(Integer settingId) {
        SettingTableInfo info = tableMap.get(settingId);
        if (info != null) {
            return String.format("SELECT %s FROM %s WHERE ID = ?",
                    info.getColumn1(),info.getTableName());
        } else {
            throw new IllegalArgumentException("Invalid ID, no mapping found.");
        }
    }



}
