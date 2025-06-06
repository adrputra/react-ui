import React, { useState, useEffect } from 'react';
import {
  Button
} from '@mui/material';
import QrReader from 'react-qr-scanner';
import { tr } from 'date-fns/locale';

export default function Camera({ val }) {
  const [state, setState] = useState({
    delay: 500,
    result: 'No result',
    scanning: true,
  });
  const [scannerKey, setScannerKey] = useState(0);
  const [facingMode, setFacingMode] = useState('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  useEffect(() => {
    // Check for available video input devices
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      console.info('videoInputs', videoInputs);
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
      val(JSON.parse(data.text));

      setTimeout(() => {
        setScannerKey((prev) => prev + 1);
        setState((prev) => ({ ...prev, scanning: true }));
      }, 1000);
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
        key={scannerKey}
        delay={state.delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
        constraints={{ video: { facingMode } }}
      />
      <p>{state.scanning ? 'Scanning...' : 'Scanning stopped'}</p>
    </div>
  );
};