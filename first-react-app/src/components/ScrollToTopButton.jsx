import React, { useState, useEffect } from 'react';

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      const scrollThreshold = (documentHeight - windowHeight) / 2;

      setIsVisible(scrollHeight > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const PageUp = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      title="Scroll to Top"
      onClick={() => PageUp()}
      id="up"
      className={`fixed bottom-4 right-4 bg-blue-200 cursor-pointer rounded-xl transition-all hover:opacity-80 rotate-270 p-3 h-12 w-12 active:scale-92 active:opacity-80 z-50 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-300`}
      style={{ transitionProperty: 'opacity', transitionDuration: '0.3s', transitionTimingFunction: 'ease-in-out' }}
    >
      &gt;
    </button>
  );
}

export default ScrollToTopButton;