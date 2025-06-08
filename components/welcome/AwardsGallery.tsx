import React from 'react';
import { AwardItem } from '../../types';
import AwardCard from '../shared/AwardCard';
import { Trophy } from 'lucide-react';
import AnimatedText from '../shared/AnimatedText';

interface AwardsGalleryProps {
  awards: AwardItem[];
}

const AwardsGallery: React.FC<AwardsGalleryProps> = ({ awards }) => {
  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10 md:mb-12">
        <Trophy className="h-12 w-12 text-primary-500 dark:text-primary-400 mx-auto mb-3 transform transition-transform duration-500 group-hover:rotate-[360deg] hover:scale-110" />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          <AnimatedText text="Our Prestigious Awards" animationType="word-slide-in" staggerDelay={70} />
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-3 max-w-xl mx-auto">
          <AnimatedText 
            text="Recognizing outstanding talent and dedication. These awards celebrate the pinnacle of achievement within the Youth Talent Hub community." 
            animationType="letter-reveal" 
            staggerDelay={10}
            className="leading-relaxed"
          />
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {awards.map(award => (
          <AwardCard key={award.id} award={award} />
        ))}
      </div>
    </div>
  );
};

export default AwardsGallery;