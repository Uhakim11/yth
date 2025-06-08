import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Slide } from '../../types';
import Button from '../shared/Button';
import TypewriterText from '../shared/TypewriterText';
import { Link, useNavigate } from 'react-router-dom'; 
import { ROUTES, MOCK_WELCOME_ACTION_BUTTONS } from '../../constants';
import { Search } from 'lucide-react'; 

interface ImageSliderProps {
  slides: Slide[];
  autoplayInterval?: number;
}

export default function ImageSlider({ slides, autoplayInterval = 7000 }: ImageSliderProps): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textKey, setTextKey] = useState(0);
  const [heroSearchTerm, setHeroSearchTerm] = useState('');
  const navigate = useNavigate();

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setTextKey(prev => prev + 1);
  }, [currentIndex, slides.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setTextKey(prev => prev + 1);
  }, [currentIndex, slides.length]);

  useEffect(() => {
    if (autoplayInterval > 0 && slides.length > 1) {
      const timer = setTimeout(goToNext, autoplayInterval);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoplayInterval, goToNext, slides.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchTerm.trim()) {
      navigate(`${ROUTES.PUBLIC_TALENTS}?search=${encodeURIComponent(heroSearchTerm.trim())}`);
    }
  };

  if (!slides || slides.length === 0) {
    // If ImageSlider can return null or other ReactNode types, React.ReactNode or React.ReactElement | null might be more accurate.
    // However, this path returns a div, so React.JSX.Element (common in React 18/19) is fine.
    return <div className="text-center p-4 dark:text-white">No slides to display.</div>;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative h-full w-full overflow-hidden group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
            className={`w-full h-full bg-center bg-no-repeat ${index === currentIndex ? 'animate-heroKenBurns' : ''} bg-cover`}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 " />
        </div>
      ))}
      
      <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 md:p-8 h-full">
          {currentSlide.title && (
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-heroTextSlideUp" style={{animationDelay: '0.3s'}} key={`title-${textKey}`}>
                {currentSlide.titleAnimation === 'typewriter' ? 
                    <TypewriterText text={currentSlide.title} speed={70} /> :
                    currentSlide.title 
                }
            </h1>
          )}
          {currentSlide.subtitle && (
             <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 animate-heroTextSlideUp" style={{animationDelay: '0.6s'}} key={`subtitle-${textKey}`}>
                {currentSlide.subtitleAnimation === 'typewriter' ?
                    <TypewriterText text={currentSlide.subtitle} speed={40} /> :
                    currentSlide.subtitle
                }
             </p>
          )}
          
          <form onSubmit={handleSearchSubmit} className="mb-8 w-full max-w-xl animate-heroTextSlideUp relative" style={{animationDelay: '0.9s'}} key={`search-${textKey}`}>
            <div className="relative flex items-center w-full shadow-2xl rounded-full bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-800/50 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary-400 focus-within:bg-white/40 dark:focus-within:bg-gray-800/60">
              <Search className="absolute left-5 h-6 w-6 text-gray-100 dark:text-gray-300 pointer-events-none" />
              <input 
                type="search" 
                value={heroSearchTerm}
                onChange={(e) => setHeroSearchTerm(e.target.value)}
                placeholder="Find talents, skills, or competitions..." 
                className="w-full py-4 pl-14 pr-32 text-lg rounded-full bg-transparent text-white placeholder-gray-200 dark:placeholder-gray-400 focus:outline-none"
              />
              <Button 
                type="submit" 
                variant='primary' 
                size="lg" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 !py-2.5 !px-6 rounded-full shadow-lg hover:scale-105"
              >
                  Search
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 animate-heroTextSlideUp" style={{animationDelay: '1.2s'}} key={`buttons-${textKey}`}>
            {MOCK_WELCOME_ACTION_BUTTONS.map(action => (
                <Link key={action.id} to={action.href}>
                    <Button 
                        variant="primary" 
                        size="lg" 
                        className={`min-w-[180px] md:min-w-[220px] text-base md:text-lg font-semibold shadow-xl ${action.color} text-white transition-transform hover:scale-105`} 
                        rightIcon={<action.icon className="h-5 w-5 ml-2"/>} 
                    >
                        {action.label}
                    </Button>
                </Link>
            ))}
          </div>
        </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous Slide"
          >
            <ChevronLeftIcon className="h-6 w-6 md:h-8 md:w-8" />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next Slide"
          >
            <ChevronRightIcon className="h-6 w-6 md:h-8 md:w-8" />
          </button>

          <div className="absolute bottom-4 md:bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
            {slides.map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => {
                  setCurrentIndex(slideIndex);
                  setTextKey(prev => prev + 1);
                }}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full cursor-pointer transition-all duration-300 ${
                  currentIndex === slideIndex ? 'bg-primary-500 scale-125' : 'bg-gray-400/70 hover:bg-gray-300/90'
                }`}
                aria-label={`Go to slide ${slideIndex + 1}`}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
