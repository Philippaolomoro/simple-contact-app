import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useMutation } from "react-query";
import sweetalert from "sweetalert";
import { useStore } from '../store';
import apiClient from "../http-common";
import { queryClient } from "../"


const style = {
  theme: {
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
  const { updateStore, modal } = useStore();

  const deleteMutation = useMutation(({ contactId })=>{
    return apiClient.delete(`/contacts/${contactId}`);
  }, {
    onMutate: async (deleteContact) => {
     await queryClient.cancelQueries('/contacts')

     const previousContacts = queryClient.getQueryData('/contacts');

     return { previousContacts }
   },
   onError: (_error, _deleteContact, context) => {
     queryClient.setQueryData('/contacts', context.previousContacts);
   },
   onSettled: () => {
     queryClient.invalidateQueries('/contacts');
   },
  });

  const handleDelete = useCallback(async () => {
    try {
      await deleteMutation.mutate({ contactId: modal.data.editingId });
      sweetalert("Contact deleted successfully");
    } catch {
      sweetalert("Oops", "Failed to delete contact", "error");
    } finally {
      handleClose();
    }
  }, [modal.data])

  const handleClose = () => {
    updateStore("modal", {
      name: null,
    });
  }

  return (
    <div>
      <Modal
        open={modal.name === "deleteModal"}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.theme}>
          <h2>Are you sure you want to delete?</h2>
          <Button 
            onClick={handleDelete} 
            variant="outlined" 
            color="error"
          >
            Yes
          </Button>
          <Button onClick={handleClose}>No</Button>
        </Box>
      </Modal>
    </div>
  );
}
