import React from "react";
import PropTypes from "prop-types";

const VARIANT_CLASSES = {
  primary: "alert alert-primary",
  secondary: "alert alert-secondary",
  success: "alert alert-success",
  danger: "alert alert-danger",
  warning: "alert alert-warning",
  info: "alert alert-info",
  light: "alert alert-light",
  dark: "alert alert-dark",
};

export default function Alert({ variant = "info", message }) {
  if (!message) return null;

  return (
    <div className={VARIANT_CLASSES[variant]} role="alert">
      {message}
    </div>
  );
}

Alert.propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
  ]),
  message: PropTypes.string,
};
