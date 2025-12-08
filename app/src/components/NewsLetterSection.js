import React, { useState } from 'react';
import styled from 'styled-components';

const features = [
  {
    title: '매일 경험하는 편안함',
    description: '올버즈는 마치 구름 위를 걷는 듯한 가벼움과, 바람처럼 자유로운 탄력을 선사합니다. 놀라운 편안함은 긴 여정도 쉽고 산책처럼 느껴집니다.',
    image: '/img/Material4.png'
  },
  {
    title: '지속 가능한 발걸음',
    description: '소재를 고르는 순간부터 신발이 당신에게 닿기 전까지 그 순간까지 지구에 남기는 흔적을 헤아립니다. 탄소 발자국을 제로에 가깝게 줄이려는 노력에 동참해주세요.',
    image: '/img/Material5.png'
  },
  {
    title: '지구에서 온 소재',
    description: '올버즈는 기술과 모든 곳에서 석유 기반 합성소재를 전연 대안으로 대체합니다. 울, 나무, 사탕수수 같은 자연 소재는 부드럽고 통기성이 좋습니다.',
    image: '/img/Material6.png'
  }
];

const SectionWrapper = styled.div`
  width: 100%;
  margin-top: 80px;
`;

const HeaderContainer = styled.div`
  max-width: 800px;
  margin: 0 auto 100px;
  text-align: center;
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

const MainTitle = styled.p`
  font-size: 3em;
  margin-bottom: -10px;
  margin-top: 0;
  line-height: 1.2;
`;

const SubText = styled.p`
  font-size: 1em;
  color: #666;
  margin-bottom: 30px;
`;

const FormContainer = styled.div`
  display: flex;
  gap: 10px;
  max-width: 500px;
  margin: 0 auto;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 15px 20px;
  border: 1px solid #ddd;
  font-size: 1em;
  outline: none;
  border-radius: 4px;
`;

const SubscribeButton = styled.button`
  padding: 15px 30px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #000;
  }
`;

const DisclaimerText = styled.p`
  font-size: 0.75em;
  color: #999;
  margin-top: 20px;
  line-height: 1.5;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 1300px;
  margin: 0 auto 40px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

const FeatureImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.p`
  font-size: 1.5em;
  margin-bottom: 15px;
  font-weight: 500;
`;

const FeatureDescription = styled.p`
  font-size: 0.95em;
  color: #666;
  line-height: 1.6;
`;


const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email) {
      alert(`구독 신청: ${email}`);
      setEmail('');
    }
  };

  return (
    <SectionWrapper>
      <HeaderContainer>
        <MainTitle>
          올버즈 뉴스레터 구독
        </MainTitle>
        <SubText>
          최신 신제품 소식과 혜택을 가장 먼저 받아보세요.
        </SubText>
        
        <FormContainer>
          <EmailInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SubscribeButton onClick={handleSubmit}>
            구독
          </SubscribeButton>
        </FormContainer>
        
        <DisclaimerText>
          구독 시 마케팅 이메일 수신에 동의하게 됩니다. 자세한 내용은 개인정보 처리방침 및 이용약관을 확인해 주세요.
        </DisclaimerText>
      </HeaderContainer>

      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <FeatureImage 
              src={feature.image}
              alt={feature.title}
            />
            <FeatureTitle>
              {feature.title}
            </FeatureTitle>
            <FeatureDescription>
              {feature.description}
            </FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </SectionWrapper>
  );
}
export default NewsletterSection;