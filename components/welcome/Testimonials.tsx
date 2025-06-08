import React from 'react';
import { Testimonial } from '../../types';
import { ChatBubbleLeftRightIcon, UserCircleIcon } from '@heroicons/react/24/solid';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-4" />
      <p className="text-gray-600 dark:text-gray-300 italic mb-6 flex-grow">"{testimonial.quote}"</p>
      <div className="flex items-center mt-auto border-t border-gray-200 dark:border-gray-700 pt-4">
        {testimonial.avatarUrl ? (
          <img src={testimonial.avatarUrl} alt={testimonial.name} className="h-12 w-12 rounded-full mr-4 object-cover" />
        ) : (
          <UserCircleIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mr-4" />
        )}
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10 md:mb-16">
        <UserCircleIcon className="h-12 w-12 text-indigo-500 dark:text-indigo-400 mx-auto mb-2" />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          What Our Users Say
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          Hear from talents who have benefited from our platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map(testimonial => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;