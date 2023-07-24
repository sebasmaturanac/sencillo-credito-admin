import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const ProtectedPage = ({ roles, element }) => {
  if (!sessionStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  const role = sessionStorage.getItem("role");

  if (roles.length && !roles.includes(role)) {
    return <Navigate to="/dashboard/home" />;
  }

  return element;
};

ProtectedPage.defaultProps = {
  roles: [],
};

ProtectedPage.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
  element: PropTypes.node.isRequired,
};

export default ProtectedPage;
