import React from "react";
import { Helmet } from "react-helmet";

const MetaData = ({ title, description }) => {
  return (
    <Helmet>
      <title>{`${title} - ClickToBuy`}</title>
      <description>{description}</description>
    </Helmet>
  );
};

export default MetaData;
