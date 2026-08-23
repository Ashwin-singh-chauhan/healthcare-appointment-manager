package com.healthcare.manager.controller;

import com.healthcare.manager.dto.SlotResponse;
import com.healthcare.manager.service.SlotService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotController {

    private final SlotService slotService;

    public SlotController(SlotService slotService) {
        this.slotService = slotService;
    }

    @GetMapping("/doctor/{doctorId}")
    public List<SlotResponse> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam LocalDate date
    ) {

        return slotService.getAvailableSlots(
                doctorId,
                date
        );
    }
}