package encrypt;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import config.JwtTokenDetail;
import config.Log4j2;

public class AES {

	public static JwtTokenDetail user = JwtTokenDetail.getInstance();
	private static SecretKeySpec secretKey;
    private static byte[] key;
    
	public AES() {
		super();
	}

	public static void setKey(String myKey) 
    {
        try {
            key = myKey.getBytes("UTF-8");
            key = Arrays.copyOf(key, 16); 
            secretKey = new SecretKeySpec(key, "AES");
        } 
        catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ AES.class.getName()+"\t"+e);
        }
    }
	
	public static String encrypt(String strToEncrypt, String secret) 
    {
        try
        {

            setKey(secret);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            return Base64.getEncoder().encodeToString(cipher.doFinal(strToEncrypt.getBytes("UTF-8")));
        } 
        catch (Exception e) 
        {
            Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ AES.class.getName()+"\t"+e);
        }
        return null;
    }
	
	public static String decrypt(String strToDecrypt, String secret) 
    {
        try
        {
            setKey(secret);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            return new String(cipher.doFinal(Base64.getDecoder().decode(strToDecrypt)));
        } 
        catch (Exception e) 
        {
            Log4j2.logger.error("ERROR\t"+user.getJwt_userId()+"\t"+user.getJwt_userName()+"\t"+ AES.class.getName()+"\t"+e);
        }
        return null;
    }
}