import { useState } from 'react';
import {
  Container,
  Typography,
  Divider,
  Stack,
  Button,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import useResponsive from '../hooks/useResponsive';
import Logo from '../components/logo';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function PaymentPage() {
  const mdUp = useResponsive('up', 'md');
  const [req, setReq] = useState({});
  const [plan, setPlan] = useState('bronze');
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});
  const [loading, setLoading] = useState(false);

  const renderPrice = () => {
    if (plan === 'bronze') {
      return 150000;
    }
    if (plan === 'silver') {
      return 1000;
    }
    return 600000;
  };

  const formatterPrice = (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReq((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (event) => {
    const { name, value } = event.target;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === 'email' && !emailRegex.test(value)) {
      setError('Please enter a valid email address');
      return;
    }
    setReq((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handlePhoneNumber = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    setReq((prev) => ({ ...prev, phone_number: numericValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const request = {
      ...req,
      amount: renderPrice(),
      plan,
    };

    console.log(request);

    try {
      const response = await axios.post('https://ravenclaw.eventarry.com/payment', request);

      console.info('RES Payment', response.data);

      if (response.data.code === 200) {
        window.location.href = response.data.data.paymentUrl;
      } else {
        handleErrorMessage({ msg: response.data.message, code: 'error' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleErrorMessage = (error) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage({});
    }, 5000);
  };

  const isFormValid = !error && req.email && req.phone_number && req.name;

  return (
    <>
      {Object.keys(errorMessage).length > 0 && (
        <Snackbar open autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert variant="filled" severity={errorMessage.code} sx={{ width: '100%' }}>
            {errorMessage.msg}
          </Alert>
        </Snackbar>
      )}
      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome
            </Typography>
            <img src="assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Start your new Experience
            </Typography>

            <Typography variant="body2">
              Please fill your details {''}
              {/* <Link variant="subtitle2">Get started</Link> */}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3} mb={2}>
                <TextField name="name" label="Name" size="small" onChange={handleChange} />
                <TextField name="email" label="Email" size="small" onChange={handleEmailChange} helperText={error} />
                <TextField name="phoneNumber" label="Phone Number" size="small" onChange={handlePhoneNumber} />
                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-standard-label">Select Plan</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                  >
                    <MenuItem value={'bronze'}>Bronze Plan</MenuItem>
                    <MenuItem value={'silver'}>Silver Plan</MenuItem>
                    <MenuItem value={'gold'}>Gold Plan</MenuItem>
                  </Select>
                </FormControl>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h5" fontWeight={'bold'}>
                    Total Payment :{' '}
                  </Typography>

                  <Typography variant="h5" fontWeight={'bold'}>
                    Rp {formatterPrice(renderPrice())},00
                  </Typography>
                  <Tooltip title="The currently available payment method is QRIS. The detail about your transaction information will be sent to your email.">
                    <IconButton>
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
              <Stack spacing={3}>
                <FormControlLabel
                  control={<Checkbox inputProps={{ 'aria-label': 'controlled' }} />}
                  label="I Agree to terms and conditions"
                  required
                />
                <Box display={'flex'} justifyContent={'flex-end'}>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    type="submit"
                    justifyContent={'flex-end'}
                    loading={loading}
                    disabled={!isFormValid}
                  >
                    Submit
                  </LoadingButton>
                </Box>
              </Stack>
            </Box>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
