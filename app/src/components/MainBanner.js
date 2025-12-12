import React from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from "react-router-dom";

const TEXT_COLOR = '#FFFFFF';
const BORDER_COLOR = '#FFFFFF';
const APP_FONT = 'Helvetica Neue, Arial, sans-serif';

const BANNER_IMAGE_URL = 'https://allbirds.co.kr/cdn/shop/files/blacksheep_dt_1_2048x.jpg?v=1764630463';

const MainContainer = styled.div`
    background-image: url(${BANNER_IMAGE_URL});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: flex-start; 
    padding-left: 10%; 
    overflow: hidden;
    position: relative;
    font-family: ${APP_FONT};
    box-sizing: border-box;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2); 
        z-index: 1;
    }
`;

const LeftContent = styled.div`
    color: ${TEXT_COLOR};
    z-index: 10;
    padding-top: 15vh;
    
    @media (max-width: 768px) {
        padding-left: 5%;
        padding-top: 10vh;
    }
`;

const Title = styled.h1`
    font-size: 2.5em;
    font-weight: bold;
    margin-bottom: 10px;
    line-height: 1.2;
    white-space: nowrap;

    @media (max-width: 768px) {
        font-size: 2em;
    }
`;

const Subtitle = styled.p`
    font-size: 1.2em;
    margin-bottom: 30px;
    font-weight: 500;
    color: ${TEXT_COLOR};
    white-space: nowrap;

    @media (max-width: 768px) {
        font-size: 1em;
        margin-bottom: 20px;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 15px;
`;

const SaleButton = styled.button`
    padding: 10px 25px;
    font-size: 1em;
    cursor: pointer;
    border: 1px solid ${BORDER_COLOR};
    border-radius: 5px;
    background-color: transparent; 
    color: ${BORDER_COLOR}; 
    font-weight: 600;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: ${BORDER_COLOR}; 
        color: #333; 
        border-color: ${BORDER_COLOR};
    }

    @media (max-width: 480px) {
        padding: 8px 15px;
        font-size: 0.9em;
    }
`;

const RightImagePlaceholder = styled.div`
    position: absolute;
    right: 0; 
    top: 0;
    width: 65%;
    height: 100%;
    z-index: 5;

    @media (max-width: 768px) {
        width: 100%;
        height: 50vh;
        top: auto; 
        bottom: 0;
        opacity: 0.3; 
    }
`;

const MainBanner = () => {
     const navigate = useNavigate();
    
    const handleSaleClick = (type) => {
        navigate("/list");
    };

    return (
        <>
            <MainContainer>
                
                <LeftContent>
                    <Title>슈퍼 블랙 프라이데이</Title>
                    <Subtitle>연중 최대 혜택, UP TO 50% OFF.</Subtitle>
                    
                    <ButtonContainer>
                        <SaleButton 
                            onClick={() => handleSaleClick('남성')}
                            aria-label="남성 세일 보기"
                        >
                            남성 세일
                        </SaleButton>
                        <SaleButton 
                          
                            aria-label="여성 세일 보기"
                        >
                            여성 세일
                        </SaleButton>
                    </ButtonContainer>
                </LeftContent>

                <RightImagePlaceholder>
                    
                </RightImagePlaceholder>
                
            </MainContainer>
        </>
    );
};

export default MainBanner;