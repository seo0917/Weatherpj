package com.inforecord.service;

import com.inforecord.dto.OnboardingDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class OnboardingService {

    private final Map<String, Set<String>> userOnboardingData = new ConcurrentHashMap<>();

    private static final List<String> ONBOARDING_STEPS = Arrays.asList(
            "welcome",        // 환영 메시지
            "permission",     // 위치 권한 요청
            "emotionGuide",   // 감정 색상 가이드
            "weatherInfo",    // 날씨 정보 안내
            "complete"        // 완료
    );

    public OnboardingDto getOnboardingStatus(String identifier) {
        if (identifier == null) {
            // 첫 방문자
            return OnboardingDto.builder()
                    .showOnboarding(true)
                    .currentStep("welcome")
                    .completedSteps(new ArrayList<>())
                    .totalSteps(ONBOARDING_STEPS.size() - 1) // complete 제외
                    .isFirstVisit(true)
                    .build();
        }

        Set<String> completedSteps = userOnboardingData.getOrDefault(identifier, new HashSet<>());
        boolean isCompleted = completedSteps.contains("complete") ||
                completedSteps.size() >= ONBOARDING_STEPS.size() - 1;

        return OnboardingDto.builder()
                .showOnboarding(!isCompleted)
                .currentStep(getCurrentStep(completedSteps))
                .completedSteps(new ArrayList<>(completedSteps))
                .totalSteps(ONBOARDING_STEPS.size() - 1)
                .isFirstVisit(false)
                .build();
    }

    public void completeStep(String identifier, String step) {
        if (identifier == null || step == null) return;

        Set<String> steps = userOnboardingData.computeIfAbsent(identifier, k -> new HashSet<>());
        steps.add(step);

        // 모든 스텝 완료 시 자동으로 complete 추가
        if (steps.containsAll(ONBOARDING_STEPS.subList(0, ONBOARDING_STEPS.size() - 1))) {
            steps.add("complete");
        }

        log.info("온보딩 완료: identifier={}, step={}", identifier, step);
    }

    public void skipOnboarding(String identifier) {
        if (identifier == null) return;

        Set<String> steps = userOnboardingData.computeIfAbsent(identifier, k -> new HashSet<>());
        steps.add("complete");

        log.info("온보딩 스킵: identifier={}", identifier);
    }

    private String getCurrentStep(Set<String> completedSteps) {
        for (String step : ONBOARDING_STEPS) {
            if (!completedSteps.contains(step)) {
                return step;
            }
        }
        return "complete";
    }
}