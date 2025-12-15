import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const POPULAR_ITEMS = [
  { id: 1, name: "여성 울 대시 미들", color: "스토니 크림 (내추럴 화이트)", category: "라이프스타일", price: "₩98,000", originalPrice: "₩209,000", sizes: [240, 245], image: "/img/1.avif" },
  { id: 2, name: "남성 울 대시 미들", color: "스토니 크림 (내추럴 화이트)", category: "라이프스타일", price: "₩98,000", originalPrice: "₩200,000", sizes: [260, 265, 270, 275, 280], image: "/img/2.avif" },
  { id: 3, name: "여성 울 러너 고 플리프", color: "내추럴 화이트 (블랙)", category: "슬립온", price: "₩78,000", originalPrice: "₩180,000", sizes: [235, 240, 245, 250, 255], image: "/img/3.avif" },
  { id: 4, name: "남성 트리 러너", color: "제트 블랙 (블랙)", category: "라이프스타일", price: "₩78,000", originalPrice: "₩150,000", sizes: [260, 270, 280, 290, 300], image: "/img/4.avif" },
  { id: 5, name: "남성 울 러너 NZ", color: "내추럴 블랙 (내추럴 블랙)", category: "슬립온", price: "₩119,000", originalPrice: "₩170,000", sizes: [260, 265, 270, 275, 280], image: "/img/5.avif" },
  { id: 6, name: "여성 울 트리퍼", color: "미드나잇 블루", category: "라이프스타일", price: "₩89,000", originalPrice: "₩160,000", sizes: [255, 265, 275, 285], image: "/img/6.avif" },
  { id: 7, name: "남성 러너 NZ", color: "스카이 그레이", category: "슬립온", price: "₩129,000", originalPrice: "₩189,000", sizes: [240, 245, 250], image: "/img/1.avif" },
  { id: 8, name: "여성 스프링 런", color: "피치 베이지", category: "라이프스타일", price: "₩95,000", originalPrice: "₩175,000", sizes: [235, 240, 245, 250], image: "/img/2.avif" },
  { id: 9, name: "남성 컴포트 슬립", color: "다크 네이비", category: "슬립온", price: "₩105,000", originalPrice: "₩165,000", sizes: [260, 270, 280, 290], image: "/img/3.avif" },
  { id: 10, name: "여성 클래식 워커", color: "라이트 그레이", category: "라이프스타일", price: "₩115,000", originalPrice: "₩195,000", sizes: [235, 240, 245, 250, 255], image: "/img/4.avif" },
];

const ITEMS_PER_VIEW = 5;
const GAP = 20;

// --- Styled Components 정의 ---

const SlideWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 40px auto;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  padding: 0 20px;
`;

const SectionTitle = styled.h2`
  font-size: 2em;
  font-weight: 400;
  text-align: left;
  max-width: 1340px;
  margin: 0 auto 60px;
`;

const CarouselContainer = styled.div`
  position: relative;
  padding: 0 40px;
`;

const CarouselTrack = styled.div`
  display: flex;
  overflow: hidden;
  gap: ${GAP}px;
`;

const ItemCard = styled.div.attrs(props => ({
  style: {
    flex: `0 0 ${props.$cardWidth}px`,
    minWidth: `${props.$cardWidth}px`,
    transform: `translateX(${props.$offset}px)`,
  }
}))`
  background: #fafafa;
  border: 1px solid #e8e8e8;
  text-align: left;
  transition: transform 0.5s ease;
  box-sizing: border-box;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: #f5f5f5;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RankBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-block;
  background: black;
  color: white;
  font-weight: bold;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 0.9em;
`;

const CardBody = styled.div`
  padding: 12px;
`;

const ItemName = styled.p`
  font-weight: bold;
  font-size: 0.85em;
  margin-bottom: 3px;
  line-height: 1.3;
  color: #333;
  margin-top: 0;
`;

const ItemColor = styled.p`
  font-size: 0.75em;
  color: #999;
  margin-bottom: 8px;
  margin-top: 0;
`;

const PriceGroup = styled.div`
  margin-top: 8px;
  margin-bottom: 12px;
`;

const SalePrice = styled.span`
  font-weight: bold;
  color: #333;
  font-size: 1em;
  margin-right: 8px;
`;

const OriginalPrice = styled.span`
  color: #bbb;
  text-decoration: line-through;
  font-size: 0.85em;
`;

const AvailableSizesText = styled.div`
  color: #5cb85c;
  font-size: 0.75em;
  margin: 10px 0 6px;
  display: flex;
  align-items: center;
`;

const CheckIcon = styled.span`
  margin-right: 4px;
`;

const SizeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
`;

const SizeBadge = styled.span`
  padding: 4px 7px;
  border: 1px solid #ddd;
  font-size: 0.75em;
  color: #666;
  cursor: default;
  background: white;
  border-radius: 2px;
`;

const NavButton = styled.button.attrs(props => ({
  disabled: props.$disabled,
}))`
  position: absolute;
  left: ${props => props.$direction === 'prev' ? '0' : 'auto'};
  right: ${props => props.$direction === 'next' ? '0' : 'auto'};
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 50%;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-size: 1.2em;
  font-weight: 300;
  line-height: 40px;
  text-align: center;
  z-index: 20;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.$disabled ? 0.4 : 1};
  transition: opacity 0.3s, background 0.3s;
  
  &:hover:not(:disabled) {
    background: #f5f5f5;
  }
`;

// --- 컴포넌트 ---

const Slide = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const updateCardWidth = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        const calculatedWidth = (containerWidth - (ITEMS_PER_VIEW - 1) * GAP) / ITEMS_PER_VIEW;
        setCardWidth(calculatedWidth);
      }
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  const handlePrev = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    const maxSlide = POPULAR_ITEMS.length - ITEMS_PER_VIEW;
    setCurrentSlide(prev => Math.min(maxSlide, prev + 1));
  };

  const offset = -currentSlide * (cardWidth + GAP);
  const maxSlideIndex = POPULAR_ITEMS.length - ITEMS_PER_VIEW;
  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide >= maxSlideIndex;

  return (
    <SlideWrapper>
      <SectionTitle>
        실시간 인기
      </SectionTitle>

      <CarouselContainer>
        <CarouselTrack 
          ref={containerRef}
        >
          {POPULAR_ITEMS.map((item, index) => (
            <ItemCard
              key={item.id}
              $cardWidth={cardWidth}
              $offset={offset}
            >
              <ImageContainer>
                <ItemImage 
                  src={item.image} 
                  alt={item.name}
                />
                <RankBadge>
                  {index + 1}
                </RankBadge>
              </ImageContainer>

              <CardBody>
                <ItemName>
                  {item.name}
                </ItemName>
              
                <ItemColor>
                  {item.color}
                </ItemColor>

                <PriceGroup>
                  <SalePrice>
                    {item.price}
                  </SalePrice>
                  <OriginalPrice>
                    {item.originalPrice}
                  </OriginalPrice>
                </PriceGroup>

                <AvailableSizesText>
                  <CheckIcon>✓</CheckIcon>
                  주문 가능 사이즈
                </AvailableSizesText>

                <SizeGroup>
                  {item.sizes.map(size => (
                    <SizeBadge
                      key={size}
                    >
                      {size}
                    </SizeBadge>
                  ))}
                </SizeGroup>
              </CardBody>
            </ItemCard>
          ))}
        </CarouselTrack>

        <NavButton
          onClick={handlePrev}
          $disabled={isPrevDisabled}
          $direction="prev"
          aria-label="이전 상품"
        >
          &lt;
        </NavButton>

        <NavButton
          onClick={handleNext}
          $disabled={isNextDisabled}
          $direction="next"
          aria-label="다음 상품"
        >
          &gt;
        </NavButton>
      </CarouselContainer>
    </SlideWrapper>
  );
};

export default Slide;
