import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getAdminConfig } from '../api';

const ItemType = 'COMPONENT';

// Draggable Component Item
function DraggableComponent({ component, currentPage, onMove }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { 
      key: component.key, 
      name: component.name, 
      icon: component.icon,
      currentPage 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        backgroundColor: isDragging ? '#e3f2fd' : 'white',
        padding: '12px',
        margin: '8px 0',
        borderRadius: '8px',
        border: isDragging ? '2px dashed #2196f3' : '2px solid #e0e0e0',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        opacity: isDragging ? 0.5 : 1,
        transition: 'all 0.2s ease',
        boxShadow: isDragging ? '0 4px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <span style={{ fontSize: '20px' }}>{component.icon}</span>
      <span style={{ fontWeight: 'bold', flex: 1 }}>{component.name}</span>
      <span style={{ 
        fontSize: '12px', 
        color: '#666',
        backgroundColor: '#f5f5f5',
        padding: '2px 6px',
        borderRadius: '10px'
      }}>
        📱 Drag me!
      </span>
    </div>
  );
}

// Drop Zone for Pages
function PageDropZone({ pageNumber, components, onDrop, children }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemType,
    drop: (item) => {
      if (item.currentPage !== pageNumber) {
        onDrop(item.key, pageNumber);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      style={{
        minHeight: '200px',
        backgroundColor: isActive ? '#e8f5e8' : '#f8f9fa',
        border: isActive ? '3px dashed #4caf50' : '2px dashed #ddd',
        borderRadius: '10px',
        padding: '15px',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
    >
      {isActive && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#4caf50',
          pointerEvents: 'none'
        }}>
          🎯 Drop component here!
        </div>
      )}
      
      {components.length === 0 && !isActive ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#999',
          padding: '40px 20px',
          fontSize: '16px'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📋</div>
          <p>No components assigned</p>
          <p style={{ fontSize: '14px' }}>Drag components here</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

// Main Admin Dashboard Component
function AdminDashboard() {
  const [config, setConfig] = useState({ 2: [], 3: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const components = [
    { key: 'ABOUT_ME', name: 'About Me', icon: '📝', description: 'Large text area for user bio' },
    { key: 'ADDRESS', name: 'Address', icon: '🏠', description: 'Street, city, state, ZIP fields' },
    { key: 'BIRTHDATE', name: 'Birthdate', icon: '🎂', description: 'Date picker for birth date' }
  ];

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await getAdminConfig();
      setConfig(response);
    } catch (error) {
      console.error('Failed to load config:', error);
     
      setConfig({
        2: ['ABOUT_ME', 'ADDRESS'],
        3: ['BIRTHDATE']
      });
    } finally {
      setLoading(false);
    }
  };

  const handleComponentMove = (componentKey, newPage) => {
    const newConfig = { ...config };
    
    // Remove component from all pages
    Object.keys(newConfig).forEach(page => {
      newConfig[page] = newConfig[page].filter(comp => comp !== componentKey);
    });
    
    
    newConfig[newPage] = [...newConfig[newPage], componentKey];
    
    setConfig(newConfig);
  };

  const saveConfig = async () => {
    // Validate: each page must have at least one component
    if (config[2].length === 0 || config[3].length === 0) {
      alert('❌ Each page must have at least one component!');
      return;
    }

    setSaving(true);
    try {
      const componentPageMap = {};
      Object.entries(config).forEach(([page, components]) => {
        components.forEach(comp => {
          componentPageMap[comp] = parseInt(page);
        });
      });

      const response = await fetch('http://localhost:8080/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ componentPageMap })
      });

      if (response.ok) {
        alert('✅ Configuration saved successfully! 🎉');
      } else {
        alert('❌ Failed to save configuration');
      }
    } catch (error) {
      alert('❌ Error saving configuration');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const getComponentDetails = (componentKey) => {
    return components.find(c => c.key === componentKey);
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontSize: '18px'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>⏳</div>
        Loading admin configuration...
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ 
        padding: '20px', 
        maxWidth: '1200px', 
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
            🔧 Admin Dashboard
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#7f8c8d',
            margin: 0
          }}>
            Drag and drop components to configure the onboarding flow pages
          </p>
        </div>

        {/* Component Overview */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '15px', 
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>📦 Available Components</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '15px' 
          }}>
            {components.map(component => (
              <div key={component.key} style={{
                border: '2px solid #ecf0f1',
                borderRadius: '10px',
                padding: '15px',
                backgroundColor: '#fafbfc'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{component.icon}</span>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{component.name}</span>
                </div>
                <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>{component.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Page Configuration */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '30px', 
          marginBottom: '30px' 
        }}>
          
          {/* Page 2 */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              color: '#3498db',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📄 Page 2
              <span style={{ 
                fontSize: '14px',
                backgroundColor: '#3498db',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontWeight: 'normal'
              }}>
                {config[2]?.length || 0} components
              </span>
            </h2>
            
            <PageDropZone 
              pageNumber={2} 
              components={config[2]} 
              onDrop={handleComponentMove}
            >
              {config[2]?.map(componentKey => {
                const component = getComponentDetails(componentKey);
                return component ? (
                  <DraggableComponent
                    key={componentKey}
                    component={component}
                    currentPage={2}
                    onMove={handleComponentMove}
                  />
                ) : null;
              })}
            </PageDropZone>
          </div>

          {/* Page 3 */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              color: '#27ae60',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📄 Page 3
              <span style={{ 
                fontSize: '14px',
                backgroundColor: '#27ae60',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontWeight: 'normal'
              }}>
                {config[3]?.length || 0} components
              </span>
            </h2>
            
            <PageDropZone 
              pageNumber={3} 
              components={config[3]} 
              onDrop={handleComponentMove}
            >
              {config[3]?.map(componentKey => {
                const component = getComponentDetails(componentKey);
                return component ? (
                  <DraggableComponent
                    key={componentKey}
                    component={component}
                    currentPage={3}
                    onMove={handleComponentMove}
                  />
                ) : null;
              })}
            </PageDropZone>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '25px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <button 
            onClick={saveConfig}
            disabled={saving || config[2].length === 0 || config[3].length === 0}
            style={{ 
              padding: '15px 40px', 
              backgroundColor: saving ? '#95a5a6' : (config[2].length === 0 || config[3].length === 0) ? '#e74c3c' : '#e67e22',
              color: 'white', 
              border: 'none', 
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginRight: '15px'
            }}
          >
            {saving ? '⏳ Saving...' : '💾 Save Configuration'}
          </button>

          

          {(config[2].length === 0 || config[3].length === 0) && (
            <div style={{ 
              marginTop: '15px',
              color: '#e74c3c',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              ⚠️ Each page must have at least one component!
            </div>
          )}
        </div>

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
              fontWeight: 'bold'
            }}>
              ← Back to Onboarding
            </a>
            {' | '}
            <a href="/data" style={{ 
              color: '#3498db', 
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              📊 View Data →
            </a>
          </nav>
        </div>
      </div>
    </DndProvider>
  );
}

export default AdminDashboard;