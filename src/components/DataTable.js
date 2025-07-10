import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../api';

function DataTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  // ISSUE 4 FIX: Improved data loading with better error handling
  const loadUsers = async () => {
    try {
      console.log('DataTable: Loading users...');
      setError(''); // Clear previous errors
      
      const userData = await getAllUsers();
      console.log('DataTable: Received users:', userData);
      
      if (Array.isArray(userData)) {
        setUsers(userData);
        console.log('DataTable: Successfully loaded', userData.length, 'users');
      } else {
        console.error('DataTable: Invalid data format received:', userData);
        setError('Invalid data format received from server');
        setUsers([]);
      }
    } catch (error) {
      console.error('DataTable: Failed to load users:', error);
      setError('Failed to load users: ' + (error.message || error));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log('DataTable: Manual refresh triggered');
    setLoading(true);
    loadUsers();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  if (loading && users.length === 0) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontSize: '18px'
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
          Real-time view of all users in the database. Auto-refreshes every 5 seconds.
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
                      <strong>{user.email || 'N/A'}</strong>
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
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ 
            padding: '40px',
            textAlign: 'center',
            color: '#7f8c8d'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>
              {error ? 'Error loading data' : 'No users found'}
            </p>
            <p style={{ fontSize: '14px' }}>
              {error ? 'Check console for details' : 'Complete the onboarding flow to see user data here.'}
            </p>
            {error && (
              <button 
                onClick={handleRefresh}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>Debug Info:</strong><br/>
          Users loaded: {users.length}<br/>
          Loading: {loading ? 'Yes' : 'No'}<br/>
          Error: {error || 'None'}<br/>
          Last refresh: {new Date().toLocaleTimeString()}
        </div>
      )}

      {/* Navigation */}
      <div style={{ 
        marginTop: '30px', 
        textAlign: 'center',
        padding: '20px'
      }}>
        <nav>
          <a href="/" style={{ 
            color: '#3498db', 
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '20px'
          }}>
            ← Back to Onboarding
          </a>
          <a href="/admin" style={{ 
            color: '#3498db', 
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            🔧 Admin Dashboard →
          </a>
        </nav>
      </div>
    </div>
  );
}

export default DataTable;