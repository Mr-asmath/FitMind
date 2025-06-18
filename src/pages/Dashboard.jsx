import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'; 
import { getMe } from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return nav("/login");
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      return nav("/login");
    }
    getMe(token).then((res) => setUser(res.data));
  }, [nav]);

  if (!user) return <p>Loading…</p>;

  return (
    <div>
      <h1>Welcome, {user.full_name}</h1>
      <p>Your email: {user.email}</p>
      {/* Later: show fitness stats, charts, etc. */}
    </div>
  );
}
