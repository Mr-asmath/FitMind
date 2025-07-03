import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkoutFitness.css';

const WorkoutFitness = () => {
  const [exerciseList, setExerciseList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [phase, setPhase] = useState('ready');
  const [timer, setTimer] = useState(5);
  const [skippedExercises, setSkippedExercises] = useState(0);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const device_id = localStorage.getItem('device_id');

  useEffect(() => {
    if (!device_id) return navigate('/login');

    fetch(`http://localhost:5000/api/user/recommendations?device_id=${device_id}`)
      .then(res => res.json())
      .then(data => {
        const allExercises = Object.values(data.recommendations || {}).flat();
        if (allExercises.length === 0) {
          alert('No exercises found. Please update your preferences.');
          navigate('/select-activities');
          return;
        }
        setExerciseList(allExercises.slice(0, 10)); // Limit to 10 exercises
        setCurrentIndex(0);
        setPhase('ready');
        setTimer(5);
      })
      .catch(err => {
        console.error('Error fetching workout:', err);
        navigate('/fitness');
      });
  }, [device_id, navigate]);

  useEffect(() => {
    if (currentIndex >= exerciseList.length) {
      setPhase('done');
      updateCompletionStatus();
      return;
    }
    if (phase === 'done') return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(interval);
          handleNextPhase();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, currentIndex]);

  useEffect(() => {
    if ((phase === 'workout' || phase === 'ready') && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [phase, currentIndex]);

  const handleNextPhase = () => {
    if (phase === 'ready') {
      setPhase('workout');
      setTimer(20);
    } else if (phase === 'workout') {
      setPhase('rest');
      setTimer(10);
    } else if (phase === 'rest') {
      setCurrentIndex(prev => prev + 1);
      setPhase('ready');
      setTimer(5);
    }
  };

  const skipRest = () => {
    if (phase === 'rest') handleNextPhase();
  };

  const skipWorkout = () => {
    if (phase === 'workout') {
      setSkippedExercises(prev => prev + 1);
      setPhase('rest');
      setTimer(10);
    }
  };

  const restartExercise = () => {
    setPhase('ready');
    setTimer(5);
  };

  const updateCompletionStatus = async () => {
    const total = exerciseList.length;
    const completedCount = total - skippedExercises;
    const percent = Math.round((completedCount / total) * 100);
    const today = new Date().toISOString().split('T')[0];
    const value = `${today}_fitness_${percent}`;

    try {
      await fetch('http://localhost:5000/api/user/update_completed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id,
          completed: value
        })
      });
      console.log('Completion updated:', value);
    } catch (err) {
      console.error('Error updating completion:', err);
    }
  };

  const renderContent = () => {
    if (phase === 'done') {
      return (
        <div className="workout-complete">
          <h2>🏁 Workout Complete! Great Job!</h2>
          <button onClick={() => navigate('/dashboard-calendar')}>
            Back to Dashboard
          </button>
        </div>
      );
    }

    if (currentIndex === -1 || !exerciseList[currentIndex]) {
      return <h2 className="loading-message">Loading...</h2>;
    }

    const videoCount = currentIndex + 1;
    const videoPath = `./video/fitness_video${videoCount}.mp4`;
    const currentExercise = exerciseList[currentIndex];

    return (
      <div className="workout-content">
        <h2 className="workout-phase-title">
          {phase === 'ready' && `Get Ready: ${currentExercise}`}
          {phase === 'workout' && `Workout: ${currentExercise}`}
          {phase === 'rest' && 'Rest Time'}
        </h2>

        <h1 className="workout-timer">{timer}</h1>

        {(phase === 'workout' || phase === 'ready') && (
          <video ref={videoRef} className="workout-video" muted>
            <source src={videoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        <div className="workout-buttons">
          {phase === 'rest' && <button className="workout-button" onClick={skipRest}>⏭ Skip Rest</button>}
          {phase === 'workout' && (
            <>
              <button className="workout-button" onClick={skipWorkout}>⏩ Skip Workout</button>
              <button className="workout-button" onClick={restartExercise}>🔁 Restart</button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="workout-container">
      <button className="quit-button" onClick={() => navigate('/dashboard-calendar')}>
        ❌ Quit
      </button>
      <div className="workout-stage">{renderContent()}</div>
    </div>
  );
};

export default WorkoutFitness;
