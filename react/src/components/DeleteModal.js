import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useStore } from '../store';


const style = {
    theme:{
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
    
};

export default function DeleteModal() {
  const { deleteModal, updateStore } = useStore();

  const handleOpen = () => updateStore("deleteModal", {
    open: true,
  });

  const handleClose = () => updateStore("deleteModal", {
    open: false,
  });

  return (
    <div>
      <Button onClick={handleOpen}>Delete</Button>
      <Modal
        open={deleteModal.open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.theme}>
          <h2>Are you sure you want to delete?</h2>
          <Button>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </Box>
      </Modal>
    </div>
  );
}
