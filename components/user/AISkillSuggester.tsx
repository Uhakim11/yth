
import React, { useState } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Talent } from '../../types';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';
import { useAlert } from '../../hooks/useAlert';
import { Sparkles, ExternalLink, Info, Brain, Lightbulb, Search } from 'lucide-react';
import { ROUTES, generatePath } from '../../constants';

interface AISkillSuggesterProps {
  talent: Talent;
}

export const AISkillSuggester: React.FC<AISkillSuggesterProps> = ({ talent }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addAlert } = useAlert();

  const generateSuggestions = async () => {
    if (!process.env.API_KEY) {
      addAlert("AI Feature Error: API Key not configured. Please contact support.", "error");
      console.error("API_KEY environment variable is not set for AI Skill Suggester.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setSuggestions([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const existingSkills = talent.skills && talent.skills.length > 0 ? talent.skills.join(', ') : 'none specified';
      const prompt = `
        Given a talent profile:
        - Name: "${talent.name}"
        - Category: "${talent.category}"
        - Existing Skills: "${existingSkills}"

        Suggest 2 to 3 new, complementary skills that would be beneficial for someone with this profile to learn.
        Please provide only a comma-separated list of the skill names. For example: Skill1, Skill2, Skill3
      `;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
      });
      
      const textResponse = response.text;

      if (textResponse) {
        const skillArray = textResponse.split(',').map(s => s.trim()).filter(s => s && s.length > 1); // Filter out empty or very short strings
        setSuggestions(skillArray);
        if (skillArray.length > 0) {
            addAlert("AI skill suggestions generated!", "success");
        } else {
            addAlert("The AI couldn't generate specific skill suggestions at this time. Try adjusting profile details or try again later.", "info");
        }
      } else {
        addAlert("The AI Skill Suggester did not return any suggestions. Please try again.", "warning");
      }
    } catch (error) {
      console.error("Error generating AI skill suggestions:", error);
      addAlert(`Failed to get skill suggestions: ${(error as Error).message}. Check console for details.`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border border-purple-300 dark:border-purple-700 rounded-lg bg-purple-50 dark:bg-purple-900/20 shadow-sm">
      <div className="flex items-center mb-3">
        <Brain size={24} className="mr-2 text-purple-600 dark:text-purple-400" />
        <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200">AI Skill Navigator</h4>
      </div>
      <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
        Discover new skills to enhance your profile. Based on your category "{talent.category}" and current skills: {talent.skills && talent.skills.length > 0 ? talent.skills.join(', ') : 'Not specified'}.
      </p>
      
      <Button 
        onClick={generateSuggestions} 
        isLoading={isLoading}
        disabled={isLoading}
        variant="primary"
        className="bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500 mb-4"
        leftIcon={<Sparkles size={18}/>}
      >
        {isLoading ? 'Thinking...' : (suggestions.length > 0 ? 'Get New Suggestions' : 'Suggest Skills')}
      </Button>

      {suggestions.length > 0 && (
        <div className="mt-4 space-y-2 animate-fadeIn">
          <h5 className="text-md font-semibold text-purple-700 dark:text-purple-300">Recommended Skills:</h5>
          <ul className="list-disc list-inside pl-1 space-y-1">
            {suggestions.map((skill, index) => (
              <li key={index} className="text-sm text-purple-700 dark:text-purple-300 flex items-center justify-between group">
                <span><Lightbulb size={14} className="inline mr-1.5 text-yellow-400"/>{skill}</span>
                <Link 
                    to={generatePath(ROUTES.RESOURCES_LIST, {}) + `?search=${encodeURIComponent(skill)}&category=Skill%20Development`}
                    title={`Find resources for ${skill}`}
                >
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity !py-0.5 !px-1.5 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300" rightIcon={<Search size={14}/>}>
                        Find Resources
                    </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
       {!isLoading && suggestions.length === 0 && !isLoading && ( // Ensure not to show this during initial load or if suggestions are pending
        <div className="mt-3 text-center text-sm text-purple-600 dark:text-purple-400 p-3 bg-purple-100 dark:bg-purple-800/30 rounded-md">
            <Info size={16} className="inline mr-1.5"/>
            Click "Suggest Skills" to get personalized recommendations based on your profile.
        </div>
      )}
    </div>
  );
};
export default AISkillSuggester;
