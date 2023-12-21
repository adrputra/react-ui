import { useState, useContext } from 'react';
// import { useCookies } from 'react-cookie';
import axios from 'axios';
// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
  Snackbar,
  Alert,
  FormControlLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Cookies from "js-cookie"
import Iconify from '../../../components/iconify';
import { MetadataContext } from '../../../hooks/MetadataContext';
import { EncryptData, GetMetadata } from '../../../utils/Enigma';


const { REACT_APP_LOGIN_API, JWT_SECRET, ENCRYPTION_SECRET } = process.env;
// ----------------------------------------------------------------------

export default function LoginForm() {
  const [userLogin, setUserLogin] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const { metadata, updateMetadata } = useContext(MetadataContext);

  const handleChange = (e) => {
    setUserLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault()
    sessionStorage.removeItem('metadata');

    const encryptedRequest =  EncryptData(userLogin, ENCRYPTION_SECRET)
    const req = {
      request: encryptedRequest
    }
    console.log(req);
    try {
      const response = await axios.post(REACT_APP_LOGIN_API, JSON.stringify(req), {
        headers: { 'Content-Type': 'application/json' },
      });

      
      console.info('RES Login', response);
      
      if (response.data.code === 200) {
        const { decryptedRes, decodedRes } = GetMetadata(response.data.message.token, JWT_SECRET, ENCRYPTION_SECRET)

        const timeUntilExpiration = (new Date((decodedRes.exp + 7 * 60 * 60) * 1000))

        Cookies.set('session', response.data.message.token, { expires: timeUntilExpiration })

        updateMetadata({
          user_id: decryptedRes.user_id,
          short_name: decryptedRes.short_name,
          branchCode: decryptedRes.branch_code,
          level_id: decryptedRes.level_id,
        });

        window.location.reload();
      } else {
        setErrorMessage({ msg: response.data.message.Description, code: 'error' });
        console.error(errorMessage);
      }
    } catch (error) {
      setErrorMessage({ msg: `${error.code} - ${error.message}`, code: 'error' });
      console.error(error);
    } finally {
      setTimeout(() => {
        setErrorMessage({});
      }, 5000);
    }

    console.info('Metadata', metadata);
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
      <form onSubmit={handleLogin}>
        <Stack spacing={3}>
          <TextField name="user_id" label="Email address" onChange={handleChange} />

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
          <FormControlLabel control={<Checkbox />} sx={{ ml: 1 }} label="Remember Me" />
          <Link variant="subtitle2" underline="hover">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleLogin}>
          Login
        </LoadingButton>
      </form>
    </>
  );
}
