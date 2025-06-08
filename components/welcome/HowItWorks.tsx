
import React from 'react';
import { UserPlusIcon, PencilSquareIcon, SparklesIcon, LightBulbIcon } from '@heroicons/react/24/outline'; 

interface Step {
  id: string;
  icon: React.ElementType; // Changed to React.ElementType
  title: string;
  description: string;
  iconColorClass: string;
}

const steps: Step[] = [
  {
    id: '1',
    icon: UserPlusIcon,
    title: 'Sign Up & Join',
    description: 'Create your free account in minutes and become part of our vibrant community.',
    iconColorClass: 'text-blue-500 dark:text-blue-400'
  },
  {
    id: '2',
    icon: PencilSquareIcon,
    title: 'Create Your Profile',
    description: 'Showcase your unique skills, experiences, and portfolio to stand out.',
    iconColorClass: 'text-green-500 dark:text-green-400'
  },
  {
    id: '3',
    icon: SparklesIcon, // Used SparklesIcon directly
    title: 'Get Discovered',
    description: 'Connect with opportunities, collaborators, and employers looking for your talent.',
    iconColorClass: 'text-purple-500 dark:text-purple-400'
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10 md:mb-16">
        <LightBulbIcon className="h-12 w-12 text-yellow-500 dark:text-yellow-400 mx-auto mb-2" />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          How It Works
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          A simple path to showcasing your talent and finding new opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2"
          >
            <div className={`p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-6 inline-block`}>
              <step.icon className={`h-10 w-10 ${step.iconColorClass}`} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;