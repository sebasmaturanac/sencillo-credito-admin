import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const PublicPage = ({ element }) => {
  if (sessionStorage.getItem("token")) {
    return <Navigate to="/dashboard/home" />;
  }

  return element;
};

PublicPage.propTypes = {
  element: PropTypes.node.isRequired,
};

export default PublicPage;
