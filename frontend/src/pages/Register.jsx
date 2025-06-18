import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      {["full_name", "email", "password", "age", "gender", "height_cm", "weight_kg"].map((f) => (
        <div key={f}>
          <label>{f.replace("_", " ")}:</label>
          <input
            type={f === "password" ? "password" : "text"}
            name={f}
            value={form[f]}
            onChange={handleChange}
            required={["full_name", "email", "password"].includes(f)}
          />
        </div>
      ))}
      <button type="submit">Register</button>
    </form>
  );
}
