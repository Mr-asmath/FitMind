import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    dob: '',
    age: '',
    height: '',
    weight: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validate step 1 (basic info)
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.age || formData.age < 1) newErrors.age = 'Valid age is required';
    if (!formData.height || formData.height < 1) newErrors.height = 'Valid height is required';
    if (!formData.weight || formData.weight < 1) newErrors.weight = 'Valid weight is required';
    return newErrors;
  };

  // Validate step 2 (account info)
  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.phone.match(/^[0-9]{10,15}$/)) {
      newErrors.phone = 'Valid phone number is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const nextStep = () => {
    const step1Errors = validateStep1();
    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors);
    } else {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const step2Errors = validateStep2();
    if (Object.keys(step2Errors).length > 0) {
      setErrors(step2Errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store device ID for automatic login
      localStorage.setItem('device_id', data.device_id);
      
      // Navigate to selection page with fallback
      navigate('/select-activities') || window.location.assign('/select-activities');
      
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register (Step {step}/2)</h2>
      {errors.form && <div className="error-message">{errors.form}</div>}
      
      {step === 1 ? (
        <form noValidate className={step === 1 ? '' : 'slide-left'}>
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              placeholder=" "
              autoComplete="off"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              required
            />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>
          
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={errors.dob ? 'error' : ''}
              required
            />
            {errors.dob && <div className="error-message">{errors.dob}</div>}
          </div>
          
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              min="1"
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? 'error' : ''}
              required
            />
            {errors.age && <div className="error-message">{errors.age}</div>}
          </div>
          
          <div className="form-group">
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              min="1"
              step="0.1"
              value={formData.height}
              onChange={handleChange}
              className={errors.height ? 'error' : ''}
              required
            />
            {errors.height && <div className="error-message">{errors.height}</div>}
          </div>
          
          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              min="1"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              className={errors.weight ? 'error' : ''}
              required
            />
            {errors.weight && <div className="error-message">{errors.weight}</div>}
          </div>
          
          <button type="button" onClick={nextStep} className="next-button">
            Continue
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} noValidate className={step === 2 ? '' : 'slide-left'}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              required
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              required
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              required
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={prevStep} className="back-button">
              Back
            </button>
            <button type="submit" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Register;