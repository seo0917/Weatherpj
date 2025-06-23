package com.inforecord.controller;

import com.inforecord.dto.OnboardingDto;
import com.inforecord.service.OnboardingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://weatherpj.vercel.app"})
public class OnboardingController {

    private final OnboardingService onboardingService;

    @GetMapping("/status")
    public ResponseEntity<OnboardingDto> getOnboardingStatus(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String deviceId
    ) {
        String identifier = userId != null ? userId : deviceId;
        OnboardingDto status = onboardingService.getOnboardingStatus(identifier);
        return ResponseEntity.ok(status);
    }

    // 온보딩 완료
    @PostMapping("/complete-step")
    public ResponseEntity<Void> completeOnboardingStep(
            @RequestParam String identifier,
            @RequestParam String step
    ) {
        onboardingService.completeStep(identifier, step);
        return ResponseEntity.ok().build();
    }

    // 온보딩 스킵
    @PostMapping("/skip")
    public ResponseEntity<Void> skipOnboarding(
            @RequestParam String identifier
    ) {
        onboardingService.skipOnboarding(identifier);
        return ResponseEntity.ok().build();
    }
}