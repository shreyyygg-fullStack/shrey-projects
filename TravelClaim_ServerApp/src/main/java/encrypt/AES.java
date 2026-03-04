package encrypt;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class AES {


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

        }
        return null;
    }


    public static String encryptData(List<Object> dataToEncrypt)
    {
        String encryptedData = null;
        try
        {
            final String Key = "mysecretkey12345";
            // Convert JSON to string
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonData = objectMapper.writeValueAsString(dataToEncrypt);

            // Encrypt the data
            encryptedData = encrypt(jsonData, Key);
        }
        catch (Exception e)
        {

        }
        return encryptedData;
    }
}