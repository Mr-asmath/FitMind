import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkoutMeditation = () => {
  const [exerciseList, setExerciseList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [phase, setPhase] = useState('ready'); // 'ready', 'workout', 'rest', 'done'
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
          alert('No meditations found. Please update your preferences.');
          navigate('/select-activities');
          return;
        }
        setExerciseList(allExercises);
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
      setTimer(60); // meditation phase could be longer
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

  const getSanitizedVideoPath = (exerciseName) => {
    if (!exerciseName) return '';
    const sanitized = exerciseName
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_');
    return `/assets/videos/meditation_${sanitized}_video.mp4`;
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
        <div style={{ textAlign: 'center' }}>
          <h2>🧘 Meditation Complete! Well done!</h2>
          <button onClick={() => navigate('/dashboard-calendar')} style={{ marginTop: '20px' }}>
            Back to Dashboard
          </button>
        </div>
      );
    }

    if (currentIndex === -1 || !exerciseList[currentIndex]) {
      return <h2 style={{ textAlign: 'center' }}>Loading...</h2>;
    }

    const currentExercise = exerciseList[currentIndex];
    const videoPath = getSanitizedVideoPath(currentExercise);

    return (
      <div style={{ textAlign: 'center' }}>
        <h2>
          {phase === 'ready' && `Get Ready: ${currentExercise}`}
          {phase === 'workout' && `Meditate: ${currentExercise}`}
          {phase === 'rest' && 'Rest'}
        </h2>

        <h1 style={{ fontSize: '4rem', margin: '20px 0' }}>{timer}</h1>

        {(phase === 'workout' || phase === 'ready') && videoPath && (
          <video
            ref={videoRef}
            width="480"
            height="270"
            controls={false}
            muted
            style={{ borderRadius: '8px', marginBottom: '20px' }}
          >
            <source src={videoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f8ff',
      padding: '2rem',
      position: 'relative'
    }}>
      <button
        onClick={() => navigate('/dashboard-calendar')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: '#ff4d4f',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        ❌ Quit
      </button>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 60px)',
        background: '#000',
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default WorkoutMeditation;
