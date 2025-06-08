import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCompetition } from '../../hooks/useCompetition';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../hooks/useAlert';
import { Competition, CompetitionTask, CompetitionExercise } from '../../types';
import { ArrowLeft, ClipboardList, Image as ImageIcon, Video as VideoIcon, HelpCircle, ListOrdered, FileText, Link2, TerminalSquare, Edit, CheckSquare, UploadCloud as UploadIcon } from 'lucide-react';
import { ROUTES, generatePath } from '../../constants';
import Markdown from 'react-markdown';
import FileUploadMock from '../../components/user/FileUploadMock'; 

const TaskTypeIcon: React.FC<{type: CompetitionTask['type']}> = ({ type }) => {
  switch(type) {
    case 'text_response': return <FileText size={20} className="mr-2 text-blue-500 flex-shrink-0" />;
    case 'file_upload_mock': return <UploadIcon size={20} className="mr-2 text-purple-500 flex-shrink-0" />; 
    case 'external_link': return <Link2 size={20} className="mr-2 text-green-500 flex-shrink-0" />;
    default: return <ListOrdered size={20} className="mr-2 text-gray-500 flex-shrink-0" />;
  }
};

const ExerciseTypeIcon: React.FC<{type: CompetitionExercise['type']}> = ({ type }) => {
    switch(type) {
      case 'multiple_choice_mock': return <CheckSquare size={18} className="mr-2 text-green-500 flex-shrink-0" />;
      case 'coding_challenge_mock': return <TerminalSquare size={18} className="mr-2 text-sky-500 flex-shrink-0" />;
      case 'essay_mock': return <Edit size={18} className="mr-2 text-orange-500 flex-shrink-0" />;
      case 'file_upload_mock': return <UploadIcon size={18} className="mr-2 text-purple-500 flex-shrink-0" />;
      default: return <ListOrdered size={18} className="mr-2 text-gray-500 flex-shrink-0" />;
    }
  };

const CompetitionUserTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCompetitionById, loading } = useCompetition();
  const { user } = useAuth();
  const { addAlert } = useAlert();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<Competition | null>(null);

  useEffect(() => {
    if (id) {
      const fetchCompetition = async () => {
        const fetchedComp = await getCompetitionById(id);
        if (fetchedComp) {
          if (fetchedComp.status !== 'open' && user?.role !== 'admin') { // Admin can view tasks anytime
            addAlert('This competition is not currently open for participation.', 'warning');
            navigate(generatePath(ROUTES.COMPETITION_DETAIL, {id: fetchedComp.id}));
            return;
          }
          setCompetition(fetchedComp);
        } else {
          addAlert('Competition not found.', 'error');
          navigate(ROUTES.COMPETITIONS_LIST);
        }
      };
      fetchCompetition();
    }
  }, [id, getCompetitionById, addAlert, navigate, user]);

  if (loading && !competition) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
        <p className="ml-4 text-xl text-gray-700 dark:text-gray-300">Loading Tasks...</p>
      </div>
    );
  }

  if (!competition) {
    return <div className="p-8 text-center dark:text-gray-300">Competition tasks could not be loaded.</div>;
  }
  
  const hasSubmitted = competition.submissions.some(sub => sub.talentId === user?.id);


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
                Tasks for: {competition.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Review and understand the requirements for each task.
              </p>
            </div>
          </div>
        </header>

        {hasSubmitted && user?.role !== 'admin' && (
             <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-800/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-center">
                You have already submitted your entry for this competition. Task details are for review.
            </div>
        )}

        {(!competition.tasks || competition.tasks.length === 0) ? (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
            <p className="text-gray-700 dark:text-gray-300">No tasks have been defined for this competition yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {competition.tasks.map((task, index) => (
              <section key={task.id} className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden p-6">
                <div className="flex items-center mb-4 pb-3 border-b dark:border-gray-700">
                  <TaskTypeIcon type={task.type} />
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{index + 1}. {task.title}</h2>
                  {task.points && <span className="ml-auto text-base font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-700/50 px-3 py-1 rounded-full">{task.points} pts</span>}
                </div>
                
                <div className="prose dark:prose-invert max-w-none mb-5 blog-content">
                  <Markdown>{task.description}</Markdown>
                </div>

                {task.imageUrls && task.imageUrls.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                      <ImageIcon size={20} className="mr-2 text-green-500"/> Reference Images:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {task.imageUrls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-400">
                          <img src={url} alt={`Task ${task.title} - Image ${i+1}`} className="w-full h-36 object-cover"/>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {task.videoUrls && task.videoUrls.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                      <VideoIcon size={20} className="mr-2 text-red-500"/> Reference Videos:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 pl-5">
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
                   <div className="mt-5">
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                      <HelpCircle size={20} className="mr-2 text-yellow-500"/> Guiding Questions:
                    </h4>
                    <ul className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300 pl-5 prose prose-sm dark:prose-invert max-w-none">
                      {task.guidingQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {task.exercises && task.exercises.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                      <ListOrdered size={22} className="mr-2 text-indigo-500"/> Exercises for this Task:
                    </h3>
                    <div className="space-y-5">
                      {task.exercises.map((exercise, exIndex) => (
                        <div key={exercise.id} className="p-4 bg-gray-50 dark:bg-gray-700/60 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                          <div className="flex items-center mb-2">
                            <ExerciseTypeIcon type={exercise.type} />
                            <h4 className="font-semibold text-gray-700 dark:text-gray-100">{exIndex + 1}. {exercise.title}</h4>
                            {exercise.points && <span className="ml-auto text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-700/50 px-2 py-0.5 rounded-full">{exercise.points} pts</span>}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300 ml-7 prose prose-sm dark:prose-invert max-w-none blog-content">
                             <Markdown>{exercise.instructions}</Markdown>
                          </div>
                          {exercise.type === 'file_upload_mock' && (
                            <div className="ml-7 mt-3">
                                <FileUploadMock />
                            </div>
                          )}
                          {exercise.mockSolutionPreview && (
                            <div className="mt-3 ml-7">
                              <details className="group">
                                <summary className="text-xs font-semibold text-gray-500 dark:text-gray-400 cursor-pointer hover:text-primary-500 dark:hover:text-primary-300">
                                  View Mock Solution/Preview
                                </summary>
                                <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-600 p-2 rounded-md overflow-x-auto group-open:animate-fadeIn">{exercise.mockSolutionPreview}</pre>
                              </details>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                 {task.type === 'file_upload_mock' && !task.exercises?.some(e => e.type === 'file_upload_mock') && (
                    <div className="mt-5">
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                            <UploadIcon size={20} className="mr-2 text-purple-500"/> File Upload (Mock)
                        </h4>
                        <FileUploadMock />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">For this task, if you need to upload a file, please mention its name in your main submission text on the competition details page.</p>
                    </div>
                 )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionUserTaskPage;