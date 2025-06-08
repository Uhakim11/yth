import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';
import AnimatedSection from '../shared/AnimatedSection';
import AnimatedText from '../shared/AnimatedText';
import { ROUTES } from '../../constants';
import { Send, Sparkles, Users } from 'lucide-react';

const JoinCTASection: React.FC = () => {
  return (
    <AnimatedSection className="w-full py-16 md:py-24 bg-gradient-cta text-white">
      <div className="container mx-auto px-4 text-center">
        <Sparkles size={48} className="mx-auto mb-4 text-yellow-300 animate-pulse" />
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          <AnimatedText text="Ready to Shine?" animationType="word-slide-in" staggerDelay={100} />
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          <AnimatedText 
            text="Join Youth Talent Hub today! Showcase your skills, connect with peers, participate in exciting competitions, and unlock your full potential. Your journey starts here." 
            animationType="letter-reveal" 
            staggerDelay={10} 
            className="leading-relaxed"
          />
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
          <Link to={ROUTES.REGISTER}>
            <Button 
              variant="primary" 
              size="xl" 
              className="!bg-white !text-primary-600 hover:!bg-gray-100 shadow-2xl transform hover:scale-105"
              leftIcon={<Send size={20} />}
              glowing={false} 
            >
              Register Now
            </Button>
          </Link>
          <Link to={ROUTES.PUBLIC_TALENTS}>
            <Button 
              variant="outline" 
              size="xl" 
              className="!border-white !text-white hover:!bg-white/10 shadow-lg transform hover:scale-105"
              leftIcon={<Users size={20}/>}
            >
              Explore Talents
            </Button>
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default JoinCTASection;