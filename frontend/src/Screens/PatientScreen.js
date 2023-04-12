import { React, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
// import patients from "../patients.js";
import DataTable from "../components/DataTable";
import axios from "axios";

const PatientScreen = () => {
  const path = "patient";

  // filterData();
  return (
    <>
      <Container className='px-5 py-2' fluid>
        <h1 className='py-3'>Patients</h1>
      </Container>
      <DataTable path={path} />
    </>
  );
};

// const filterData = () => {
//   patients.map((item) => {
//     Object.keys(item).forEach(() => {
//       delete item.description;
//     });
//   });
// };

export default PatientScreen;
