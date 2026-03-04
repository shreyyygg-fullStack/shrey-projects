package configure;

public class DBQUERY {

//    final String ueryIDashboardMasterAll = "SELECT db_master.*,\n" +
//            "                   iuserregion.region AS region,\n" +
//            "                   iuserpayment.pmt_sts AS payment_sts, \n" +
//            "                   iuserdelevery.del_sts AS delevery_sts \n" +
//            "                 FROM iboard.db_master db_master\n" +
//            "                LEFT JOIN iboard.iuserregion iuserregion ON db_master.sales1_id = iuserregion.id\n" +
//            "                LEFT JOIN iboard.iuserpayment iuserpayment ON db_master.pmt_sts = iuserpayment.id \n" +
//            "            LEFT JOIN iboard.iuserdelevery iuserdelevery ON db_master.del_sts = iuserdelevery.id  WHERE db_master.del_sts != \"D-0\"\n" +
//            "                ORDER BY  db_master.priority_position, db_master.priority_type";

    final String ueryIDashboardMasterAll = "SELECT db_master.*,\n" +

            "                   iuserpayment.pmt_sts AS payment_sts, \n" +
            "                   iuserdelevery.del_sts AS delevery_sts \n" +
            "                 FROM iboard.db_master db_master\n" +
            "                LEFT JOIN iboard.iuserpayment iuserpayment ON db_master.pmt_sts = iuserpayment.id \n" +
            "            LEFT JOIN iboard.iuserdelevery iuserdelevery ON db_master.del_sts = iuserdelevery.id  WHERE db_master.del_sts != \"D-0\"\n" +
            "                ORDER BY  db_master.priority_position, db_master.priority_type";

    final String updateIDashboardMasterAll = "UPDATE iboard.db_master " +
            "SET priority_type = CASE " +
            "    WHEN (DATEDIFF(CURDATE(), exf1) > 0 OR DATEDIFF(CURDATE(), prod_date) > 0) THEN 1 " +
            "    ELSE 2 " +
            "END " +
            "WHERE del_sts = 'D-1' ";



//    final  String getQueryPollingSericeflag = "SELECT update_event.ID, update_event.UPFLAG, db_master_audit.INDENT_NO,  db_master_audit.STATUS_FLAG, db_master_audit.MESSAGE, db_master_audit.UPDATED_ON" +
//            " FROM iboard.update_event update_event, " +
//            " (SELECT INDENT_NO, STATUS_FLAG, MESSAGE , UPDATED_ON FROM iboard.db_master_audit ORDER BY ID DESC LIMIT 1) AS db_master_audit";

    final String getQueryPollingSericeflag = "SELECT update_event.ID, update_event.UPFLAG,  " +
            "    db_master_audit.INDENT_NO AS INDENT_NO,  " +
            "    db_master_audit.STATUS_FLAG AS STATUS_FLAG, " +
            "    db_master_audit.MESSAGE AS MESSAGE, " +
            "    db_master_audit.UPDATED_ON AS UPDATED_ON " +
            "FROM iboard.update_event update_event " +
            "LEFT JOIN (" +
            "    SELECT INDENT_NO, STATUS_FLAG, MESSAGE, UPDATED_ON " +
            "    FROM iboard.db_master_audit  " +
            "    WHERE ID = (SELECT MAX(ID) FROM iboard.db_master_audit) " +
            ") AS db_master_audit " +
            "ON TRUE";







    final String getdeleteQueryFordbM_audit = "delete from iboard.db_master_audit where UPDATED_ON < (SELECT DATE_SUB(now(), INTERVAL 30 DAY))";

    public String getQueryIDashboardMasterAll() {
        return ueryIDashboardMasterAll;
    }
    public String updateQueryIDashboardMasterAll() {
        return updateIDashboardMasterAll;
    }

    public String getQueryPollingSericeFlag() {
        return getQueryPollingSericeflag;
    }
    public String deleteQueryFordbM_audit(){
        return getdeleteQueryFordbM_audit;
    }








}
