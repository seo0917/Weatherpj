# AI 감정분석 서버

한국어 텍스트를 분석하여 감정을 자동으로 분류하는 AI 서버입니다.

## 기능

- 한국어 텍스트 감정분석
- AI 모델 기반 분석 (BERT)
- 한국어 특성 고려한 결과 보강
- RESTful API 제공

## API 엔드포인트

### 감정분석
```
POST /analyze
Content-Type: application/json

{
  "text": "분석할 텍스트"
}
```

### 테스트
```
GET /test
```

### 헬스 체크
```
GET /
```

## 배포

Railway를 통해 배포되었습니다.

## 사용법

1. 텍스트를 POST 요청으로 전송
2. 감정 분석 결과를 JSON 형태로 받음
3. 감정 타입: 행복, 슬픔, 화남, 놀람, 중립 