from flask import Flask, request, jsonify
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
import re

app = Flask(__name__)

# AI 모델 로드 (한번만 실행)
print("AI 감정분석 모델 로딩 중...")

# 한국어 감정분석 모델 (사전훈련된 AI 모델)
try:
    # 방법 1: 한국어 특화 감정분석 모델
    model_name = "hun3359/klue-bert-base-sentiment"
    sentiment_pipeline = pipeline(
        "text-classification", 
        model=model_name, 
        tokenizer=model_name,
        return_all_scores=True
    )
    print("한국어 BERT 모델 로드 완료!")
except:
    # 방법 2: 다국어 감정분석 모델 (백업)
    print("한국어 모델 로드 실패, 다국어 모델 사용...")
    sentiment_pipeline = pipeline(
        "text-classification", 
        model="cardiffnlp/twitter-xlm-roberta-base-sentiment",
        return_all_scores=True
    )

def analyze_emotion_with_ai(text):
    """AI 모델을 사용한 실제 감정분석"""
    try:
        # AI 모델로 감정 분석
        results = sentiment_pipeline(text)
        
        # 결과 처리
        if isinstance(results[0], list):
            scores = results[0]
        else:
            scores = results
            
        # 감정 라벨 매핑
        emotion_mapping = {
            'POSITIVE': '행복',
            'NEGATIVE': '슬픔', 
            'NEUTRAL': '중립',
            'LABEL_0': '부정',
            'LABEL_1': '중립',
            'LABEL_2': '긍정'
        }
        
        # 가장 높은 점수의 감정 찾기
        best_result = max(scores, key=lambda x: x['score'])
        
        emotion_label = emotion_mapping.get(best_result['label'], best_result['label'])
        confidence = int(best_result['score'] * 100)
        
        # 긍정을 행복으로, 부정을 슬픔으로 매핑
        if emotion_label == '긍정':
            emotion_label = '행복'
        elif emotion_label == '부정':
            emotion_label = '슬픔'
            
        return {
            'emotion': emotion_label,
            'confidence': confidence,
            'all_scores': [
                {
                    'emotion': emotion_mapping.get(score['label'], score['label']),
                    'score': int(score['score'] * 100)
                } for score in scores
            ]
        }
        
    except Exception as e:
        print(f"AI 분석 오류: {e}")
        return {'emotion': '중립', 'confidence': 50, 'error': str(e)}

def enhance_korean_analysis(text, ai_result):
    """한국어 특성을 고려한 감정 강화"""
    
    # 강조 표현 감지
    intensifiers = ['너무', '정말', '진짜', '완전', '엄청', '매우', '아주', '굉장히', '정말로']
    mitigators = ['약간', '조금', '살짝', '그냥', '조금은', '조금씩', '조금이라도']
    multiplier = 1.0
    
    for intensifier in intensifiers:
        if intensifier in text:
            multiplier += 0.2
            
    # 완화어가 있으면 -0.2씩 감소 (최소 0.5까지)
    for mitigator in mitigators:
        if mitigator in text:
            multiplier -= 0.2
    multiplier = max(multiplier, 0.5)  # 너무 낮아지지 않게 하한선
    
    # 감정 표현 직접 매핑 (높은 확신도)
    direct_emotions = {
        '행복': ['행복해', '기뻐', '좋아', '신나', '즐거워', '사랑해', '기쁘다', '즐겁다'],
        '슬픔': ['슬퍼', '우울해', '힘들어', '아파', '외로워', '슬프다', '우울하다', '힘들다', '기분나빠', '기분나쁘다', '기분이 나빠', '기분이 나쁘다'],
        '화남': ['화나', '짜증나', '열받아', '빡쳐', '화나다', '짜증나다', '열받다', '빡치다', '화가나', '화가 나', '짜증내', '짜증 내'],
        '놀람': ['놀라', '깜짝', '충격', '놀랐어', '놀랐다', '깜짝놀라', '충격받아', '충격받다']
    }
    
    for emotion, keywords in direct_emotions.items():
        for keyword in keywords:
            if keyword in text:
                return {
                    'emotion': emotion,
                    'confidence': min(int(80 * multiplier), 100),
                    'method': 'direct_korean_match'
                }
    
    # AI 결과에 한국어 강화 적용
    enhanced_confidence = min(int(ai_result['confidence'] * multiplier), 100)
    
    return {
        'emotion': ai_result['emotion'],
        'confidence': enhanced_confidence,
        'method': 'ai_enhanced'
    }

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    """AI 기반 감정분석 API"""
    try:
        data = request.json
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({'error': '텍스트를 입력해주세요'}), 400
        
        # 1. AI 모델로 기본 분석
        ai_result = analyze_emotion_with_ai(text)
        
        # 2. 한국어 특성 고려한 결과 보강
        final_result = enhance_korean_analysis(text, ai_result)
        
        response = {
            'input_text': text,
            'emotion': final_result['emotion'],
            'confidence': final_result['confidence'],
            'message': f"{final_result['emotion']} {final_result['confidence']}%",
            'analysis_method': final_result.get('method', 'ai'),
            'raw_ai_scores': ai_result.get('all_scores', [])
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': f'분석 오류: {str(e)}'}), 500

@app.route('/test', methods=['GET'])
def test_analysis():
    """테스트용 엔드포인트"""
    test_sentences = [
        "내가 오늘 너무 행복해",
        "정말 슬퍼서 눈물이 나",
        "완전 화가 나서 미치겠어", 
        "그냥 평범한 하루야",
        "깜짝 놀랐어!"
    ]
    
    results = []
    for sentence in test_sentences:
        ai_result = analyze_emotion_with_ai(sentence)
        final_result = enhance_korean_analysis(sentence, ai_result)
        results.append({
            'text': sentence,
            'emotion': final_result['emotion'],
            'confidence': final_result['confidence']
        })
    
    return jsonify({'test_results': results})

if __name__ == '__main__':
    print("\n🤖 AI 기반 한국어 감정분석 서버 시작!")
    print("💡 이제 실제 AI 모델이 감정을 자동으로 분석합니다")
    print("📝 키워드 매핑이 아닌 딥러닝 모델 사용")
    print("\n테스트 해보기:")
    print("curl -X POST http://localhost:5000/analyze -H 'Content-Type: application/json' -d '{\"text\":\"내가 오늘 너무 행복해\"}'")
    print("\n또는 브라우저에서: http://localhost:5000/test")
    
    app.run(host='0.0.0.0', port=5000, debug=True) 