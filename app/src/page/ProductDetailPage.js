import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { getProductById } from '../api/products';
import CartDrawer from '../components/CartDrawer';
import client from '../api/client';

// 로컬 색상 정보 (백엔드에서 colors 필드를 받지 않으므로 로컬에서 관리)
const LOCAL_COLORS = [
  { 
    code: 'black', 
    name: '내추럴 블랙 (Natural Black)', 
    thumb: "/img/black_4.avif" 
  },
  { 
    code: 'grey', 
    name: '미스트 그레이 (Mist Grey)', 
    thumb: "/img/grey_4.avif" 
  },
  { 
    code: 'beige', 
    name: '헤이지 베이지 (Hazy Beige)', 
    thumb: "/img/4.avif" 
  },
  { 
    code: 'navy', 
    name: '트루 네이비 (True Navy)', 
    thumb: "/img/navy_4.avif" 
  }
];

// --- Styled Components ---
const PageContainer = styled.div` max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: 'Pretendard', 'Helvetica Neue', Arial, sans-serif; color: #212121; `;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #888;
  margin-right: 10px;
`;

const DiscountedPrice = styled.span`
  font-weight: bold;
  color: #c0392b; // A noticeable color for discount
`;
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
const ReviewCard = styled.div` max-width: 900px; margin: 0 auto 30px; text-align: left; `;
const ReviewHeader = styled.div` display: flex; justify-content: space-between; margin-bottom: 0; border-top: 1px solid #ddd; padding-top: 30px; `;
const ReviewImg = styled.img` width: 120px; height: 120px; object-fit: cover; border-radius: 4px; margin-top: 15px; `;

const ReviewForm = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
`;
const TextArea = styled.textarea`
  width: 100%;
  height: 80px;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
`;
const SubmitBtn = styled.button`
  background: #212121;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); 
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [reviews, setReviews] = useState([]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  }, [reviews]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const productRes = await getProductById(id);
        if (productRes && productRes.product) {
          setProduct(productRes.product);
        } else {
          throw new Error("Product not found");
        }

        const reviewRes = await client.get(`/api/reviews/${id}`);
        if (reviewRes.data.success) {
          setReviews(reviewRes.data.reviews);
        }
      } catch (err) {
        setError(err.message);
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <PageContainer>Loading...</PageContainer>;
  }

  if (error) {
    return <PageContainer>Error: {error}</PageContainer>;
  }

  if (!product) {
    return <PageContainer>Product not found.</PageContainer>;
  }

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % LOCAL_COLORS.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + LOCAL_COLORS.length) % LOCAL_COLORS.length);
  const toggleAccordion = (name) => setActiveAccordion(activeAccordion === name ? null : name);

  const handleAddToCart = async () => {
    if(!selectedSize) return alert("사이즈를 선택해주세요.");
    
    const selectedColor = LOCAL_COLORS[activeIndex]; // Use LOCAL_COLORS

    await addItem(
      product,
      selectedSize,
      1,
      selectedColor.name,
      product.images[activeIndex] // Use product.images for image
    );

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
    { id: 'sustainable', title: '지속 가능성', content: <p>지속 가능성은 무슨 환경보다 본인의 학접부터 신경쓰는게 좋지 않을까요?</p> },
    { id: 'care', title: '케어 방법', content: <p>신발을 닦을 시간이 있다면 나가서 돈이나 버는게.....</p> },
    { id: 'shipping', title: '배송 & 반품', content: <p>그 여자친구는 배송안됩니다.</p> }
  ];



  return (
    <PageContainer>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <ContentGrid>
        <LeftSection>
          <ImageContainer>
            {product.badge && <NewBadge>{product.badge}</NewBadge>}
            <MainImage src={product.images[activeIndex]} alt={LOCAL_COLORS[activeIndex].name} />
            
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
                {LOCAL_COLORS.map((_, idx) => (
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
          <Price>
            {product.is_on_sale && product.discountRate > 0 ? (
              <>
                <OriginalPrice>₩{product.price.toLocaleString()}</OriginalPrice>
                <DiscountedPrice>
                  ₩{(product.price * (1 - product.discountRate / 100)).toLocaleString()}
                </DiscountedPrice>
              </>
            ) : (
              <span>₩{product.price.toLocaleString()}</span>
            )}
          </Price>
          <Description>{product.description}</Description>
          <OptionLabel>색상 <span style={{fontWeight:'normal', color:'#666'}}>{LOCAL_COLORS[activeIndex].name}</span></OptionLabel>
          <ColorGrid>{LOCAL_COLORS.map((color, idx) => (<ColorThumbnail key={idx} src={color.thumb} $active={idx === activeIndex} onClick={() => setActiveIndex(idx)}/>))}</ColorGrid>
          <GenderToggle><GenderBtn $active={true}>남성</GenderBtn><GenderBtn $active={false}>여성</GenderBtn></GenderToggle>
          <OptionLabel>사이즈</OptionLabel>
          <SizeGrid>{product.sizes.map(sizeObj => (<SizeBtn key={sizeObj.size} $active={selectedSize === sizeObj.size} onClick={() => setSelectedSize(sizeObj.size)} disabled={!sizeObj.available}>{sizeObj.size}</SizeBtn>))}</SizeGrid>
          <OptionLabel>핏 가이드 <span style={{textDecoration:'underline', fontWeight:'normal', cursor:'pointer'}}>자세한 가이드</span></OptionLabel>
          <FitGuide><FitBar><FitDot /></FitBar><FitLabels><span>작게 나옴</span><span>정사이즈</span><span>크게 나옴</span></FitLabels></FitGuide>
          <div style={{fontSize:'12px', fontWeight:'bold', marginTop:'20px'}}>오프라인 매장 재고 확인! <br/><span style={{fontWeight:'normal', color:'#666'}}>사이즈를 선택하시면 재고가 있는 매장을 확인하실 수 있습니다.</span></div>
          <AddCartBtn onClick={handleAddToCart} disabled={!selectedSize}>{selectedSize ? '장바구니 담기' : '사이즈 선택하기'}</AddCartBtn>
        </RightSection>
      </ContentGrid>

      <ReviewSection>
        <div style={{fontSize:'36px', fontWeight:'bold', marginBottom:'10px'}}>
          {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'} <span style={{color:'#f4c430'}}>{'★'.repeat(Math.round(averageRating))}</span>
          <span style={{fontSize:'12px', color:'#333', marginLeft:'10px'}}>
            ({reviews.length}건의 리뷰)
          </span>
        </div>



        <div style={{ marginTop: '40px' }}>
        {reviews.map((review, idx) => (
          <ReviewCard key={idx}>
            <ReviewHeader>
              <div style={{fontWeight:'bold'}}>
                <span style={{color:'#f4c430', marginRight:'10px'}}>
                  {'★'.repeat(review.rating)}
                </span>
                {review.content.substring(0, 20)}...
              </div>
              <div style={{fontSize:'12px', color:'#888'}}>
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </ReviewHeader>
            <p style={{lineHeight:'1.6', fontSize:'14px', marginTop:'30px'}}>
              {review.content}
            </p>
            <div style={{fontSize:'12px', color:'#666', marginTop:'5px'}}>
              작성자: {review.userName}
            </div>
          </ReviewCard>
        ))}
        </div>
      </ReviewSection>
    </PageContainer>
  );
};

export default ProductDetailPage;
