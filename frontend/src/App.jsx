import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import SelectionPage from './pages/SelectionPage';
import DashboardCalendar from './pages/DashboardCalendar';
import UpdateUserSelectionPage from './pages/SelectionPage';
import FitnessListPage from './pages/FitnessListPage';
import MeditationListPage from './pages/MeditationListPage';
import YogaListPage from './pages/YogaListPage';
import WorkoutFitness from './pages/WorkoutFitness';
import WorkoutMeditation from './pages/WorkoutMeditation';
import WorkoutYoga from './pages/WorkoutYoga';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-activities" element={<SelectionPage />} />
        <Route path="/update-preferences" element={<UpdateUserSelectionPage />} />
        <Route path="/dashboard-calendar" element={<DashboardCalendar />} />
        <Route path="/fitness" element={<FitnessListPage />} />
        <Route path="/meditation" element={<MeditationListPage />} />
        <Route path="/yoga" element={<YogaListPage />} />
        <Route path="/workout_fitness" element={<WorkoutFitness />} />
        <Route path="/workout_meditation" element={<WorkoutMeditation />} />
        <Route path="/workout_yoga" element={<WorkoutYoga />} />
      </Routes>
    </Router>
  );
}

export default App;
