import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FitnessListPage.css';

const FitnessListPage = () => {
  const [selections, setSelections] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWithErrorHandling = async (url) => {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Invalid response: ${text.substring(0, 100)}`);
    }

    return response.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      const device_id = localStorage.getItem('device_id');
      if (!device_id) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const prefData = await fetchWithErrorHandling(
          `http://localhost:5000/api/user/preferences?device_id=${device_id}`
        );

        if (prefData.activity_type !== 'fitness') {
          navigate('/select-activities');
          return;
        }

        const focusAreas = JSON.parse(prefData.fitness_focus || '[]');
        setSelections(focusAreas);

        const recData = await fetchWithErrorHandling(
          `http://localhost:5000/api/user/recommendations?device_id=${device_id}`
        );

        setRecommendations(recData.recommendations || {});
      } catch (err) {
        console.error('API Error:', err);
        setError(
          err.message.includes('Invalid response')
            ? 'Server returned incorrect format'
            : err.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  let videoCounter = 1;

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your fitness program...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-box">
          <h2 className="error-title">Error</h2>
          <p className="error-message">{error}</p>
          <div className="error-buttons">
            <button onClick={() => window.location.reload()} className="retry-button">
              Try Again
            </button>
            <button onClick={() => navigate('/select-activities')} className="change-button">
              Change Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="header-section">
          <h1 className="page-title">Your Fitness Program</h1>
          <p className="page-subtitle">Personalized workouts based on your preferences</p>
          
        </div>

        <div className="focus-section">
          <div className="focus-header">
            <h2>Your Focus Areas</h2>
          </div>
          
          <button onClick={() => navigate('/workout_fitness')} className="back-button">
            Start Workout
          </button>
        </div>

        {Object.keys(recommendations).length > 0 ? (
          <div className="recommendation-list">
            {Object.entries(recommendations).map(([focusArea, exercises]) => (
              <div key={focusArea} className="recommendation-box">
                <div className="recommendation-header">
                  <h3>{focusArea.replace('_', ' ')} Exercises</h3>
                </div>
                <ul className="exercise-list">
                {exercises.map((exercise, index) => {
                  const videoPath = `/video/fitness_video${videoCounter}.mp4`;
                  videoCounter += 1;

                  return (
                    <li key={`${focusArea}-${index}`} className="exercise-item">
                      <video className="exercise-video" autoPlay muted loop preload="metadata">
                        <source src={videoPath} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                      <div className="exercise-info">
                        {/* Instruction section above the exercise details */}
                        

                        <div className="exercise-details">
                          <p className="exercise-title">{exercise}</p>
                          <p className="exercise-sets">3 sets × 12 reps</p>
                          <button onClick={() => speak(exercise)} className="back-button">🔊</button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-recommendations">
            <p>No exercise recommendations found.</p>
            <button onClick={() => navigate('/select-activities')} className="select-button">
              Select Focus Areas
            </button>
          </div>
        )}

        <div className="footer-buttons">
          <button onClick={() => navigate('/select-activities')} className="back-button">
            Change Preferences
          </button>
          <button onClick={() => navigate('/dashboard-calendar')} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default FitnessListPage;
