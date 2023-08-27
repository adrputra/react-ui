import { useState, useContext } from 'react';
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
import axios from 'axios';
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

export default function InputModal({ open, onClose, InquiryInvitationList }) {
  const [invitationData, setInvitationData] = useState({ level: 'Reguler', pax: 1 });
  const [errorMessage, setErrorMessage] = useState({});
  const { metadata } = useContext(MetadataContext);

  const handleInvitationData = (e) => {
    setInvitationData((prev) => ({ ...prev, [e.target.name]: e.target.value, userId: metadata.userId }));
  };

  const addInvitation = async () => {
    console.info('REQ Add Invitation', invitationData);
    const postman = SendRequest(REACT_APP_ADD_INVITATION)
    try {
      const response = await postman.post('', JSON.stringify(invitationData));

      console.info('RES Add Invitation', response.data);

      if (response.data.code === 200) {
        setErrorMessage({ msg: response.data.message.Description, code: 'success' });
      } else {
        setErrorMessage({ msg: response.data.message.Description, code: 'error' });
        console.error(errorMessage);
      }
    } catch (error) {
      setErrorMessage({ msg: `${error.code} - ${error.message}`, code: 'error' });
      console.error(error);
    } finally {
      setInvitationData({ level: 'Reguler', pax: 1 });
      console.log(invitationData);
      console.log(errorMessage);
      setTimeout(() => {
        setErrorMessage({});
      }, 5000);

      onClose();
      InquiryInvitationList();
      // window.location.reload();
    }

    console.log('Metadata', metadata);
  };

  return (
    <>
      {Object.keys(errorMessage).length > 0 && (
        <Snackbar open autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert variant="filled" severity={errorMessage.code} sx={{ width: '100%' }}>
            {errorMessage.msg}
          </Alert>
        </Snackbar>
      )}
      <Modal open={open} onClose={onClose} style={modalContainerStyle}>
        <Container maxWidth="xl">
          <div style={modalContentStyle}>
            <Stack
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
              spacing={5}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Typography variant="h5" style={modalTitleStyle}>
                Create Invitation
              </Typography>
              <Stack direction="column" spacing={3}>
                {/* <Typography variant="body1">Guest Name</Typography> */}
                <TextField fullWidth name="name" label="Guest Name" onChange={handleInvitationData} />
                <div>
                  <InputLabel id="level-label">Level</InputLabel>
                  <Select
                    labelId="level-label"
                    id="level"
                    name="level"
                    value={invitationData.level}
                    label="Level"
                    onChange={handleInvitationData}
                  >
                    <MenuItem value={'Reguler'}>Reguler</MenuItem>
                    <MenuItem value={'VIP'}>VIP</MenuItem>
                    <MenuItem value={'VVIP'}>VVIP</MenuItem>
                  </Select>
                </div>
              </Stack>

              <Stack direction="column" spacing={3}>
                {/* <Typography variant="body1">Phone Number</Typography> */}
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  onChange={handleInvitationData}
                />

                {/* <Typography variant="body1">Number Of PAX</Typography> */}
                <div>
                  <InputLabel id="pax-label">Number Of PAX</InputLabel>
                  <Select
                    labelId="pax-label"
                    id="pax"
                    name="pax"
                    value={invitationData.pax}
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
              <Stack direction="column" spacing={3}>
                <Button variant="contained" color="primary" style={modalButtonStyle} onClick={addInvitation}>
                  Submit
                </Button>
                <Button variant="contained" color="error" style={modalButtonStyle} onClick={onClose}>
                  Close
                </Button>
              </Stack>
            </Stack>
          </div>
        </Container>
      </Modal>
    </>
  );
}
