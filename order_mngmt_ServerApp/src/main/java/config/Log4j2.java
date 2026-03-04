package config;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.order.iotServerApp.iotServerApplication;

public class Log4j2{
	public static Level LEVEL = Level.forName("INFO", 400);
	public static Logger logger = LogManager.getLogger(iotServerApplication.class);
	
}
