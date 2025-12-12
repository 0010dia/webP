import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

// 한 번에 보여줄 아이템 개수와 간격
const ITEMS_PER_VIEW = 5;
const GAP = 20;
// 서버 주소 (배포 시 환경변수로 분리 권장)
const SERVER_URL = 'http://localhost:5000';

// --- Styled Components 정의 (기존과 동일) ---

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
  cursor: pointer; /* 클릭 가능 표시 */
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
  border-radius: 50%;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  const [items, setItems] = useState([]); // 실제 상품 데이터 저장
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  // 1. 서버에서 상품 데이터 불러오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/products`);
        const data = await response.json();
        
        if (data.success) {
          // 최신순 등으로 정렬되어 온다고 가정하고 상위 10개만 슬라이더에 표시
          setItems(data.products.slice(0, 10));
        }
      } catch (error) {
        console.error("상품 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 2. 화면 크기 계산 (기존 로직 유지)
  useEffect(() => {
    const updateCardWidth = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        // 카드가 너무 작아지지 않도록 최소 너비 보장 로직이 있으면 좋음
        const calculatedWidth = (containerWidth - (ITEMS_PER_VIEW - 1) * GAP) / ITEMS_PER_VIEW;
        setCardWidth(calculatedWidth);
      }
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    
    // items가 로드된 후에도 width를 다시 계산해야 정확함
    if (!loading) {
      updateCardWidth();
    }
    
    return () => window.removeEventListener('resize', updateCardWidth);
  }, [loading]); // loading 상태가 변할 때도 체크

  const handlePrev = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    const maxSlide = items.length - ITEMS_PER_VIEW;
    setCurrentSlide(prev => Math.min(maxSlide, prev + 1));
  };

  const offset = -currentSlide * (cardWidth + GAP);
  
  // items가 로드되지 않았거나 개수가 적을 때 처리
  const maxSlideIndex = Math.max(0, items.length - ITEMS_PER_VIEW);
  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide >= maxSlideIndex || items.length <= ITEMS_PER_VIEW;

  // 가격 포맷팅 함수 (1000 -> 1,000)
  const formatPrice = (price) => {
    return `₩${Number(price).toLocaleString()}`;
  };

  if (loading) {
    return <SlideWrapper>Loading...</SlideWrapper>;
  }

  if (items.length === 0) {
    return null; // 상품이 없으면 섹션 자체를 숨김
  }

  return (
    <SlideWrapper>
      <SectionTitle>
        실시간 인기
      </SectionTitle>

      <CarouselContainer>
        <CarouselTrack ref={containerRef}>
          {items.map((item, index) => {
            // 이미지 경로 처리: 전체 URL이 없으면 서버 주소 붙이기
            const imageUrl = item.images && item.images.length > 0 
              ? `${SERVER_URL}${item.images[0]}` 
              : '/img/no-image.png'; // 기본 이미지

            // 구매 가능한 사이즈만 필터링해서 배열로 변환
            const availableSizes = item.sizes
              ? item.sizes.filter(s => s.available).map(s => s.size)
              : [];

            return (
              <ItemCard
                key={item._id} // MongoDB의 _id 사용
                $cardWidth={cardWidth}
                $offset={offset}
                // 상세 페이지 이동 로직이 있다면 여기에 onClick 추가
                // onClick={() => window.location.href = `/products/${item._id}`}
              >
                <ImageContainer>
                  <ItemImage 
                    src={imageUrl} 
                    alt={item.name}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }} // 이미지 에러 시 대체
                  />
                  <RankBadge>
                    {index + 1}
                  </RankBadge>
                </ImageContainer>

                <CardBody>
                  <ItemName title={item.name}>
                    {item.name}
                  </ItemName>
                
                  {/* 백엔드에 color 필드가 없으므로 material이나 카테고리로 대체 */}
                  <ItemColor>
                    {item.material || item.category[0]} 
                  </ItemColor>

                  <PriceGroup>
                    {item.is_on_sale ? (
                      <>
                        <SalePrice>
                          {/* 할인된 가격 계산 로직이 없으면 그냥 price 표시하거나 별도 필드 필요 */}
                           {/* 여기선 일단 할인 로직이 복잡하니 원가만 표시하거나, 
                               백엔드에서 계산된 discountedPrice가 온다면 그것 사용 */}
                          {formatPrice(item.price * (1 - item.discountRate / 100))}
                        </SalePrice>
                        <OriginalPrice>
                          {formatPrice(item.price)}
                        </OriginalPrice>
                      </>
                    ) : (
                      <SalePrice>
                        {formatPrice(item.price)}
                      </SalePrice>
                    )}
                  </PriceGroup>

                  <AvailableSizesText>
                    <CheckIcon>✓</CheckIcon>
                    주문 가능 사이즈
                  </AvailableSizesText>

                  <SizeGroup>
                    {availableSizes.slice(0, 5).map(size => ( // 공간상 5개만 표시
                      <SizeBadge key={size}>
                        {size}
                      </SizeBadge>
                    ))}
                    {availableSizes.length > 5 && (
                      <SizeBadge>+{availableSizes.length - 5}</SizeBadge>
                    )}
                  </SizeGroup>
                </CardBody>
              </ItemCard>
            );
          })}
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