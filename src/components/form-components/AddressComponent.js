import React from 'react';

function AddressComponent({ values, onChange }) {
  return (
    <div className="form-component">
      <h3>🏠 Address Information</h3>
      <div style={{ display: 'grid', gap: '10px' }}>
        <input
          type="text"
          value={values?.streetAddress || ''}
          onChange={(e) => onChange('streetAddress', e.target.value)}
          placeholder="Street Address"
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <input
            type="text"
            value={values?.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="City"
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            value={values?.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="State"
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            value={values?.zip || ''}
            onChange={(e) => onChange('zip', e.target.value)}
            placeholder="ZIP"
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
      </div>
    </div>
  );
}

export default AddressComponent;