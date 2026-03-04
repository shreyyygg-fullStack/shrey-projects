export class GlobalConstants {
    public static globalNxtActIndNo: string = "";
    public static globalIndentDetailIndNo: string = "";
    // API URLs
    // user Management component APIs
    public static apiURL: string = "http://localhost:3010/";
    
    public static apiListUser: string = GlobalConstants.apiURL + "list-user";
    public static apiAddUser: string = GlobalConstants.apiURL + "add-user"
    public static apiNumberOfUsers: string = GlobalConstants.apiURL + "number-of-users"
    public static apiUpdateUserDetails: string = GlobalConstants.apiURL + "updateUserDetails";
    public static apiGetUserDetails: string = GlobalConstants.apiURL + "getUserDetails/";
    public static apiInsertUserRegData: string = GlobalConstants.apiURL + "insertUserRegData";
    public static apiGetUserList: string = GlobalConstants.apiURL + "getUserList";
    public static apiGetActiveUserList: string = GlobalConstants.apiURL + "getActiveUserList";
    public static apiGetInActiveUserList: string = GlobalConstants.apiURL + "getInActiveUserList";
    public static apiGetDepartmentList: string = GlobalConstants.apiURL + "getDepartmentList";
    public static apiGetDesignationList: string = GlobalConstants.apiURL + "getDesignationList";
    public static apiGetUserRoleList: string = GlobalConstants.apiURL + "getUserRoleList";
    public static apiGetCurrentUserCount: string = GlobalConstants.apiURL + "getCurrentUserCount";
    public static apiGetActiveUserCount: string = GlobalConstants.apiURL + "getActiveUserCount";
    public static apiGetInActiveUserCount: string = GlobalConstants.apiURL + "getInActiveUserCount";
    public static apiInsertUser: string = GlobalConstants.apiURL + "getInsertUser";
    public static apiUpdateUser: string = GlobalConstants.apiURL + "getUpdateUser";
    public static apiDeleteUser: string = GlobalConstants.apiURL + "getDeleteUser";
    public static apiApplicationLog: string = GlobalConstants.apiURL + "getApplicationLog";
    public static apiGetApplicationLogWithDate: string = GlobalConstants.apiURL + "getApplicationLogWithDate";
    public static apiGetDeleteApplicationLog: string = GlobalConstants.apiURL + "getDeleteApplicationLog";

    //File releted APIs
    public static apiGetIndentDelSts: string = GlobalConstants.apiURL + "getIndentDelSts/";
    public static apiGetCategoryList: string = GlobalConstants.apiURL + "getCategoryList";
    public static apiInsertOtherFileData: string = GlobalConstants.apiURL + "insertOtherFileData";
    public static apiGetIndentOtherFileData: string = GlobalConstants.apiURL + "getIndentOtherFileData/";
    public static apiDeleteOtherFile: string = GlobalConstants.apiURL + "deleteOtherFile";
    public static apiDeleteImageFile: string = GlobalConstants.apiURL + "deleteImageFile";
    public static apiInsertImageFileData: string = GlobalConstants.apiURL + "insertImageFileData";

    // home component API
    public static apiNextActionToday: string = GlobalConstants.apiURL + "filter_NextAction_Today";

    //compare-uploadedFiles component API
    public static apiFilter_PRDNotStarted_OCDate: string = GlobalConstants.apiURL + "filter_PRDNotStarted_OCDate";
    public static apiFilter_LCPending_PMTstswithASHTypeLCODate: string = GlobalConstants.apiURL + "filter_LCPending_PMTstswithASHTypeLCODate";

    //details-template component API
    public static apiFilter_SpecNotFin_SADatewithIndentDate: string = GlobalConstants.apiURL + "filter_SpecNotFin_SADatewithIndentDate";
    public static apiFilter_SpecNotFin_SADate: string = GlobalConstants.apiURL + "filter_SpecNotFin_SADate";
    public static apiFilter_AdvPending_PMTstswithADVAmtIndentDate: string = GlobalConstants.apiURL + "filter_AdvPending_PMTstswithADVAmtIndentDate";
    public static apiFilter_AdvPending_PMTstswithADVAmt: string = GlobalConstants.apiURL + "filter_AdvPending_PMTstswithADVAmt";

    // login component API
    public static apiAuthenticate: string = GlobalConstants.apiURL + "authenticate";
    public static apiUpdateLoginStatus: string = GlobalConstants.apiURL + "updateLoginStatus";
    public static apiResetPassword: string = GlobalConstants.apiURL + "resetPassword";
    public static apiChangePassword: string = GlobalConstants.apiURL + "changePassword";
    public static apiMatchUserWithEmail: string = GlobalConstants.apiURL + "matchUserWithEmail/";
    public static apiSendMail: string = GlobalConstants.apiURL + "sendMail";
    public static apiForgetPasswordSendMail: string = GlobalConstants.apiURL + "forgetPasswordSendMail/";


    // e-mail setting component API
    public static apiAddEmail: string = GlobalConstants.apiURL + "add-email";
    public static apiEmail: string = GlobalConstants.apiURL + "api/v1/emails";
    public static apiEmailData: string = GlobalConstants.apiURL + "api/v1/email-data";
    public static apiAutomaticSendMail: string = GlobalConstants.apiURL + "automaticSendMail";
    public static apiDeleteEmail: string = GlobalConstants.apiURL + "api/v1/delete-email";
    public static apiUpdateEmail: string = GlobalConstants.apiURL + "api/v1/update-email";
    public static apiGetEmailFlag2: string = GlobalConstants.apiURL + "getEmailFlag";
    public static apiAddRegionEmails: string = GlobalConstants.apiURL + "api/v1/save-region-email";
    public static apiRegionEmail: string = GlobalConstants.apiURL + "/api/v1/region-emails";
    public static apiAddRegion: string = GlobalConstants.apiURL + "add-region";

    public static apiSendInvMail: string = GlobalConstants.apiURL + "sendInvMail";

    // display-board component API
    public static apiAllPriorityIndents: string = GlobalConstants.apiURL + "all-priority-indent";
    public static apiRegionList: string = GlobalConstants.apiURL + "region-list";
    public static apiSelectedIndent: string = GlobalConstants.apiURL + "selected-indentDetail/";
    public static apiSelectedIndentPosition: string = GlobalConstants.apiURL + "selected-indentPosition/";
    public static apiSetPriorityIndent: string = GlobalConstants.apiURL + "setPriorityIndent";
    public static apiChangeIndentPosition: string = GlobalConstants.apiURL + "changeIndentPosition";

    // daily-planning component API
    public static apiUpdateIndentPosition: string = GlobalConstants.apiURL + "updateIndentPosition";
    public static apiSetDefaultIndent: string = GlobalConstants.apiURL + "set-default-indent";

    //iboard setting
    public static apiPaginationDetails: string = GlobalConstants.apiURL + "pagination-details";
    public static apiSavePaginationDetails: string = GlobalConstants.apiURL + "savePageDetails";

    //iboard files
    public static apiPriorityIndentByDate: string = GlobalConstants.apiURL + "priority-indents-by-date";

    // indent management component API
    public static apiIndent: string = GlobalConstants.apiURL + "indent";
    public static apiOpenIndent: string = GlobalConstants.apiURL + "OpenIndent";
    public static apiClosedIndent: string = GlobalConstants.apiURL + "ClosedIndent";
    public static apiCancelledIndent: string = GlobalConstants.apiURL + "CancelledIndent";
    public static apiIndentASC: string = GlobalConstants.apiURL + "indentASC/";
    public static apiIndentDetail: string = GlobalConstants.apiURL + "indentDetail/";
    public static apiIndentSubDetail: string = GlobalConstants.apiURL + "indentSubDetail/";
    public static apiUpdatePiData: string = GlobalConstants.apiURL + "updatePIData";
    public static apiUpdateIIPOData: string = GlobalConstants.apiURL + "updateIIPOData";
    public static apiUpdateIIOCData: string = GlobalConstants.apiURL + "updateIIOCData";
    public static apiUpdateOCData: string = GlobalConstants.apiURL + "updateOCData";
    public static apiUpdateIIEXFData: string = GlobalConstants.apiURL + "updateIIEXFData";
    public static apiUpdateEXFData: string = GlobalConstants.apiURL + "updateEXFData";
    public static apiUpdateBGData: string = GlobalConstants.apiURL + "updateBGData";
    public static apiUpdateINVEWBData: string = GlobalConstants.apiURL + "updateINVEWBData";

    public static apiCheckPoExist: string = GlobalConstants.apiURL + "checkPoNumberExist";
    public static apiGetIndentListUsingPoNumber: string = GlobalConstants.apiURL + "getIndentListUsingPoNumber";
    public static apiGetListOfPmtUsingPoNumber: string = GlobalConstants.apiURL + "getListOfPmtUsingPoNumber";
    public static apiGetListOfMasterPmtUsingPoNumber: string = GlobalConstants.apiURL + "getListOfMasterPmtUsingPoNumber";

    public static apiServiceData: string = GlobalConstants.apiURL + "getServiceData";
    public static apiSetIndentStatus: string = GlobalConstants.apiURL + "setIndentStatus";

    public static apiGetPaymentIndentData: string = GlobalConstants.apiURL + "getPaymentIndentData/";
    public static apiAddOrUpdatePMTData: string = GlobalConstants.apiURL + "PaymentData";
    public static apiDeletePaymentData: string = GlobalConstants.apiURL + "DeletePaymentData";

    public static apiUpdateLCData: string = GlobalConstants.apiURL + "updateLCData";
    public static apiUpdateCOMData: string = GlobalConstants.apiURL + "updateCOMData";
    public static apiUpdateSHPorINVData: string = GlobalConstants.apiURL + "updateSHPorINVData";
    public static apiUpdateNextActionData: string = GlobalConstants.apiURL + "updateNextActionData";
    public static apiGetIndentDetail: string = GlobalConstants.apiURL + "getIndentDetails";
    public static apiGetInvIndentData: string = GlobalConstants.apiURL + "getInvIndentData/";
    public static apiInsertINVData: string = GlobalConstants.apiURL + "insertINVData";
    public static apiUpdateINVData: string = GlobalConstants.apiURL + "updateINVData";
    public static apiDeleteINVData: string = GlobalConstants.apiURL + "deleteINVData";

    public static apiGetIndentFromInvoice: string = GlobalConstants.apiURL + "getIndentListFromInvoice/";
    public static apiGetInvoiceFilterData: string = GlobalConstants.apiURL + "InvoiceFilterData"

    // file management component API -- fileupload component.
    public static apiListIndentByConditionalFilter: string = GlobalConstants.apiURL + "list-indent-by-conditional-filter/";
    public static apiListIndentByDate: string = GlobalConstants.apiURL + "list-indent-by-date/";
    public static apiCheckIndentStatus: string = GlobalConstants.apiURL + "chkIndentNoSts/";
    public static apiUploadData: string = GlobalConstants.apiURL + "upload";
    public static apiGetYearList: string = GlobalConstants.apiURL + "getYearList";
    public static apiGetDatawithFilters: string = GlobalConstants.apiURL + "getDatawithFilters";
    public static apiGetDataList: string = GlobalConstants.apiURL + "get-data-list/";

    public static apiGetListOfInvoice: string = GlobalConstants.apiURL + "get-indent-invoice-list/";
    public static apiGetListOfInvoiceByDate: string = GlobalConstants.apiURL + "get-indent-invoice-list-by-date/";
    public static apiGetListOfInvoiceByConditionalFilter: string = GlobalConstants.apiURL + "get-indent-invoice-list-by-conditional-filter/";
    public static apiGetListOfPayment: string = GlobalConstants.apiURL + "get-indent-payment-list/";
    public static apiGetListOfPaymentByDate: string = GlobalConstants.apiURL + "get-indent-payment-list-by-date/";
    public static apiGetListOfPaymentByConditionalFilter: string = GlobalConstants.apiURL + "get-indent-payment-list-by-conditional-filter/";
    public static apiCancelPayment: string = GlobalConstants.apiURL + "paymentCancel"

    // navbar component API
    public static apiUpdateUserPassword: string = GlobalConstants.apiURL + "updatePassword";

    // dashboard component API
    public static apiFilter_AllCount: string = GlobalConstants.apiURL + "filter_AllCount";
    public static apiFilter_AllYellowCount: string = GlobalConstants.apiURL + "filter_AllYellowCount";
    public static apiyellfiltersnf: string = GlobalConstants.apiURL + "yellfiltersnf";
    public static apiblufiltersnf: string = GlobalConstants.apiURL + "blufiltersnf";
    public static apiyellfilteradv: string = GlobalConstants.apiURL + "yellfilteradv";
    public static apiblufilteradv: string = GlobalConstants.apiURL + "blufilteradv";
    public static apiYellfilterlc: string = GlobalConstants.apiURL + "yellfilterlc";
    public static apiBlufilterlc: string = GlobalConstants.apiURL + "blufilterlc";
    public static apiYellfilterbsh: string = GlobalConstants.apiURL + "yellfilterbsh";
    public static apiBlufilterbsh: string = GlobalConstants.apiURL + "blufilterbsh";
    public static apiYellfilterout: string = GlobalConstants.apiURL + "yellfilterout";
    public static apiBlufilterout: string = GlobalConstants.apiURL + "blufilterout";
    public static apiYellfilterpns: string = GlobalConstants.apiURL + "yellfilterpns";
    public static apiBlufilterpns: string = GlobalConstants.apiURL + "blufilterpns";
    public static apiYellfilterlcp: string = GlobalConstants.apiURL + "yellfilterlcp";
    public static apiBlufilterlcp: string = GlobalConstants.apiURL + "blufilterlcp";
    public static apiYellfilterpxef: string = GlobalConstants.apiURL + "yellfilterpxef";
    public static apiBlufilterpxef: string = GlobalConstants.apiURL + "blufilterpxef";
    public static apiYellfilterfexf: string = GlobalConstants.apiURL + "yellfilterfexf";
    public static apiBlufilterfexf: string = GlobalConstants.apiURL + "blufilterfexf";
    public static apiYellfilterssp: string = GlobalConstants.apiURL + "yellfilterssp";
    public static apiBlufilterssp: string = GlobalConstants.apiURL + "blufilterssp";
    public static apiYellfiltersap: string = GlobalConstants.apiURL + "yellfiltersap";
    public static apiBlufiltersap: string = GlobalConstants.apiURL + "blufiltersap";

    // http client service API
    public static apiLoginAdmin: string = GlobalConstants.apiURL + "loginadmin";

    // Global Variables
    // public static globalNxtActIndNo: string = "";
    static globalIsMailSentSuccessFully: boolean = false;
    static globalEnableButtons: boolean = false;
    static globalReadOnly: boolean = false;
    static globalIsMaintenanceEnable: boolean = false;
    static globalUserRole: string = "";
    static globaldisable: boolean = false;

    // ngbtooltip titles
    static globalRequiredMsg: string = "This field is required";
    static globalInvalidDateMsg: string = "Please provide a valid date";
    static globalDecimalValMsg: string = "This field should have decimal values only";
    static globalIncorrectPassMsg: string = "Password is incorrect";
    static globalDiffNewAndCurrentPassMsg: string = "Current password and New password must be different";
    static globalInvalidPasswordMsg: string = "Password must have minimum 8 alphanumeric characters with atleast one special character and a capital letter";
    static globalDiffPasswordMsg: string = "New password and Confirm password are not same";
    static globalPasswordMinLengthMsg: string = "Password must be 8 characters long";
    static globalPasswordMaxLengthMsg: string = "Password can have length of atmost 20 characters";
    static globalPasswordPatternMsg: string = "Password must contain alphanumeric characters with atleast one special character and a capital letter";
    static globalIdPatternMsg: string = "User id must have a pattern like IIPL-XXX";
    static globalInvalidEmailMsg: string = "Please enter a valid email id";

    //global shared variable
    public static glabalUserLoginPass: string = "";

}
