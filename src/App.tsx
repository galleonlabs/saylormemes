import './App.css'
import saylor from './assets/saylor.jpg'
import btc from './assets/btc.png'
import { useEffect, useRef, useState } from 'react';
import { storage } from './main';
import { ref, listAll, getDownloadURL, getMetadata, StorageReference } from "firebase/storage";
import { logEvent } from 'firebase/analytics';
import { analytics } from './main';

function App() {
  const [videos, setVideos] = useState<any[]>([]);
  const videoRefs = useRef<any[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
  const [enlarged, setEnlarged] = useState(-1)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [videoDimensions, setVideoDimensions] = useState<{ [key: number]: { height: number, width: number } }>({});
  const [photoDimensions, setPhotoDimensions] = useState<{ [key: number]: { height: number, width: number } }>({});
  const [currentSelection, setCurrentSelection] = useState('videos');
  const [photos, setPhotos] = useState<any[]>([]);

  const fetchVideoData = async (itemRef: StorageReference) => {
    const url = await getDownloadURL(itemRef);
    const metadata = await getMetadata(itemRef);
    return { url, title: metadata.customMetadata?.title || 'Untitled' };
  };

  const fetchPhotos = async () => {
    setIsLoading(true);
    const cachedPhotos = sessionStorage.getItem('photos');
    if (cachedPhotos) {
      setPhotos(JSON.parse(cachedPhotos));
      setIsLoading(false);
    } else {
      try {
        const listRef = ref(storage, 'photos/');
        const res = await listAll(listRef);
        const fetchPromises = res.items.map(async (ref) => await getDownloadURL(ref));
        const photoList = await Promise.all(fetchPromises);
        setPhotos(photoList);
        sessionStorage.setItem('photos', JSON.stringify(photoList));
      } catch (error) {
        console.error('Error fetching photos:', error);

      }
      setIsLoading(false);
    };
  }

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      const cachedVideos = sessionStorage.getItem('videos');
      if (cachedVideos) {
        setVideos(JSON.parse(cachedVideos));
        setIsLoading(false);
      } else {
        try {
          const listRef = ref(storage, 'videos/');
          const res = await listAll(listRef);
          const fetchPromises = res.items.filter(x => x.name.includes('.mp4')).map(fetchVideoData);
          const videoList = await Promise.all(fetchPromises);
          setVideos(videoList);
          sessionStorage.setItem('videos', JSON.stringify(videoList));
        } catch (error) {
          console.error('Error fetching videos:', error);

        }
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    setIsPlaying(new Array(videos.length).fill(false));

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target as HTMLVideoElement;

          const source = video.querySelector('source');
          if (source && source.dataset.src) {
            source.src = source.dataset.src;
            video.load();
            observer.unobserve(video);
          }
        }
      });
    }, {
      rootMargin: '0px',
      threshold: 0.1
    });

    videoRefs.current.forEach(video => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos, currentSelection]);

  useEffect(() => {
    if (currentSelection === 'photos' && photos.length === 0) {
      fetchPhotos();
    }
  }, [currentSelection]);

  const togglePlay = (index: number, title: string) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused || video.ended) {
        video.play();
        setIsPlaying(isPlaying.map((play, i) => i === index ? true : play));
        logAnalyticsEvent('play_video', { video: title });
      } else {
        video.pause();
        setIsPlaying(isPlaying.map((play, i) => i === index ? false : play));
        logAnalyticsEvent('pause_video', { video: title });
      }
    }
  };

  const toggleSize = (index: number) => {
    if (index === enlarged) {
      setEnlarged(-1)
    } else {
      setEnlarged(index)
    }
  };

  const requestFullScreen = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) { /* Firefox */
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) { /* IE/Edge */
        video.msRequestFullscreen();
      }
    }
  };

  const logAnalyticsEvent = (eventName: any, eventParams: any) => {
    logEvent(analytics, eventName, eventParams);
  };

  const handleVideoLoad = (index: number) => {

    const video = videoRefs.current[index];
    if (video) {
      setVideoDimensions(prevDimensions => ({
        ...prevDimensions,
        [index]: { height: video.videoHeight, width: video.videoWidth }
      }));
    }

  };

  const handlePhotoLoad = (index: number, photoElement: HTMLImageElement) => {
    const { naturalHeight, naturalWidth } = photoElement;
    setPhotoDimensions(prevDimensions => ({
      ...prevDimensions,
      [index]: { height: naturalHeight, width: naturalWidth }
    }));
  };

  return (
    <div className='m-auto flex-auto'>
      <div>
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">

          <div className="relative isolate overflow-hidden  shadow-md bg-white px-6 pb-24 pt-16 text-center sm:rounded-lg sm:px-16">
            <div className="mx-auto justify-center pb-5 isolate flex -space-x-2 overflow-hidden pt-1">
              <img
                loading="lazy"
                className="relative z-30 inline-block sm:h-16 sm:w-16 h-16 w-16 rounded-full border-2 bg-btc border-btc "
                src={saylor}
                alt=""
              />
              <img
                loading="lazy"
                className="relative z-20 inline-block sm:h-16 sm:w-16 h-16 w-16 rounded-full border-2 bg-btc border-btc "
                src={btc}
                alt=""
              />

            </div>
            <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight text-gray-700 sm:text-3xl">
              saylor memes
            </h2>
            <p className="mx-auto mt-2 max-w-3xl sm:text-lg text-md leading-8 text-gray-700">
              directory of the highest quality, hand-picked, organic saylor content.
            </p>
            <div className="flex justify-center space-x-4 mt-8">
              <button
                className={`px-4 py-2 rounded-lg ${currentSelection === 'videos' ? 'bg-gray-300' : ''}`}
                onClick={() => setCurrentSelection('videos')}
              >
                videos
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${currentSelection === 'photos' ? 'bg-gray-300' : ''}`}
                onClick={() => setCurrentSelection('photos')}
              >
                photos
              </button>
            </div>
            <div>
              {isLoading ? (
                <div className="flex justify-center items-center py-32">
                  <p>Loading {currentSelection}...</p>

                </div>
              ) : currentSelection === 'videos' ? (
                <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 rounded-md pt-8 sm:pt-8">
                  {videos.map((video, index) => (
                    <li key={index} className={enlarged !== -1 ? 'col-span-1 bg-white rounded-lg  mx-auto' : ' border border-btc hover:shadow-sm hover:shadow-btc col-span-1 bg-white rounded-lg  mx-auto shadow'}>
                      <div onClick={() => togglePlay(index, video.title)} className="overflow-hidden flex hover:cursor-pointer items-center justify-center rounded-t-lg" style={{ maxHeight: enlarged === index ? '' : '150px', maxWidth: enlarged === index ? '' : '320px' }}>
                        <video
                          className="h-full w-full"
                          ref={el => videoRefs.current[index] = el}
                          onLoadedMetadata={() => handleVideoLoad(index)}
                        >
                          <source data-src={video.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>

                      <h3 className="text-center pt-2 text-sm font-medium text-gray-700">{video.title}</h3>
                      <div className="flex justify-center space-x-2 pb-2 pt-1 text-sm text-gray-700">
                        <button aria-label="Play video" className='hover:text-btc' onClick={() => togglePlay(index, video.title)}>{isPlaying[index] ? 'pause' : 'play'}</button>&nbsp;{'|'}
                        {videoDimensions[index]?.height > videoDimensions[index]?.width && (
                          <span><button className='hover:text-btc' onClick={() => toggleSize(index)}>{enlarged === index ? 'shrink' : 'enlarge'}</button>&nbsp;{'|'}</span>
                        )}
                        <button className='hover:text-btc' onClick={() => requestFullScreen(index)}>full screen</button>
                      </div>
                    </li>
                  ))}
                </ul>
                ) : <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 rounded-md pt-8 sm:pt-8">
                  {photos.map((photo, index) => (
                    <li key={index} className={enlarged !== -1 ? 'col-span-1 bg-white rounded-lg  mx-auto' : ' border border-btc hover:shadow-sm hover:shadow-btc col-span-1 bg-white rounded-lg  mx-auto shadow'}>
                      <div onClick={() => toggleSize(index)} className="overflow-hidden flex hover:cursor-pointer items-center justify-center rounded-t-lg" style={{ maxHeight: enlarged === index ? '' : '150px', maxWidth: enlarged === index ? '' : '320px' }}>
                        <img
                          loading="lazy"
                          className="h-full w-full"
                          src={photo}
                          onLoad={(e) => handlePhotoLoad(index, e.currentTarget)}
                        />
                      </div>
                      <div className="flex justify-center space-x-2 pb-2 pt-1 text-sm text-gray-700 pt-2">
                        {photoDimensions[index]?.height > 150 && (
                          <button className='hover:text-btc' onClick={() => toggleSize(index)}>{enlarged === index ? 'shrink' : 'enlarge'}</button>
                        )}&nbsp;{'|'}
                        <a href={photo} target='_blank' download className='hover:text-btc'>download</a>
                      </div>
                    </li>
                  ))}
                </ul>}


            </div>
            <p className=" absolute bottom-0 text-center mx-auto mt-16 max-w-3xl text-sm  sm:text-md leading-8 text-gray-500 pb-2">
              created by <a className='hover:text-btc ' href='https://twitter.com/galleonlabs' target='_blank'>@galleonlabs</a> (send us saylor memes)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
