package interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;



import jwttoken.JwtTokenUtil;

@Component
public class interceptorLogging implements HandlerInterceptor {

    JwtTokenUtil jwtTokenUtil = new JwtTokenUtil();
    static final Logger log = LogManager.getLogger(interceptorLogging.class);

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object object, Exception arg3)
            throws Exception {
        log.info("Request is complete");

    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object object, ModelAndView model)
            throws Exception {
        log.info("Handler execution is complete");
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object object) throws Exception {
//		System.out.println("PreHandle");
        log.info("Handler execution is PreHandle");
        String token = request.getHeader("Authorization");
        log.info("Token Check");
        if (!StringUtils.isEmpty(token)) {
            if (token.contains("Bearer")) {
                String tokendata = token.replace("Bearer ", "");
                if (!tokendata.contains("initiated")) {
                    // jwtTokenUtil.updateLoginDetailFromToken(tokendata);
                    if (!jwtTokenUtil.validateToken(tokendata, request)) {
                        final String expired = (String) request.getAttribute("expired");
//				        System.out.println(expired);
                        log.info(expired);

                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT expired");
                        return true;
                    }

                }
            }
        }

        return true;
    }

}
