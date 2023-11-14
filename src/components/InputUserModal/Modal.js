import { useState, useContext, useEffect } from 'react';
import {
  Modal,
  Typography,
  Button,
  TextField,
  Stack,
  Container,
  Select,
  MenuItem,
  InputLabel,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import Iconify from '../iconify';
import { MetadataContext } from '../../hooks/MetadataContext';
import { SendRequest } from '../../utils/Enigma'

const { REACT_APP_ADD_INVITATION } = process.env;

const modalContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '16px',
  borderRadius: '4px',
  outline: 'none',
};

const modalTitleStyle = {
  marginBottom: '8px',
};

const modalButtonStyle = {
  marginLeft: '8px',
};

export default function InputUserModal({ open, isError, onClose, InquiryUserList, initialData }) {
  const [userData, setUserData] = useState({});
  const { metadata } = useContext(MetadataContext);

  console.log('User Initial Data', initialData);

  useEffect(() => {
    if (initialData) {
      setUserData(initialData);
    }
  }, [initialData]);

  const handleInvitationData = (e) => {
    const act = initialData ? 'c' : 'a';
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value, userId: metadata.userId, act }));
  };

  const handlePhoneNumber = (event) => {
    const inputValue = event.target.value;
    // Remove any non-numeric characters using a regular expression
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    // Update the input value with the sanitized numeric value

    handleInvitationData({ target: { name: 'phone_number', value: numericValue } });
  }

  const addUser = async () => {
    console.info('REQ Add User', userData);
    try {
      const response = await SendRequest(REACT_APP_ADD_INVITATION, userData);

      console.info('RES Add User', response.data);

      if (response.data.code === 200) {
        isError({ msg: response.data.message.Description, code: 'success' });
      } else {
        isError({ msg: response.data.message.Description, code: 'error' });
        console.error(response.data.message.Description);
      }
    } catch (error) {
      isError({ msg: `${error.code} - ${error.message}`, code: 'error' });
      console.error(error);
    } finally {
      setUserData({});

      onClose();
      InquiryUserList();
    }

    console.log('Metadata', metadata);
  };

  return (
    <>
      <Modal open={open} onClose={onClose} style={modalContainerStyle}>
        <Container maxWidth="sm">
          <div style={modalContentStyle}>
            <Stack
              direction="column"
              justifyContent="space-evenly"
              spacing={3}
              divider={<Divider orientation="horizontal" flexItem />}
              sx={{ ml: 3 }}
            >
              <Typography variant="h3" style={modalTitleStyle}>
                {initialData ? 'Change User Data' : 'Create New User'}
              </Typography>
              <Stack direction="column" spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Iconify icon={'ic:round-person-add-alt-1'} width={50} sx={{ color: 'primary.main' }} />
                  <TextField
                    name="name"
                    label="Guest Name"
                    value={userData.name || ''}
                    onChange={handleInvitationData}
                  />
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Iconify icon={'basil:phone-solid'} width={50} sx={{ color: 'primary.main' }} />
                  <TextField
                    name="phone_number"
                    label="Phone Number"
                    value={userData.phone_number || ''}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={handlePhoneNumber}
                  />
                </Stack>
              </Stack>

              <Stack direction="row" spacing={3} justifyContent="flex-start">
                <div>
                  <InputLabel id="level-label">Level</InputLabel>
                  <Select
                    labelId="level-label"
                    style={{ width: '200px' }}
                    id="level"
                    name="level"
                    value={userData.level || 'Reguler'}
                    label="Level"
                    onChange={handleInvitationData}
                  >
                    <MenuItem value={'Reguler'}>Reguler</MenuItem>
                    <MenuItem value={'VIP'}>VIP</MenuItem>
                    <MenuItem value={'VVIP'}>VVIP</MenuItem>
                  </Select>
                </div>

                <div>
                  <InputLabel id="pax-label">Number Of PAX</InputLabel>
                  <Select
                    labelId="pax-label"
                    style={{ width: '100px' }}
                    id="pax"
                    name="pax"
                    value={userData.pax || 1}
                    label="pax"
                    onChange={handleInvitationData}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                  </Select>
                </div>
              </Stack>
              <Stack direction="row" spacing={3}>
                <Button variant="contained" color="error" style={modalButtonStyle} onClick={onClose}>
                  Close
                </Button>
                <Button variant="contained" color="primary" style={modalButtonStyle} onClick={addUser}>
                  Submit
                </Button>
              </Stack>
            </Stack>
          </div>
        </Container>
      </Modal>
    </>
  );
}
