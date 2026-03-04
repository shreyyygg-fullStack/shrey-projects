package jwttoken;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.servlet.http.HttpServletRequest;

import interceptor.interceptorLogging;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import model.LoginRequest;
import model.LoginResponse;

import configure.JwtTokenDetail;




@Component
public class JwtTokenUtil implements Serializable {

    private static final long serialVersionUID = -2550185165626007488L;
    public static final long JWT_TOKEN_VALIDITY =  60 * 60;

    JwtTokenDetail jwttokendetail = JwtTokenDetail.getInstance();

    static final Logger log = LogManager.getLogger(interceptorLogging.class);

    //	@Value("${jwt.secret}")
    private String SECRET = "ishida495344";

    //retrieve username from jwt token

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public void updateLoginDetailFromToken(String token) {

        final Claims claims = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody();
        jwttokendetail.setJwt_userId(claims.get("sub").toString());
        jwttokendetail.setJwt_userName(claims.get("UserName").toString());
    }

    //retrieve expiration date from jwt token

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }
    //for retrieving any information from token
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody();
    }

    //check if the token has expired
	private Boolean isTokenExpired(String token) {
		final Date expiration = getExpirationDateFromToken(token);
		return expiration.before(new Date());
	}

    //generate token for user
    public String generateToken(LoginRequest loginRequest,LoginResponse loginResponce) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, loginRequest.getUserId(), loginResponce.getUserName(),loginResponce.getSalesMark()
                ,loginResponce.getRegion() ).toString();
    }

    private String doGenerateToken(Map<String, Object> claims, String uid, String uname, String salesMark, String region) {
        jwttokendetail.setJwt_userId(uid);
        jwttokendetail.setJwt_userName(uname);

        log.info("UserId: " + uid);
        log.info("Username: " + uname);
        log.info("Token Generated");

        return Jwts.builder().setClaims(claims).setSubject(uid).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
                .signWith(SignatureAlgorithm.HS512, SECRET).claim("UserName", uname)
                .claim("UserType",salesMark).claim("UserRegion",region).compact();
    }

    public Boolean validateToken(String token, HttpServletRequest httpServletRequest) {
        try {
            Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token);
            final Claims claims = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody();
            jwttokendetail.setJwt_userId(claims.get("sub").toString());
            jwttokendetail.setJwt_userName(claims.get("UserName").toString());
            return true;
        }catch (SignatureException ex){
            System.out.println("Invalid JWT Signature");
        }catch (MalformedJwtException ex){
            System.out.println("Invalid JWT token");
        }catch (ExpiredJwtException ex){
            //System.out.println("Expired JWT token");
            httpServletRequest.setAttribute("expired",ex.getMessage());
        }catch (UnsupportedJwtException ex){
            System.out.println("Unsupported JWT exception");
        }catch (IllegalArgumentException ex){
            System.out.println("Jwt claims string is empty");
        }
        return false;
    }

}
