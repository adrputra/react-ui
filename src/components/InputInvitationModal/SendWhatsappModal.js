import {
    Modal,
    Typography,
    Button,
    Stack,
    Container,
    Divider,
} from '@mui/material';
import { useContext } from 'react';
import { MetadataContext } from '../../hooks/MetadataContext';
import { SendRequestExt } from '../../utils/Enigma'

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
const { REACT_APP_SEND_INVITATION } = process.env;

export default function SendWhatsappModal({ open, onClose, data, isError, InquiryInvitationList }) {
    const { metadata } = useContext(MetadataContext);

    console.log('SendWhatsappModal', REACT_APP_SEND_INVITATION, data);

    const sendInvitation = async () => {
        try {
            const request = {
                ...data,
                userId: metadata.userId,
            }
            const response = await SendRequestExt(REACT_APP_SEND_INVITATION, request);

            if (response.status === 200) {
                isError({ msg: response.data.message, code: 'success' });
            } else {
                isError({ msg: response.data.message, code: 'error' });
                console.error(response.data.message);
            }
        }
        catch (error) {
            isError({ msg: `${error.code} - ${error.response.data.message}`, code: 'error' });
            console.error(error);
        } finally {
            onClose();
            InquiryInvitationList();
        }
    }

    return (
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
                            Send Invitation to Whatsapp
                        </Typography>
                        <Typography>Are you sure you want to send this invitation to Whatsapp?</Typography>
                        <Stack direction="row" spacing={3}>
                            <Button variant="contained" color="error" style={modalButtonStyle} onClick={onClose}>
                                Close
                            </Button>
                            <Button variant="contained" color="primary" style={modalButtonStyle} onClick={sendInvitation}>
                                Send
                            </Button>
                        </Stack>
                    </Stack>
                </div>
            </Container>
        </Modal>
    )
}