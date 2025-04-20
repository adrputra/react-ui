import { useState, useContext, useEffect } from 'react';
import {
  Modal,
  Typography,
  Button,
  TextField,
  Stack,
  Container,
  InputAdornment,
  IconButton,
  Divider,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Iconify from '../iconify';
import { MetadataContext } from '../../hooks/MetadataContext';
import { SendRequest } from '../../utils/Enigma'

const { REACT_APP_ADD_USER } = process.env;

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

export default function InputUserModal({ open, isError, onClose, InquiryUserList, initialData, isDelete }) {
  const [userData, setUserData] = useState({levelId : "1"});
  const [isMatchPassword, setIsMatchPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { metadata } = useContext(MetadataContext);

  console.log('Initial Data', initialData);
  console.log('User Data', userData);

  const deleteConfirmationDialog = () => {
    <Modal open={open} onClose={onClose} style={modalContainerStyle} />
  }

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (initialData) {
      if (isDelete) {
          setUserData({ ...initialData, act: 'd' });
        return deleteConfirmationDialog();
      }
      setUserData(initialData);
    }
  }, [initialData, isDelete]);

  const handleUserData = (e) => {
    const act = initialData ? 'c' : 'a';
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value, act }));
    if (e.target.name === 'password') {
      setIsMatchPassword(e.target.value === confirmPassword);
    }

  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    console.log(userData.password, confirmPassword);
    setIsMatchPassword(e.target.value === userData.password);
  };

  const addUser = async () => {
    console.info(userData.act === 'c' ? 'REQ Change User' : 'REQ Add User', userData);
    try {
      const response = await SendRequest(REACT_APP_ADD_USER, userData);

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
      <Modal open={open && !isDelete} onClose={onClose} style={modalContainerStyle}>
        <Container maxWidth="md">
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
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="column" spacing={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon={'bxs:id-card'} width={50} sx={{ color: 'primary.main' }} />
                    <TextField
                      id='userId'
                      name="userId"
                      label="Username"
                      value={userData.userId || ''}
                      onChange={handleUserData}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon={'ic:round-person-add-alt-1'} width={50} sx={{ color: 'primary.main' }} />
                    <TextField
                      id='fullName'
                      name="fullName"
                      label="Full Name"
                      value={userData.fullName || ''}
                      onChange={handleUserData}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon={'ic:round-person-add-alt-1'} width={50} sx={{ color: 'primary.main' }} />
                    <TextField
                      id='shortName'
                      name="shortName"
                      label="Short Name"
                      value={userData.shortName || ''}
                      onChange={handleUserData}
                    />
                  </Stack>
                </Stack>
                <Stack direction="column" spacing={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon={'eos-icons:admin'} width={50} sx={{ color: 'primary.main' }} />
                    <Stack direction="column">
                      <Select
                        labelId="level-label"
                        style={{ width: '200px' }}
                        id="levelId"
                        name="levelId"
                        value={userData.levelId || '1'}
                        label="Level"
                        onChange={handleUserData}
                      >
                        <MenuItem value={'1'}>User</MenuItem>
                        <MenuItem value={'0'}>Admin</MenuItem>
                      </Select>
                      {/* <FormHelperText>&nbsp; Account Level</FormHelperText> */}
                    </Stack>
                  </Stack>
                  
                  {!initialData && 
                    <><Stack direction="row" spacing={2} alignItems="center">
                      <Iconify icon={'mdi:password-check'} width={50} sx={{ color: 'primary.main' }} />
                      <TextField
                        id='password'
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={userData.password || ''}
                        onChange={handleUserData}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }} />
                    </Stack><Stack direction="row" spacing={2} alignItems="center">
                        <Iconify icon={'mdi:password-check'} width={50} sx={{ color: 'primary.main' }} />
                        <Stack direction="column">
                          <TextField
                            id='confirmPassword'
                            name="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword || ''}
                            onChange={handleConfirmPassword}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                    <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }} />
                          {!isMatchPassword && (
                            <FormHelperText style={{ color: 'red' }}>
                              &nbsp; Password do not match
                            </FormHelperText>
                          )}
                        </Stack>
                      </Stack></>
                  }
                </Stack>
              </Stack>

              <Stack direction="row" spacing={3}>
                <Button variant="contained" color="error" style={modalButtonStyle} onClick={onClose}>
                  Close
                </Button>
                <Button variant="contained" color="primary" style={modalButtonStyle} onClick={addUser} disabled={!isMatchPassword}>
                  Submit
                </Button>
              </Stack>
            </Stack>
          </div>
        </Container>
      </Modal>

      <Modal open={isDelete} onClose={onClose} style={modalContainerStyle}>
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
              Delete User
            </Typography>
            <Typography>Are you sure you want to delete this user?</Typography>
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
