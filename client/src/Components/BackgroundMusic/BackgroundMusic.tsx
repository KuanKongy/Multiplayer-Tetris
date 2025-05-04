import { useEffect, useRef } from "react";

interface BackgroundMusicProps {
  play: boolean;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ play }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/Multiplayer-Tetris/tetris-theme.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }

    const audio = audioRef.current;

    if (play) {
      // Only try to play after interaction
      const tryPlay = () => {
        audio
          .play()
          .catch((err) => {
            console.log("Autoplay blocked:", err);
          });
      };

      document.addEventListener("click", tryPlay, { once: true });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      audio.pause();
    };
  }, [play]);

  return null;
};

export default BackgroundMusic;
