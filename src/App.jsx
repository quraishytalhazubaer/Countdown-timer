import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [time, setTime] = useState(5); // Default countdown time
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBeeping, setIsBeeping] = useState(false);
  const [inputTime, setInputTime] = useState("00:00:05");
  const [title, setTitle] = useState("Countdown Timer");
  const [isEditingTitle, setIsEditingTitle] = useState(false);  
  const [theme, setTheme] = useState("light");
  const bellSound = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");


  useEffect(() => {
    let timer;
    if (isActive && time > 0 && !isPaused) {
      timer = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
    } else if (time === 0 && !isBeeping) {
      setIsActive(false);
      playBell();
    }
    return () => clearInterval(timer);
  }, [isActive, time, isPaused]);

  const handleStart = () => {
    const parsedTime = parseTimeInput(inputTime);
    if (parsedTime > 0) {
      setTime(parsedTime);
      setIsActive(true);
      setIsPaused(false);
      setIsBeeping(false);
      stopBell();
    }
  };
  

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    stopBell();
    setTime(parseTimeInput(inputTime));
  };
  

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const playBell = () => {
    bellSound.play();
    setIsBeeping(true);
  };

  const stopBell = () => {
    bellSound.pause();
    bellSound.currentTime = 0;
    setIsBeeping(false);
  };

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };
  
  const parseTimeInput = (timeStr) => {
    const [hrs, mins, secs] = timeStr.split(":").map(Number);
    return (hrs || 0) * 3600 + (mins || 0) * 60 + (secs || 0);
  };
  
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const calculateProgress = () => (time / inputTime) * 100;

  const addSecondsToInputTime = (secondsToAdd) => {
    const totalSeconds = parseTimeInput(inputTime) + secondsToAdd;
    setInputTime(formatTime(totalSeconds));
  };
  

  return (
    <div className={`d-flex justify-content-center align-items-center vh-100 ${theme}`}>
      <div className={`card p-4 shadow-lg ${theme}`} style={{ width: "600px" }}>
        <div className="card-body text-center">
        <div className="mb-4">
        {isEditingTitle ? (
            <input
              type="text"
              className={`form-control text-center fw-bold fs-2 mb-4 ${theme}`}
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditingTitle(false);
              }}
            />
          ) : (
            <h1
              className="mb-4"
              onClick={() => setIsEditingTitle(true)}
              style={{ cursor: "pointer" }}
              title="Click to edit"
            >
              {title}
            </h1>
          )}

          </div>

          <div className="mb-4">
            <input
              type="text"
              className={`form-control d-inline-block w-auto text-center ${theme}`}
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              placeholder="HH:MM:SS"
            />            
          </div>
          <div className="mb-4 position-relative">
            <svg width="200" height="200" className="progress-circle">
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#e0e0e0"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#007bff"
                strokeWidth="10"
                fill="none"
                strokeDasharray="565.48"
                strokeDashoffset={(565.48 * (100 - calculateProgress())) / 100}
                style={{ transition: "stroke-dashoffset 0.5s linear" }}
              />
            </svg>
            <h2 className="position-absolute top-50 start-50 translate-middle">
              {formatTime(time)}
            </h2>
          </div>
          <div className="mb-4">
            <button
              className="btn btn-success me-2"
              onClick={handleStart}
              disabled={isActive}
            >
              Start
            </button>
            <button
              className="btn btn-danger me-2"
              onClick={handleStop}
              disabled={!isActive}
            >
              Stop
            </button>
            <button
              className="btn btn-warning me-2"
              onClick={handlePause}
              disabled={isPaused || !isActive}
            >
              Pause
            </button>
            <button
              className="btn btn-primary me-2"
              onClick={handleResume}
              disabled={!isPaused}
            >
              Resume
            </button>
          </div>
          <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => addSecondsToInputTime(30)}
          >
            +30s
          </button>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => addSecondsToInputTime(60)}
          >
            +1m
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => addSecondsToInputTime(300)}
          >
            +5m
          </button>
          </div>
          <div className="mt-4">
            <button className="btn btn-primary mx-2" onClick={toggleTheme}>
              Toggle Theme
            </button>
            {isBeeping && (
              <button className="btn btn-secondary" onClick={stopBell}>
                Stop Bell
              </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
