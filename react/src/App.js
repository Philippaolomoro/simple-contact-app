import { AppBar, Container, Typography } from "@mui/material";
import Contacts from "./components/Contacts.js"
import ContactFormModal from "./components/ContactFormModal"
import DeleteModal from "./components/DeleteModal";
import ContactHistoryModal from "./components/ContactHistoryModal";

function App() {
  return (
    <div>
      <Container maxWidth="lg">
        <AppBar position="static" color="inherit">
          <Typography
          variant="h2"
          align="center">
            Contacts
          </Typography>
        </AppBar>
        <ContactFormModal/>
        <DeleteModal />
        <ContactHistoryModal />
        <Contacts />             
      </Container>
    </div>
  );
}

export default App;
