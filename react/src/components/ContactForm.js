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
  const createMutation = useMutation((data) => {
    return apiClient.post("/contacts", data);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts"]);
    },
    onMutate: (data) => data,
  });

  const updateMutation = useMutation(({ contactId, ...data }) => {
    return apiClient.put(`/contacts/${contactId}`, data);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts"]);
    },
    onMutate: (data) => data,
  });


  const { updateStore, contact: {
    editingId: contactId
  }} = useStore();

  const { data } = useQuery(`/contacts/${contactId}`, {
    enabled: Boolean(contactId),
  });

  const handleCreateContact = useCallback(({
    phoneNumber,
    firstName,
    lastName,
    email,
  }, actions) => {
    try {
      createMutation.mutate({
        phoneNumber,
        firstName,
        lastName,
        email,
      });

      updateStore("formModal", {
        open: false,
      });
      actions.resetForm();
    } finally {
      actions.setSubmitting(false);
    }
  }, [createMutation]);

  const handleUpdateContact = useCallback(({
    phoneNumber,
    firstName,
    lastName,
    email,
  }, actions) => {
    try {
      updateMutation.mutate({
        phoneNumber,
        contactId,
        firstName,
        lastName,
        email,
      });

      updateStore("formModal", {
        open: false,
      });
      actions.resetForm();
    } finally {
      actions.setSubmitting(false);
    }
  }, [contactId, updateMutation])

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
