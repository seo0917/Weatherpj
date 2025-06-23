import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { recordAPI, emotionAPI, aiAnalysisAPI } from '../services/api';
import homeIcon from '../assets/home.svg';
import homeActiveIcon from '../assets/home_act.svg';
import mapIcon from '../assets/map.svg';
import mapActiveIcon from '../assets/map_act.svg';
import myIcon from '../assets/my.svg';
import myActiveIcon from '../assets/my_act.svg';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Container = styled.div`
  padding: 15px;
  background: #fff;
  min-height: 100vh;
`;

const TopBar = styled.div`
  display: flex; 
  align-items: center; 
  justify-content: space-between;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #234E83;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f4fa;
  }
`;

const DateRange = styled.div`
  font-size: 16px; 
  color: #888;
`;

const Summary = styled.div`
  margin: 16px 0; 
  font-size: 18px; 
  color: #333;
`;

const Toggle = styled.button`
  background: #f5f5f5; 
  border: 1px solid #ddd; 
  border-radius: 20px; 
  padding: 6px 18px; 
  font-size: 16px; 
  color: #555; 
  margin-left: 8px; 
  cursor: pointer;
`;

const TabBar = styled.div`
  display: flex;
  margin: 24px 0 12px 0;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-weight: bold;
  cursor: pointer;
  border-bottom: 3px solid ${props => props.active ? '#234E83' : 'transparent'};
  color: ${props => props.active ? '#234E83' : '#bbb'};
  background: #fff;
`;

const BubbleChartArea = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 32px;
  margin: 40px 0 24px 0;
  height: 200px;
`;

const pastelGradients = [
  'linear-gradient(135deg, #b7eaff 0%, #a3c8f5 100%)', // 파랑
  'linear-gradient(135deg, #ffe6e6 0%, #ffd6e0 100%)', // 핑크
  'linear-gradient(135deg, #fff6b7 0%, #fceabb 100%)', // 노랑
  'linear-gradient(135deg, #e0ffd6 0%, #b7f8e4 100%)', // 연두
  'linear-gradient(135deg, #fceabb 0%, #f8b7ff 100%)', // 보라
  'linear-gradient(135deg, #ffe6fa 0%, #e0d6ff 100%)', // 연보라
];

const BubbleChartWrap = styled.div`
  position: relative;
  width: 340px;
  height: 220px;
  margin: 0 auto 24px auto;
`;

const BubbleStyled = styled.div`
  position: absolute;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.bg};
  border-radius: 50%;
  color: #234E83;
  font-weight: bold;
  font-size: 15px;
  text-align: center;
  word-break: keep-all;
  line-height: 1.2;
  box-shadow: 0 2px 8px 0 rgba(60, 80, 120, 0.07);
  user-select: none;
  transition: box-shadow 0.2s, transform 0.2s;
  z-index: ${props => props.z || 1};
`;

const BubblePercent = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #234E83;
  margin-top: 6px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1.5px solid #e0e7ef;
  margin: 24px 0 16px 0;
`;

const Desc = styled.div`
  color: #888;
  font-size: 15px;
  margin-bottom: 24px;
`;

const RecordList = styled.div`
  margin-top: 12px;
`;

const RecordItem = styled.div`
  background: #f7faff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  color: #234E83;
  font-family: Pretendard;
`;

const RecordDate = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #557CA1;
`;

const RecordContent = styled.div`
  font-size: 15px;
  line-height: 1.5;
`;

const Loading = styled.div`
  color: #234E83;
  font-size: 18px;
  text-align: center;
  margin: 40px 0;
`;

const ErrorMsg = styled.div`
  color: #d32f2f;
  background: #fff0f0;
  border-radius: 8px;
  padding: 12px;
  margin: 24px 0;
  text-align: center;
`;

const WeekControl = styled.button`
  background: #f5f5f5; 
  border: 1px solid #ddd; 
  border-radius: 20px; 
  padding: 6px 12px; 
  font-size: 16px; 
  color: #555; 
  margin: 0 8px; 
  cursor: pointer;
`;

const DetailContainer = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
`;

const AIAnalysisContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const AIAnalysisTitle = styled.h3`
  color: #191f28;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: left;
  letter-spacing: -0.5px;
`;

const AIAnalysisSection = styled.div`
  margin-bottom: 20px;
  padding: 0;
  background: transparent;
  border-radius: 0;
`;

const AIAnalysisSectionTitle = styled.h4`
  color: #8b95a1;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AIAnalysisContent = styled.p`
  color: #191f28;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 16px 0;
  font-weight: 400;
`;

const SectionTitle = styled.h3`
  color: #234E83;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const DetailRecordItem = styled.div`
  background: rgba(255,255,255,0.8);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255,255,255,0.9);
    transform: translateY(-2px);
  }
`;

const DetailRecordDate = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #557CA1;
`;

const DetailRecordContent = styled.div`
  font-size: 15px;
  line-height: 1.5;
  color: #234E83;
`;

const NoRecordsText = styled.div`
  color: #888;
  text-align: center;
  font-style: italic;
  padding: 20px;
`;

const EditForm = styled.div`
  background: rgba(255,255,255,0.95);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 2px solid #234E83;
`;

const EditInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 14px;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 60px;
`;

const EditButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const EditButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  &.save {
    background: #234E83;
    color: white;
    
    &:hover {
      background: #1a3a6b;
    }
  }
  
  &.cancel {
    background: #f5f5f5;
    color: #666;
    
    &:hover {
      background: #e0e0e0;
    }
  }
  
  &.delete {
    background: #d32f2f;
    color: white;
    
    &:hover {
      background: #b71c1c;
    }
  }
`;

const EmotionChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 32px;
  margin: 40px 0 24px 0;
  height: 200px;
`;

const EmotionBubble = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: #fff;
  border: 3.5px solid #b7c6e6;
  box-shadow: 0 8px 32px 0 rgba(60, 80, 120, 0.2), 0 4px 16px 0 rgba(60, 80, 120, 0.1);
  border-radius: 50%;
  color: #234E83;
  font-weight: bold;
  font-size: ${props => props.fontSize}px;
  transition: all 0.3s ease;
  text-align: center;
  word-break: keep-all;
  line-height: 1.2;
  transform: translateY(-10px);
  
  &:hover {
    transform: translateY(-15px);
    box-shadow: 0 12px 40px 0 rgba(60, 80, 120, 0.25), 0 6px 20px 0 rgba(60, 80, 120, 0.15);
  }
`;

const EmotionPercentage = styled.div`
  font-size: ${props => props.fontSize}px;
  font-weight: bold;
  color: #234E83;
  margin-top: 4px;
`;

export default function WeeklyReportPage() {
  const [tab, setTab] = useState('my');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [desc, setDesc] = useState('');
  const [editingEmotion, setEditingEmotion] = useState(null);
  const [editForm, setEditForm] = useState({
    emotionType: '',
    intensity: 0,
    percentage: 0
  });
  const navigate = useNavigate();

  // 날짜 관련 유틸리티 함수들
  const getWeekRange = (date) => {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay();
    const last = first + 6;
    
    const firstDay = new Date(curr.setDate(first));
    const lastDay = new Date(curr.setDate(last));
    
    return { 
      start: firstDay.toISOString().split('T')[0], 
      end: lastDay.toISOString().split('T')[0] 
    };
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const getDateRangeText = () => {
    const { start, end } = getWeekRange(currentDate);
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  useEffect(() => {
    fetchData();
  }, [tab, currentDate]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const weekRange = getWeekRange(currentDate);
      
      // 주간 기록 조회
      const recordsData = await recordAPI.getWeeklyRecords(weekRange.start, weekRange.end);
      setRecords(recordsData || []);
      
      // 주간 감정분석 수행 (기록이 있을 때만)
      if (recordsData && recordsData.length > 0) {
        console.log('주간 감정분석 시작 - 기록 수:', recordsData.length);
        try {
          const analysisResult = await emotionAPI.analyzeWeeklyEmotions(weekRange.start, weekRange.end);
          console.log('주간 감정분석 완료:', analysisResult);
        } catch (error) {
          console.error('주간 감정분석 실패:', error);
        }
      } else {
        console.log('분석할 기록이 없음');
      }
      
      // 감정분석 결과 조회
      console.log('감정분석 결과 조회 시작');
      const emotionsData = await emotionAPI.getWeeklyEmotions(weekRange.start, weekRange.end);
      console.log('감정분석 결과 조회 완료:', emotionsData);
      setEmotions(emotionsData || []);
      
      // AI 분석 조회 (기록이 있을 때만)
      if (recordsData && recordsData.length > 0) {
        try {
          console.log('AI 분석 조회 시작');
          const aiAnalysisData = await aiAnalysisAPI.getWeeklyAnalysis(weekRange.start, weekRange.end);
          console.log('AI 분석 조회 완료:', aiAnalysisData);
          setAiAnalysis(aiAnalysisData);
        } catch (error) {
          console.error('AI 분석 조회 실패:', error);
          setAiAnalysis(null);
        }
      } else {
        setAiAnalysis(null);
      }
      
      if (tab === 'my') {
      } else {
        setDesc('공동 기록에 대한 감정 분석 결과입니다.');
      }
      
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 버블 크기 계산 (최소 60, 최대 140)
  const getBubbleSize = (percent, ratio) => {
    const min = 20, max = 200;
    // ratio 값을 기준으로 버블 크기 계산
    return min + ((max - min) * (ratio / 100));
  };

  const formatDisplayDate = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return new Date(date).toLocaleDateString('ko-KR', options);
  };

  // 감정 원형 차트 크기 계산
  const getEmotionBubbleSize = (ratio) => {
    const min = 20, max = 200;
    return min + ((max - min) * (ratio / 100));
  };

  // 감정 원형 차트 폰트 크기 계산
  const getEmotionFontSize = (ratio) => {
    const min = 10, max = 16;
    return min + ((max - min) * (ratio / 100));
  };

  // 통계 요약 함수
  const getEmotionSummaryLines = (emotions) => {
    if (!emotions || emotions.length === 0) return [];
    const sorted = [...emotions].sort((a, b) => b.percentage - a.percentage);
    const top = sorted[0];
    const second = sorted[1];
    const last = sorted[sorted.length - 1];
    const lines = [];
    if (top && top.percentage > 0) {
      lines.push(`이번 주에는 "${top.emotionType}" 감정을 가장 많이 느꼈어요.`);
    }
    if (second && second.percentage > 0) {
      lines.push(`그 다음으로는 "${second.emotionType}" 감정이 자주 등장했네요.`);
    }
    if (last && last !== top && last.percentage > 0) {
      lines.push(`반면 "${last.emotionType}" 감정은 거의 느끼지 않았어요.`);
    }
    if (lines.length === 0) lines.push('이번 주에는 특별히 두드러진 감정이 없었어요.');
    return lines;
  };

  // 감정분석 데이터 수정 시작
  const startEdit = (emotion) => {
    setEditingEmotion(emotion);
    setEditForm({
      emotionType: emotion.emotionType,
      intensity: emotion.intensity,
      percentage: emotion.percentage
    });
  };

  // 감정분석 데이터 수정 저장
  const saveEdit = async () => {
    try {
      const weekRange = getWeekRange(currentDate);
      
      if (editingEmotion.id) {
        // 기존 데이터 업데이트
        await emotionAPI.updateEmotion(editingEmotion.id, editForm);
      } else {
        // 새 데이터 저장 (현재 주의 날짜 범위 사용)
        await emotionAPI.saveEmotion({
          ...editForm,
          date: weekRange.start,
          weekStart: weekRange.start,
          weekEnd: weekRange.end
        });
      }
      
      // 데이터 다시 로드
      await fetchData();
      setEditingEmotion(null);
      setEditForm({ emotionType: '', intensity: 0, percentage: 0 });
    } catch (error) {
      console.error('감정분석 데이터 저장 실패:', error);
      setError('감정분석 데이터 저장에 실패했습니다.');
    }
  };

  // 감정분석 데이터 수정 취소
  const cancelEdit = () => {
    setEditingEmotion(null);
    setEditForm({ emotionType: '', intensity: 0, percentage: 0 });
  };

  // 감정분석 데이터 삭제
  const deleteEmotion = async (emotionId) => {
    if (!window.confirm('이 감정분석 데이터를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await emotionAPI.deleteEmotion(emotionId);
      await fetchData();
    } catch (error) {
      console.error('감정분석 데이터 삭제 실패:', error);
      setError('감정분석 데이터 삭제에 실패했습니다.');
    }
  };

  return (
    <Container>
      <TopBar>
        <BackButton onClick={()=>navigate('/home')}>&lt;</BackButton>
        <DateRange>{getDateRangeText()}</DateRange>
        <div>
          <WeekControl onClick={handlePrevWeek}>&lt;</WeekControl>
          <Toggle>Week</Toggle>
          <WeekControl onClick={handleNextWeek}>&gt;</WeekControl>
        </div>
      </TopBar>
      <Summary>
        이번 주엔 흐린 날이 많았지만,<br />
        오히려 편안했던 순간이 많았어요.
      </Summary>
      <TabBar>
        <Tab active={tab==='my'} onClick={()=>setTab('my')}>My Record</Tab>
        <Tab active={tab==='our'} onClick={()=>setTab('our')}>Our Record</Tab>
      </TabBar>
      
      {/* My Record 탭일 때만 버블 차트 표시 */}
      {tab === 'my' && (
        <>
          <BubbleChartWrap>
            {emotions.length === 0 && <div style={{color:'#bbb',textAlign:'center'}}>감정 데이터 없음</div>}
            {emotions.map((emotion, idx) => {
              const ratio = emotion.percentage;
              const size = getBubbleSize(emotion.percent, ratio);
              // 버블 위치와 zIndex를 감정별로 다르게(자연스러운 배치)
              const positions = [
                { left: 10, top: 15, z: 2 },
                { left: 65, top: 10, z: 3 },
                { left: 40, top: 60, z: 1 },
                { left: 75, top: 65, z: 2 },
                { left: 20, top: 70, z: 1 },
                { left: 50, top: 35, z: 2 },
                { left: 30, top: 45, z: 3 },
                { left: 80, top: 40, z: 1 },
                { left: 5, top: 50, z: 2 },
                { left: 60, top: 80, z: 1 },
              ];
              const pos = positions[idx % positions.length];
              const bg = pastelGradients[idx % pastelGradients.length];
              return (
                <BubbleStyled
                  key={idx}
                  size={size}
                  left={pos.left}
                  top={pos.top}
                  bg={bg}
                  z={pos.z}
                >
                  <div style={{whiteSpace:'pre-line', fontWeight:600}}>{emotion.emotionType}</div>
                  <BubblePercent>{ratio.toFixed(1)}%</BubblePercent>
                </BubbleStyled>
              );
            })}
          </BubbleChartWrap>
          
          {/* AI 분석 결과 */}
          {aiAnalysis && (
            <AIAnalysisContainer>
              <AIAnalysisTitle>이번 주 리포트</AIAnalysisTitle>
              
              {aiAnalysis.emotionChange && (
                <AIAnalysisSection>
                  <AIAnalysisSectionTitle>감정 변화</AIAnalysisSectionTitle>
                  <AIAnalysisContent>{aiAnalysis.emotionChange}</AIAnalysisContent>
                </AIAnalysisSection>
              )}
              
              {aiAnalysis.mainEmotion && (
                <AIAnalysisSection>
                  <AIAnalysisSectionTitle>주요 감정</AIAnalysisSectionTitle>
                  <AIAnalysisContent>{aiAnalysis.mainEmotion}</AIAnalysisContent>
                </AIAnalysisSection>
              )}
              
              {aiAnalysis.emotionPattern && (
                <AIAnalysisSection>
                  <AIAnalysisSectionTitle>감정 패턴</AIAnalysisSectionTitle>
                  <AIAnalysisContent>{aiAnalysis.emotionPattern}</AIAnalysisContent>
                </AIAnalysisSection>
              )}
              
              {aiAnalysis.weatherEmotionCorrelation && (
                <AIAnalysisSection>
                  <AIAnalysisSectionTitle>날씨와 감정</AIAnalysisSectionTitle>
                  <AIAnalysisContent>{aiAnalysis.weatherEmotionCorrelation}</AIAnalysisContent>
                </AIAnalysisSection>
              )}
              
              {aiAnalysis.personalizedInsights && (
                <AIAnalysisSection>
                  <AIAnalysisSectionTitle>인사이트</AIAnalysisSectionTitle>
                  <AIAnalysisContent>{aiAnalysis.personalizedInsights}</AIAnalysisContent>
                </AIAnalysisSection>
              )}
            </AIAnalysisContainer>
          )}
        </>
      )}
      
      {loading ? <Loading>로딩 중...</Loading> : error ? <ErrorMsg>{error}</ErrorMsg> : <>
        <Desc>{desc}</Desc>

        {/* My Record 탭일 때만 상세 정보 표시 */}
        {tab === 'my' && (
          <>
            {/* 주간 기록 상세 */}
            <DetailContainer>
              <SectionTitle>이번 주 기록</SectionTitle>
              {records.length > 0 ? (
                records.map((record, index) => (
                  <DetailRecordItem key={index}>
                    <DetailRecordDate>
                      {formatDisplayDate(record.recordDate)}
                    </DetailRecordDate>
                    <DetailRecordContent>
                      {record.content}
                    </DetailRecordContent>
                  </DetailRecordItem>
                ))
              ) : (
                <NoRecordsText>아직 기록된 내용이 없습니다.</NoRecordsText>
              )}
            </DetailContainer>

            {/* 감정 분석 상세 */}
            <DetailContainer>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <SectionTitle>감정 분석 상세</SectionTitle>
              </div>
              {emotions.length > 0 ? (
                emotions.map((emotion, index) => (
                  <div key={index}>
                    {editingEmotion && editingEmotion === emotion ? (
                      <EditForm>
                        <EditInput
                          type="text"
                          placeholder="감정 유형"
                          value={editForm.emotionType}
                          onChange={(e) => setEditForm({...editForm, emotionType: e.target.value})}
                        />
                        <EditInput
                          type="number"
                          placeholder="강도 (0-1)"
                          min="0"
                          max="1"
                          step="0.1"
                          value={editForm.intensity}
                          onChange={(e) => setEditForm({...editForm, intensity: parseFloat(e.target.value)})}
                        />
                        <EditInput
                          type="number"
                          placeholder="비율 (%)"
                          min="0"
                          max="100"
                          step="0.1"
                          value={editForm.percentage}
                          onChange={(e) => setEditForm({...editForm, percentage: parseFloat(e.target.value)})}
                        />
                        <EditButtonGroup>
                          <EditButton className="save" onClick={saveEdit}>
                            저장
                          </EditButton>
                          <EditButton className="cancel" onClick={cancelEdit}>
                            취소
                          </EditButton>
                          {emotion.id && (
                            <EditButton className="delete" onClick={() => deleteEmotion(emotion.id)}>
                              삭제
                            </EditButton>
                          )}
                        </EditButtonGroup>
                      </EditForm>
                    ) : (
                      <DetailRecordItem onClick={() => startEdit(emotion)}>
                        <DetailRecordDate>{emotion.emotionType}</DetailRecordDate>
                        <DetailRecordContent>
                          강도: {(emotion.intensity * 100).toFixed(1)}% | 
                          비율: {emotion.percentage.toFixed(1)}%
                        </DetailRecordContent>
                      </DetailRecordItem>
                    )}
                  </div>
                ))
              ) : (
                <NoRecordsText>감정 분석 데이터가 없습니다.</NoRecordsText>
              )}
            </DetailContainer>
          </>
        )}

        {/* Our Record 탭일 때는 기존 리스트 표시 */}
        {tab === 'our' && (
          <RecordList>
            {records.length === 0 && <div style={{color:'#bbb', textAlign:'center'}}>기록 없음</div>}
            {records.map((rec, i) => (
              <RecordItem key={i}>
                <RecordDate>{rec.date}</RecordDate>
                <RecordContent>{rec.content}</RecordContent>
              </RecordItem>
            ))}
          </RecordList>
        )}
      </>}
      <Navbar />
    </Container>
  );
} 