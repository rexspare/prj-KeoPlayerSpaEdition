package com.keoplayerspaedition.KeoCryptographyModule;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import java.util.Map;
import java.util.HashMap;

public class KeoCryptographyModule extends ReactContextBaseJavaModule {

    public KeoCryptographyModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "KeoCryptographyModule";
    }

    @ReactMethod
    public void encryptFile(String pathIn, String pathOut) {
        // Call your Java encryption method here
        KeoCryptography.startEncryptFiles(pathIn, pathOut);
    }

    @ReactMethod
    public void decryptFile(String pathIn, String pathOut) {
        // Call your Java decryption method here
        KeoCryptography.startDecryptFiles(pathIn, pathOut);
    }

    @ReactMethod
    public void decryptSingleFile(String pathIn, String pathOut) {
        // Call your Java decryption method here
        KeoCryptography.startDecryptSingle(pathIn, pathOut);
    }
}