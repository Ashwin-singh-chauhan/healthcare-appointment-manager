package com.healthcare.manager.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SlotAlreadyBookedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleSlotAlreadyBooked(
            SlotAlreadyBookedException ex
    ) {

        return Map.of(
                "message",
                ex.getMessage()
        );
    }
}