import { useState, useContext } from 'react';
// import { useCookies } from 'react-cookie';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Snackbar, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { MetadataContext } from '../../../hooks/MetadataContext';

const { REACT_APP_LOGIN_API } = process.env;
// ----------------------------------------------------------------------

export default function LoginForm() {
  const [userLogin, setUserLogin] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const { metadata, updateMetadata } = useContext(MetadataContext);

  const handleChange = (e) => {
    setUserLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(REACT_APP_LOGIN_API, JSON.stringify(userLogin), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      console.log('RES Login', response.data);

      if (response.data.code === 200) {
        const res = response.data.message.Result;

        updateMetadata({
          userId: res[0].user_id,
          shortName: res[0].short_name,
          branchCode: res[0].branch_code,
          levelId: res[0].level_id,
        });

        window.location.reload();
      } else {
        setErrorMessage({ msg: response.data.message.Description, code: 'error' });
        console.log(errorMessage);
      }
    } catch (error) {
      setErrorMessage({ msg: `${error.code} - ${error.message}`, code: 'error' });
      console.log(error);
    } finally {
      setTimeout(() => {
        setErrorMessage({});
      }, 5000);
    }

    console.log('Metadata', metadata);
  };

  return (
    <>
      {Object.keys(errorMessage).length > 0 && (
        <Snackbar open autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert variant="filled" severity={errorMessage.code} sx={{ width: '100%' }}>
            {errorMessage.msg}
          </Alert>
        </Snackbar>
      )}
      <Stack spacing={3}>
        <TextField name="userId" label="Email address" onChange={handleChange} />

        <TextField
          name="password"
          label="Password"
          onChange={handleChange}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me">
          Remember Me{' '}
        </Checkbox>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleLogin}>
        Login
      </LoadingButton>
    </>
  );
}
