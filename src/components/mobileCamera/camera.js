import React, { useState, useEffect } from 'react';
import {
  Button
} from '@mui/material';
import QrReader from 'react-qr-scanner';

export default function Camera({ val }) {
  const [state, setState] = useState({
    delay: 5000,
    result: 'No result',
    scanning: true,
  });
  const [facingMode, setFacingMode] = useState('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  useEffect(() => {
    // Check for available video input devices
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      setHasMultipleCameras(videoInputs.length > 1);
    });
  }, []);

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

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const previewStyle = {
    height: 480,
    width: '90vw',
  };

  return (
    <div>
      {hasMultipleCameras && (
        <Button variant="contained" color="primary" onClick={handleFlipCamera}>
          Flip Camera
        </Button>
      )}
      <QrReader
        delay={state.delay}
        style={previewStyle}
        onError={handleError}
        {...(state.scanning ? { onScan: handleScan } : {})}
        constraints={{ video: { facingMode } }}
      />
      {state.result && state.result.text && <p>{state.result.text}</p>}
    </div>
  );
};