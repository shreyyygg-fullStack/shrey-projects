package com.order.iotServerApp;

import javax.annotation.Resource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.JdbcTemplateAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import service.FileDownloadService;
import service.FileDownloadServiceImpl;
import service.FileUploadService;
import service.FileUploadServiceImpl;
import service.IndentService;
import service.IndentServiceImpl;

import org.springframework.boot.CommandLineRunner;

@ComponentScan(basePackages = { "config" })
@ComponentScan(basePackages = { "interceptor" })
@ComponentScan(basePackages = { "controller" })
@SpringBootApplication(exclude = {JdbcTemplateAutoConfiguration.class})
@Configuration
public class iotServerApplication extends SpringBootServletInitializer implements CommandLineRunner  {
	
	@Bean
	RestTemplate restTemplate() {
		return new RestTemplate();
	}

	@Bean
	public FileUploadService uploadService() {
		return new FileUploadServiceImpl();
	}

	@Bean
	public FileDownloadService downloadService() {
		return new FileDownloadServiceImpl();
	}
	
	@Bean
	public IndentService indService() {
		return new IndentServiceImpl();
	}

	@Resource
	FileUploadService uploadService;

	@Resource
	FileDownloadService downloadService;
	
	@Resource
	IndentService indService;

	public static void main(String[] args) {
		SpringApplication.run(iotServerApplication.class, args);
	}
	
	 @Override
	    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
	        return builder.sources(iotServerApplication.class);
	    }

	@Override
	public void run(String... arg) throws Exception {
//		uploadService.deleteAll();
		uploadService.init();
	}

}
