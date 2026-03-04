package configure;

import com.flutterSegmap.FlutterAppServer.FlutterAppServerApplication;


public class JwtTokenDetail {

    private static JwtTokenDetail instance = null;

    String jwt_userId;
    String jwt_userName;

    private JwtTokenDetail() {
    }

    public static JwtTokenDetail getInstance() {
        if (instance == null) {
            instance = new JwtTokenDetail();
        }
        return instance;
    }

    public String getJwt_userId() {
        return jwt_userId;
    }

    public void setJwt_userId(String jwt_userId) {
		this.jwt_userId = jwt_userId;

        FlutterAppServerApplication.GLOBAL_USER_ID = this.jwt_userId.toUpperCase();
    }

    public String getJwt_userName() {
        return jwt_userName;
    }

    public void setJwt_userName(String jwt_userName) {
        this.jwt_userName = jwt_userName;
        FlutterAppServerApplication.GLOBAL_USER_NAME = this.jwt_userName;
    }

}
