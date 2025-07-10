import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getAdminConfig } from './api';
import AboutMeComponent from './components/form-components/AboutMeComponent';
import AddressComponent from './components/form-components/AddressComponent';
import BirthdateComponent from './components/form-components/BirthdateComponent';
import AdminDashboard from './components/AdminDashboard';
import DataTable from './components/DataTable';
import './App.css';

function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [adminConfig, setAdminConfig] = useState({ 2: [], 3: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAdminConfig();
    restoreProgress();
  }, []);

  // Auto-save progress whenever userData changes (ISSUE 3 FIX)
  useEffect(() => {
    if (userData.email && currentStep > 1) {
      localStorage.setItem('zealthy_user_data', JSON.stringify(userData));
      localStorage.setItem('zealthy_current_step', currentStep.toString());
      console.log('Auto-saved progress:', userData, 'Step:', currentStep);
    }
  }, [userData, currentStep]);

  const loadAdminConfig = async () => {
    try {
      const config = await getAdminConfig();
      setAdminConfig(config);
      console.log('Admin config loaded:', config);
    } catch (error) {
      console.error('Failed to load admin config:', error);
      // Set default config if API fails
      setAdminConfig({
        2: ['ABOUT_ME', 'ADDRESS'],
        3: ['BIRTHDATE']
      });
    }
  };

  // ISSUE 3 FIX: Restore progress on page refresh
  const restoreProgress = () => {
    console.log('Attempting to restore progress...');
    
    const savedData = localStorage.getItem('zealthy_user_data');
    const savedStep = localStorage.getItem('zealthy_current_step');
    
    if (savedData && savedStep) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.email) {
          setUserData(parsedData);
          setCurrentStep(parseInt(savedStep));
          console.log('Progress restored - Data:', parsedData, 'Step:', savedStep);
        }
      } catch (error) {
        console.error('Error restoring progress:', error);
        localStorage.removeItem('zealthy_user_data');
        localStorage.removeItem('zealthy_current_step');
      }
    } else {
      console.log('No saved progress found');
    }
  };

  // ISSUE 1 FIX: Check if email exists in database
  const checkEmailExists = async (email) => {
    try {
      console.log('Checking if email exists:', email);
      const response = await fetch(`http://localhost:8080/api/users/email/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Email check response status:', response.status);
      
      if (response.status === 200) {
        console.log('Email exists in database');
        return true;
      } else if (response.status === 404) {
        console.log('Email is available');
        return false;
      } else {
        console.log('Unexpected response status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    console.log('Step 1 form submitted - Email:', email);

    try {
      // ISSUE 1: Check if email exists
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setError('❌ This email is already registered. Please use a different email.');
        setLoading(false);
        return;
      }

      // Email is available, proceed to step 2
      const newUserData = { email, password };
      setUserData(newUserData);
      setCurrentStep(2);
      
      console.log('Moving to step 2 with data:', newUserData);
      
    } catch (error) {
      console.error('Step 1 submission error:', error);
      setError('❌ Failed to validate email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (field, value) => {
    console.log(`Field "${field}" changed to:`, value);
    const newUserData = { ...userData, [field]: value };
    setUserData(newUserData);
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      console.log('Moving from step 2 to step 3');
      setCurrentStep(3);
    } else if (currentStep === 3) {
      console.log('Completing registration from step 3');
      handleCompleteRegistration();
    }
  };

  // ISSUE 2 FIX: Complete registration with proper data saving
  const handleCompleteRegistration = async () => {
    setLoading(true);
    setError('');

    console.log('Starting registration completion...');
    console.log('Current userData:', userData);

    try {
      // Prepare complete user data
      const completeUserData = {
        email: userData.email,
        password: userData.password,
        aboutMe: userData.aboutMe || null,
        streetAddress: userData.streetAddress || null,
        city: userData.city || null,
        state: userData.state || null,
        zip: userData.zip || null,
        birthdate: userData.birthdate || null
      };

      console.log('Sending complete user data to backend:', completeUserData);

      // ISSUE 2: Use the correct endpoint
      const response = await fetch('http://localhost:8080/api/users/register-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(completeUserData)
      });

      console.log('Registration response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration failed with error:', errorText);
        throw new Error(`Registration failed: ${errorText}`);
      }

      const result = await response.json();
      console.log('Registration successful! Result:', result);
      
      alert(`🎉 Registration Complete! User ID: ${result.id}. Check the data table to see your info.`);
      
      // Clear all saved data and return to step 1
      localStorage.removeItem('zealthy_user_data');
      localStorage.removeItem('zealthy_current_step');
      setCurrentStep(1);
      setUserData({});
      setError('');
      
      console.log('Registration flow completed, returned to step 1');
      
    } catch (error) {
      console.error('Registration completion error:', error);
      setError('❌ Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearProgress = () => {
    if (window.confirm('Start over? All progress will be lost.')) {
      localStorage.removeItem('zealthy_user_data');
      localStorage.removeItem('zealthy_current_step');
      setCurrentStep(1);
      setUserData({});
      setError('');
      console.log('Progress cleared by user');
    }
  };

  const renderComponents = (pageNumber) => {
    const components = adminConfig[pageNumber] || [];
    
    // If no admin config, use defaults
    if (components.length === 0) {
      if (pageNumber === 2) {
        return [
          <AboutMeComponent
            key="about-me"
            value={userData.aboutMe || ''}
            onChange={handleDataChange}
          />,
          <AddressComponent
            key="address"
            values={userData}
            onChange={handleDataChange}
          />
        ];
      } else if (pageNumber === 3) {
        return [
          <BirthdateComponent
            key="birthdate"
            value={userData.birthdate || ''}
            onChange={handleDataChange}
          />
        ];
      }
    }
    
    return components.map(componentType => {
      switch (componentType) {
        case 'ABOUT_ME':
          return (
            <AboutMeComponent
              key="about-me"
              value={userData.aboutMe || ''}
              onChange={handleDataChange}
            />
          );
        case 'ADDRESS':
          return (
            <AddressComponent
              key="address"
              values={userData}
              onChange={handleDataChange}
            />
          );
        case 'BIRTHDATE':
          return (
            <BirthdateComponent
              key="birthdate"
              value={userData.birthdate || ''}
              onChange={handleDataChange}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 Zealthy Onboarding</h1>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          {[1, 2, 3].map(step => (
            <div key={step} style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: currentStep >= step ? '#007bff' : '#ccc',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {step}
            </div>
          ))}
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '10px', 
            marginBottom: '20px',
            fontSize: '12px',
            borderRadius: '5px'
          }}>
            <strong>Debug:</strong> Step {currentStep} | Email: {userData.email || 'None'} | 
            Data keys: {Object.keys(userData).join(', ')}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ 
            color: '#dc3545', 
            backgroundColor: '#f8d7da', 
            padding: '15px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            border: '1px solid #f5c6cb',
            fontWeight: 'bold'
          }}>
            {error}
          </div>
        )}
        
        {/* Step 1: Email/Password */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Step 1: Create Account</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              We'll check if your email is available before proceeding.
            </p>
            
            <form onSubmit={handleStep1Submit} style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ marginBottom: '15px' }}>
                <input 
                  type="email" 
                  name="email"
                  defaultValue={userData.email || ''}
                  placeholder="Email" 
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '5px', 
                    border: '1px solid #ccc',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <input 
                  type="password" 
                  name="password"
                  defaultValue={userData.password || ''}
                  placeholder="Password (min 6 characters)" 
                  minLength="6"
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '5px', 
                    border: '1px solid #ccc',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  backgroundColor: loading ? '#6c757d' : '#007bff',
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '🔍 Checking Email...' : '✅ Check Email & Continue →'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Dynamic Components */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>Step 2: Tell Us About Yourself</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Your progress is automatically saved. Safe to refresh the page.
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '30px', 
              maxWidth: '600px', 
              margin: '20px auto' 
            }}>
              {renderComponents(2)}
            </div>
            
            <button 
              onClick={handleNextStep}
              style={{ 
                padding: '12px 30px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Next Step →
            </button>
          </div>
        )}

        {/* Step 3: Dynamic Components */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>Step 3: Final Step!</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Complete your registration. This will save all data to the database.
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '30px', 
              maxWidth: '600px', 
              margin: '20px auto' 
            }}>
              {renderComponents(3)}
            </div>
            
            {/* Data Preview */}
            <div style={{ 
              backgroundColor: '#e8f5e8', 
              padding: '15px', 
              borderRadius: '5px', 
              margin: '20px auto',
              maxWidth: '600px',
              border: '1px solid #c3e6c3'
            }}>
              <h4 style={{ marginTop: 0, color: '#155724' }}>📋 Review Your Information:</h4>
              <div style={{ textAlign: 'left', color: '#155724' }}>
                <p><strong>Email:</strong> {userData.email}</p>
                {userData.aboutMe && <p><strong>About Me:</strong> {userData.aboutMe.length > 50 ? userData.aboutMe.substring(0, 50) + '...' : userData.aboutMe}</p>}
                {userData.streetAddress && <p><strong>Address:</strong> {userData.streetAddress}{userData.city ? `, ${userData.city}` : ''}{userData.state ? ` ${userData.state}` : ''}{userData.zip ? ` ${userData.zip}` : ''}</p>}
                {userData.birthdate && <p><strong>Birthdate:</strong> {userData.birthdate}</p>}
              </div>
            </div>
            
            <button 
              onClick={handleNextStep}
              disabled={loading}
              style={{ 
                padding: '15px 35px', 
                backgroundColor: loading ? '#6c757d' : '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '20px'
              }}
            >
              {loading ? '💾 Saving to Database...' : '🎉 Complete Registration'}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div style={{ marginTop: '40px' }}>
          <nav>
            <Link to="/admin" style={{ color: '#007bff', textDecoration: 'none', marginRight: '20px' }}>
              🔧 Admin Dashboard
            </Link>
            <Link to="/data" style={{ color: '#007bff', textDecoration: 'none' }}>
              📊 View Data
            </Link>
            {currentStep > 1 && (
              <>
                {' | '}
                <button 
                  onClick={clearProgress}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  🔄 Start Over
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingWizard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/data" element={<DataTable />} />
      </Routes>
    </Router>
  );
}

export default App;