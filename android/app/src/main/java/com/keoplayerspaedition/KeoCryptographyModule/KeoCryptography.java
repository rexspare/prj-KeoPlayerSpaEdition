package com.keoplayerspaedition.KeoCryptographyModule;

import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

public class KeoCryptography {

    private static final Logger logger = Logger.getLogger(KeoCryptography.class.getName());

    private static final String ENCRYPTION_KEY = "myKey123";

    private static final byte[] ENCRYPTION_KEY_BYTES = keyStringToByteArray(ENCRYPTION_KEY);

    public KeoCryptography() {
    }

    private static byte[] keyStringToByteArray(String keyString) {
        byte[] sk = null;
        try {
            sk = keyString.getBytes("UTF-8");
        } catch (UnsupportedEncodingException e) {
            logger.log(Level.SEVERE, "ERROR getting bytes of keyString", e);
        }
        byte[] key = new byte[16];
        int len = sk.length;
        if (len > key.length) {
            len = key.length;
        }
        System.arraycopy(sk, 0, key, 0, len);
        return key;
    }

    public static void encrypt(File in, File out) throws Exception {
        logger.info("Cryptage de " + in.getName() + " en cours...");
        FileInputStream fis = new FileInputStream(in);
        FileOutputStream fos = new FileOutputStream(out);

        try {
            encrypt(ENCRYPTION_KEY_BYTES, fis, fos);
        } finally {
            try {
                fis.close();
                fos.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            logger.info("Cryptage de " + in.getName() + " termine.");
        }

    }

    public static void encrypt(byte[] key, InputStream is, OutputStream os) throws Exception {
        CipherInputStream cin = null;
        try {

            SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(key);
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, ivSpec);
            cin = new CipherInputStream(is, cipher);
            byte[] buffer = new byte[8192];
            int len;



            while ((len = cin.read(buffer)) > 0) {
                os.write(buffer, 0, len);
                os.flush();
            }

        } finally {
            if (cin != null)
                try {
                    cin.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }

    }

    public static void decrypt(File in, File out) throws Exception {
        logger.info("Decryptage de " + in.getName() + " en cours...");
        FileInputStream fis = new FileInputStream(in);
        FileOutputStream fos = new FileOutputStream(out);

        try {
            decrypt(ENCRYPTION_KEY_BYTES, fis, fos);
        } finally {
            try {
                fis.close();
                fos.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            logger.info("Decryptage de " + in.getName() + " termine.");
        }

    }

    public static void decrypt(byte[] key, InputStream is, OutputStream os) throws Exception {
        CipherInputStream cin = null;
        try {

            SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(key);
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, ivSpec);
            cin = new CipherInputStream(is, cipher);
            byte[] buffer = new byte[8192];
            int len;
            while ((len = cin.read(buffer)) > 0) {
                os.write(buffer, 0, len);
                os.flush();
            }

        } finally {
            if (cin != null)
                try {
                    cin.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }

    }

    // public static void main(String[] args) throws Exception {

    // startEncryptFiles("/Users/blacksouf/Projects/Professionel/KEO/Ujuke.fr/FILE_COMPILATION/Original");
    // startDecryptFiles("/Users/blacksouf/Projects/Professionel/KEO/Ujuke.fr/FILE_COMPILATION/Crypter");
    // }

    public static String getExtension(File file) {

        String extension = "";

        int i = file.getName().lastIndexOf('.');
        if (i > 0) {
            extension = file.getName().substring(i + 1);
        }

        return extension;
    }

    public static Boolean startEncryptFiles(String pathIn, String pathOut) {

        try {
            System.out.println("Start Encryption ----!");

            File folder = new File(pathIn);
            File[] listOfFiles = folder.listFiles();

            for (int i = 0; i < Objects.requireNonNull(listOfFiles).length; i++) {
                if (listOfFiles[i].isFile()) {
                    if (Objects.equals(getExtension(listOfFiles[i]), "mp3")) {
                        System.out.println("File " + listOfFiles[i].getName());
                        encrypt(new File(pathIn + "/" + listOfFiles[i].getName()),
                                new File(pathOut + "/" + listOfFiles[i].getName()));

                    }
                }
            }
            return true;
        } catch (Exception exception) {
            return false;
        }
    }

    public static Boolean startDecryptFiles(String pathIn, String pathOut) {

        try {
            System.out.println("Start Decryption ----!HAMZA");
            System.out.println("Start Decryption ----!HAMZA");
            System.out.println("Start Decryption ----!HAMZA");
            System.out.println("Start Decryption ----!HAMZA");
            System.out.println("Start Decryption ----!HAMZA");
            System.out.println("Start Decryption ----!HAMZA");
            System.out.println("Start Decryption ----!HAMZA");
            System.out.println("Start Decryption ----!HAMZA");

            File folder = new File(pathIn);
            File[] listOfFiles = folder.listFiles();

            for (int i = 0; i < Objects.requireNonNull(listOfFiles).length; i++) {
                try {
                    if (listOfFiles[i].isFile() && Objects.equals(getExtension(listOfFiles[i]), "mp3")) {
                        System.out.println("File " + listOfFiles[i].getName());
                        decrypt(new File(pathIn + "/" + listOfFiles[i].getName()),
                                new File(pathOut + "/" + listOfFiles[i].getName()));
                    }
                } catch (Exception e) {
                    // Log the exception
                    e.printStackTrace();
                }
            }

            return true;
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }
    }

    public static Boolean startDecryptSingle(String filePath, String destinationPath) {
        try {
            System.out.println("Start Decrypting Single File ----!");

            File file = new File(filePath);

            if (file.isFile() && Objects.equals(getExtension(file), "mp3")) {
                System.out.println("File " + file.getName());
                decrypt(file, new File(destinationPath + "/" + file.getName()));
                return true;
            } else {
                System.out.println("Invalid file or extension.");
                return false;
            }
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }
    }

}
