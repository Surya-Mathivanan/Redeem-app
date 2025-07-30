import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Added faEye, faEyeSlash

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password visibility
  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const togglePasswordVisibility = () => { // New function to toggle password visibility
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => { // New function to toggle confirm password visibility
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    const success = await register({
      name,
      email,
      password
    });
    
    setIsLoading(false);
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="app-container">
      <style>
        {`
          .form-container {
            width: 100%; /* Make it responsive */
            max-width: 400px; /* Add max-width to control the form's maximum width */
            background: linear-gradient(#212121, #212121) padding-box,
                        linear-gradient(145deg, transparent 35%,#e81cff, #40c9ff) border-box;
            border: 2px solid transparent;
            padding: 32px 24px;
            font-size: 14px;
            font-family: inherit;
            color: white;
            display: flex;
            flex-direction: column;
            gap: 20px;
            box-sizing: border-box;
            border-radius: 16px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            margin: auto; /* Center the form container horizontally */
          }

          .form-container button:active {
            scale: 0.95;
          }

          .form-container .form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .form-container .form-group {
            display: flex;
            flex-direction: column;
            gap: 2px;
            position: relative; /* Added for icon positioning */
          }
                      .app-container {
            background-color: rgb(9, 11, 44); /* Set the background color for the entire page */
            min-height: 100vh; /* Ensure it covers the full viewport height */
            display: flex; /* Use flexbox to help center content if needed */
            justify-content: center;
            align-items: center;
          }

          .form-container .form-group-label {
            display: block;
            margin-bottom: 5px;
            color: #717171;
            font-weight: 600;
            font-size: 12px;
          }

          .form-container .form-group-input {
            width: 100%;
            padding: 12px 16px;
            border-radius: 8px;
            color: #fff;
            font-family: inherit;
            background-color: transparent;
            border: 1px solid #414141;
            box-sizing: border-box; /* Include padding and border in the element's total width and height */
            padding-right: 40px; /* Added space for the eye icon */
          }

          .form-container .form-group-input::placeholder {
            opacity: 0.5;
          }

          .form-container .form-group-input:focus {
            outline: none;
            border-color: #e81cff;
          }

          .form-container .form-submit-btn {
            display: flex;
            align-items: center; /* Center content vertically */
            justify-content: center;
            font-family: inherit;
            color: #fff; /* Changed to white for better contrast */
            font-weight: 600;
            width: 100%; /* Make button full width */
            background: linear-gradient(145deg, #e81cff, #40c9ff); /* Gradient background for button */
            border: none; /* No border for the gradient button */
            padding: 12px 16px;
            font-size: inherit;
            gap: 8px;
            margin-top: 8px;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.3s ease; /* Smooth transition for hover effects */
          }

          .form-container .form-submit-btn:hover {
            background: linear-gradient(145deg, #40c9ff, #e81cff); /* Invert gradient on hover */
            box-shadow: 0 0 10px rgba(232, 28, 255, 0.5); /* Add glow effect on hover */
          }

          .text-centered {
            text-align: center;
          }

          .margin-bottom-large {
            margin-bottom: 24px;
          }

          .margin-end-small {
            margin-right: 8px;
          }

          .margin-bottom-medium {
            margin-bottom: 16px;
          }

          .width-full {
            width: 100%;
          }

          .margin-top-medium {
            margin-top: 16px;
          }

          .margin-top-large {
            margin-top: 24px;
          }

          .text-muted-style {
            color: #aaa;
            font-size: 0.85em;
          }

          .alert-message {
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-size: 0.9em;
          }

          .alert-danger-style {
            background-color: #ff4d4d;
            color: white;
            border: 1px solid #cc0000;
          }

          .app-row {
            display: flex;
            justify-content: center; /* Center content horizontally */
            align-items: center; /* Center content vertically */
            min-height: 100vh;
            width: 100%;
          }

          .app-col {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
          }

          .password-toggle-icon { /* New style for the eye icon */
            position: absolute;
            right: 15px;
            top: 60%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #717171;
          }
        `}
      </style>
      <div className="app-row">
        <div className="app-col">
          <div className="form-container">
            <h2 className="text-centered margin-bottom-large">
              {/* <FontAwesomeIcon icon={faUserPlus} className="margin-end-small" /> */}
              Register Here
            </h2>
            
            {error && (
              <div className="alert-message alert-danger-style" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={onSubmit} className="form">
              <div className="form-group margin-bottom-medium">
                <label htmlFor="name" className="form-group-label">Name</label>
                <input
                  type="text"
                  className="form-group-input"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="form-group margin-bottom-medium">
                <label htmlFor="email" className="form-group-label">Email Address</label>
                <input
                  type="email"
                  className="form-group-input"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group margin-bottom-medium">
                <label htmlFor="password" className="form-group-label">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'} 
                  className="form-group-input"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  required
                />
                <FontAwesomeIcon 
                  icon={showPassword ? faEyeSlash : faEye} // Dynamic icon
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                />
                <small className="text-muted-style">Password must be at least 6 characters</small>
              </div>
              
              <div className="form-group margin-bottom-medium">
                <label htmlFor="confirmPassword" className="form-group-label">Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'} 
                  className="form-group-input"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  placeholder="Confirm your password"
                  required
                />
                <FontAwesomeIcon 
                  icon={showConfirmPassword ? faEyeSlash : faEye} // Dynamic icon
                  className="password-toggle-icon"
                  onClick={toggleConfirmPasswordVisibility}
                />
              </div>
              
              <button
                type="submit"
                className="form-submit-btn width-full margin-top-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="margin-end-small" />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>
            
            <div className="margin-top-large text-centered">
              <p>
                Already have an account? <Link to="/login" style={{ color: '#40c9ff', textDecoration: 'none' }}>Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;