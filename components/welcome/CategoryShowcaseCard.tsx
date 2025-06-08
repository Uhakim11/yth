import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryShowcase } from '../../types';
import { ArrowRight } from 'lucide-react';

const CategoryShowcaseCard: React.FC<{ category: CategoryShowcase }> = ({ category }) => {
  const IconComponent = category.icon;

  return (
    <Link 
      to={category.link} 
      className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 hover:scale-105"
    >
      <div 
        className={`absolute inset-0 ${category.imageUrl} bg-cover bg-center category-card-bg-image`}
      ></div>
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300"></div>
      
      <div className="relative p-6 h-56 flex flex-col justify-between items-start text-white">
        <div className="transform transition-transform duration-300 group-hover:scale-110">
          <IconComponent size={36} className="mb-2 text-primary-300 group-hover:text-primary-200 transition-all duration-300 ease-out group-hover:rotate-[15deg] group-hover:drop-shadow-[0_0_8px_rgba(var(--color-primary-500),0.7)]" />
          <h3 className="text-2xl font-bold group-hover:text-shadow-lg transition-text-shadow duration-300">{category.name}</h3>
        </div>
        
        <p className="text-sm text-gray-200 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-100 line-clamp-3 group-hover:translate-y-0 translate-y-2">
          {category.description}
        </p>
        
        <div className="mt-auto self-end opacity-0 group-hover:opacity-100 transition-all duration-400 delay-150 transform group-hover:translate-x-0 translate-x-[-8px]">
           <ArrowRight size={28} className="transform group-hover:scale-110 transition-transform"/>
        </div>
      </div>
    </Link>
  );
};

export default CategoryShowcaseCard;