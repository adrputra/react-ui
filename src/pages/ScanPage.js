import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Snackbar, Alert } from '@mui/material';
import Camera from '../components/mobileCamera';
import { SendRequest } from '../utils/Enigma';

const { REACT_APP_ADD_INVITATION } = process.env;

export default function ScanPage() {
  const [value, setValue] = useState();
  const [invitationData, setInvitationData] = useState();
  const [errorMessage, setErrorMessage] = useState({});

  const handleValue = (val) => {
      setValue(val);
      setInvitationData({act : 'c', code: val.code, name: val.name, user_id: val.user_id, level: val.level, pax: val.pax, phone_number: val.phone_number, status: 'Attended'});
  };

  useEffect(() => {
    if (invitationData !== undefined) {
        updateInvitation();
    }
  }, [invitationData]);

  const updateInvitation = async () => {
    console.info('REQ Scan Invitation', invitationData);
    try {
      const response = await SendRequest(REACT_APP_ADD_INVITATION, invitationData);

      console.info('RES Scan Invitation', response.data);

      if (response.data.code === 200) {
        setErrorMessage({ msg: response.data.message.Description, code: 'success' });
      } else {
        setErrorMessage({ msg: response.data.message.Description, code: 'error' });
        console.error(response.data.message.Description);
      }
    } catch (error) {
      setErrorMessage({ msg: `${error.code} - ${error.message}`, code: 'error' });
      console.error(error);
    } finally {
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
        <p>SCAN {value && value.name}</p>
      </Container>
    </>
  );
}
