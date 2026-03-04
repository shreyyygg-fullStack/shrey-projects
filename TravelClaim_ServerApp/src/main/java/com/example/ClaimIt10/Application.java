package com.example.ClaimIt10;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@ComponentScan(basePackages = { "interceptor" })
@ComponentScan(basePackages = { "controller" })
@ComponentScan(basePackages = { "configuration" })
@SpringBootApplication
@Configuration
public class Application {

	@Bean
	RestTemplate restTemplate() {
		return new RestTemplate();
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

//	@Bean
//	public ServletContextInitializer initializer() {
//		return servletContext -> {
//			servletContext.addListener(new SessionListener());
//		};
//	}

}
