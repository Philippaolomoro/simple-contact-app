import { Button, TextField } from "@mui/material";
import { withStyles } from "@mui/styles";
import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useStore } from "../store";
import apiClient from "../http-common";

const styles ={
  root: {
    '& .MuiTextField-root': { margin: "8px", },
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  submitButton: {
    width: "50%"
  }
}

const ContactForm = ({ classes }) => {
  const queryClient = useQueryClient();
  const { updateStore, modal } = useStore();

  const createMutation = useMutation((data) => {
    return apiClient.post("/contacts", data);
  }, {
    onMutate: async (createContact) => {
      await queryClient.cancelQueries('/contacts')

      const previousContacts = queryClient.getQueryData('/contacts');
  
      queryClient.setQueryData('/contacts', old => [...old.contacts, createContact]);
  
      return { previousContacts }
    },
    onError: (_error, _createContact, context) => {
      queryClient.setQueryData('/contacts', context.previousContacts);
    },
    onSettled: () => {
      queryClient.invalidateQueries('/contacts');
    },
  });

  const updateMutation = useMutation(({ contactId, ...data }) => {
    return apiClient.put(`/contacts/${contactId}`, data);
  }, {
    onMutate: async (updateContact) => {
      await queryClient.cancelQueries('/contacts')

      const previousContacts = queryClient.getQueryData('/contacts');
  
      queryClient.setQueryData('/contacts', old => [...old.contacts, updateContact]);
  
      return { previousContacts }
    },
    onError: (_error, updateContact, context) => {
      queryClient.setQueryData('/contacts', context.previousContacts);
    },
    onSettled: () => {
      queryClient.invalidateQueries('/contacts');
    },
  });

  const { data } = useQuery(`/contacts/${modal.data.contactId}`, {
    enabled: Boolean(modal.data.contactId),
  });

  const handleCreateContact = useCallback(async ({
    phoneNumber,
    firstName,
    lastName,
    email,
  }, actions) => {
    try {
      await createMutation.mutate({
        phoneNumber,
        firstName,
        lastName,
        email,
      });

      updateStore("modal", {
        name: null,
      });
      actions.resetForm();
    } finally {
      actions.setSubmitting(false);
    }
  }, [createMutation]);

  const handleUpdateContact = useCallback(async ({
    phoneNumber,
    firstName,
    lastName,
    email,
  }, actions) => {
    const { contactId } = modal.data;

    try {
      await updateMutation.mutate({
        phoneNumber,
        contactId,
        firstName,
        lastName,
        email,
      });

      updateStore("modal", {
        name: null,
      });
      actions.resetForm();
    } finally {
      actions.setSubmitting(false);
    }
  }, [modal.data, updateMutation])

  const initialValues = useMemo(() => {
    return [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
    ].reduce((values, key) => ({
      ...values,
      [key]: data?.contact?.[key] ?? "",
    }), {})
  }, [data?.contact]);

  return (
    <Formik
      enableReinitialize
      onSubmit={
        !Boolean(data?.contact)
          ? handleCreateContact
          : handleUpdateContact
      }
      initialValues={initialValues}
      validationSchema={Yup.object({
        firstName: Yup.string().required(),
        lastName: Yup.string().required(),
        email: Yup.string().email().required(),
        phoneNumber: Yup.string().min(10).max(16).required(),
      })}
    >
      {({ handleSubmit, handleChange, handleBlur, handleReset, values, isSubmitting }) => (
        <form className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit} >
          <TextField
            name="firstName"
            variant="outlined"
            label="First Name"
            fullWidth
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <ErrorMessage name="firstName" component="p" />

          <TextField
            name="lastName"
            variant="outlined"
            label="Last Name"
            fullWidth
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <ErrorMessage name="lastName" component="p" />

          <TextField
            name="email"
            variant="outlined"
            label="Email"
            fullWidth
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <ErrorMessage name="email" component="p" />
          <TextField
            name="phoneNumber"
            variant="outlined"
            label="Phone Number"
            fullWidth
            value={values.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <ErrorMessage name="phoneNumber" component="p" />
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            className={classes.submitButton}
            disabled={isSubmitting}
          >
            {!Boolean(data?.contact) ? "Create" : "Update" }
          </Button>

          {Boolean(data?.contact) && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="reset"
              onClick={() => {
                handleReset();
                updateStore("contact", {
                  editingId: null,
                });
                updateStore("formModal", { open: false });
              }}
              className={classes.submitButton}
            >
              Reset
            </Button>
          )}
          
        </form>
      )}
    </Formik>
  );
}

ContactForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ContactForm);
