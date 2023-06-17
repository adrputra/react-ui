import { useState, useContext } from 'react';
// import { useCookies } from 'react-cookie';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { MetadataContext } from '../../../hooks/MetadataContext';

// ----------------------------------------------------------------------

export default function LoginForm() {

  const [userLogin, setUserLogin] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const { metadata, updateMetadata } = useContext(MetadataContext);

  const handleChange = (e) => {
    setUserLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/login', JSON.stringify(userLogin), {
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
        setErrorMessage(response.data.message.Description);
        console.log(errorMessage);
      }
    } catch (error) {
      setErrorMessage(`${error.code} - ${error.message}`);
      console.log(error);
    }

      console.log('Metadata', metadata);
  };

  // const handleLogin = () => {
  //   axios
  //     .post('http://localhost:5000/user/login', JSON.stringify(userLogin), {
  //       headers: { 'Content-Type': 'application/json' },
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       console.log('RES Login', response.data);
  //       if (response.data.code === 200) {
  //         // const userCookie = getCookie('session')
  //         // setCookie('user-session', userCookie);
  //         // console.log(cookies);
  //         const res = response.data.message.Result;

  //         updateMetadata({
  //           userId: res[0].user_id,
  //           shortName: res[0].short_name,
  //           branchCode: res[0].branch_code,
  //           levelId: res[0].level_id,
  //         });
          
  //         navigate('/dashboard', { replace: true });
  //       } else {
  //         setErrorMessage(response.data.message.Description);
  //         console.log(errorMessage);
  //       }
  //     })
  //     .catch((error) => {
  //       setErrorMessage(`${error.code} - ${error.message}`);
  //       console.log(error);
  //     });

  //     console.log('Metadata', metadata);
  // };

  return (
    <>
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
          {' '}
          Remember Me{' '}
        </Checkbox>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleLogin}>
        Login
      </LoadingButton>
      {errorMessage ?? <h2 style={{ textAlign: 'center', color: 'red' }}>{errorMessage}</h2>}
    </>
  );
}
