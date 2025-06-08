import React, { useState, useEffect } from 'react';
import { Talent, UploadedFile } from '../../types';
import Input from '../shared/Input';
import Button from '../shared/Button';
import FileInput from '../shared/FileInput'; 
import { MOCK_TALENT_CATEGORIES } from '../../constants';
import { useAlert } from '../../hooks/useAlert';
import { GoogleGenAI } from "@google/genai";
import { Sparkles } from 'lucide-react';

interface TalentFormProps {
  initialTalent?: Talent | null;
  onSubmit: (talentData: Omit<Talent, 'id' | 'userId' | 'portfolio' | 'profileImageUrl'> | Talent) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
}

const TalentForm: React.FC<TalentFormProps> = ({ initialTalent, onSubmit, onCancel, isSubmitting }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [profileImageDataUrl, setProfileImageDataUrl] = useState<string | null>(null);
  const [portfolioLinks, setPortfolioLinks] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [location, setLocation] = useState('');
  const { addAlert } = useAlert();

  // AI Description Generation State
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    if (initialTalent) {
      setName(initialTalent.name);
      setCategory(initialTalent.category);
      setDescription(initialTalent.description);
      setSkills(initialTalent.skills.join(', '));
      setProfileImageDataUrl(initialTalent.profileImageDataUrl || initialTalent.profileImageUrl || null); 
      setPortfolioLinks(initialTalent.portfolioLinks?.join(', ') || '');
      setContactEmail(initialTalent.contactEmail || '');
      setLocation(initialTalent.location || '');
    } else {
      setName('');
      setCategory(MOCK_TALENT_CATEGORIES[0] || '');
      setDescription('');
      setSkills('');
      setProfileImageDataUrl(null);
      setPortfolioLinks('');
      setContactEmail('');
      setLocation('');
    }
    setAiSuggestion(null); 
  }, [initialTalent]);

  const handleProfileImageChange = (file: UploadedFile | null) => {
    setProfileImageDataUrl(file ? file.dataUrl : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category.trim() || !description.trim()) {
        addAlert('Name, Category, and Description are required.', 'error');
        return;
    }

    const talentDataPayload: any = {
      name,
      category,
      description,
      skills: skills.split(',').map(s => s.trim()).filter(s => s),
      profileImageDataUrl: profileImageDataUrl, 
      portfolioLinks: portfolioLinks.split(',').map(s => s.trim()).filter(s => s),
      contactEmail: contactEmail || undefined,
      location: location || undefined,
    };
    
    if (initialTalent && initialTalent.id) {
      onSubmit({ 
        ...talentDataPayload, 
        id: initialTalent.id, 
        userId: initialTalent.userId,
        profileImageUrl: !profileImageDataUrl && initialTalent.profileImageUrl ? initialTalent.profileImageUrl : undefined,
        portfolio: initialTalent.portfolio || [] 
      } as Talent);
    } else {
      onSubmit(talentDataPayload as Omit<Talent, 'id' | 'userId' | 'portfolio' | 'profileImageUrl'>);
    }
  };

  const handleGenerateDescription = async () => {
    if (!name.trim() || !category.trim()) { // Skills can be optional for initial generation
      addAlert('Please fill in Name and Category to generate a description.', 'warning');
      return;
    }
    setIsGeneratingDescription(true);
    setAiSuggestion(null);
    try {
      if (!process.env.API_KEY) {
        // This check is mostly for local dev; in deployed env, API_KEY should be set.
        console.error('API_KEY environment variable is not set.');
        addAlert('AI feature configuration error. Please contact support.', 'error');
        setIsGeneratingDescription(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const skillsText = skills.trim() ? ` whose skills include "${skills}"` : "";
      const prompt = `Generate a concise and engaging talent profile description (around 50-70 words) for a talent named "${name}", in the category of "${category}"${skillsText}. Emphasize their passion and key strengths. Write in a professional but approachable tone.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17', // Correct and current model
        contents: prompt,
      });

      if (response.text) {
        setAiSuggestion(response.text.trim());
        addAlert('AI description suggestion generated!', 'success');
      } else {
        addAlert('Could not generate a description. The AI returned an empty response.', 'error');
      }
    } catch (error) {
      console.error('Error generating AI description:', error);
      addAlert(`Failed to generate description: ${(error as Error).message}`, 'error');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleUseSuggestion = () => {
    if (aiSuggestion) {
      setDescription(aiSuggestion);
      setAiSuggestion(null); 
    }
  };

  const handleDiscardSuggestion = () => {
    setAiSuggestion(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <FileInput
        label="Profile Image"
        onFileChange={handleProfileImageChange}
        currentFileUrl={profileImageDataUrl || (initialTalent?.profileImageDataUrl || initialTalent?.profileImageUrl)}
        acceptedFileTypes="image/*"
        maxFileSizeMB={2}
      />
      <Input id="name" label="Full Name / Act Name" value={name} onChange={e => setName(e.target.value)} required />
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select 
          id="category" 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          required
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm transition-colors duration-150"
        >
          {MOCK_TALENT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      
      <Input id="skills" label="Skills (comma-separated)" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g., Singing, Dancing, Python" />

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description / Bio</label>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleGenerateDescription} 
            isLoading={isGeneratingDescription}
            leftIcon={<Sparkles size={16} className="text-yellow-500"/>}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            disabled={isSubmitting || isGeneratingDescription}
          >
            Generate with AI ✨
          </Button>
        </div>
        <textarea 
          id="description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          required 
          rows={4}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm transition-colors duration-150"
          placeholder="Tell us about your talent..."
        />
      </div>

      {aiSuggestion && (
        <div className="mt-2 p-3 border border-dashed border-primary-300 dark:border-primary-700 rounded-md bg-primary-50 dark:bg-primary-900/20 animate-fadeIn">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">AI Suggestion:</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{aiSuggestion}</p>
          <div className="mt-2 flex space-x-2">
            <Button type="button" size="sm" variant="success" onClick={handleUseSuggestion}>Use Suggestion</Button>
            <Button type="button" size="sm" variant="secondary" onClick={handleDiscardSuggestion}>Discard</Button>
          </div>
        </div>
      )}

      <Input id="portfolioLinks" label="Portfolio Links (comma-separated, Optional, e.g., Behance, GitHub)" value={portfolioLinks} onChange={e => setPortfolioLinks(e.target.value)} placeholder="https://mywork.com, https://videos.com/mychannel" />
      <Input id="contactEmail" label="Public Contact Email (Optional)" value={contactEmail} onChange={e => setContactEmail(e.target.value)} type="email" placeholder="contact@example.com" />
      <Input id="location" label="Location (Optional)" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" />

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting || isGeneratingDescription}>Cancel</Button>}
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting || isGeneratingDescription}>
          {initialTalent ? 'Save Changes' : 'Create Profile'}
        </Button>
      </div>
    </form>
  );
};

export default TalentForm;