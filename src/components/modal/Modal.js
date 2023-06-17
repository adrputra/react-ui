import React from 'react';
import { Modal, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    outline: 'none',
  },
  modalTitle: {
    marginBottom: theme.spacing(2),
  },
  modalButton: {
    marginLeft: theme.spacing(2),
  },
}));

export default function InputModal({ open, onClose }) {
  const classes = useStyles();

  return (
    <Modal open={open} onClose={onClose} className={classes.modalContainer}>
      <div className={classes.modalContent}>
        <Typography variant="h5" className={classes.modalTitle}>
          Modal Title
        </Typography>
        <Typography variant="body1">This is the content of the modal.</Typography>
        <Button variant="contained" color="primary" className={classes.modalButton} onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}