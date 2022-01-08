import { Paper, List, ListItem, Divider, Button, Grid, Typography, Stack, Box, AppBar, Toolbar } from "@mui/material";
import { withStyles } from "@mui/styles";
import PropTypes from "prop-types";
import { Fragment } from "react";
import { useQuery } from "react-query";
import { useStore } from "../store";


const styles ={
  paper: {
    margin: "24px",
    padding: "16px" 
  },
  heading: {
    background: "white"
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
      <Box sx={{ flexGrow: 1}} >
        <AppBar position="static" sx={{background:"white"}}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color:"black" }}>
              List of Contacts
            </Typography>
            <Button 
              onClick={handleOnAddContact} 
              variant="contained" 
              size="large"
            >
              Add Contact
            </Button>
          </Toolbar>
        </AppBar>
        
      </Box>

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
                </Grid>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    onClick={handleOnUpdateContact.bind(null, _id)}
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={handleOnDeleteContact.bind(null, _id)} 
                    variant="outlined" 
                    color="error"
                  >
                    Delete
                  </Button>  
                  <Button 
                    variant="outlined" 
                    color="error"
                  >
                    History
                  </Button>    
                </Stack>                    
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
