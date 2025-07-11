import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../api';

function DataTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadUsers = async () => {
    try {
      console.log('DataTable: Loading users...');
      setError('');
      
      const userData = await getAllUsers();
      console.log('DataTable: Received data:', userData);
      
      if (Array.isArray(userData)) {
        setUsers(userData);
        console.log('DataTable: Loaded', userData.length, 'users');
      } else {
        console.error('DataTable: Invalid data format:', userData);
        setError('Invalid data format received');
        setUsers([]);
      }
    } catch (error) {
      console.error('DataTable: Load error:', error);
      setError(`Failed to load users: ${error.message || error}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log('DataTable: Manual refresh');
    setLoading(true);
    loadUsers();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading && users.length === 0) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontSize: '18px',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>⏳</div>
        Loading user data...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '15px', 
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          marginBottom: '10px',
          color: '#2c3e50'
        }}>
          📊 User Data Table
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#7f8c8d',
          marginBottom: '20px'
        }}>
          Real-time view of registered users. Auto-refreshes every 10 seconds.
        </p>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: loading ? '#6c757d' : '#3498db',
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading ? '⏳ Loading...' : '🔄 Refresh Data'}
          </button>
          
          <div style={{ 
            fontSize: '16px',
            color: '#2c3e50',
            fontWeight: 'bold'
          }}>
            Total Users: {users.length}
          </div>

          {error && (
            <div style={{
              color: '#dc3545',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              ❌ {error}
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {users.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ 
                    padding: '15px 12px', 
                    border: '1px solid #ddd',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: '#2c3e50'
                  }}>ID</th>
                  <th style={{ 
                    padding: '15px 12px', 
                    border: '1px solid #ddd',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: '#2c3e50'
                  }}>Email</th>
                  <th style={{ 
                    padding: '15px 12px', 
                    border: '1px solid #ddd',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: '#2c3e50'
                  }}>About Me</th>
                  <th style={{ 
                    padding: '15px 12px', 
                    border: '1px solid #ddd',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: '#2c3e50'
                  }}>Street Address</th>
                  <th style={{ 
                    padding: '15px 12px', 
                    border: '1px solid #ddd',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: '#2c3e50'
                  }}>City</th>
                  <th style={{ 
                    padding: '15px 12px', 
                    border: '1px solid #ddd',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: '#2c3e50'
                  }}>State</th>
                  <th style={{ 
                    padding: '15px 12px', 
                    border: '1px solid #ddd',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: '#2c3e50'
                  }}>ZIP</th>
                  <th style={{ 
                    padding: '15px 12px', 
                    border: '1px solid #ddd',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: '#2c3e50'
                  }}>Birthdate</th>
                  <th style={{ 
                    padding: '15px 12px', 
                    border: '1px solid #ddd',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: '#2c3e50'
                  }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id || index} style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                  }}>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <strong>{user.id || 'N/A'}</strong>
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <strong style={{ color: '#007bff' }}>{user.email || 'N/A'}</strong>
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      border: '1px solid #ddd',
                      maxWidth: '200px',
                      wordWrap: 'break-word'
                    }}>
                      {user.aboutMe || '-'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {user.streetAddress || '-'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {user.city || '-'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {user.state || '-'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {user.zip || '-'}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {formatDate(user.birthdate)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {formatDateTime(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ 
            padding: '60px 40px',
            textAlign: 'center',
            color: '#7f8c8d'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
            <h3 style={{ 
              fontSize: '24px', 
              marginBottom: '10px',
              color: '#2c3e50'
            }}>
              {error ? 'Unable to Load Data' : 'No Users Found'}
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '20px' }}>
              {error 
                ? 'There was an error loading user data. Please check your connection and try again.' 
                : 'Complete the onboarding flow to see user data here.'
              }
            </p>
            {error && (
              <button 
                onClick={handleRefresh}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🔄 Try Again
              </button>
            )}
          </div>
        )}
      </div>

      {/* Debug Info - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#666',
          border: '1px solid #dee2e6'
        }}>
          <strong>Debug Info:</strong><br/>
          Users loaded: {users.length}<br/>
          Loading: {loading ? 'Yes' : 'No'}<br/>
          Error: {error || 'None'}<br/>
          Last refresh: {new Date().toLocaleTimeString()}<br/>
          API URL: {process.env.REACT_APP_API_URL || 'localhost:8080/api'}
        </div>
      )}

      {/* Navigation */}
      <div style={{ 
        marginTop: '40px', 
        textAlign: 'center',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <nav>
          <a href="/" style={{ 
            color: '#3498db', 
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            marginRight: '30px',
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            transition: 'all 0.3s ease'
          }}>
            ← Back to Onboarding
          </a>
          <a href="/admin" style={{ 
            color: '#e74c3c', 
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            transition: 'all 0.3s ease'
          }}>
            🔧 Admin Dashboard →
          </a>
        </nav>
      </div>
    </div>
  );
}

export default DataTable;