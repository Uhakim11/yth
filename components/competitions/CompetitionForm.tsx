import React, { useState, useEffect } from 'react';
import { Competition, CompetitionStatus, CompetitionTask, UploadedFile, CompetitionCategory } from '../../types';
import Input from '../shared/Input';
import Button from '../shared/Button';
import FileInput from '../shared/FileInput'; // New
import { useAlert } from '../../hooks/useAlert';
import { PlusCircle, Trash2 } from 'lucide-react';
import { COMPETITION_CATEGORIES } from '../../constants';


interface CompetitionFormProps {
  initialCompetition?: Competition | null;
  onSubmit: (competitionData: Omit<Competition, 'id' | 'submissions' | 'status' | 'bannerImageUrl'> | Competition) => Promise<void>; 
  onCancel: () => void;
  isSubmitting: boolean;
}

const CompetitionForm: React.FC<CompetitionFormProps> = ({ initialCompetition, onSubmit, onCancel, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImageDataUrl, setBannerImageDataUrl] = useState<string | null>(null);
  const [rules, setRules] = useState('');
  const [prize, setPrize] = useState('');
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState(''); 
  const [status, setStatus] = useState<CompetitionStatus>('upcoming');
  const [category, setCategory] = useState<CompetitionCategory>(COMPETITION_CATEGORIES[0]);
  const [tasks, setTasks] = useState<CompetitionTask[]>([]);
  
  // For adding new task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskType, setNewTaskType] = useState<CompetitionTask['type']>('text_response');
  const [newTaskPoints, setNewTaskPoints] = useState<number | undefined>(undefined);

  const { addAlert } = useAlert();

  useEffect(() => {
    if (initialCompetition) {
      setTitle(initialCompetition.title);
      setDescription(initialCompetition.description);
      setBannerImageDataUrl(initialCompetition.bannerImageDataUrl || initialCompetition.bannerImageUrl || null);
      setRules(initialCompetition.rules);
      setPrize(initialCompetition.prize);
      setStartDate(new Date(initialCompetition.startDate).toISOString().substring(0, 16)); 
      setEndDate(new Date(initialCompetition.endDate).toISOString().substring(0, 16)); 
      setStatus(initialCompetition.status);
      setCategory(initialCompetition.category || COMPETITION_CATEGORIES[0]);
      setTasks(initialCompetition.tasks || []);
    } else {
      setTitle('');
      setDescription('');
      setBannerImageDataUrl(null);
      setRules('');
      setPrize('');
      const now = new Date();
      const defaultStart = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); 
      const defaultEnd = new Date(defaultStart.getTime() + 30 * 24 * 60 * 60 * 1000); 
      setStartDate(defaultStart.toISOString().substring(0, 16));
      setEndDate(defaultEnd.toISOString().substring(0, 16));
      setStatus('upcoming');
      setCategory(COMPETITION_CATEGORIES[0]);
      setTasks([]);
    }
  }, [initialCompetition]);

  const handleBannerImageChange = (file: UploadedFile | null) => {
    setBannerImageDataUrl(file ? file.dataUrl : null);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !newTaskDescription.trim()) {
      addAlert("Task title and description are required.", "error");
      return;
    }
    const newTask: CompetitionTask = {
      id: `task_${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDescription,
      type: newTaskType,
      points: newTaskPoints ? Number(newTaskPoints) : undefined,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskType('text_response');
    setNewTaskPoints(undefined);
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(startDate) >= new Date(endDate)) {
        addAlert('End date must be after start date.', 'error');
        return;
    }

    const competitionDataPayload: any = {
      title,
      description,
      bannerImageDataUrl: bannerImageDataUrl,
      rules,
      prize,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      category,
      tasks,
    };
    // Logic to preserve original bannerImageUrl if bannerImageDataUrl is null and initial one existed
    if (!bannerImageDataUrl && initialCompetition?.bannerImageUrl) {
        competitionDataPayload.bannerImageUrl = initialCompetition.bannerImageUrl;
    }


    if (initialCompetition && initialCompetition.id) {
      onSubmit({ 
        ...competitionDataPayload, 
        id: initialCompetition.id, 
        submissions: initialCompetition.submissions, 
        status: status, 
        winner: initialCompetition.winner, 
        paymentProcessed: initialCompetition.paymentProcessed 
      } as Competition);
    } else {
      onSubmit(competitionDataPayload as Omit<Competition, 'id' | 'submissions' | 'status' | 'bannerImageUrl'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
      <FileInput
        label="Competition Banner Image"
        onFileChange={handleBannerImageChange}
        currentFileUrl={bannerImageDataUrl || (initialCompetition?.bannerImageDataUrl || initialCompetition?.bannerImageUrl)}
        acceptedFileTypes="image/*"
        maxFileSizeMB={5}
      />
      <Input id="title" label="Competition Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select 
          id="category" 
          value={category} 
          onChange={e => setCategory(e.target.value as CompetitionCategory)} 
          required
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm"
        >
          {COMPETITION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea 
          id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm"
          placeholder="Detailed description of the competition..."
        />
      </div>
      <div>
        <label htmlFor="rules" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rules (Markdown supported)</label>
        <textarea 
          id="rules" value={rules} onChange={e => setRules(e.target.value)} required rows={4}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm"
          placeholder="Enter competition rules. You can use Markdown for formatting."
        />
      </div>
      <Input id="prize" label="Prize Description" value={prize} onChange={e => setPrize(e.target.value)} required placeholder="e.g., $500 Amazon Voucher, Feature on Homepage"/>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input id="startDate" label="Start Date & Time" value={startDate} onChange={e => setStartDate(e.target.value)} type="datetime-local" required />
        <Input id="endDate" label="End Date & Time" value={endDate} onChange={e => setEndDate(e.target.value)} type="datetime-local" required />
      </div>

      {/* Competition Tasks Management */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Competition Tasks</h3>
        {tasks.map((task, index) => (
          <div key={task.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200">{index + 1}. {task.title} <span className="text-xs text-gray-500 dark:text-gray-400">({task.type})</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
              {task.points && <p className="text-xs text-blue-600 dark:text-blue-400">Points: {task.points}</p>}
            </div>
            <Button type="button" variant="danger_outline" size="sm" onClick={() => handleRemoveTask(task.id)} leftIcon={<Trash2 size={14}/>}>
              Remove
            </Button>
          </div>
        ))}
        <div className="pt-4 border-t dark:border-gray-600 space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Add New Task:</p>
          <Input id="newTaskTitle" label="Task Title" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="e.g., Submit Design Mockup" />
          <textarea 
            id="newTaskDescription" value={newTaskDescription} onChange={e => setNewTaskDescription(e.target.value)} rows={2}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            placeholder="Task description..."
          />
          <div className="grid grid-cols-2 gap-3">
            <select 
              value={newTaskType} onChange={e => setNewTaskType(e.target.value as CompetitionTask['type'])}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            >
              <option value="text_response">Text Response</option>
              <option value="file_upload_mock">File Upload (Mock)</option>
              <option value="external_link">External Link</option>
            </select>
            <Input type="number" label="Points (Optional)" value={newTaskPoints || ''} onChange={e => setNewTaskPoints(e.target.value ? parseInt(e.target.value) : undefined)} min="0" placeholder="e.g., 50"/>
          </div>
          <Button type="button" variant="info_outline" onClick={handleAddTask} leftIcon={<PlusCircle size={16}/>}>Add This Task</Button>
        </div>
      </div>


      {initialCompetition && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select 
            id="status" value={status} onChange={e => setStatus(e.target.value as CompetitionStatus)} 
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm"
          >
            {(['upcoming', 'open', 'judging', 'closed', 'archived'] as CompetitionStatus[]).map(s => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
          {initialCompetition ? 'Save Changes' : 'Create Competition'}
        </Button>
      </div>
    </form>
  );
};

export default CompetitionForm;