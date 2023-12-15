import { useState, useContext } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, Snackbar, Alert } from '@mui/material';
// mocks_
import account from '../../../_mock/account';
import { MetadataContext } from '../../../hooks/MetadataContext';
import { SendRequest } from '../../../utils/Enigma';

const { REACT_APP_LOGOUT_API } = process.env;

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});
  const { metadata } = useContext(MetadataContext);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const req = {
    sessionId: metadata.sessionId,
  };

  const handleLogout = async () => {
    console.log('REQ Logout', req);

    try {
      const response = await SendRequest(REACT_APP_LOGOUT_API, req);

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
      document.cookie = `session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
      console.log(errorMessage);
      setTimeout(() => {
        setErrorMessage({});
      }, 5000);
    }
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
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {metadata.short_name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {metadata.user_id}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
