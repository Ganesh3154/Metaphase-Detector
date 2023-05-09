import React from "react";
import { Container } from "react-bootstrap";
import doctors from "../doctors.js";
import DataTable from "../components/DataTable";

const DoctorScreen = () => {
  const path = "doctor";

  // const column = Object.keys(doctors[0]);
  return (
    <>
      <Container className='px-5 py-2' fluid>
        <h1 className='py-3'>Doctors</h1>
      </Container>
      <DataTable path={path} />
    </>
  );
};

// const filterData = () => {
//   doctors.map((item) => {
//     Object.keys(item).forEach(() => {
//       delete item.description;
//     });
//   });
// };

export default DoctorScreen;
