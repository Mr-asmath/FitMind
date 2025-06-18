import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
  const nav = useNavigate();
  const [cred, setCred] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(cred);
      localStorage.setItem("token", data.access_token);
      nav("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={cred.email}
        onChange={(e) => setCred({ ...cred, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        value={cred.password}
        onChange={(e) => setCred({ ...cred, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
}
