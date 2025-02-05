import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [time, setTime] = useState(5); // Default countdown time
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBeeping, setIsBeeping] = useState(false);
  const [inputTime, setInputTime] = useState(5);
  const [beepContext, setBeepContext] = useState(null);

  useEffect(() => {
    let timer;
    if (isActive && time > 0 && !isPaused) {
      timer = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
    } else if (time === 0 && !isBeeping) {
      setIsActive(false);
      startBeep();
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

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
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
          <div className="mb-4">
            <h2>{time}s</h2>
          </div>
          <div>
            <button className="btn btn-success me-2" onClick={handleStart} disabled={isActive}>
              Start
            </button>
            <button className="btn btn-danger me-2" onClick={handleStop} disabled={!isActive}>
              Stop
            </button>
            <button className="btn btn-warning me-2" onClick={handlePause} disabled={isPaused || !isActive}>
              Pause
            </button>
            <button className="btn btn-primary me-2" onClick={handleResume} disabled={!isPaused}>
              Resume
            </button>
            {isBeeping && (
              <button className="btn btn-dark" onClick={stopBeep}>
                Stop Beep
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
