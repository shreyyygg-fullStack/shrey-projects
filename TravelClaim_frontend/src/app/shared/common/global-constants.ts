export class GlobalConstants {


    public static apiURL: string = "http://localhost:3010/";
    // public static apiURL: string = "http://10.0.10.10:8121/";

    public static apiSignUp: string = GlobalConstants.apiURL + "signUp";
    public static apiLogin: string = GlobalConstants.apiURL + "perform_login";
    public static apiLogout: string = GlobalConstants.apiURL + "logout";
    public static apiforgotPassword: string = GlobalConstants.apiURL + "forgotPassword";
    public static apiSetNewPassword: string = GlobalConstants.apiURL + "setNewPassword";

    public static apiGetFiles: string = GlobalConstants.apiURL + "session/get-files";
    public static apiUploadFile: string = GlobalConstants.apiURL + "session/upload-file";
    public static apiSaveOrgInfo: string = GlobalConstants.apiURL + "setting/save-orgInfo";
    public static apiGetOrgInfo: string = GlobalConstants.apiURL + "setting/get-orgInfo";
    public static apiGetUserList: string = GlobalConstants.apiURL + "setting/get-userList";
    public static apiGetUserDetail: string = GlobalConstants.apiURL + "setting/get-userDetail/";
    public static apiAddUser: string = GlobalConstants.apiURL + "setting/add-user";
    public static apiEditUser: string = GlobalConstants.apiURL + "setting/edit-user";
    public static apiDeleteUser: string = GlobalConstants.apiURL + "setting/delete-user/";
    public static apiDepartmentList: string = GlobalConstants.apiURL + "setting/get-departmentList";
    public static apiGetGradesList: string = GlobalConstants.apiURL + "setting/get-gradesList";
    public static apiSaveAllowance: string = GlobalConstants.apiURL + "setting/save-allowance";
    public static apiGetAllowance: string = GlobalConstants.apiURL + "setting/get-allowanceData";
    public static apiDeleteGradeRow: string = GlobalConstants.apiURL + "setting/delete-gradeRow/"

    public static apiSearchClassAPlusLocation: string = GlobalConstants.apiURL + "setting/search_class_aplus_location/"
    public static apiSearchClassALocation: string = GlobalConstants.apiURL + "setting/search_class_a_location/"
    public static apiSearchLocations: string = GlobalConstants.apiURL + "setting/search_locations/"

    public static apiSendInvite: string = GlobalConstants.apiURL + "setting/send-invite";

    public static apiGetSettingList: string = GlobalConstants.apiURL + "setting/get-setting-data";
    public static apiGetActiveSettingList: string = GlobalConstants.apiURL + "setting/get-active-setting-data";
    public static apiInsertGlobalSettingData: string = GlobalConstants.apiURL + "setting/insert-global-setting-data";

    public static apiUpdateGlobalSettingData: string = GlobalConstants.apiURL + "setting/update-global-setting-data";
    public static apiUpdateIDepartment: string = GlobalConstants.apiURL + "setting/update-department";
    public static apiUpdateIDesignation: string = GlobalConstants.apiURL + "setting/update-designation";
    public static apiUpdateIshidaLocation: string = GlobalConstants.apiURL + "setting/update-location";
    public static apiUpdateIGrade: string = GlobalConstants.apiURL + "setting/update-grade";
    public static apiUpdateIEmptSts: string = GlobalConstants.apiURL + "setting/update-employment-status";
    public static apiUpdateIRole: string = GlobalConstants.apiURL + "setting/update-role";





     // ngbtooltip titles
     static globalRequiredMsg: string = "This field is required.";

}