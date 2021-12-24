import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import ContactForm from './ContactForm';
import { useStore } from '../store';


const style = {
  box:{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    background: 'white',
    bgcolor: 'background',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
  button:{
    margin: "30px"
  }
};

export default function ContactFormModal() {
  const { formModal, updateStore } = useStore();

  const handleOpen = () => updateStore("formModal", {
    open: true,
  });

  const handleClose = () => updateStore("formModal", {
    open: false,
  });

  return (
    <div>
      <Button 
        sx={style.button}
        variant="contained"
        color="primary"
        size="large"
        onClick={handleOpen}
      >Add Contacts</Button>
      <Modal
        open={formModal.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.box}>
          <Button           
            variant="contained"
            color="primary"
            size="large"
            onClick={handleClose}
          >X</Button>
          <ContactForm/>
        </Box>
      </Modal>
    </div>
  );
}
