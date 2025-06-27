import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import updatePrefs from '../services/api';

const parts = ['Arms', 'Chest', 'Legs', 'Shoulders', 'Abs', 'Back'];

export default function FitnessOptions() {
  const [selected, setSelected] = useState([]);
  const nav = useNavigate();

  const toggle = (p) =>
    setSelected((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  const save = async () => {
    const token = localStorage.getItem('token');
    await updatePrefs({ fitness: selected }, token);
    nav('/dashboard');
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Select body parts to train</h3>
      {parts.map((p) => (
        <label key={p} className="block">
          <input type="checkbox" checked={selected.includes(p)} onChange={() => toggle(p)} /> {p}
        </label>
      ))}
      <button onClick={save} className="mt-4 p-2 bg-blue-600 text-white rounded">Save & Continue</button>
    </div>
  );
}