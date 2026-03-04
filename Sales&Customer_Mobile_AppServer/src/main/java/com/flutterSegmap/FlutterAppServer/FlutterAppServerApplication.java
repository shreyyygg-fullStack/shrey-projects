package com.flutterSegmap.FlutterAppServer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@ComponentScan(basePackages = { "interceptor" })
@ComponentScan(basePackages = { "controller" })
@SpringBootApplication
@Configuration
public class FlutterAppServerApplication {
	public static String GLOBAL_USER_ID = "";
	public static String GLOBAL_USER_NAME = "";

	@Bean
	RestTemplate restTemplate() {
		return new RestTemplate();
	}

	public static void main(String[] args) {
		SpringApplication.run(FlutterAppServerApplication.class, args);
	}

}
