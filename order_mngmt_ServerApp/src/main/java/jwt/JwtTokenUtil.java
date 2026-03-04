package jwt;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;
import config.JwtTokenDetail;
import config.Log4j2;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import model.LoginRequest;
import model.LoginResponse;

@Component
public class JwtTokenUtil implements Serializable {
	
	JwtTokenDetail user = JwtTokenDetail.getInstance();
	private static final long serialVersionUID = -2550185165626007488L;
	public static final long JWT_TOKEN_VALIDITY = 7 * 24 * 60 * 60;

	JwtTokenDetail jwttokendetail = JwtTokenDetail.getInstance();

	private String SECRET = "ishida495344";

	// retrieve username from jwt token
	public String getUsernameFromToken(String token) {
		return getClaimFromToken(token, Claims::getSubject);
	}

	public void updateLoginDetailFromToken(String token) {

		final Claims claims = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody();
		jwttokendetail.setJwt_userId(claims.get("sub").toString());
		jwttokendetail.setJwt_userName(claims.get("UserName").toString());
	}

	// retrieve expiration date from jwt token
	public Date getExpirationDateFromToken(String token) {
		return getClaimFromToken(token, Claims::getExpiration);
	}

	public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = getAllClaimsFromToken(token);
		return claimsResolver.apply(claims);
	}

	// for retrieving any information from token
	private Claims getAllClaimsFromToken(String token) {
		return Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody();
	}

	// generate token for user
	public String generateToken(LoginRequest loginRequest, LoginResponse loginResponce) {
		Map<String, Object> claims = new HashMap<>();
		return doGenerateToken(claims, loginRequest.getUser_id(), loginResponce.getUserName());
	}

	private String doGenerateToken(Map<String, Object> claims, String uid, String uname) {
		jwttokendetail.setJwt_userId(uid);
		jwttokendetail.setJwt_userName(uname);

		return Jwts.builder().setClaims(claims).setSubject(uid).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
				.signWith(SignatureAlgorithm.HS512, SECRET).claim("UserName", uname).compact();
	}

	public Boolean validateToken(String token, HttpServletRequest httpServletRequest) {
		try {
			Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token);
			final Claims claims = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody();
			jwttokendetail.setJwt_userId(claims.get("sub").toString());
			jwttokendetail.setJwt_userName(claims.get("UserName").toString());
			return true;
		} catch (SignatureException ex) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ JwtTokenUtil.class.getName()+"\t"+ex);
		} catch (MalformedJwtException ex) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ JwtTokenUtil.class.getName()+"\t"+ex);
		} catch (ExpiredJwtException ex) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ JwtTokenUtil.class.getName()+"\t"+ex);
			httpServletRequest.setAttribute("expired", ex.getMessage());
		} catch (UnsupportedJwtException ex) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ JwtTokenUtil.class.getName()+"\t"+ex);
		} catch (IllegalArgumentException ex) {
			Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ JwtTokenUtil.class.getName()+"\t"+ex);
		}
		return false;
	}

}
