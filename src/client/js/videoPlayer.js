const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const videoBox = document.getElementById("videoBox");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayPause = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleEnded = () => {
  playBtnIcon.classList = "fas fa-play";
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

const handleMute = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    muteBtnIcon.classList = "fas fa-volume-up";
    video.muted = false;
  }
  if (Number(value) === 0) {
    muteBtnIcon.classList = "fas fa-volume-mute";
    video.muted = true;
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = () => {
  video.currentTime = timeline.value;
};

const handleFullScreen = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const handleKeyDown = (event) => {
  if (event.target.tagName === "TEXTAREA") {
    return;
  }
  switch (event.code) {
    case "Space":
      event.preventDefault();
      handlePlayPause();
      break;

    case "KeyF":
      event.preventDefault();
      handleFullScreen();
      break;

    case "KeyM":
      event.preventDefault();
      handleMute();
      break;

    case "ArrowLeft":
      event.preventDefault();
      video.currentTime = video.currentTime - 5;
      break;
    case "ArrowRight":
      event.preventDefault();
      video.currentTime = video.currentTime + 5;
      break;

    case "ArrowUp":
      event.preventDefault();
      if (video.volume < 1) {
        if (video.volume === 0) {
          handleMute();
        }
        video.volume = video.volume + 0.1;
        video.volume = video.volume.toFixed(1);
        volumeRange.value = video.volume;
        volumeValue = video.volume;
      }
      break;
    case "ArrowDown":
      event.preventDefault();
      if (video.volume > 0) {
        video.volume = video.volume - 0.1;
        video.volume = video.volume.toFixed(1);
        volumeRange.value = video.volume;
        volumeValue = video.volume;
        if (video.volume === 0) {
          handleMute();
        }
      }
      break;
  }
};

const handleExpandScreen = () => {
  if (!document.fullscreenElement) {
    fullScreenIcon.classList = "fas fa-expand";
  }
};

const handleF = (event) => {};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 1500);
};

if (video.readyState == 4) {
  handleLoadedMetadata();
}

playBtn.addEventListener("click", handlePlayPause);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("click", handlePlayPause);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("dblclick", handleFullScreen);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
document.addEventListener("fullscreenchange", handleExpandScreen);
document.addEventListener("keydown", handleKeyDown);
