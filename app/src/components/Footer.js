import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  background-color: #212121;
  color: #ffffff;
  padding: 60px 5% 40px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const SectionLeft = styled.div``;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 80px;
`;

const LinkTitle = styled.h3`
  font-size: 2.2em;
  font-weight: 400;
  margin: 0;
  line-height: 1.2;
`;

const FollowSection = styled.div``;

const FollowTitle = styled.h4`
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 15px;
`;

const FollowText = styled.p`
  font-size: 0.85em;
  color: #cccccc;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const SocialLinkGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const SocialLink = styled.a`
  color: #ffffff;
  text-decoration: none;
  display: flex;
  align-items: center;

  svg path {
    fill: #ffffff;
  }
`;

const SectionRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SupportTitle = styled.p`
  font-size: 2em;
  margin-bottom: 25px;
`;

const SupportList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SupportListItem = styled.li`
  margin-bottom: 12px;
`;

const SupportLink = styled.a`
  color: #ffffff;
  text-decoration: none;
  font-size: 0.95em;
`;

const BCorpBadge = styled.div`
  display: flex;
`;

const BCorpImage = styled.img`
  width: 80px;
  height: auto;
`;

const BottomWrapper = styled.div`
  max-width: 1400px;
  margin: 60px auto 0;
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const CopyrightSection = styled.div`
  font-size: 0.75em;
  color: #999;
  line-height: 1.8;
`;

const CopyrightLink = styled.a`
  color: #999;
  text-decoration: underline;
  margin-right: 15px;
`;

const CompanyInfoSection = styled.div`
  font-size: 0.75em;
  color: #f7f7f7;
  line-height: 1.6;
`;

const InfoParagraph = styled.p`
  margin-bottom: 5px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <ContentWrapper>
        
        <SectionLeft>
          <LinkGroup>
            <LinkTitle>올멤버스 가입하기</LinkTitle>
            <LinkTitle>오프라인 매장 찾기</LinkTitle>
            <LinkTitle>카카오 채널 추가하기</LinkTitle>
            <LinkTitle>올버즈 브랜드 스토리</LinkTitle>
          </LinkGroup>

          <FollowSection>
            <FollowTitle>ALLBIRDS를 팔로우 하세요!</FollowTitle>
            <FollowText>
              최신 정보나 Allbirds 상품의 스냅샷 등을 보실 수 있습니다. 오! 좋을 귀여운 양도 보실 수 있죠. #weareallbirds #올버즈
            </FollowText>
            
            <SocialLinkGroup>
              <SocialLink href="https://www.instagram.com/allbirdskorea" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
                  <g clipPath="url(#clip0_397_1840)">
                    <path d="M10 1.80441C12.6693 1.80441 12.9854 1.8146 14.0397 1.8627C15.0144 1.90718 15.5437 2.07 15.896 2.20691C16.3302 2.36716 16.7229 2.6227 17.0454 2.95472C17.3774 3.27718 17.633 3.66996 17.7932 4.10417C17.9301 4.45643 18.093 4.98576 18.1374 5.96044C18.1855 7.0146 18.1957 7.33076 18.1957 10.0001C18.1957 12.6695 18.1855 12.9856 18.1374 14.0398C18.0929 15.0145 17.9301 15.5438 17.7932 15.8961C17.6269 16.3272 17.3722 16.7188 17.0454 17.0455C16.7186 17.3723 16.3271 17.627 15.896 17.7933C15.5437 17.9302 15.0144 18.0931 14.0397 18.1375C12.9857 18.1856 12.6696 18.1958 10 18.1958C7.33044 18.1958 7.01441 18.1856 5.96032 18.1375C4.98564 18.0931 4.45635 17.9302 4.10405 17.7933C3.66984 17.6331 3.27706 17.3775 2.9546 17.0455C2.62258 16.7231 2.36705 16.3303 2.20679 15.8961C2.06988 15.5438 1.90702 15.0145 1.86258 14.0398C1.81449 12.9857 1.80429 12.6695 1.80429 10.0001C1.80429 7.33076 1.81449 7.01468 1.86258 5.96044C1.90706 4.98576 2.06988 4.45647 2.20679 4.10417C2.36706 3.66994 2.62263 3.27715 2.95468 2.95468C3.27715 2.62266 3.66992 2.36713 4.10413 2.20687C4.45639 2.06996 4.98572 1.9071 5.9604 1.86266C7.01456 1.81456 7.33072 1.80437 10.0001 1.80437L10 1.80441ZM10.0001 0.00313568C7.28508 0.00313568 6.94453 0.0146436 5.87841 0.0632944C4.81433 0.111866 4.08766 0.280834 3.45179 0.527977C2.78475 0.778994 2.18049 1.17249 1.68115 1.68103C1.1725 2.18034 0.778889 2.7846 0.527779 3.45167C0.280834 4.08758 0.111866 4.81425 0.0634928 5.87833C0.0146436 6.94445 0.00313568 7.285 0.00313568 10C0.00313568 12.715 0.0146436 13.0556 0.0634928 14.1217C0.112064 15.1858 0.281033 15.9124 0.528175 16.5483C0.779194 17.2153 1.17269 17.8196 1.68123 18.3189C2.18057 18.8275 2.78482 19.221 3.45187 19.472C4.08778 19.7191 4.81445 19.8881 5.87849 19.9367C6.94476 19.9853 7.2852 19.9968 10.0002 19.9968C12.7151 19.9968 13.0557 19.9853 14.1218 19.9367C15.1859 19.8881 15.9126 19.7191 16.5485 19.472C17.2125 19.2151 17.8156 18.8224 18.3191 18.3189C18.8226 17.8155 19.2153 17.2124 19.4721 16.5483C19.7193 15.9124 19.8883 15.1857 19.9368 14.1217C19.9855 13.0554 19.997 12.715 19.997 10C19.997 7.28504 19.9855 6.94445 19.9368 5.87833C19.8883 4.81425 19.7193 4.08758 19.4721 3.45171C19.2211 2.78467 18.8276 2.18041 18.3191 1.68107C17.8197 1.17243 17.2154 0.778849 16.5483 0.527779C15.9124 0.280834 15.1858 0.111866 14.1217 0.0634928C13.0556 0.0146436 12.715 0.00313568 10 0.00313568H10.0001Z" fill="#ffffff"/>
                    <path d="M10 4.86647C7.16484 4.86647 4.86647 7.16484 4.86647 10C4.86647 12.8352 7.16484 15.1335 10 15.1335C12.8352 15.1335 15.1335 12.8352 15.1335 10C15.1335 7.16484 12.8352 4.86647 10 4.86647ZM10 13.3323C8.15964 13.3323 6.66778 11.8403 6.66778 9.99996C6.66778 8.1596 8.15968 6.66774 10 6.66774C11.8404 6.66774 13.3323 8.15964 13.3323 10C13.3323 11.8404 11.8404 13.3323 10 13.3323Z" fill="#ffffff"/>
                    <path d="M15.3363 5.86326C15.9989 5.86326 16.536 5.32618 16.536 4.66365C16.536 4.00113 15.9989 3.46405 15.3363 3.46405C14.6738 3.46405 14.1367 4.00113 14.1367 4.66365C14.1367 5.32618 14.6738 5.86326 15.3363 5.86326Z" fill="#ffffff"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_397_1840">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </SocialLink>
              <SocialLink href="https://www.facebook.com/weareallbirds" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="24" viewBox="0 0 11 20" fill="none">
                  <g clipPath="url(#clip0_397_1846)">
                    <path d="M3.41141 7.11576V5.425C3.41141 2.83913 5.30109 0.849998 7.58859 0.849998H10.3734V4.23152H7.58859C7.29022 4.23152 6.89239 4.7288 6.89239 5.32554V7.11576H10.3734V10.5967H6.89239V19.0505H3.41141V10.5967H0.626629V7.11576H3.41141Z" fill="#ffffff"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_397_1846">
                      <rect width="9.8" height="18.3" fill="white" transform="translate(0.599998 0.849998)"/>
                    </clipPath>
                  </defs>
                </svg>
              </SocialLink>
            </SocialLinkGroup>
          </FollowSection>
        </SectionLeft>

        <SectionRight>
          <div>
            <SupportTitle>올버즈 지원</SupportTitle>
            
            <SupportList>
              <SupportListItem>
                <SupportLink href="#">교환 및 반품</SupportLink>
              </SupportListItem>
              <SupportListItem>
                <SupportLink href="#">수선</SupportLink>
              </SupportListItem>
              <SupportListItem>
                <SupportLink href="#">문의하기</SupportLink>
              </SupportListItem>
              <SupportListItem>
                <SupportLink href="#">FAQ</SupportLink>
              </SupportListItem>
              <SupportListItem>
                <SupportLink href="#">채용</SupportLink>
              </SupportListItem>
            </SupportList>
          </div>

          <BCorpBadge>
            <BCorpImage 
              src="https://sfycdn.speedsize.com/4aadaad8-50d5-458f-88dd-2f364bf4d82e/allbirds.co.kr/cdn/shop/files/image_2.png?v=1692870417&width=80" 
              alt="Certified B Corporation"
            />
          </BCorpBadge>
        </SectionRight>
      </ContentWrapper>

      <BottomWrapper>
        <BottomGrid>
          <CopyrightSection>
            <p>
              © 2025 EFG.CO All Rights Reserved.  
              <CopyrightLink href="#">이용 약관, 개인정보 처리방침,</CopyrightLink>
            </p>
          </CopyrightSection>

          <CompanyInfoSection>
            <InfoParagraph>(주)이에프지 대표 박재호 | 서울특별시 강남구 강남대로 160길 45</InfoParagraph>
            <InfoParagraph>통신판매업신고번호 2023-서울강남-04461 | 등록번호 146-81-03205</InfoParagraph>
            <InfoParagraph>전화번호 070-4138-0128(수신자 부담) | E-mail help@efg.earth</InfoParagraph>
          </CompanyInfoSection>
        </BottomGrid>
      </BottomWrapper>
    </FooterContainer>
  );
};

export default Footer;