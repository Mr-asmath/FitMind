import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser,FaArrowLeft , FaBirthdayCake, FaHashtag, FaRulerVertical, FaWeight, FaEnvelope, FaLock, FaPhone, FaHome } from 'react-icons/fa';
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

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.age || formData.age < 1) newErrors.age = 'Valid age is required';
    if (!formData.height || formData.height < 1) newErrors.height = 'Valid height is required';
    if (!formData.weight || formData.weight < 1) newErrors.weight = 'Valid weight is required';
    return newErrors;
  };

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
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      localStorage.setItem('device_id', data.device_id);
      navigate('/select-activities') || window.location.assign('/select-activities');
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (name, type, placeholder, Icon) => (
    <div className="form-group">
      <div className="input-icon">
        <Icon className="icon" />
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          className={errors[name] ? 'error' : ''}
          required
        />
      </div>
      {errors[name] && <div className="error-message">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="body1">
      <header></header>
      <div className="auth-container" style={{ background: 'rgba(255, 255, 255, 0.08)', marginTop: '50px', width: '80%' }}>
        <h2>Register (Step {step}/2)</h2>
        {errors.form && <div className="error-message">{errors.form}</div>}
        {step === 1 ? (
          <form noValidate className={step === 1 ? '' : 'slide-left'}>
            {renderInput('username', 'text', 'Username', FaUser)}
            {renderInput('dob', 'date', '', FaBirthdayCake)}
            {renderInput('age', 'number', 'Age', FaHashtag)}
            {renderInput('height', 'number', 'Height (cm)', FaRulerVertical)}
            {renderInput('weight', 'number', 'Weight (kg)', FaWeight)}
            <button type="button" onClick={nextStep} className="next-button">Continue</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} noValidate className={step === 2 ? '' : 'slide-left'}>
            {renderInput('email', 'email', 'Email', FaEnvelope)}
            {renderInput('password', 'password', 'Password', FaLock)}
            {renderInput('phone', 'tel', 'Phone', FaPhone)}
            {renderInput('address', 'text', 'Address', FaHome)}
            <div className="form-actions">
              <button type="button" onClick={prevStep} className="back-button" title="Go Back" style={{
                width:'50px',
                borderRadius:'2rem'
              }}> <FaArrowLeft /></button>
              <button type="submit" disabled={isSubmitting} className="submit-button" style={{
                width:'150px'
              }}>
                {isSubmitting ? 'Registering...' : 'Sumbit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
