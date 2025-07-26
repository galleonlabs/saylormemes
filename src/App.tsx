import './App.css';
import { useState, useEffect } from 'react';
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
  
  const { videos, photos, isLoading, loadVideoUrl, setVideos } = useFirebaseStorage();
  const { filteredContent, availableTags } = useMediaFiltering(
    videos, 
    photos, 
    currentSelection, 
    searchQuery, 
    activeFilter
  );
  const { logAnalyticsEvent } = useAnalytics();

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
    <div className="min-h-screen bg-paper">
      <div className="document-container">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="font-serif text-display text-ink mb-2">
            The Saylor Meme Collection
          </h1>
          <p className="text-body text-ink-lighter">
            A curated anthology of Michael Saylor's Bitcoin wisdom
          </p>
          <div className="mt-4">
            <span className="text-footnote text-ink-lightest">
              Document version 2.0 · {new Date().getFullYear()}
            </span>
          </div>
        </header>

        {/* Navigation */}
        <nav className="nav-tabs">
          <button
            onClick={() => setCurrentSelection('videos')}
            className={`nav-tab ${currentSelection === 'videos' ? 'active' : ''}`}
          >
            Videos ({videos.length})
          </button>
          <button
            onClick={() => setCurrentSelection('photos')}
            className={`nav-tab ${currentSelection === 'photos' ? 'active' : ''}`}
          >
            Images ({photos.length})
          </button>
        </nav>

        {/* Table of Contents */}
        <div className="toc">
          <h2 className="font-serif text-heading text-ink mb-3">Contents</h2>
          <div className="space-y-1">
            <div className="toc-item">
              <span className="text-ink-lighter">I.</span> Search & Filter
            </div>
            <div className="toc-item">
              <span className="text-ink-lighter">II.</span> {currentSelection === 'videos' ? 'Video' : 'Image'} Catalog
            </div>
            <div className="toc-item">
              <span className="text-ink-lighter">III.</span> Appendix
            </div>
          </div>
        </div>

        {/* Search Section */}
        <section className="section">
          <h2 className="font-serif text-title text-ink mb-6">
            I. Search & Filter
          </h2>
          
          <div className="subsection">
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            
            {availableTags.length > 1 && (
              <div className="mt-4">
                <p className="text-footnote text-ink-lighter mb-2">Filter by category:</p>
                <TagFilter 
                  availableTags={availableTags} 
                  activeFilter={activeFilter} 
                  onFilterChange={setActiveFilter} 
                />
              </div>
            )}
          </div>
        </section>

        {/* Content Section */}
        <section className="section">
          <h2 className="font-serif text-title text-ink mb-6">
            II. {currentSelection === 'videos' ? 'Video' : 'Image'} Catalog
          </h2>
          
          <div className="mb-4 text-footnote text-ink-lighter">
            Showing {filteredContent.length} of {currentSelection === 'videos' ? videos.length : photos.length} items
            {searchQuery && ` matching "${searchQuery}"`}
            {activeFilter !== 'all' && ` in category "${activeFilter}"`}
          </div>

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
        </section>

        {/* Appendix */}
        <section className="section">
          <h2 className="font-serif text-title text-ink mb-6">
            III. Appendix
          </h2>
          
          <div className="subsection">
            <h3 className="font-serif text-heading text-ink mb-3">About this Collection</h3>
            <p className="paragraph">
              This collection represents a comprehensive archive of Michael Saylor's most memorable 
              moments discussing Bitcoin. Each piece has been carefully cataloged and tagged for 
              easy reference and discovery.
            </p>
          </div>

          <div className="subsection">
            <h3 className="font-serif text-heading text-ink mb-3">Usage Guidelines</h3>
            <p className="paragraph">
              All content is provided for educational and entertainment purposes. 
              Please respect intellectual property rights when sharing or using these materials.
            </p>
          </div>

          <div className="subsection">
            <h3 className="font-serif text-heading text-ink mb-3">Technical Details</h3>
            <ul className="bullet-list">
              <li>Format: MP4 (video), PNG/JPG (images)</li>
              <li>Storage: Cloud-based distribution</li>
              <li>Metadata: Title, category tags</li>
              <li>Last updated: {new Date().toLocaleDateString()}</li>
            </ul>
          </div>
        </section>

        <Footer />
      </div>

      {/* Photo Modal */}
      <PhotoModal photo={enlargedPhoto} onClose={() => setEnlargedPhoto(null)} />
    </div>
  );
}

export default App;