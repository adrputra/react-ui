import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';

export default function Camera ({val}) {
  const [state, setState] = useState({
    delay: 5000,
    result: 'No result',
    scanning: true,
  });

  const handleScan = (data) => {
    if (state.scanning && data) {
      setState({
        ...state,
        result: data,
        scanning: false,
      });
      val(JSON.parse(data.text))
    }
  };

  const handleError = (err) => {
    console.error(err);
  };


  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div>
      <QrReader
        delay={state.delay}
        style={previewStyle}
        onError={handleError}
        {...(state.scanning ? { onScan: handleScan } : {})}
      />
      {state.result && state.result.text && <p>{state.result.text}</p>}
    </div>
  );
};