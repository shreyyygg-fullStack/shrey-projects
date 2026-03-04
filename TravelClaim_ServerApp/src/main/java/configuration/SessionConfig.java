package configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;

@Configuration
@EnableJdbcHttpSession(maxInactiveIntervalInSeconds = 60*60)
public class SessionConfig {
    // Session configuration is automatically handled by Spring Session with JDBC.
}
