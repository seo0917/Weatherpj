package com.inforecord.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingDto {
    private boolean showOnboarding;
    private String currentStep;
    private List<String> completedSteps;
    private int totalSteps;
    private boolean isFirstVisit;
}