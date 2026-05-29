package com.cu.sweetmart.exception;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomerException.class)
    public ResponseEntity<MyErrorDetails> customerExceptionHandler(CustomerException ex, WebRequest req) {
        return buildResponse(ex.getMessage(), req, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(NoRecordsFoundException.class)
    public ResponseEntity<MyErrorDetails> noRecordFoundExceptionHandler(NoRecordsFoundException ex, WebRequest req) {
        return buildResponse(ex.getMessage(), req, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MyErrorDetails> validationExceptionHandler(MethodArgumentNotValidException ex, WebRequest req) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return buildResponse(message, req, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MyErrorDetails> otherExceptionHandler(Exception ex, WebRequest req) {
        return buildResponse(ex.getMessage(), req, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<MyErrorDetails> buildResponse(String message, WebRequest req, HttpStatus status) {
        MyErrorDetails err = new MyErrorDetails();
        err.setTimestamp(LocalDateTime.now());
        err.setMessage(message);
        err.setDetails(req.getDescription(false));
        return new ResponseEntity<>(err, status);
    }
}
