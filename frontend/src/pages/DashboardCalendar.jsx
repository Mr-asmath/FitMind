// Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardCalendar.css';

// Image imports
import fitness1 from '../assets/images/image_fitness_1.jpg';
import fitness2 from '../assets/images/image_fitness_2.jpg';
import fitness3 from '../assets/images/image_fitness_3.jpg';
import fitness4 from '../assets/images/image_fitness_4.jpg';
import fitness5 from '../assets/images/image_fitness_5.jpg';

import meditation1 from '../assets/images/image_meditation_1.jpeg';
import meditation2 from '../assets/images/image_meditation_2.jpeg';
import meditation3 from '../assets/images/image_meditation_3.jpeg';
import meditation4 from '../assets/images/image_meditation_4.jpeg';
import meditation5 from '../assets/images/image_meditation_5.jpeg';

import yoga1 from '../assets/images/image_yoga_1.jpg';
import yoga2 from '../assets/images/image_yoga_2.jpeg';
import yoga3 from '../assets/images/image_yoga_3.jpeg';
import yoga4 from '../assets/images/image_yoga_4.jpeg';
import yoga5 from '../assets/images/image_yoga_5.jpeg';

const ImageSlider = () => {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const fitnessImages = [fitness1, fitness2, fitness3, fitness4, fitness5];
  const meditationImages = [meditation1, meditation2, meditation3, meditation4, meditation5];
  const yogaImages = [yoga1, yoga2, yoga3, yoga4, yoga5];

  useEffect(() => {
    const loadImages = async () => {
      const device_id = localStorage.getItem('device_id');
      if (!device_id) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/user/preferences?device_id=${device_id}`);
        const data = await response.json();

        switch (data.activity_type) {
          case 'fitness':
            setImages(fitnessImages);
            break;
          case 'meditation':
            setImages(meditationImages);
            break;
          case 'yoga':
            setImages(yogaImages);
            break;
          default:
            setImages([]); // fallback or default image set if needed
        }
      } catch (err) {
        console.error("Failed to load user activity type or images:", err);
      }
    };

    loadImages();
  }, [navigate]);

  // Auto slide timer
  useEffect(() => {
    if (images.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 5000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [current, images]);

  const getClass = (idx) => {
    if (idx === current) return "slider-img current";
    if (idx === (current + 1) % images.length) return "slider-img right";
    if (idx === (current - 1 + images.length) % images.length) return "slider-img left";
    return "slider-img hidden";
  };

  return (
    <div className="slider-container">
      <div className="slider-track">
        {images.map((src, idx) => (
          <div key={idx} className={getClass(idx)}>
            <img src={src} alt={`Slide ${idx + 1}`} className="w-full h-auto rounded" />
          </div>
        ))}
      </div>
      <div className="slider-dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`slider-dot${idx === current ? ' active' : ''}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};




const Dashboard = () => {
  const [currentDate] = useState(new Date());
  const [activityType, setActivityType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user preferences
  useEffect(() => {
    const fetchUserPreferences = async () => {
      const device_id = localStorage.getItem('device_id');
      if (!device_id) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:5000/api/user/preferences?device_id=${device_id}`);
        const data = await response.json();
        setActivityType(data.activity_type || '');
      } catch (err) {
        console.error('Error fetching preferences:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPreferences();
  }, [navigate]);

  // Redirect to activity page
  const redirectToActivityPage = () => {
    const routeMap = {
      fitness: '/fitness',
      meditation: '/meditation',
      yoga: '/yoga',
    };
    
    const route = routeMap[activityType?.toLowerCase()] || '/select-activities';
    navigate(route);
  };

  // Handle date click (only works for today)
  const handleDateClick = () => {
    redirectToActivityPage();
  };

  // Generate calendar for month/year
  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const calendar = [];
    let day = 1;

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (; day <= daysInMonth; day++) {
      const clickedDate = new Date(year, month, day);
      const isToday = clickedDate.toDateString() === today.toDateString();

      calendar.push(
        <div
          key={`day-${day}`}
          className={`calendar-day${isToday ? ' today' : ''}`}
          onClick={isToday ? handleDateClick : undefined}
          style={{
            cursor: isToday ? 'pointer' : 'default',
            opacity: isToday ? 1 : 0.5,
          }}
          tabIndex={isToday ? 0 : -1}
          role={isToday ? 'button' : undefined}
          aria-disabled={!isToday}
          onKeyDown={e => {
            if (isToday && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleDateClick();
            }
          }}
        >
          <div className="day-number">{day}</div>
        </div>
      );
    }

    return calendar;
  };

  // Current and next month details
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const nextMonthDate = new Date(year, month + 1, 1);
  const nextMonth = nextMonthDate.getMonth();
  const nextYear = nextMonthDate.getFullYear();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <ImageSlider />

      <div className="calendar-scroll-container">
        {/* Current Month */}
        <div className="calendar-section">
          <h2 className="calendar-month-title">
            {currentDate.toLocaleString('default', { month: 'long' })} {year}
          </h2>
          <div className="calendar-grid">
            <div className="day-header">Sun</div>
            <div className="day-header">Mon</div>
            <div className="day-header">Tue</div>
            <div className="day-header">Wed</div>
            <div className="day-header">Thu</div>
            <div className="day-header">Fri</div>
            <div className="day-header">Sat</div>
            {generateCalendar(year, month)}
          </div>
        </div>

        {/* Next Month */}
        <div className="calendar-section">
          <h2 className="calendar-month-title">
            {nextMonthDate.toLocaleString('default', { month: 'long' })} {nextYear}
          </h2>
          <div className="calendar-grid">
            <div className="day-header">Sun</div>
            <div className="day-header">Mon</div>
            <div className="day-header">Tue</div>
            <div className="day-header">Wed</div>
            <div className="day-header">Thu</div>
            <div className="day-header">Fri</div>
            <div className="day-header">Sat</div>
            {generateCalendar(nextYear, nextMonth)}
          </div>
        </div>
      </div>

      <div class="legend-row">
        <div class="legend-item">
          <div class="legend-circle today"></div>
          <span>Today</span>
        </div>
        <div class="legend-item">
          <div class="legend-circle completed"></div>
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
