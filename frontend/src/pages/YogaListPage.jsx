import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './YogaListPage.css';

const YogaListPage = () => {
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

        if (prefData.activity_type !== 'yoga') {
          navigate('/select-activities');
          return;
        }

        const focusAreas = JSON.parse(prefData.yoga_focus || '[]');
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

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p className="loading-text">Loading your yoga program...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-card">
          <h2 className="error-title">Error</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()} className="btn-primary">
              Try Again
            </button>
            <button onClick={() => navigate('/select-activities')} className="btn-secondary">
              Change Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="yoga-container">
      <div className="yoga-inner">
        <div className="yoga-header">
          <h1 className="page-title">Your Yoga Program</h1>
          <p className="page-subtitle">
            Mindful and energizing sessions based on your preferences
          </p>
          <button onClick={() => navigate('/workout_yoga')} className="primary-button">
            Start Yoga
          </button>
        </div>

        <div className="focus-section">
          <h2>Your Focus Areas</h2>
          <div className="focus-tags" style={{
            background:'transparent',
          }}>
            {selections.map((selection) => (
              <span key={selection} className="focus-tag">
                {selection.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {Object.keys(recommendations).length > 0 ? (
          <div className="sessions-section">
            {Object.entries(recommendations).map(([focusArea, exercises]) => (
              
              <div key={focusArea} className="session-card">
                <div className="session-title">
                  {focusArea.replace('_', ' ')} Yoga Sessions
                </div>
                <ul className="session-list">
                  {exercises.map((exercise, index) => (
                    <li key={`${focusArea}-${index}`} className="session-item">
                      <div className="session-count">{index + 1}</div>
                      <div>
                        <p className="session-name">{exercise}</p>
                        <p className="session-instruction">
                          Begin in a relaxed seated or standing posture. Focus on your breath,
                          gently stretch into the pose, and hold for a few breaths while
                          maintaining steady awareness.
                        </p>
                        <button
                          onClick={() =>
                            speak(`Yoga pose: ${exercise}. Breathe deeply and hold the posture mindfully.`)
                          }
                          className="primary-button"
                        >
                          🎧
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-sessions">
            <p>No yoga sessions found.</p>
            <button
              onClick={() => navigate('/select-activities')}
              className="primary-button"
            >
              Select Focus Areas
            </button>
          </div>
        )}

        <div className="navigation-buttons">
          <button
            onClick={() => navigate('/select-activities')}
            className="primary-button"
          >
            Change Preferences
          </button>
          <button
            onClick={() => navigate('/dashboard-calendar')}
            className="primary-button"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default YogaListPage;
