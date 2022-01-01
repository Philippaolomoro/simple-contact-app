import { Paper, List, ListItem, ListItemText, Divider, Button, Grid, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import { fontWeight } from "@mui/system";
import PropTypes from "prop-types";
import { Fragment } from "react";
import { useQuery } from "react-query";
import { useStore } from "../store";
import DeleteModal from "./DeleteModal";

const styles ={
  paper: {
    margin: "24px",
    padding: "16px" 
  },
  heading: {
    fontSize: "1.5em",
    fontWeight:"700"
  }
}

const Contacts = ({ classes }) => {
  const contact = useQuery("/contacts");
  const store = useStore();
  const { isFetching, isFetched, error, data, } = contact;

  const handleOnDeleteContact = (editingId) => {
    store.updateStore("modal", {
      name: "deleteModal",
      data: {
        editingId,
      }
    });
  }

  const handleOnAddContact = () => {
    store.updateStore("modal", { name: "createContactModal" });
  }

  const handleOnUpdateContact = (contactId) => {
    store.updateStore("modal", {
      name: "createContactModal",
      data: { contactId }
    })
  }

  return (
    <Paper className={classes.paper}>
      <div className={classes.heading}>List of Contacts</div>

      <Button onClick={handleOnAddContact}>Add Contact</Button>

      { isFetching && <h1>Loading...</h1> }

      { isFetched && error && <h1>{data?.message || "Error occured" }</h1> }

      { isFetched && data?.contacts && (
        <List>
          {data?.contacts.map(({ _id, firstName, phoneNumber, lastName, email }) => (
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
                  </Grid>
                  <Grid item>
                    <Button onClick={handleOnDeleteContact.bind(null, _id)}>
                      Delete
                    </Button>
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  onClick={handleOnUpdateContact.bind(null, _id)}
                >
                  Edit
                </Button>             
              </ListItem>             
              <Divider component="li" />
              
            </Fragment>
          ))}
        </List>
      )}

    </Paper>
  );
}

Contacts.propTypes = {
  classes: PropTypes.object.isRequired
}


export default withStyles(styles)(Contacts);
