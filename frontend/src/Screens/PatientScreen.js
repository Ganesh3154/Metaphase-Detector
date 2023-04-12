import { React, useEffect, useState, useRef } from "react";
import { Container } from "react-bootstrap";
// import patients from "../patients.js";
import DataTable from "../components/DataTable";
import axios from "axios";

const PatientScreen = () => {
  let data;
  const [patients, setPatient] = useState([]);
  const [column, setColumn] = useState([]);
  const mountedRef = useRef(false);

  const getData = () => {
    axios.get("http://localhost:8000/patient").then((res) => {
      data = res.data;
      setTimeout(setPatient(...patients, data), 1000, true);
    });
  };

  useEffect(() => {
    if (mountedRef.current) {
      console.log("trick: changed");
      console.log(patients);
      setColumn(Object.keys(patients[0]));
    }
  }, [patients]);

  useEffect(() => {
    mountedRef.current = true;
    getData();
  }, []);

  // filterData();
  return (
    <>
      <Container className='px-5 py-2' fluid>
        <h1 className='py-3'>Patients</h1>
      </Container>
      <DataTable column={column} items={patients} />
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
