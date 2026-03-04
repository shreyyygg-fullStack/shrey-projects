package configuration;

//import controller.SessionValidationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.sql.DataSource;
import java.util.List;

@Configuration
public class SecurityConfig {

    private final DataSource dataSource;

    public SecurityConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
//                .addFilterBefore(new SessionValidationFilter(), UsernamePasswordAuthenticationFilter.class)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/login","/forgotPassword","setting/validate-token","/setNewPassword","/signUp").permitAll() // Public access to login and certain endpoints
                        .anyRequest().authenticated() // All other requests require authentication
                )
                .formLogin(form -> form
                        .loginPage("/login") // Custom login page
                        .loginProcessingUrl("/perform_login") // Endpoint to process login
                        .defaultSuccessUrl("/redirect", true) // Redirect on successful login
                        .failureUrl("/login?error=true") // Redirect on login failure
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("Invalid credentials: " + exception.getMessage());
                        }) //
                        .permitAll() // Allow access to login page
                )
                .logout(logout -> logout
                        .logoutUrl("/logout") // Logout URL
                        .logoutSuccessUrl("/logouturl") // Redirect after successful logout
                        .invalidateHttpSession(true) // Invalidate session
                        .deleteCookies("SESSION") // Delete session cookie
                        .permitAll() // Allow access to logout URL
                )
                .sessionManagement(session -> session
                        .invalidSessionStrategy((request, response) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("Session expired");
                        })
                        .invalidSessionUrl("/login?sessionExpired=true")
                        .maximumSessions(1) // Allow only one active session per user
                        .expiredUrl("/login?sessionExpired=true") // Redirect on session expiration
                )
                .csrf(csrf -> csrf.disable());  // Disable CSRF for APIs (optional, depending on use case)

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        JdbcUserDetailsManager manager = new JdbcUserDetailsManager(dataSource);
        manager.setUsersByUsernameQuery("SELECT EMP_ID, EMP_PWD , ENABLE_STS FROM iexpense.iuseraccounts WHERE EMP_ID = ?");
//        manager.setAuthoritiesByUsernameQuery("SELECT username, authority FROM iexpense.authorities WHERE username = ?");
        return manager;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200","http://localhost:8888"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
