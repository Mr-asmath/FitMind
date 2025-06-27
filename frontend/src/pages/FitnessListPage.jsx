import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your fitness program...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/select-activities')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
            >
              Change Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Your Fitness Program</h1>
          <p className="mt-3 text-xl text-gray-500">Personalized workouts based on your preferences</p>
          <button
            onClick={() => navigate('/workout_fitness')}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md text-lg hover:bg-green-700 transition"
          >
            Start Workout
          </button>
        </div>

        {/* Focus Areas */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Focus Areas</h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {selections.map((selection) => (
                <span
                  key={selection}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full capitalize"
                >
                  {selection.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Exercise Recommendations */}
        {Object.keys(recommendations).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(recommendations).map(([focusArea, exercises]) => (
              <div key={focusArea} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 capitalize">
                    {focusArea.replace('_', ' ')} Exercises
                  </h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {exercises.map((exercise, index) => {
                    const videoPath = `/assets/videos/fitness_video${videoCounter}.mp4`;
                    const item = (
                      <li
                        key={`${focusArea}-${index}`}
                        className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 transition"
                      >
                        <video
                          className="w-full md:w-1/2 rounded border"
                          controls
                          preload="metadata"
                        >
                          <source src={videoPath} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <div className="flex items-center md:w-1/2">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{exercise}</p>
                            <p className="text-sm text-gray-500 mt-1">3 sets × 12 reps</p>
                            <button
                              onClick={() => speak(exercise)}
                              className="mt-1 text-blue-600 text-sm underline hover:text-blue-800"
                            >
                              🔊
                            </button>
                          </div>
                        </div>
                      </li>
                    );

                    videoCounter += 1;
                    return item;
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden p-6 text-center">
            <p className="text-gray-500">No exercise recommendations found.</p>
            <button
              onClick={() => navigate('/select-activities')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Select Focus Areas
            </button>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/select-activities')}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Change Preferences
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default FitnessListPage;
