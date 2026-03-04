//package controller;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.ServletRequest;
//import jakarta.servlet.ServletResponse;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.GenericFilterBean;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//@Component
//public class SessionValidationFilter extends GenericFilterBean {
//
//
//    @Override
//    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
//        HttpServletRequest httpRequest = (HttpServletRequest) request;
//        HttpServletResponse httpResponse = (HttpServletResponse) response;
//
//        String requestURI = httpRequest.getRequestURI();
//        if (requestURI.equals("/login") || requestURI.equals("/perform_login") || requestURI.equals("/logout") || requestURI.equals("/logouturl") || requestURI.equals("/signUp") || requestURI.equals("/forgotPassword") || requestURI.equals("/setNewPassword") || requestURI.equals("setting/validate-token")) {
//            chain.doFilter(request, response);
//            return;
//        }
//
//        chain.doFilter(request, response);
//    }
//
//
//}
