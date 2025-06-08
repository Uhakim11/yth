
import React, { useMemo } from 'react'; // Added useMemo
import AnimatedSection from '../components/shared/AnimatedSection';
import AnimatedText from '../components/shared/AnimatedText';
import { SLIDER_IMAGES, MOCK_TESTIMONIALS, ROUTES, MOCK_SHOWCASED_WINNERS, MOCK_CATEGORY_SHOWCASES, MOCK_AWARDS_DATA, MOCK_TALENT_CATEGORIES, MOCK_STATISTICS_BASE_CONFIG } from '../constants'; 
import { useAuth } from '../hooks/useAuth'; // Added useAuth
import { useTalent } from '../hooks/useTalent';
import { useCompetition } from '../hooks/useCompetition'; 
import { useWorkshop } from '../hooks/useWorkshop'; 
import { useResource } from '../hooks/useResource'; // Added useResource
import FeaturedTalents from '../components/welcome/FeaturedTalents';
import HowItWorks from '../components/welcome/HowItWorks';
import Testimonials from '../components/welcome/Testimonials';
import Button from '../components/shared/Button';
import { Link } from 'react-router-dom';
import FeaturedCompetitionCard from '../components/competitions/FeaturedCompetitionCard';
import UpcomingWorkshopCard from '../components/workshops/UpcomingWorkshopCard';
import WinnerHighlightCard from '../components/welcome/WinnerHighlightCard'; 
import CategoryShowcaseCard from '../components/welcome/CategoryShowcaseCard'; 
import ImageSlider from '../components/welcome/ImageSlider'; 
import AwardsGallery from '../components/welcome/AwardsGallery'; 
import JoinCTASection from '../components/welcome/JoinCTASection'; 
import { ArrowRight, Trophy as TrophyIconLucide, Lightbulb } from 'lucide-react'; 
import StatisticCard from '../components/admin/StatisticCard'; // Added StatisticCard
import TalentCardSkeleton from '../components/shared/TalentCardSkeleton'; // For stats loading

const WelcomePage: React.FC = () => {
  const { talents, loading: talentsLoading } = useTalent();
  const { competitions, loading: competitionsLoading } = useCompetition(); 
  const { workshops, loading: workshopsLoading } = useWorkshop();
  const { resources, loading: resourcesLoading } = useResource(); // Added
  const { fetchAllUsers } = useAuth(); // Added, assuming it provides total user count or can be adapted
  const [totalUsersCount, setTotalUsersCount] = React.useState(0);

  React.useEffect(() => {
    fetchAllUsers().then(allUsers => setTotalUsersCount(allUsers.length));
  }, [fetchAllUsers]);

  const showcasedTalentsList = talents.slice(0, 12); 
  const featuredCompetition = competitions.find(c => c.status === 'open' || c.status === 'upcoming'); 
  const upcomingWorkshopsList = workshops // Renamed to avoid conflict
    .filter(w => new Date(w.dateTime) > new Date())
    .sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 2);

  const statisticsData = useMemo(() => {
    return MOCK_STATISTICS_BASE_CONFIG.map(stat => {
       if (stat.id === 's0') return { ...stat, value: `${totalUsersCount}` };
       if (stat.id === 's1') return { ...stat, value: `${talents.length}` };
       if (stat.id === 's3') return { ...stat, value: `${MOCK_TALENT_CATEGORIES.length}` }; // Assuming categories are constant for this stat
       if (stat.id === 's5') return { ...stat, value: `${competitions.filter(c => c.status === 'open' || c.status === 'upcoming').length}` };
       if (stat.id === 's6') return { ...stat, value: `${workshops.filter(w => new Date(w.dateTime) > new Date()).length}` };
       if (stat.id === 's7') return { ...stat, value: `${resources.length}` };
       return { ...stat, value: 'N/A'};
   });
 }, [talents.length, competitions, workshops, resources.length, totalUsersCount]);

 const statsLoading = talentsLoading || competitionsLoading || workshopsLoading || resourcesLoading || totalUsersCount === 0;


  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-950">
      <section className="h-screen w-full relative">
        <ImageSlider slides={SLIDER_IMAGES} autoplayInterval={7000} />
      </section>

      {/* Platform Statistics Section */}
      <AnimatedSection className="w-full py-12 md:py-20 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                    <AnimatedText text="Platform At a Glance" animationType="word-slide-in" staggerDelay={80}/>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
                    See the vibrant activity and opportunities within our community.
                </p>
            </div>
            {statsLoading && statisticsData.every(s => s.value === 'N/A' || s.value === '0') ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => ( // Assuming 6 stat cards
                        <div key={i} className="p-6 rounded-xl shadow-lg bg-gray-200 dark:bg-gray-700 animate-pulse h-32"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statisticsData.map(stat => <StatisticCard key={stat.id} {...stat} />)}
                </div>
            )}
        </div>
      </AnimatedSection>


      {MOCK_SHOWCASED_WINNERS.length > 0 && (
        <AnimatedSection className="w-full py-12 md:py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-12">
                <TrophyIconLucide className="h-12 w-12 text-amber-500 dark:text-amber-400 mx-auto mb-3 transform group-hover:scale-110 transition-transform" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                    <AnimatedText text="Hall of Fame" animationType="word-slide-in" staggerDelay={80}/>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
                    Celebrating the remarkable achievements of our talented competition winners. Their journey inspires us all.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_SHOWCASED_WINNERS.map(winner => (
                <WinnerHighlightCard key={winner.id} winner={winner} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      <AnimatedSection className="w-full py-12 md:py-20 bg-white dark:bg-gray-900">
        <FeaturedTalents talents={showcasedTalentsList} loading={talentsLoading} displayCount={12} />
      </AnimatedSection>
      
      {MOCK_CATEGORY_SHOWCASES.length > 0 && (
        <AnimatedSection className="w-full py-12 md:py-20 bg-gray-100 dark:bg-gray-950">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-10 md:mb-12">
                    <Lightbulb className="h-12 w-12 text-primary-500 dark:text-primary-400 mx-auto mb-3 transform group-hover:rotate-[15deg] transition-transform" />
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                        <AnimatedText text="Explore Diverse Categories" animationType="word-slide-in" staggerDelay={80}/>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
                        Dive into various fields of talent, discover opportunities, and connect with like-minded individuals.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_CATEGORY_SHOWCASES.map(category => (
                        <CategoryShowcaseCard key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </AnimatedSection>
      )}
      
      {MOCK_AWARDS_DATA.length > 0 && (
        <AnimatedSection className="w-full py-12 md:py-20 bg-primary-50 dark:bg-primary-900/20">
            <AwardsGallery awards={MOCK_AWARDS_DATA} />
        </AnimatedSection>
      )}

      {featuredCompetition && !competitionsLoading && (
        <AnimatedSection className="w-full py-12 md:py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-12">
                <TrophyIconLucide className="h-12 w-12 text-amber-500 dark:text-amber-400 mx-auto mb-3" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                  <AnimatedText text="Featured Competition" animationType="word-slide-in" staggerDelay={80}/>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
                    Check out our current highlight competition. Don't miss your chance to participate!
                </p>
            </div>
            <div className="max-w-2xl mx-auto">
                <FeaturedCompetitionCard competition={featuredCompetition} />
            </div>
             <div className="text-center mt-10">
                <Link to={ROUTES.COMPETITIONS_LIST}>
                    <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="h-5 w-5"/>}>View All Competitions</Button>
                </Link>
            </div>
          </div>
        </AnimatedSection>
      )}

      {upcomingWorkshopsList.length > 0 && !workshopsLoading && (
        <AnimatedSection className="w-full py-12 md:py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center mb-10">
                 <AnimatedText text="Upcoming Workshops" animationType="word-slide-in" staggerDelay={80}/>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {upcomingWorkshopsList.map(workshop => (
                <UpcomingWorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
            <div className="text-center mt-10">
                <Link to={ROUTES.WORKSHOPS_LIST}>
                    <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="h-5 w-5"/>}>Browse All Workshops</Button>
                </Link>
            </div>
          </div>
        </AnimatedSection>
      )}
      
      <AnimatedSection className="w-full py-12 md:py-20 bg-white dark:bg-gray-900">
        <HowItWorks />
      </AnimatedSection>

      <AnimatedSection className="w-full py-12 md:py-20 bg-gray-50 dark:bg-gray-800/50">
        <Testimonials testimonials={MOCK_TESTIMONIALS} />
      </AnimatedSection>

      <JoinCTASection />

      <footer className="w-full py-10 text-center text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-950 border-t dark:border-gray-800">
        <p>&copy; {new Date().getFullYear()} Youth Talent Hub. All rights reserved.</p>
        <p className="text-sm">Empowering the next generation of talent through technology and community.</p>
      </footer>
    </div>
  );
};

export default WelcomePage;