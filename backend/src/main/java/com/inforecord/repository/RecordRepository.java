package com.inforecord.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;

import com.inforecord.Entity.Record;

@Repository
public class RecordRepository {
    private final Map<Long, Record> records = new ConcurrentHashMap<>();
    private long nextId = 1;

    public Record save(Record record) {
        if (record.getId() == null) {
            record.setId(nextId++);
        }
        records.put(record.getId(), record);
        return record;
    }

    public Optional<Record> findById(Long id) {
        return Optional.ofNullable(records.get(id));
    }

    public Optional<Record> findByRecordDateAndUserId(LocalDate date, String userId) {
        return records.values().stream()
            .filter(r -> r.getRecordDate().equals(date) && r.getUserId().equals(userId))
            .findFirst();
    }

    public List<Record> findByUserIdAndDateRange(String userId, LocalDate startDate, LocalDate endDate) {
        return records.values().stream()
            .filter(r -> r.getUserId().equals(userId) && 
                        !r.getRecordDate().isBefore(startDate) && 
                        !r.getRecordDate().isAfter(endDate))
            .toList();
    }

    public void deleteById(Long id) {
        records.remove(id);
    }

    // 모든 기록 반환 (Our Record용)
    public List<Record> findAll() {
        return new ArrayList<>(records.values());
    }
}