import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import updatePrefs from '../services/api';

const yogas = ['Hatha', 'Vinyasa', 'Ashtanga', 'Power Yoga', 'Yin'];

export default function YogaOptions() {
  const [sel, setSel] = useState([]);
  const nav = useNavigate();
  const toggle = (y) => setSel((s) => (s.includes(y) ? s.filter((x) => x !== y) : [...s, y]));
  const save = async () => {
    const token = localStorage.getItem('token');
    await updatePrefs({ yoga: sel }, token);
    nav('/dashboard');
  };
  return (
    <div className="p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Select yoga styles you practice</h3>
      {yogas.map((y) => (
        <label key={y} className="block">
          <input type="checkbox" checked={sel.includes(y)} onChange={() => toggle(y)} /> {y}
        </label>
      ))}
      <button onClick={save} className="mt-4 p-2 bg-green-600 text-white rounded">Save & Continue</button>
    </div>
  );
}