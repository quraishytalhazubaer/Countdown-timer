import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [time, setTime] = useState(5); // Default countdown time
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBeeping, setIsBeeping] = useState(false);
  const [inputTime, setInputTime] = useState(5);
  const [beepContext, setBeepContext] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    let timer;
    if (isActive && time > 0 && !isPaused) {
      timer = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
    } else if (time === 0 && !isBeeping) {
      setIsActive(false);
      startBeep();
      setTimeout(stopBeep, 3000); // Stop beeping after 5 seconds
    }
    return () => clearInterval(timer);
  }, [isActive, time, isPaused]);

  const handleStart = () => {
    setTime(inputTime);
    setIsActive(true);
    setIsPaused(false);
    setIsBeeping(false);
    stopBeep();
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    stopBeep();
    setTime(inputTime); // Reset timer back to the input value
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const startBeep = () => {
    const beep = new AudioContext();
    const oscillator = beep.createOscillator();
    const gainNode = beep.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(1000, beep.currentTime);
    gainNode.gain.setValueAtTime(0.1, beep.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(beep.destination);

    oscillator.start();
    oscillator.loop = true;

    setBeepContext({ beep, oscillator });
    setIsBeeping(true);
  };

  const stopBeep = () => {
    if (beepContext) {
      const { beep, oscillator } = beepContext;
      oscillator.stop();
      beep.close();
      setBeepContext(null);
      setIsBeeping(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const calculateProgress = () => (time / inputTime) * 100;

  return (
    <div className={`d-flex justify-content-center align-items-center vh-100 ${theme}`}>
      <div className="card p-4 shadow-lg" style={{ width: "600px" }}>
        <div className="card-body text-center">
          <h1 className="mb-4">Countdown Timer</h1>
          <div className="mb-4">
            <input
              type="number"
              className="form-control d-inline-block w-auto"
              value={inputTime}
              onChange={(e) => setInputTime(Number(e.target.value))}
              min="1"
            />
            <span className="mx-2">seconds</span>
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
            <h2 className="position-absolute top-50 start-50 translate-middle">{time}s</h2>
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
              onClick={() => setInputTime((prev) => prev + 30)}
            >
              +30s
            </button>
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => setInputTime((prev) => prev + 60)}
            >
              +1m
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setInputTime((prev) => prev + 300)}
            >
              +5m
            </button>
          </div>
          <div className="mt-4">
            <button className="btn btn-dark" onClick={toggleTheme}>
              Toggle Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
