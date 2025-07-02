import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MeditationListPage.css';

const MeditationListPage = () => {
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

        if (prefData.activity_type !== 'meditation') {
          navigate('/select-activities');
          return;
        }

        const focusAreas = JSON.parse(prefData.meditation_focus || '[]');
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
      <div className="loader-container">
        <div className="loader"></div>
        <p className="loader-text">Loading your meditation program...</p>
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
            <button onClick={() => window.location.reload()}>Try Again</button>
            <button onClick={() => navigate('/select-activities')}>Change Preferences</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="meditation-wrapper">
      <div className="meditation-container">
        <div className="meditation-header">
          <h1>Your Meditation Program</h1>
          <p>Mindful and calming sessions based on your preferences</p>
          <button onClick={() => navigate('/workout_meditation')} className="primary-button">
            Start Meditation
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
          <div className="session-section">
            {Object.entries(recommendations).map(([focusArea, exercises]) => (
              <div key={focusArea} className="session-box">
                <h3>{focusArea.replace('_', ' ')} Meditation Sessions</h3>
                <ul className="session-list">
                  {exercises.map((exercise, index) => (
                    <li key={`${focusArea}-${index}`} className="session-item">
                      <div className="session-count1">{index + 1}</div>
                      <div className="session-info">
                        <p className="session-title1">{exercise}</p>
                        <p className="session-desc">
                          Find a quiet place, sit comfortably, and breathe deeply for a few minutes.
                        </p>
                        <button className='primary-button' onClick={() => speak(`Meditation for ${exercise}. Breathe deeply and stay present.`)}>
                          🔊
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-section">
            <p>No meditation sessions found.</p>
            <button onClick={() => navigate('/select-activities')}>Select Focus Areas</button>
          </div>
        )}

        <div className="footer-buttons">
          <button className='primary-button' onClick={() => navigate('/select-activities')}>Change Preferences</button>
          <button className='primary-button' onClick={() => navigate('/dashboard-calendar')}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default MeditationListPage;
