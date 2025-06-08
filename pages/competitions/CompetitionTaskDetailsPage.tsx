import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCompetition } from '../../hooks/useCompetition';
import { useAlert } from '../../hooks/useAlert';
import { Competition, CompetitionTask, CompetitionExercise } from '../../types';
import { ArrowLeft, ClipboardList, Image as ImageIcon, Video as VideoIcon, HelpCircle, ListOrdered, FileText, Link2 as LinkIconLucide, TerminalSquare, Edit as EditIconLucide, CheckSquare, UploadCloud, Save, XCircle } from 'lucide-react'; // Added Save, XCircle
import { ROUTES, generatePath } from '../../constants';
import Markdown from 'react-markdown';
import Button from '../../components/shared/Button'; // Added Button
import Modal from '../../components/shared/Modal'; // Added Modal
import Input from '../../components/shared/Input'; // Added Input

const TaskTypeIconDisplay: React.FC<{type: CompetitionTask['type']}> = ({ type }) => {
  switch(type) {
    case 'text_response': return <FileText size={20} className="mr-2 text-blue-500 flex-shrink-0" />;
    case 'file_upload_mock': return <UploadCloud size={20} className="mr-2 text-purple-500 flex-shrink-0" />; 
    case 'external_link': return <LinkIconLucide size={20} className="mr-2 text-green-500 flex-shrink-0" />;
    default: return <ListOrdered size={20} className="mr-2 text-gray-500 flex-shrink-0" />;
  }
};

const ExerciseTypeIconDisplay: React.FC<{type: CompetitionExercise['type']}> = ({ type }) => {
    switch(type) {
      case 'multiple_choice_mock': return <CheckSquare size={18} className="mr-2 text-green-500 flex-shrink-0" />;
      case 'coding_challenge_mock': return <TerminalSquare size={18} className="mr-2 text-sky-500 flex-shrink-0" />;
      case 'essay_mock': return <EditIconLucide size={18} className="mr-2 text-orange-500 flex-shrink-0" />; // Renamed Edit import
      case 'file_upload_mock': return <UploadCloud size={18} className="mr-2 text-purple-500 flex-shrink-0" />;
      default: return <ListOrdered size={18} className="mr-2 text-gray-500 flex-shrink-0" />;
    }
  };

const TaskEditForm: React.FC<{
  task: CompetitionTask;
  onSave: (updatedTask: CompetitionTask) => void;
  onCancel: () => void;
  isSaving: boolean;
}> = ({ task: initialTask, onSave, onCancel, isSaving }) => {
  const [task, setTask] = useState<CompetitionTask>(initialTask);

  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(task);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
      <Input label="Task Title" name="title" value={task.title} onChange={handleChange} required />
      <div>
        <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Markdown supported)</label>
        <textarea 
          id="task-description"
          name="description" 
          value={task.description} 
          onChange={handleChange} 
          rows={5} 
          className="w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="task-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Type</label>
          <select name="type" value={task.type} onChange={handleChange} className="w-full p-2 border dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
            <option value="text_response">Text Response</option>
            <option value="file_upload_mock">File Upload (Mock)</option>
            <option value="external_link">External Link</option>
          </select>
        </div>
        <Input label="Points (Optional)" name="points" type="number" value={task.points || ''} onChange={handleChange} min="0" />
      </div>
      {/* Simple display for URLs/Questions for now, not editable in this form iteration */}
      {task.imageUrls && task.imageUrls.length > 0 && <p className="text-xs text-gray-500 dark:text-gray-400">Image URLs: {task.imageUrls.join(', ')} (Editing URLs not supported in this quick edit)</p>}
      {task.videoUrls && task.videoUrls.length > 0 && <p className="text-xs text-gray-500 dark:text-gray-400">Video URLs: {task.videoUrls.join(', ')} (Editing URLs not supported in this quick edit)</p>}
      {task.guidingQuestions && task.guidingQuestions.length > 0 && <p className="text-xs text-gray-500 dark:text-gray-400">Guiding Questions exist (Editing not supported in this quick edit)</p>}
      
      {/* Exercise editing would be complex here, defer to a dedicated interface or CompetitionForm */}
       {task.exercises && task.exercises.length > 0 && <p className="text-xs text-gray-500 dark:text-gray-400">{task.exercises.length} Exercises exist (Editing exercises not supported in this quick edit)</p>}


      <div className="flex justify-end space-x-3 pt-3 border-t dark:border-gray-600">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving} leftIcon={<XCircle size={16}/>}>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={isSaving} disabled={isSaving} leftIcon={<Save size={16}/>}>Save Task</Button>
      </div>
    </form>
  );
};


const CompetitionTaskDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCompetitionById, updateCompetition, loading: competitionLoading } = useCompetition();
  const { addAlert } = useAlert();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [editingTask, setEditingTask] = useState<CompetitionTask | null>(null);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // Separate loading state for this page

  useEffect(() => {
    setPageLoading(true);
    if (id) {
      const fetchCompetition = async () => {
        const fetchedComp = await getCompetitionById(id);
        if (fetchedComp) {
          setCompetition(fetchedComp);
        } else {
          addAlert('Competition not found.', 'error');
          navigate(ROUTES.COMPETITIONS_LIST);
        }
        setPageLoading(false);
      };
      fetchCompetition();
    }
  }, [id, getCompetitionById, addAlert, navigate]);

  const handleSaveTask = async (updatedTask: CompetitionTask) => {
    if (!competition) return;
    setIsSavingTask(true);
    const updatedTasks = (competition.tasks || []).map(t => t.id === updatedTask.id ? updatedTask : t);
    const updatedCompetition = { ...competition, tasks: updatedTasks };
    
    const result = await updateCompetition(updatedCompetition); // Assuming updateCompetition handles tasks array update
    if (result) {
      setCompetition(result);
      addAlert(`Task "${updatedTask.title}" updated successfully.`, 'success');
      setEditingTask(null);
    } else {
      addAlert('Failed to update task.', 'error');
    }
    setIsSavingTask(false);
  };


  if (pageLoading || (competitionLoading && !competition)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
        <p className="ml-4 text-xl text-gray-700 dark:text-gray-300">Loading Task Details...</p>
      </div>
    );
  }

  if (!competition) {
    return <div className="p-8 text-center dark:text-gray-300">Competition details could not be loaded.</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          to={generatePath(ROUTES.COMPETITION_DETAIL, { id: competition.id })} 
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-6 group"
        >
          <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Competition Details
        </Link>

        <header className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="flex items-center space-x-3">
            <ClipboardList className="h-10 w-10 text-primary-500" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Manage Tasks for: {competition.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Review and edit competition tasks. To add or remove tasks, edit the competition itself.
              </p>
            </div>
          </div>
        </header>

        {(!competition.tasks || competition.tasks.length === 0) ? (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
            <p className="text-gray-700 dark:text-gray-300">No tasks have been defined for this competition yet. You can add tasks by editing the competition.</p>
            <Button onClick={() => navigate(generatePath(ROUTES.ADMIN_DASHBOARD, {}) + `?tab=Competitions&edit=${competition.id}`)} className="mt-4">Edit Competition to Add Tasks</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {competition.tasks.map((task, index) => (
              <div key={task.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <TaskTypeIconDisplay type={task.type} />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{index + 1}. {task.title}</h2>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEditingTask(task)} leftIcon={<EditIconLucide size={16}/>}>
                    Edit Task
                  </Button>
                </div>
                {task.points && <p className="text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-700/50 px-2 py-0.5 rounded-full inline-block mb-2">{task.points} pts</p>}
                
                <div className="prose dark:prose-invert max-w-none mb-4 blog-content">
                  <Markdown>{task.description}</Markdown>
                </div>

                {task.imageUrls && task.imageUrls.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                      <ImageIcon size={18} className="mr-2 text-green-500"/> Associated Images:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {task.imageUrls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                          <img src={url} alt={`Task ${task.title} - Image ${i+1}`} className="w-full h-32 object-cover"/>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {task.videoUrls && task.videoUrls.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                      <VideoIcon size={18} className="mr-2 text-red-500"/> Associated Videos:
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {task.videoUrls.map((url, i) => (
                        <li key={i} className="text-sm">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                            Video Link {i+1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {task.guidingQuestions && task.guidingQuestions.length > 0 && (
                   <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                      <HelpCircle size={18} className="mr-2 text-yellow-500"/> Guiding Questions:
                    </h4>
                    <ul className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300 pl-4">
                      {task.guidingQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {task.exercises && task.exercises.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                      <ListOrdered size={20} className="mr-2 text-indigo-500"/> Associated Exercises:
                    </h4>
                    <div className="space-y-4">
                      {task.exercises.map((exercise, exIndex) => (
                        <div key={exercise.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center mb-2">
                            <ExerciseTypeIconDisplay type={exercise.type} />
                            <h5 className="font-medium text-gray-700 dark:text-gray-100">{exIndex + 1}. {exercise.title}</h5>
                            {exercise.points && <span className="ml-auto text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-700/50 px-2 py-0.5 rounded-full">{exercise.points} pts</span>}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 ml-7 prose prose-sm dark:prose-invert max-w-none blog-content">
                             <Markdown>{exercise.instructions}</Markdown>
                          </div>
                          {exercise.mockSolutionPreview && (
                            <div className="mt-2 ml-7">
                              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Mock Solution/Preview:</p>
                              <pre className="text-xs bg-gray-100 dark:bg-gray-600 p-2 rounded-md overflow-x-auto">{exercise.mockSolutionPreview}</pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {editingTask && (
        <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title={`Edit Task: ${editingTask.title}`} size="lg">
            <TaskEditForm 
                task={editingTask}
                onSave={handleSaveTask}
                onCancel={() => setEditingTask(null)}
                isSaving={isSavingTask}
            />
        </Modal>
      )}
    </div>
  );
};

export default CompetitionTaskDetailsPage;