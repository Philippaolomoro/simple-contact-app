import React, { Fragment } from 'react';
import { Box, Button, Modal, List, ListItem, Typography, Divider, Grid } from '@mui/material';
import { useQuery } from "react-query";
// import sweetalert from "sweetalert";
import { useStore } from '../store';
import apiClient from "../http-common";
import { queryClient } from ".."

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

export default function ContactHistoryModal(){

  const handleClose = () => {
    updateStore("modal", {
      name: null,
    });
  }
  const { updateStore, modal } = useStore();

  const contactHistory = useQuery(`/contacts/${modal.data.contactId}/history`, {
    enabled: Boolean(modal.data.contactId),
  });

  const { isFetching, isFetched, error, data } = contactHistory

  return (
    <div>
      <Modal
        open={modal.name === "contactHistoryModal"}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.theme}>
          <Button onClick={handleClose}>X</Button>
          { isFetching && <h1>Loading...</h1> }

          { isFetched && error && <h1>{data?.message || "Error occured" }</h1> }

          { isFetched && data?.history && (
            <List>
              {data?.history.map(({ _id, firstName, phoneNumber, lastName, email, updated_at_date, updated_at_time }) => (
                <Fragment key={_id}>
                  <ListItem>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          {firstName} {lastName}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {phoneNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date updated: {updated_at_date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Time updated: {updated_at_time}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>             
                  <Divider component="li" />              
                </Fragment>
              ))}
            </List>
          )}
        </Box>
      </Modal>
    </div>
  );
}