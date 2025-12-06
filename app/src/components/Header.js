import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { Link } from "react-router-dom";

// 1. --- 폰트 및 공통 스타일 설정 ---

const ALLBIRDS_FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif'; 
const PRIMARY_COLOR = '#212121'; // 검정
const HEADER_HEIGHT = '64px';

// 드롭다운 메뉴 왼쪽에서 오른쪽으로 나타나는 애니메이션 Keyframes
const slideIn = keyframes`
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

// "남성 신발" 등 하위 메뉴 호버 시 오른쪽으로 '슥' 나타나는 대시 애니메이션
const dashSlide = keyframes`
    from {
        width: 0;
        opacity: 0;
    }
    to {
        width: 14px; /* 최종 대시 '-'의 길이 */
        opacity: 1;
    }
`;


// 2. --- Styled Components ---

const HeaderContainer = styled.header`
  width: 100%;
  height: ${HEADER_HEIGHT};
  position: sticky;
  top: 0;
  z-index: 1000;
  
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
`;

const ContentWrap = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 30px; 

  display: flex;
  align-items: center;
  justify-content: space-between; 
`;

// 로고 스타일
const LogoText = styled(Link)`
    font-family: ${ALLBIRDS_FONT};
    font-size: 28px;
    font-weight: 300; 
    font-style: normal;
    color: ${PRIMARY_COLOR};
    text-decoration: none;
    line-height: 1;
    letter-spacing: -1.5px;
    
    &::before {
        content: 'allbirds'; 
    }
`;

const MainNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0; 
  height: 100%;
`;

const NavItemContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: 100%; 
`;

// 메인 내비게이션 링크 스타일 (밑줄 없음)
const NavItemLink = styled(Link)`
  position: relative;
  color: ${PRIMARY_COLOR};
  text-decoration: none;
  white-space: nowrap;
  font-family: ${ALLBIRDS_FONT};

  font-size: 14px; 
  font-weight: 400; 
  
  padding: 18px 36px;
  height: 100%;
  display: flex;
  align-items: center;
  transition: color 0.15s ease-out;

  &:hover {
    color: #4a4a4a; 
    text-decoration: none; 
  }
`;

const RedDot = styled.span`
  position: absolute;
  top: 20px; 
  right: 25px; 
  width: 5px;
  height: 5px;
  background-color: #ff0000; 
  border-radius: 50%;
`;

// 드롭다운 메뉴 스타일 (왼쪽에서 슬라이드, 유지 기능)
const DropdownMenu = styled.div`
    position: absolute;
    top: ${HEADER_HEIGHT};
    left: 0; 
    width: 100%;
    /* 마우스 이동 시 끊김 방지를 위해 최소 높이 설정 */
    min-height: 300px; 
    background-color: #ffffff;
    border-top: 1px solid #e5e5e5;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

    padding: 50px 0; 
    display: block;
    
    /* 애니메이션 적용 */
    animation: ${slideIn} 0.3s ease-out forwards;
`;

const DropdownContentWrapper = styled.div`
    display: flex;
    justify-content: flex-start; 
    max-width: 1440px; 
    width: 100%;
    margin: 0 auto;
    padding: 0 30px; 
`;

const DropdownSection = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 80px;
    
    ${(props) => props.$hasBorder && css`
        padding-left: 0;
        border-left: none;
    `}
    
    &:last-child {
        margin-right: 0;
    }
`;

const DropdownTitle = styled.h3`
    font-family: ${ALLBIRDS_FONT};
    font-size: 32px;
    font-weight: 500; 
    letter-spacing: 1.7px;

    color: ${PRIMARY_COLOR};
    margin-bottom: 20px; 
    white-space: nowrap;
    text-transform: none; 
`;

const SubMenuList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    padding-top: 16px; 
    padding-bottom: 16px;
    display: flex;
    flex-direction: column;
`;

const SubMenuItem = styled.li`
    border-left: 0.9px solid #000000;
    opacity: 1; 
    margin-left: -0.9px; 
    margin-bottom: 0;

    &:hover {
        border-left: 0.9px solid ${PRIMARY_COLOR}; 
    }
`;

// 드롭다운 서브 메뉴 링크 스타일
const SubMenuLink = styled(Link)`
    color: #4a4a4a;
    text-decoration: none;
    font-family: ${ALLBIRDS_FONT};
    
    font-size: 16px; 
    line-height: 1.5;
    font-weight: 400;

    display: flex;
    align-items: center; 
    padding: 4px 20px; 
    position: relative; 
    
    /* 1. "신제품" 하위 메뉴 스타일: 호버 시 밑줄 + 굵은 폰트 */
    ${(props) => props.$isNewProduct && css`
        transition: all 0.2s ease-out;

        &:hover {
            color: ${PRIMARY_COLOR};
            font-weight: 600; /* 폰트 굵게 */
            text-decoration: underline; /* 밑줄 추가 */
            text-underline-offset: 4px; 
        }
    `}

    /* 2. "남성 신발", "의류 & 악세사리" 등 하위 메뉴 스타일: 호버 시 대시 애니메이션 */
    ${(props) => !props.$isNewProduct && css`
        &::before {
            content: '-';
            color: ${PRIMARY_COLOR};
            font-size: 18px;
            font-weight: 500;
            display: inline-block;
            overflow: hidden; 
            white-space: nowrap;
            
            width: 0; 
            opacity: 0;
            margin-right: 0; 
            
            transition: all 0.2s ease-out; 
        }

        &:hover {
            color: ${PRIMARY_COLOR};
            
            &::before {
                width: 14px; 
                opacity: 1;
                margin-right: 6px; 
                animation: ${dashSlide} 0.3s ease-out forwards;
            }
        }
    `}
`;

// 오른쪽 아이콘 그룹 스타일
const IconNav = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;
  height: 100%;
`;

const IconWrapper = styled(Link)`
    display: flex;
    height: 24px; 
    width: 24px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    
    & > svg {
        stroke: ${PRIMARY_COLOR};
        transition: stroke 0.15s ease-out;
    }
    &:hover > svg {
        stroke: #4a4a4a;
    }
`;

const CartBadge = styled.div.attrs(props => ({
    'data-bubble': props.$count 
}))`
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%); 
    z-index: 10;
    
    &::after {
        content: attr(data-bubble);
        position: absolute;
        top: 0;
        right: 0;
        
        display: ${props => props.$count > 0 ? 'flex' : 'none'}; 
        align-items: center;
        justify-content: center;
        
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: ${PRIMARY_COLOR};
        color: #fff;
        font-size: 0.5625rem;
        font-weight: bold;
        line-height: 1;
    }
`;


// 3. --- SVG 아이콘 컴포넌트 ---

const SearchIcon = () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ stroke: PRIMARY_COLOR, strokeWidth: '1.5', fill: 'none', width: '100%', height: '100%' }}>
        <path d="M11.2276 3.24948C10.1722 3.23718 9.12482 3.43443 8.1462 3.8298C7.16758 4.22518 6.27715 4.81081 5.52649 5.55277C4.77583 6.29474 4.17986 7.17829 3.77311 8.15223C3.36636 9.12617 3.15692 10.1711 3.15692 11.2266C3.15692 12.2821 3.36636 13.327 3.77311 14.301C4.17986 15.2749 4.77583 16.1585 5.52649 16.9004C6.27715 17.6424 7.16758 18.228 8.1462 18.6234C9.12482 19.0188 10.1722 19.216 11.2276 19.2037C13.3271 19.1793 15.3324 18.328 16.8084 16.8347C18.2845 15.3414 19.1123 13.3263 19.1123 11.2266C19.1123 9.1269 18.2845 7.11185 16.8084 5.61851C15.3324 4.12517 13.3271 3.27395 11.2276 3.24948Z" strokeMiterlimit="10"/>
        <path d="M17.1783 17.1799L22.7499 22.7515" strokeMiterlimit="10" strokeLinecap="round"/>
    </svg>
);

const AccountIcon = () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ stroke: PRIMARY_COLOR, strokeWidth: '1.5', fill: 'none', width: '100%', height: '100%' }}>
        <path d="M21.6666 22.8333C21.6666 21.3215 21.6666 19.4822 21.4801 18.8671C21.0599 17.4822 19.9762 16.3984 18.5912 15.9783C17.9761 15.7917 17.2202 15.7917 15.7083 15.7917H10.2917C8.77979 15.7917 8.02385 15.7917 7.40874 15.9783C6.02381 17.4822 4.94002 17.4822 4.51991 18.8671C4.33331 19.4822 4.33331 21.3215 4.33331 22.8333M17.875 8.125C17.875 10.8174 15.6924 13 13 13C10.3076 13 8.12498 10.8174 8.12498 8.125C8.12498 5.43261 10.3076 3.25 13 3.25C15.6924 3.25 17.875 5.43261 17.875 8.125Z" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CartIcon = () => (
    <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ stroke: PRIMARY_COLOR, strokeWidth: '1.5', fill: 'none', width: '100%', height: '100%' }}>
        <path d="M7.02456 5.9695V4.9756C7.02456 3.92121 7.44341 2.91 8.18898 2.16443C8.93455 1.41886 9.94576 1 11.0002 1C12.0546 1 13.0658 1.41886 13.8113 2.16443C14.5569 2.91 14.9758 3.92121 14.9758 4.9756V5.9695M20.4422 21.375V6.46645H1.55811V21.375H20.4422Z" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


// 4. --- Dropdown Content Components ---

const NewProducts = ({ prefix }) => (
    <DropdownSection $hasBorder={false}>
        <DropdownTitle>신제품</DropdownTitle>
        <SubMenuList>
            {/* $isNewProduct={true} : 밑줄 + 굵은 폰트 효과 */}
            <SubMenuItem><SubMenuLink to={`/new/${prefix}/nz`} $isNewProduct={true}>울러너 NZ</SubMenuLink></SubMenuItem>
            <SubMenuItem><SubMenuLink to={`/new/${prefix}/slipers`} $isNewProduct={true}>코두로이 슬립온</SubMenuLink></SubMenuItem>
            <SubMenuItem><SubMenuLink to={`/new/${prefix}/cruiser`} $isNewProduct={true}>울 크루져</SubMenuLink></SubMenuItem>
            <SubMenuItem><SubMenuLink to={`/new/${prefix}/cruiser-slipers`} $isNewProduct={true}>울 크루져 슬립온</SubMenuLink></SubMenuItem>
            {prefix === 'm' ? (
                <SubMenuItem><SubMenuLink to="/new/m/mix-exp" $isNewProduct={true}>크루져 미드 믹스플로어</SubMenuLink></SubMenuItem>
            ) : (
                <SubMenuItem><SubMenuLink to="/new/w/mix-exp" $isNewProduct={true}>스트라이더 믹스플로어</SubMenuLink></SubMenuItem>
            )}
            {prefix === 'm' && (<SubMenuItem><SubMenuLink to="/new/m/tree-runner" $isNewProduct={true}>트리 러너 NZ</SubMenuLink></SubMenuItem>)}
        </SubMenuList>
    </DropdownSection>
);

const MenuGroup = ({ title, links }) => (
    <DropdownSection $hasBorder={false}>
        <DropdownTitle>{title}</DropdownTitle>
        <SubMenuList>
            {/* $isNewProduct={false} 또는 미전달: 대시 애니메이션 효과 */}
            {links.map((link, index) => (
                <SubMenuItem key={index}><SubMenuLink to={link.to} $isNewProduct={false}>{link.label}</SubMenuLink></SubMenuItem>
            ))}
        </SubMenuList>
    </DropdownSection>
);

const MenDropdown = () => (
    <DropdownContentWrapper>
        <NewProducts prefix="m" />
        <MenuGroup 
            title="남성 신발" 
            links={[
                { label: "전체", to: "/men/shoes/all" },
                { label: "라이프스타일", to: "/men/shoes/lifestyle" },
                { label: "액티브", to: "/men/shoes/active" },
                { label: "슬립온", to: "/men/shoes/slippers" },
                { label: "세일", to: "/men/shoes/sale" },
            ]}
        />
        <MenuGroup 
            title="의류 & 악세사리" 
            links={[
                { label: "양말", to: "/men/apparel/socks" },
                { label: "의류", to: "/men/apparel/clothing" },
                { label: "악세사리", to: "/men/apparel/accessories" },
            ]}
        />
        <MenuGroup 
            title="유아/어린이" 
            links={[]} 
        />
    </DropdownContentWrapper>
);

const WomenDropdown = () => (
    <DropdownContentWrapper>
        <NewProducts prefix="w" />
        <MenuGroup 
            title="여성 신발" 
            links={[
                { label: "전체", to: "/women/shoes/all" },
                { label: "라이프스타일", to: "/women/shoes/lifestyle" },
                { label: "액티브", to: "/women/shoes/active" },
                { label: "플랫", to: "/women/shoes/flats" },
                { label: "세일", to: "/women/shoes/sale" },
            ]}
        />
        <MenuGroup 
            title="의류 & 악세사리" 
            links={[
                { label: "양말", to: "/women/apparel/socks" },
                { label: "의류", to: "/women/apparel/clothing" },
                { label: "악세사리", to: "/women/apparel/accessories" },
            ]}
        />
        <MenuGroup 
            title="유아/어린이" 
            links={[]} 
        />
    </DropdownContentWrapper>
);


// 5. --- Header Component ---

export default function Header() {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [cartCount, setCartCount] = useState(0); 

    const renderDropdown = () => {
        switch (activeDropdown) {
            case 'men':
                return <MenDropdown />;
            case 'women':
                return <WomenDropdown />;
            default:
                return null;
        }
    }

    // 마우스가 메뉴나 드롭다운 영역으로 진입했을 때 드롭다운을 열고 유지합니다.
    const handleMouseEnter = (menu) => {
        setActiveDropdown(menu);
    };
    
    // 마우스가 메뉴나 드롭다운 영역에서 벗어났을 때 드롭다운을 닫습니다.
    const handleMouseLeave = () => {
        setActiveDropdown(null);
    };
    
    return (
        <HeaderContainer>
            <ContentWrap>
                
                {/* 로고 */}
                <LogoText to="/"></LogoText>

                {/* 메인 내비게이션 */}
                <MainNav>
                    {/* 홀리데이 */}
                    <NavItemLink to="/holiday">
                        홀리데이
                        <RedDot />
                    </NavItemLink>
                    
                    {/* 남성 메뉴: 호버 시 드롭다운 */}
                    <NavItemContainer 
                        onMouseEnter={() => handleMouseEnter('men')} 
                        onMouseLeave={handleMouseLeave}
                    >
                        <NavItemLink to="/men">남성</NavItemLink>
                    </NavItemContainer>

                    {/* 여성 메뉴: 호버 시 드롭다운 */}
                    <NavItemContainer 
                        onMouseEnter={() => handleMouseEnter('women')} 
                        onMouseLeave={handleMouseLeave}
                    >
                        <NavItemLink to="/women">여성</NavItemLink>
                    </NavItemContainer>

                    {/* 매장 위치 */}
                    <NavItemLink to="/stores">
                        매장 위치
                    </NavItemLink>
                </MainNav>

                {/* 오른쪽 섹션: 아이콘 그룹 */}
                <IconNav>
                    {/* 검색 아이콘 */}
                    <IconWrapper to="/search">
                        <SearchIcon />
                    </IconWrapper>
                    
                    {/* 사용자/로그인 아이콘 */}
                    <IconWrapper to="/account/login">
                        <AccountIcon />
                    </IconWrapper>
                    
                    {/* 장바구니 아이콘 및 뱃지 */}
                    <IconWrapper 
                        to="/cart"
                    >
                        <CartIcon />
                        <CartBadge $count={cartCount} />
                    </IconWrapper>
                </IconNav>

            </ContentWrap>
            
            {/* 드롭다운 메뉴 컨테이너: 메뉴나 드롭다운 영역에 마우스가 있는 동안 유지 */}
            {activeDropdown && (
                <DropdownMenu 
                    onMouseEnter={() => handleMouseEnter(activeDropdown)} 
                    onMouseLeave={handleMouseLeave}
                >
                    {renderDropdown()}
                </DropdownMenu>
            )}
        </HeaderContainer>
    );
}