package com.cu.sweetmart.exception;

public class NoRecordsFoundException extends RuntimeException {
    public NoRecordsFoundException(String message) {
        super(message);
    }
}
