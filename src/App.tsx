import './App.css';
import saylor from './assets/saylor.jpg';
import btc from './assets/btc.png';
import { useState, useEffect, useRef } from 'react';
import { 
  Footer, 
  MediaGrid, 
  SearchBar, 
  TagFilter, 
  PhotoModal, 
  LoadingSpinner, 
  EmptyState 
} from './components';
import { useFirebaseStorage, useMediaFiltering, useAnalytics } from './hooks';
import { MediaType, Photo } from './types';

function App() {
  const [currentSelection, setCurrentSelection] = useState<MediaType>('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [enlargedPhoto, setEnlargedPhoto] = useState<Photo | null>(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  
  const { videos, photos, isLoading, loadVideoUrl, setVideos } = useFirebaseStorage();
  const { filteredContent, availableTags } = useMediaFiltering(
    videos, 
    photos, 
    currentSelection, 
    searchQuery, 
    activeFilter
  );
  const { logAnalyticsEvent } = useAnalytics();

  // Hide/show navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsNavVisible(currentScrollY < lastScrollY.current || currentScrollY < 50);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentSelection === 'videos') {
      logAnalyticsEvent('view_videos');
    } else {
      logAnalyticsEvent('view_photos');
    }
  }, [currentSelection, logAnalyticsEvent]);

  useEffect(() => {
    if (searchQuery) {
      logAnalyticsEvent('search', { search_term: searchQuery });
    }
  }, [searchQuery, logAnalyticsEvent]);

  useEffect(() => {
    if (activeFilter !== 'all') {
      logAnalyticsEvent('filter_by_tag', { tag: activeFilter });
    }
  }, [activeFilter, logAnalyticsEvent]);

  const handleTogglePlay = (index: number) => {
    setVideos(prevVideos => 
      prevVideos.map((video, i) => ({
        ...video,
        isPlaying: i === index ? !video.isPlaying : false
      }))
    );
  };

  const handleEnlargePhoto = (photo: Photo) => {
    setEnlargedPhoto(photo);
    logAnalyticsEvent('enlarge_photo', {
      photo_title: photo.title
    });
  };

  return (
    <div className="min-h-screen bg-dark relative overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-radial from-btc/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-grid-pattern bg-grid-32 opacity-10"></div>
      </div>

      {/* Floating navigation header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="glass border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Brand */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    className="h-10 w-10 rounded-full shadow-glow animate-float"
                    src={saylor}
                    alt="Saylor"
                  />
                  <div className="absolute -bottom-1 -right-1 h-5 w-5">
                    <img
                      className="h-full w-full rounded-full shadow-glow-sm"
                      src={btc}
                      alt="BTC"
                    />
                  </div>
                </div>
                <h1 className="text-xl font-bold gradient-text bg-gradient-to-r from-btc via-btc-bright to-accent-cyber">
                  SaylorMemes
                </h1>
              </div>

              {/* Media type toggle */}
              <div className="flex items-center space-x-2 bg-dark-elevated rounded-full p-1">
                <button
                  onClick={() => setCurrentSelection('videos')}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    currentSelection === 'videos'
                      ? 'bg-btc text-dark shadow-glow'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Videos
                </button>
                <button
                  onClick={() => setCurrentSelection('photos')}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    currentSelection === 'photos'
                      ? 'bg-btc text-dark shadow-glow'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero section */}
          <div className="text-center mb-12 animate-slide-in-up">
            <div className="mb-8">
              <h2 className="text-4xl sm:text-6xl font-bold mb-4">
                <span className="gradient-text bg-gradient-to-r from-btc via-accent-electric to-accent-neon">
                  Michael Saylor
                </span>
              </h2>
              <p className="text-xl text-white/60 font-light">
                The ultimate collection of Bitcoin wisdom in meme form
              </p>
            </div>

            {/* Search and filters */}
            <div className="max-w-2xl mx-auto space-y-4">
              <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
              {availableTags.length > 1 && (
                <TagFilter 
                  availableTags={availableTags} 
                  activeFilter={activeFilter} 
                  onFilterChange={setActiveFilter} 
                />
              )}
            </div>
          </div>

          {/* Content area */}
          <div className="relative">
            {isLoading ? (
              <LoadingSpinner />
            ) : filteredContent.length === 0 ? (
              <EmptyState searchQuery={searchQuery} activeFilter={activeFilter} />
            ) : (
              <MediaGrid
                mediaType={currentSelection}
                videos={filteredContent as any}
                photos={filteredContent as any}
                onLoadVideo={loadVideoUrl}
                onTogglePlay={handleTogglePlay}
                onEnlargePhoto={handleEnlargePhoto}
                logAnalyticsEvent={logAnalyticsEvent}
              />
            )}
          </div>
        </div>
      </main>

      {/* Floating action buttons */}
      <div className="fixed bottom-8 right-8 z-30 flex flex-col gap-3">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn-primary rounded-full p-4 shadow-float"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>

      {/* Footer */}
      <Footer />

      {/* Photo Modal */}
      <PhotoModal photo={enlargedPhoto} onClose={() => setEnlargedPhoto(null)} />
    </div>
  );
}

export default App;