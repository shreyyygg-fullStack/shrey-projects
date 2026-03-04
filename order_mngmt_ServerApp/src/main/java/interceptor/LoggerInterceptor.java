package interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import encrypt.AES;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jwt.JwtTokenUtil;


@Component
public class LoggerInterceptor implements HandlerInterceptor {

	JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();

	final String Key = "mysecretkey12345";

	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object object, Exception arg3)
			throws Exception {
	}

	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object object, ModelAndView model)
			throws Exception {
	}

//	@Override
//	public boolean preHandle(HttpServletRequest request,
//			HttpServletResponse response, Object object) throws Exception {
//		String token = request.getHeader("Authorization");
//		String method = request.getMethod();
//		if (HttpMethod.OPTIONS.toString().equals(method)) {
//			return true;
//		}
//		if (!StringUtils.isEmpty(token)) {
//			if (token.contains("Bearer")) {
//				String tokendata = token.replace("Bearer ","");
//				if(!tokendata.contains("initiated")) {
//					if (!jwtTokenUtil.validateToken(tokendata, request)) {
////				        final String expired = (String) request.getAttribute("expired");
//						response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT expired");
//						return false;
//					}
//					return true;
//				}
//				if(tokendata.contains("initiated")){
//					return true;
//				}
//			}
//		}
//
//		return false;
//	}

	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object object) throws Exception {
		String token = request.getHeader("Authorization");
		String method = request.getMethod();
		if (HttpMethod.OPTIONS.toString().equals(method)) {
			return true;
		}
		if (!StringUtils.isEmpty(token)) {
			if (token.contains("Bearer")) {
				String tokendata = token.replace("Bearer ","");
				if(tokendata.contains("initiated")){
					String decodedTokenData =  tokendata.replace("initiated","");
					decodedTokenData = AES.decrypt(decodedTokenData, Key);
					if(decodedTokenData.contains("initiated")){
						if(decodedTokenData.contains("initiated")){
							return true;
						}
					}
				}
				if(!tokendata.contains("initiated")) {
					if (!jwtTokenUtil.validateToken(tokendata, request)) {
//				        final String expired = (String) request.getAttribute("expired");
						response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT expired");
						return false;
					}
					return true;
				}
			}
		}

		return false;
	}


}
