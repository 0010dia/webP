import React, { useState, useRef, useEffect } from 'react';
import MainBanner from '../components/MainBanner';
import Slide from '../components/Slide';
import MaterialsSection from '../components/MaterialsSection';
import NewsletterSection from '../components/NewsLetterSection';
import Footer from '../components/Footer';

const MainPage = () => {
  return (
    <div>
      <MainBanner />
      <Slide />
      <MaterialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default MainPage;