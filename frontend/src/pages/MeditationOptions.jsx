import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import updatePrefs from '../services/api';

const meditations = ['Mindfulness', 'Zen', 'Transcendental', 'Body‑scan', 'Breath‑focus'];

export default function MeditationOptions() {
  const [sel, setSel] = useState([]);
  const nav = useNavigate();
  const toggle = (m) => setSel((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m]));
  const save = async () => {
    const token = localStorage.getItem('token');
    await updatePrefs({ meditation: sel }, token);
    nav('/dashboard');
  };
  return (
    <div className="p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Select meditation styles</h3>
      {meditations.map((m) => (
        <label key={m} className="block">
          <input type="checkbox" checked={sel.includes(m)} onChange={() => toggle(m)} /> {m}
        </label>
      ))}
      <button onClick={save} className="mt-4 p-2 bg-purple-600 text-white rounded">Save & Continue</button>
    </div>
  );
}