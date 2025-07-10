import React from 'react';

function BirthdateComponent({ value, onChange }) {
  return (
    <div className="form-component">
      <h3>🎂 Birthdate</h3>
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange('birthdate', e.target.value)}
        style={{
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '16px',
          width: '200px'
        }}
      />
    </div>
  );
}

export default BirthdateComponent;