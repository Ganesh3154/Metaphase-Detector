import React from "react";
import { Container } from "react-bootstrap";
import patients from "../patients.js";
import SearchTable from "../components/DataTable";

const PatientScreen = () => {
  filterData();
  const column = Object.keys(patients[0]);
  return (
    <>
      <Container className='px-5 py-2' fluid>
        <h1 className='py-3'>Patients</h1>
      </Container>
      <SearchTable column={column} items={patients} />
    </>
  );
};

const filterData = () => {
  patients.map((item) => {
    Object.keys(item).forEach(() => {
      delete item.description;
    });
  });
};

export default PatientScreen;
