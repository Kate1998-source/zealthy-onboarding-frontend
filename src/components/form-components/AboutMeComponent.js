import React from 'react';

function AboutMeComponent({ value, onChange }) {
  return (
    <div className="form-component">
      <h3>📝 About Me</h3>
      <textarea
        value={value || ''}
        onChange={(e) => onChange('aboutMe', e.target.value)}
        placeholder="Tell us about yourself..."
        rows="4"
        cols="50"
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '16px'
        }}
      />
    </div>
  );
}

export default AboutMeComponent;