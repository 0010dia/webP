import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { getProductById } from '../api/products';
import CartDrawer from '../components/CartDrawer'; // 🟢 1. CartDrawer 임포트

// --- 목업 데이터 (기존 유지) ---
const MOCK_PRODUCT = {
  _id: '1',
  name: "남성 트리 러너 NZ",
  price: 170000,
  description: "최상의 편안함을 위해 세심하게 만들어진 트리 러너 NZ는 메모리폼 풋베드로 다양한 발 형태에도 유연하게 대응해, 누구에게나 안정적인 착화감을 제공합니다.",
  badge: "NEW",
  colors: [
    { code: 'black', name: '내추럴 블랙 (Natural Black)', image: "/img/black_4.avif", thumb: "/img/black_4.avif" },
    { code: 'grey', name: '미스트 그레이 (Mist Grey)', image: "/img/grey_4.avif", thumb: "/img/grey_4.avif" },
    { code: 'beige', name: '헤이지 베이지 (Hazy Beige)', image: "/img/4.avif", thumb: "/img/4.avif" },
    { code: 'navy', name: '트루 네이비 (True Navy)', image: "/img/navy_4.avif", thumb: "/img/navy_4.avif" }
  ]
};

const SIZES = [250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300];

// --- Styled Components (기존 코드 그대로 유지) ---
const PageContainer = styled.div` max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: 'Pretendard', 'Helvetica Neue', Arial, sans-serif; color: #212121; `;
const ContentGrid = styled.div` display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px; margin-bottom: 80px; @media (max-width: 992px) { grid-template-columns: 1fr; } `;
const LeftSection = styled.div` width: 100%; `;
const ImageContainer = styled.div` position: relative; width: 100%; padding-bottom: 100%; background-color: #eaddcf; margin-bottom: 0; `;
const MainImage = styled.img` position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); width: 85%; height: auto; object-fit: contain; mix-blend-mode: multiply; `;
const NewBadge = styled.div` position: absolute; top: 30px; left: 30px; background: white; padding: 6px 10px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; z-index: 10; font-style: italic; `;
const SliderControlsOverlay = styled.div` position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 20px; z-index: 20; width: auto; padding: 0 20px; `;
const ButtonGroup = styled.div` display: flex; `;
const NavBtn = styled.button` width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; font-size: 20px; transition: opacity 0.2s; &.prev { background: white; color: #212121; } &.next { background: #212121; color: white; } &:hover { opacity: 0.9; } `;
const ProgressBarContainer = styled.div` display: flex; gap: 10px; align-items: center; `;
const ProgressLine = styled.div` width: ${props => props.$active ? '60px' : '30px'}; height: 2px; background-color: ${props => props.$active ? '#212121' : 'white'}; cursor: pointer; transition: all 0.3s ease; border-radius: 2px; `;
const AccordionWrapper = styled.div` border-top: none; margin-top: 0; `;
const AccordionItem = styled.div` border-bottom: 1px solid #e0e0e0; border-top: 1px solid #e0e0e0; margin-top: -1px; `;
const AccordionHeader = styled.div` padding: 22px 0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-weight: 500; font-size: 16px; user-select: none; `;
const AccordionContent = styled.div` padding-bottom: 25px; font-size: 14px; line-height: 1.6; color: #555; display: ${props => props.$isOpen ? 'block' : 'none'}; `;
const RightSection = styled.div` padding-top: 10px; `;
const Breadcrumb = styled.div` font-size: 12px; color: #666; margin-bottom: 20px; display: flex; align-items: center; gap: 5px; `;
const ProductTitle = styled.h1` font-size: 42px; font-weight: 400; margin: 0 0 15px 0; letter-spacing: -1px; `;
const Price = styled.div` font-size: 20px; font-weight: 400; margin-bottom: 25px; `;
const Description = styled.p` font-size: 15px; line-height: 1.6; color: #333; margin-bottom: 40px; `;
const OptionLabel = styled.div` font-size: 13px; font-weight: bold; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; `;
const ColorGrid = styled.div` display: flex; gap: 12px; margin-bottom: 35px; flex-wrap: wrap; `;
const ColorThumbnail = styled.img` width: 65px; height: 45px; object-fit: cover; border: 1px solid ${props => props.$active ? '#212121' : '#eee'}; padding: 2px; cursor: pointer; background: #f5f5f5; opacity: ${props => props.$active ? 1 : 0.6}; &:hover { opacity: 1; border-color: #999; } `;
const GenderToggle = styled.div` display: flex; margin-bottom: 35px; border: 1px solid #e0e0e0; `;
const GenderBtn = styled.button` flex: 1; padding: 14px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; background: ${props => props.$active ? '#212121' : '#fff'}; color: ${props => props.$active ? '#fff' : '#212121'}; `;
const SizeGrid = styled.div` display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 35px; `;
const SizeBtn = styled.button` height: 48px; background: white; border: 1px solid ${props => props.$active ? '#212121' : '#e0e0e0'}; font-size: 14px; cursor: pointer; font-weight: ${props => props.$active ? 'bold' : 'normal'}; &:hover { border-color: #212121; } `;
const FitGuide = styled.div` border-top: 1px solid #eee; padding-top: 20px; margin-bottom: 25px; `;
const FitLabels = styled.div` display: flex; justify-content: space-between; font-size: 11px; color: #888; margin-top: 8px; `;
const FitBar = styled.div` position: relative; height: 4px; background: #e0e0e0; margin: 0 10px; `;
const FitDot = styled.div` position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 10px; height: 10px; background: #212121; border-radius: 50%; `;
const AddCartBtn = styled.button` width: 100%; padding: 20px; background: #212121; color: white; font-size: 16px; font-weight: bold; border: none; cursor: pointer; margin-top: 20px; &:hover { background: #333; } &:disabled { background: #ccc; cursor: not-allowed; } `;
const ReviewSection = styled.div` background: #f9f9f9; padding: 80px 20px; margin-top: 80px; text-align: center; `;
const ReviewCard = styled.div` max-width: 900px; margin: 0 auto; text-align: left; `;
const ReviewHeader = styled.div` display: flex; justify-content: space-between; margin-bottom: 20px; border-top: 1px solid #ddd; padding-top: 30px; `;
const ReviewImg = styled.img` width: 120px; height: 120px; object-fit: cover; border-radius: 4px; margin-top: 15px; `;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState(MOCK_PRODUCT);
  const [activeIndex, setActiveIndex] = useState(0); 
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);

  // 🟢 2. 장바구니 Drawer 상태 관리
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        if (data && data.product) setProduct(data.product);
      } catch (err) {
        console.log("Mock data 사용");
      }
    };
    fetchProduct();
  }, [id]);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % product.colors.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + product.colors.length) % product.colors.length);
  const toggleAccordion = (name) => setActiveAccordion(activeAccordion === name ? null : name);

  // 🟢 3. 장바구니 담기 로직 수정
  const handleAddToCart = async () => {
    if(!selectedSize) return alert("사이즈를 선택해주세요.");
    
    // 현재 선택된 컬러 정보 추출
    const selectedColor = product.colors[activeIndex];

    // addItem에 상품 정보, 사이즈, 수량 + [색상명, 이미지경로]를 추가로 전달
    // (CartContext의 addItem이 이 추가 인자를 받아 로컬 state에 저장하도록 구현되어 있어야 완벽하지만,
    //  지금은 데이터를 전달하는 쪽에 집중했습니다.)
    await addItem(
      product,          // 상품 객체 전체
      selectedSize,     // 사이즈
      1,                // 수량
      selectedColor.name, // 선택된 색상 이름
      selectedColor.thumb // 선택된 색상 이미지
    );

    // 사이드바 열기
    setIsCartOpen(true);
  };

  const accordionData = [
    { 
      id: 'detail', 
      title: '상세 정보',
      content: (
        <>
          <p><strong>주요 소재 및 특징:</strong></p>
          <ul>
            <li>통기성이 뛰어난 ZQ 메리노 울 어퍼</li>
            <li>사탕수수 추출물로 만든 친환경 스위트폼(SweetFoam®) 미드솔</li>
            <li>폐플라스틱을 재활용한 신발 끈</li>
            <li>맨발에도 부드러운 착화감을 제공하는 힐 라이닝</li>
          </ul>
          <p style={{marginTop: '10px'}}>{product.description}</p>
        </>
      )
    },
    // ... (다른 아코디언 데이터는 그대로 유지)
    { id: 'sustainable', title: '지속 가능성', content: <p>지속 가능성 내용...</p> },
    { id: 'care', title: '케어 방법', content: <p>케어 방법 내용...</p> },
    { id: 'shipping', title: '배송 & 반품', content: <p>배송 정보 내용...</p> }
  ];

  return (
    <PageContainer>
      {/* 🟢 4. CartDrawer 컴포넌트 삽입 */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <ContentGrid>
        <LeftSection>
          <ImageContainer>
            {product.badge && <NewBadge>{product.badge}</NewBadge>}
            <MainImage src={product.colors[activeIndex].image} alt={product.colors[activeIndex].name} />
            
            <SliderControlsOverlay>
              <ButtonGroup>
                <NavBtn className="prev" onClick={handlePrev}>
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </NavBtn>
                <NavBtn className="next" onClick={handleNext}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </NavBtn>
              </ButtonGroup>
              <ProgressBarContainer>
                {product.colors.map((_, idx) => (
                  <ProgressLine 
                    key={idx} 
                    $active={idx === activeIndex} 
                    onClick={() => setActiveIndex(idx)} 
                  />
                ))}
              </ProgressBarContainer>
            </SliderControlsOverlay>
          </ImageContainer>

          <AccordionWrapper>
            {accordionData.map(item => (
              <AccordionItem key={item.id}>
                <AccordionHeader onClick={() => toggleAccordion(item.id)}>
                  {item.title}<span>{activeAccordion === item.id ? '-' : '+'}</span>
                </AccordionHeader>
                <AccordionContent $isOpen={activeAccordion === item.id}>
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </AccordionWrapper>
        </LeftSection>

        <RightSection>
          <Breadcrumb>Home › 남성 › {product.name}</Breadcrumb>
          <ProductTitle>{product.name}</ProductTitle>
          <Price>₩{product.price.toLocaleString()}</Price>
          <Description>{product.description}</Description>
          <OptionLabel>색상 <span style={{fontWeight:'normal', color:'#666'}}>{product.colors[activeIndex].name}</span></OptionLabel>
          <ColorGrid>{product.colors.map((color, idx) => (<ColorThumbnail key={idx} src={color.thumb} $active={idx === activeIndex} onClick={() => setActiveIndex(idx)}/>))}</ColorGrid>
          <GenderToggle><GenderBtn $active={true}>남성</GenderBtn><GenderBtn $active={false}>여성</GenderBtn></GenderToggle>
          <OptionLabel>사이즈</OptionLabel>
          <SizeGrid>{SIZES.map(size => (<SizeBtn key={size} $active={selectedSize === size} onClick={() => setSelectedSize(size)}>{size}</SizeBtn>))}</SizeGrid>
          <OptionLabel>핏 가이드 <span style={{textDecoration:'underline', fontWeight:'normal', cursor:'pointer'}}>자세한 가이드</span></OptionLabel>
          <FitGuide><FitBar><FitDot /></FitBar><FitLabels><span>작게 나옴</span><span>정사이즈</span><span>크게 나옴</span></FitLabels></FitGuide>
          <div style={{fontSize:'12px', fontWeight:'bold', marginTop:'20px'}}>오프라인 매장 재고 확인! <br/><span style={{fontWeight:'normal', color:'#666'}}>사이즈를 선택하시면 재고가 있는 매장을 확인하실 수 있습니다.</span></div>
          <AddCartBtn onClick={handleAddToCart} disabled={!selectedSize}>{selectedSize ? '장바구니 담기' : '사이즈 선택하기'}</AddCartBtn>
        </RightSection>
      </ContentGrid>

      <ReviewSection>
        <div style={{fontSize:'36px', fontWeight:'bold', marginBottom:'10px'}}>5 <span style={{color:'#f4c430', fontSize:'24px', verticalAlign:'middle'}}>★★★★★</span><span style={{fontSize:'12px', color:'#333', fontWeight:'normal', marginLeft:'10px'}}>1건의 리뷰 분석 결과입니다.</span></div>
        <ReviewCard>
          <ReviewHeader><div style={{fontWeight:'bold'}}><span style={{color:'#f4c430', marginRight:'10px'}}>★★★★★</span>르무통과는 차원이 다른 편안함!</div><div style={{fontSize:'12px', color:'#888'}}>2025-10-20</div></ReviewHeader>
          <p style={{lineHeight:'1.6', fontSize:'14px'}}>르무통과 동시에 신어보고 올버즈가 훨씬 편하고 디자인도 세련되어서 바로 구매했습니다. 발에 땀이 안생기고 항상 신발이 쾌적합니다. 하지만 비 많이 내리는 날엔 젖지 않게 주의가 필요해요.</p>
          <ReviewImg src="/img/review.jpg" alt="리뷰 사진" onError={(e)=>e.target.style.display='none'} />
        </ReviewCard>
      </ReviewSection>
    </PageContainer>
  );
};

export default ProductDetailPage;