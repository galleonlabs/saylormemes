import './App.css'
import saylor from './assets/saylor.jpg'
import btc from './assets/btc.png'
import { useEffect, useRef, useState } from 'react';
import { storage } from './main';
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
// import { logEvent } from 'firebase/analytics'; 
// import { analytics } from './main';
function App() {
  const [videos, setVideos] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
  const videoRefs = useRef<any[]>([]);
  const [enlarged, setEnlarged] = useState(-1)

  useEffect(() => {
    const fetchVideos = async () => {
      // Check if videos are stored in sessionStorage
      const cachedVideos = sessionStorage.getItem('videos');
      if (cachedVideos) {
        setVideos(JSON.parse(cachedVideos));
      } else {
        // Fetch videos from Firebase
        const videoList = [];
        const listRef = ref(storage, 'videos/');

        const res = await listAll(listRef);
        for (const itemRef of res.items) {
          const url = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);
          const title = metadata.customMetadata?.title || 'Untitled';
          videoList.push({ url, title });
        }

        setVideos(videoList);
        // Cache the fetched videos in sessionStorage
        sessionStorage.setItem('videos', JSON.stringify(videoList));
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    setIsPlaying(new Array(videos.length).fill(false)); // Initialize playing state for each video
  }, [videos]);

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused || video.ended) {
        video.play();
        setIsPlaying(isPlaying.map((play, i) => i === index ? true : play));
      } else {
        video.pause();
        setIsPlaying(isPlaying.map((play, i) => i === index ? false : play));
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

  return (
    <div className='m-auto flex-auto'>
      <div>
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">

          <div className="relative isolate overflow-hidden  shadow-md bg-white px-6 pb-24 pt-16 text-center sm:rounded-lg sm:px-16">
            <div className="mx-auto justify-center pb-5 isolate flex -space-x-2 overflow-hidden pt-1">
              <img
                className="relative z-30 inline-block sm:h-16 sm:w-16 h-16 w-16 rounded-full border-2 bg-btc border-btc "
                src={saylor}
                alt=""
              />
              <img
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
            <div>
              <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 rounded-md pt-8 sm:pt-12">
                {videos.map((video, index) => (
                  <li key={index} className={enlarged !== -1 ? 'col-span-1 bg-white rounded-lg  mx-auto' : ' border border-btc hover:shadow-sm hover:shadow-btc col-span-1 bg-white rounded-lg  mx-auto shadow'}>
                    <div onClick={() => togglePlay(index)} className="overflow-hidden flex hover:cursor-pointer items-center justify-center rounded-t-lg" style={{ maxHeight: enlarged === index ? '' : '150px', maxWidth: enlarged === index ? '' : '320px' }}>
                      <video className="h-full w-full" ref={el => videoRefs.current[index] = el}>
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>

                    <h3 className="text-center pt-2 text-sm font-medium text-gray-700">{video.title}</h3>
                    <div className="flex justify-center space-x-2 pb-2 pt-1 text-sm text-gray-700">
                      <button className='hover:text-btc' onClick={() => togglePlay(index)}>{isPlaying[index] ? 'pause' : 'play'}</button>&nbsp;{'|'}
                      <button className='hover:text-btc' onClick={() => toggleSize(index)}>{enlarged === index ? 'shrink' : 'enlarge'}</button>&nbsp;{'|'}
                      <button className='hover:text-btc' onClick={() => requestFullScreen(index)}>full screen</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <p className=" absolute bottom-0 text-center mx-auto mt-16 max-w-3xl text-sm  sm:text-md leading-8 text-gray-500 pb-2">
              created by <a className='hover:text-btc ' href='https://twitter.com/andrew_eth' target='_blank'>@andrew_eth</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
