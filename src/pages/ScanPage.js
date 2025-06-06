import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Snackbar, Alert } from '@mui/material';
import Camera from '../components/mobileCamera';
import { SendRequestExt } from '../utils/Enigma';

const { REACT_APP_CONFIRM_ATTENDANCE } = process.env;

export default function ScanPage() {
  const [value, setValue] = useState();
  const [errorMessage, setErrorMessage] = useState({});

  const handleValue = (val) => {
      setValue(val);
  };

  const resetValue = () => {
    setValue(undefined);
  };

  useEffect(() => {
    if (value !== undefined) {
        updateInvitation();
    }
  }, [value]);

  const updateInvitation = async () => {
    console.info('REQ Scan Invitation', value);
    try {
      const response = await SendRequestExt(REACT_APP_CONFIRM_ATTENDANCE, { code: value.code });

      console.info('RES Scan Invitation', response.data);

      if (response.data.code === 200) {
        setErrorMessage({ msg: response.data.message, code: 'success' });
      } else {
        setErrorMessage({ msg: response.data.message, code: 'error' });
        console.error(response.data.message);
      }
    } catch (error) {
      setErrorMessage({ msg: `${error.code} - ${error.message}`, code: 'error' });
      console.error(error);
    } finally {
      setTimeout(() => {
        resetValue();
      }, 1000);
      setTimeout(() => {
        setErrorMessage({});
      }, 5000);
    }
  };

  return (
    <>
      <Helmet>
        <title>User | Eventarry</title>
      </Helmet>
      <Container>
        {Object.keys(errorMessage).length > 0 && (
          <Snackbar open autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert variant="filled" severity={errorMessage.code} sx={{ width: '100%' }}>
              {errorMessage.msg}
            </Alert>
          </Snackbar>
        )}
        <Camera val={handleValue} />
        <p>Data: {value && value.code}</p>
      </Container>
    </>
  );
}
