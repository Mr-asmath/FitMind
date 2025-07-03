import React, { useState, useEffect } from 'react';  // Added useEffect here
import { useNavigate } from 'react-router-dom';
import './SelectionPage.css';

const UpdateUserSelectionPage = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [subSelections, setSubSelections] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const activityOptions = [
    {
      id: 'fitness',
      name: 'Fitness',
      icon: '🏋️',
      subOptions: [
        { id: 'full_body', name: 'Full Body' },
        { id: 'arms', name: 'Arms' },
        { id: 'legs', name: 'Legs' },
        { id: 'shoulders', name: 'Shoulders' },
        { id: 'core', name: 'Core' },
        { id: 'cardio', name: 'Cardio' }
      ]
    },
    {
      id: 'meditation',
      name: 'Meditation',
      icon: '🧘',
      subOptions: [
        { id: 'health', name: 'Health' },
        { id: 'heart', name: 'Heart' },
        { id: 'brain', name: 'Brain' },
        { id: 'sleep', name: 'Sleep' },
        { id: 'stress', name: 'Stress Relief' },
        { id: 'focus', name: 'Focus' }
      ]
    },
    {
      id: 'yoga',
      name: 'Yoga',
      icon: '🧘‍♀️',
      subOptions: [
        { id: 'hatha', name: 'Hatha' },
        { id: 'vinyasa', name: 'Vinyasa' },
        { id: 'ashtanga', name: 'Ashtanga' },
        { id: 'yin', name: 'Yin' },
        { id: 'restorative', name: 'Restorative' },
        { id: 'power', name: 'Power' }
      ]
    }
  ];

  useEffect(() => {
    const checkUserPreferences = async () => {
      const device_id = localStorage.getItem('device_id');
      if (!device_id) return;

      try {
        const response = await fetch(`/api/user/preferences?device_id=${device_id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.activity_type) {
            redirectToActivityPage(data.activity_type);
          }
        }
      } catch (err) {
        console.error('Error fetching preferences:', err);
      }
    };

    checkUserPreferences();
  }, []);

  const redirectToActivityPage = (activityType) => {
    switch(activityType) {
      case 'fitness':
        navigate('/dashboard-calendar');
        break;
      case 'meditation':
        navigate('/dashboard-calendar');
        break;
      case 'yoga':
        navigate('/dashboard-calendar');
        break;
      default:
        break;
    }
  };

  const toggleSubSelection = (optionId) => {
    setSubSelections(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = async () => {
  if (subSelections.length === 0) {
    setError('Please select at least one focus area');
    return;
  }

  setIsSubmitting(true);
  setError('');

  try {
    const device_id = localStorage.getItem('device_id');
    if (!device_id) {
      throw new Error('Session expired. Please register again.');
    }

    const payload = {
      device_id,
      activity_type: selectedActivity,
      selections: subSelections
    };

    // Use absolute URL to your Flask backend
    const response = await fetch('http://localhost:5000/api/user/update-preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // First check if response exists
    if (!response) {
      throw new Error('No response from server');
    }

    // Check for server errors
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      throw new Error(errorData.message || 'Failed to update preferences');
    }

    // Parse successful response
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Update failed');
    }

    redirectToActivityPage(selectedActivity);
    
  } catch (err) {
    console.error('Update error:', err);
    setError(err.message || 'An error occurred while saving your selections');
  } finally {
    setIsSubmitting(false);
  }
};

  const currentActivity = activityOptions.find(a => a.id === selectedActivity);

  return (
    <div className="update-selection-container">
      <header className="selection-header">
        <h1>Update Your Preferences</h1>
        <p>Customize your wellness journey</p>
      </header>

      {!selectedActivity ? (
        <div className="activity-selection">
          <h2 className='h2'>Choose an Activity</h2>
          <div className="activity-grid">
            {activityOptions.map(activity => (
              <button
                key={activity.id}
                className="activity-card"
                onClick={() => setSelectedActivity(activity.id)}
              >
                <span className="activity-icon">{activity.icon}</span>
                <span className="activity-name">{activity.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="focus-selection">
          <div className="selection-navigation">
            <button 
              onClick={() => {
                setSelectedActivity(null);
                setSubSelections([]);
                setError('');
              }}
              className="back-button"
            >
              &larr;Back 
            </button>
            <div className="current-activity">
              {currentActivity.icon} {currentActivity.name}
            </div>
          </div>

          <h2>Select Your Focus Areas</h2>
          <p className="selection-instruction">Choose one or more options below</p>
          
          <div className="focus-grid">
            {currentActivity.subOptions.map(option => (
              <button
                key={option.id}
                className={`focus-option ${subSelections.includes(option.id) ? 'selected' : ''}`}
                onClick={() => toggleSubSelection(option.id)}
              >
                {option.name}
                {subSelections.includes(option.id) && (
                  <span className="checkmark">✓</span>
                )}
              </button>
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          {subSelections.length > 0 && (
            <div className="selection-actions">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateUserSelectionPage;