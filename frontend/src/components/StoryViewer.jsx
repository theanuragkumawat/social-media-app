import moment from "moment";
import {
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Heart,
  NotepadText,
  Pause,
  Play,
  Send,
  Volume2,
  VolumeOff,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";

function StoryViewer({
  data,
  userIndex,
  storyIndex,
  setUserIndex,
  setStoryIndex,
  setShowStoryViewer,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const currentUser = data[userIndex];
  const currentStory = currentUser.stories[storyIndex];

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const isLastStoryOfUser = storyIndex === currentUser.stories.length - 1;

    const isLastUser = userIndex === data.length - 1;

    if (!isLastStoryOfUser) {
      // same user → next story
      setStoryIndex((prev) => prev + 1);
    } else if (!isLastUser) {
      // next user → first story
      setUserIndex((prev) => prev + 1);
      setStoryIndex(0);
    } else {
      // end of all stories
      setShowStoryViewer(false);
      setStoryIndex(0)
    }
  };

  const handlePrev = () => {
    if (storyIndex > 0) {
      // previous story of same user
      setStoryIndex((prev) => prev - 1);
    } else if (userIndex > 0) {
      // previous user → last story
      const prevUserIndex = userIndex - 1;
      setUserIndex(prevUserIndex);
      setStoryIndex(data[prevUserIndex].stories.length - 1);
    }
  };


  const timeAgoShort = (date) => {
  const duration = moment.duration(moment().diff(moment(date)));
  
  // console.log("Currenr user",moment.duration(moment().diff(moment(date))).asDays() );
  const days = Math.floor(duration.asDays());
  if (days > 0) return `${days}d`;

  const hours = Math.floor(duration.asHours());
  if (hours > 0) return `${hours}h`;

  const minutes = Math.floor(duration.asMinutes());
  if (minutes > 0) return `${minutes}m`;

  return "now";
};


  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) videoRef.current.play();
    }
  }, [userIndex, storyIndex]);


  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg,rgba(14, 18, 18, 1) 0%, rgba(26, 26, 21, 1) 100%)",
      }}
    >
      <div className="size-full py-4  md:py-6 flex items-center justify-center relative ">
        <div className="h-full rounded-2xl  bg-neutral-800 relative !aspect-[9/16]">
          <div className=" size-full   rounded-2xl flex justify-center items-center bg-">
            <div className="rounded-2xl overflow-hidden size-full justify-center items-center flex">
              {currentStory.media.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  ref={videoRef}
                  muted={isMuted}
                  autoPlay
                  className=""
                  src={currentStory.media}
                  onEnded={handleNext}
                ></video>
              ) : (
                <img
                  className="w-full object-cover "
                  src={currentStory.media}
                />
              )}
            </div>
          </div>

          {/* for shadow */}
          <div className="absolute inset-0 flex flex-col justify-between rounded-2xl overflow-hidden">
            <div className="w-full h-25  bg-gradient-to-b from-black/80 to-black/0"></div>
            <div className="w-full h-22 bg-gradient-to-b from-black/0 to-black"></div>
          </div>

          <div className="absolute inset-0 flex flex-col justify-between px-4 py-4 2xl:px-4.5 2xl:py-5 rounded-2xl overflow-hidden">
            <div className="flex flex-row justify-between">
              <Link
                to={`/${currentUser.user.username}`}
                className="flex flex-row items-center justify-center gap-1.5"
              >
                <div className="size-9 rounded-full overflow-hidden">
                  <img
                    className="size-full object-cover"
                    src={currentUser.user.avatar}
                  />
                </div>
                <h4 className="text-sm font-semibold ">
                  {currentUser.user.username}
                </h4>
                <p className="text-xs text-neutral-400">
                  {timeAgoShort(currentStory.createdAt)}
                </p>
              </Link>
              <div className="flex flex-row justify-center items-center gap-3">
                <button
                  onClick={() => {
                    videoRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }}
                  className="cursor-pointer "
                >
                  {isMuted ? (
                    <VolumeOff
                      fill="currentcolor"
                      strokeWidth={2}
                      className="size-5 "
                    />
                  ) : (
                    <Volume2
                      fill="currentcolor"
                      strokeWidth={2}
                      className="size-5 "
                    />
                  )}
                </button>
                <button onClick={togglePlay} className="cursor-pointer">
                  {isPlaying ? (
                    <Pause
                      fill="currentcolor"
                      strokeWidth={2}
                      className="size-5 "
                    />
                  ) : (
                    <Play
                      fill="currentcolor"
                      strokeWidth={2}
                      className="size-5 "
                    />
                  )}
                </button>
                <button className="cursor-pointer ">
                  <Ellipsis
                    fill="currentcolor"
                    strokeWidth={2}
                    className="size-5 "
                  />
                </button>
              </div>
            </div>
            <div className="flex">
              <input
                placeholder={`Reply to ${currentUser.user.username}`}
                className={
                  "rounded-3xl bg-black/20 w-full px-4 py-3 outline outline-neutral-200 text-sm placeholder:text-neutral-300"
                }
              />
              <button className="cursor-pointer p-3 pr-0 hover:scale-105 active:scale-97">
                <Heart />
              </button>
              <button className="cursor-pointer p-3 pr-0 hover:scale-105 active:scale-97">
                <Send />
              </button>
            </div>
          </div>
          <button
            onClick={handlePrev}
            className="absolute flex justify-center items-center cursor-pointer -left-10 top-1/2 size-6  z-500 text-neutral-900 bg-neutral-700 hover:bg-neutral-50 hover:scale-106 active:scale-95 rounded-full"
          >
            <ChevronLeft className="size-5" strokeWidth={2.5} />
          </button>
          <button
            onClick={handleNext}
            className="absolute flex justify-center items-center cursor-pointer -right-10 top-1/2 size-6 text-neutral-900 bg-neutral-700 hover:bg-neutral-50 hover:scale-106 active:scale-95 rounded-full"
          >
            <ChevronRight className="size-5" strokeWidth={2.5} />
          </button>
        </div>
        <button
          className="z-50 cursor-pointer absolute right-0 top-0 m-5 hover:scale-105 active:scale-85 transition-transform duration-75"
          onClick={() => setShowStoryViewer(false)}
        >
          <XIcon className="text-amber-50 size-9" />
        </button>
        <button className="z-50 cursor-pointer absolute left-0 top-0 m-5 hover:scale-105 active:scale-90 transition-transform duration-75 font-anuraga text-3xl">
          SocialSnap
        </button>
      </div>
    </div>
  );
}

export default StoryViewer;
