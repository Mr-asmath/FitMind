import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkoutMeditation.css';

const WorkoutMeditation = () => {
  const [exerciseList, setExerciseList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [phase, setPhase] = useState('ready');
  const [timer, setTimer] = useState(5);
  const [skippedExercises, setSkippedExercises] = useState(0);
  const navigate = useNavigate();
  const device_id = localStorage.getItem('device_id');

  useEffect(() => {
    if (!device_id) return navigate('/login');

    fetch(`http://localhost:5000/api/user/recommendations?device_id=${device_id}`)
      .then(res => res.json())
      .then(data => {
        const allExercises = Object.values(data.recommendations || {}).flat();

        // Limit to max 10 meditations
        const limitedExercises = allExercises.slice(0, 10);

        if (limitedExercises.length === 0) {
          alert('No meditations found. Please update your preferences.');
          navigate('/select-activities');
          return;
        }

        setExerciseList(limitedExercises);
        setCurrentIndex(0);
        setPhase('ready');
        setTimer(5);
      })
      .catch(err => {
        console.error('Error fetching meditation list:', err);
        navigate('/meditation');
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

  const handleNextPhase = () => {
    if (phase === 'ready') {
      setPhase('workout');
      setTimer(60);
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

  const getFixedImagePath = (index) => {
    const imageIndex = index + 1;
    if (imageIndex > 10) return ''; // support max 10 images
    return `./images/image_meditation_${imageIndex}.jpeg`;
  };

  const updateCompletionStatus = async () => {
    const total = exerciseList.length;
    const completedCount = total - skippedExercises;
    const percent = Math.round((completedCount / total) * 100);
    const today = new Date().toISOString().split('T')[0];
    const value = `${today}_meditation_${percent}`;

    try {
      await fetch('http://localhost:5000/api/user/update_completed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id, completed: value })
      });
      console.log('Meditation completion updated:', value);
    } catch (err) {
      console.error('Error updating meditation completion:', err);
    }
  };

  const renderContent = () => {
    if (phase === 'done') {
      return (
        <div className="meditation-complete">
          <h2>🧘 Meditation Complete! Well done!</h2>
          <button onClick={() => navigate('/dashboard-calendar')}>Back to Dashboard</button>
        </div>
      );
    }

    if (currentIndex === -1 || !exerciseList[currentIndex]) {
      return <h2 className="loading-message">Loading...</h2>;
    }

    const currentExercise = exerciseList[currentIndex];
    const imagePath = getFixedImagePath(currentIndex);

    return (
      <div className="meditation-content">
        <h2>
          {phase === 'ready' && `Get Ready: ${currentExercise}`}
          {phase === 'workout' && `Meditate: ${currentExercise}`}
          {phase === 'rest' && 'Rest & Breathe'}
        </h2>

        <h1 className="meditation-timer">{timer}</h1>

        {(phase === 'workout' || phase === 'ready') && imagePath && (
          <img className="meditation-image" src={imagePath} alt={`Meditation ${currentIndex + 1}`} />
        )}

        {phase === 'workout' && (
          <div className="meditation-music">
            <p>🌿 Optional: Play calming music in the background.</p>
            <a
              href="https://open.spotify.com/search/meditation"
              target="_blank"
              rel="noopener noreferrer"
            >
              🎵
            </a>
          </div>
        )}

        <div className="meditation-buttons">
          {phase === 'rest' && <button onClick={skipRest}>⏭ Skip Rest</button>}
          {phase === 'workout' && (
            <>
              <button onClick={skipWorkout}>⏩ Skip Meditation</button>
              <button onClick={restartExercise}>🔁 Restart</button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="meditation-wrapper">
      <button className="quit-button" onClick={() => navigate('/dashboard-calendar')}>
        ❌ Quit
      </button>
      <div className="meditation-stage">{renderContent()}</div>
    </div>
  );
};

export default WorkoutMeditation;
