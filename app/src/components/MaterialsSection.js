import React from 'react';
import styled from 'styled-components';

const materials = [
  {
    title: 'ZQ 메리노 울',
    subtitle: '최상급 울 소재',
    image: '/img/Material1.png',
    buttonText: '더 알아보기'
  },
  {
    title: '유칼립투스 나무',
    subtitle: '실크처럼 매끄러운 촉감',
    image: '/img/Material2.png',
    buttonText: '더 알아보기'
  },
  {
    title: '사탕수수',
    subtitle: '부드러운 SweetFoam®의 주 소재',
    image: '/img/Material3.png',
    buttonText: '더 알아보기'
  }
];


const SectionWrapper = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 2em;
  font-weight: 400;
  text-align: left;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  max-width: 1340px;
  margin: 0 auto 60px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1340px;
  margin: 0 auto;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const MaterialCard = styled.div`
  background: white;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

const ImageWrapper = styled.div`
  overflow: hidden;
  border-radius: 4px 4px 0 0;
`;

const CardImage = styled.img`
  width: 100%;
  height: 440px;
  object-fit: cover;
  display: block;

  @media (max-width: 992px) {
    height: 350px;
  }
  @media (max-width: 600px) {
    height: 300px;
  }
`;

const CardBody = styled.div`
  padding: 20px 25px;
`;

const CardTitle = styled.h3`
  font-size: 1em;
  font-weight: 800;
  margin-top: 0px;
  margin-bottom: 5px;
  color: #555;
`;

const CardSubtitle = styled.p`
  font-size: 1.5em;
  margin-bottom: 18px;
  color: #333;
`;

const CardButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 1px solid #333;
  background: transparent;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 40px;
  color: #333;

  &:hover {
    background-color: #333;
    color: white;
  }
`;


const MaterialsSection = () => {
  return (
    <SectionWrapper>
      <SectionTitle>
        우리가 사용하는 소재
      </SectionTitle>

      <GridContainer>
        {materials.map((material, index) => (
          <MaterialCard key={index}>
            <ImageWrapper>
              <CardImage 
                src={material.image}
                alt={material.title}
              />
            </ImageWrapper>
            <CardBody>
              <CardTitle>
                {material.title}
              </CardTitle>
              <CardSubtitle>
                {material.subtitle}
              </CardSubtitle>
              <CardButton>
                {material.buttonText}
              </CardButton>
            </CardBody>
          </MaterialCard>
        ))}
      </GridContainer>
    </SectionWrapper>
  );
};

export default MaterialsSection;