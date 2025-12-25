import { Ellipsis, Heart, Pause, Play, Send, Volume2, VolumeOff, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router"
import { Input } from "@/components/ui/input";

function StoryViewer({ setShowStoryViewer }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg,rgba(14, 18, 18, 1) 0%, rgba(26, 26, 21, 1) 100%)",
      }}
    >
      <div className="size-full py-13 flex items-center justify-center relative">
        <div className="w-md h-full rounded-2xl overflow-hidden bg-neutral-800 relative">
          <div className=" size-full aspect-video rounded-2xl flex justify-center items-center bg-">
            {/* <img
              className="w-full object-cover"
              src="https://images.unsplash.com/photo-1529911194209-8578109840df?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            /> */}
            <video
              ref={videoRef}
              muted={isMuted}
              autoPlay
              className=""
              src="https://www.pexels.com/download/video/14886038/"
            ></video>
          </div>

          {/* for shadow */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="w-full h-25  bg-gradient-to-b from-black/80 to-black/0"></div>
            <div className="w-full h-22 bg-gradient-to-b from-black/0 to-black"></div>
          </div>

          <div className="absolute inset-0 flex flex-col justify-between px-4.5 py-5.5">
            <div className="flex flex-row justify-between">
              <Link to={"profile"} className="flex flex-row items-center justify-center gap-1.5">
                <div className="size-9 rounded-full overflow-hidden">
                  <img
                    className="size-full object-cover"
                    src="https://parade.com/.image/w_100,q_auto:good,c_limit/ODowMDAwMDAwMDAwNzI3NDI1/brad-pitt-at-the-premiere-of-wolfs-held-at-tcl-chinese-theatre-on-september-18-2024-in-los-angeles-california-photo-by-gilbert-floresvariety-via-getty-images-stockpack-gettyimages.jpg"
                  />
                </div>
                <h4 className="text-sm font-semibold ">
                  nipun.marya
                </h4>
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
              
                  <input placeholder={"Reply to oankajtripathi"}  className={"rounded-3xl bg-black/20 w-full px-4 py-3 outline outline-neutral-200 text-sm placeholder:text-neutral-300"} />
                  <button className="cursor-pointer p-3 pr-0 hover:scale-105 active:scale-97"><Heart/></button>
                  <button className="cursor-pointer p-3 pr-0 hover:scale-105 active:scale-97"><Send/></button>
            </div>
          </div>
        </div>
        <button
          className="z-50 cursor-pointer absolute right-0 top-0 m-5"
          onClick={() => setShowStoryViewer(false)}   
        >
          <XIcon className="text-amber-50 size-9" />
        </button>
      </div>
    </div>
  );
}

export default StoryViewer;
