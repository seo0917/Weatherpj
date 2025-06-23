package com.inforecord.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.inforecord.Entity.Emotion;

@Repository
public class EmotionRepository {
    private final Map<Long, Emotion> emotions = new ConcurrentHashMap<>();
    private long nextId = 1;

    public Emotion save(Emotion emotion) {
        if (emotion.getId() == null) {
            emotion.setId(nextId++);
        }
        emotions.put(emotion.getId(), emotion);
        return emotion;
    }

    public List<Emotion> saveAll(List<Emotion> emotionList) {
        List<Emotion> savedEmotions = new ArrayList<>();
        for (Emotion emotion : emotionList) {
            savedEmotions.add(save(emotion));
        }
        return savedEmotions;
    }

    public Optional<Emotion> findById(Long id) {
        return Optional.ofNullable(emotions.get(id));
    }

    public void delete(Emotion emotion) {
        emotions.remove(emotion.getId());
    }

    public void deleteByRecordId(Long recordId) {
        emotions.entrySet().removeIf(entry -> entry.getValue().getRecord() != null && 
                                            entry.getValue().getRecord().getId().equals(recordId));
    }

    public List<Emotion> findByRecordId(Long recordId) {
        return emotions.values().stream()
            .filter(e -> e.getRecord().getId().equals(recordId))
            .toList();
    }

    public List<Emotion> findEmotionsByUserIdAndDateRange(String userId, LocalDate startDate, LocalDate endDate) {
        return emotions.values().stream()
            .filter(e -> e.getUserId() != null && e.getUserId().equals(userId) && 
                        e.getDate() != null && !e.getDate().isBefore(startDate) && 
                        !e.getDate().isAfter(endDate))
            .toList();
    }

    public List<Emotion> findEmotionsByUserIdAndWeekRange(String userId, LocalDate weekStart, LocalDate weekEnd) {
        return emotions.values().stream()
            .filter(e -> e.getUserId() != null && e.getUserId().equals(userId) && 
                         e.getDate() != null && !e.getDate().isBefore(weekStart) && 
                         !e.getDate().isAfter(weekEnd))
            .toList();
    }
}