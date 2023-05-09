import { React, useState } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";

const AddPatientScreen = () => {
  const [patient, setPatient] = useState({
    name: "",
    address: "",
    doctor_id: 0,
    age: 0,
    gender: "",
    analysed: false,
    url: "",
  });

  const submit = (e) => {
    e.preventDefault();
    console.log(patient);
    axios
      .post("http://localhost:8000/patient", patient)
      .then((res) => {
        console.log(res.data);
        alert("Database updated!!!");
      })
      .catch((err) => {
        alert("OOPS SOMETHING WENT WRONG", err);
      });
  };

  const handleOnChange = (e) => {
    console.log(e.target.name, " ", e.target.value);
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  return (
    <Container>
      <Container className='ps-0 py-3 m-0' as='h1'>
        Add Patient
      </Container>
      <Form
        onSubmit={(e) => {
          submit(e);
        }}
      >
        <Form.Group className='mb-3' htmlFor='patient_id'>
          <Form.Label>Patient ID</Form.Label>
          <Form.Control
            id='patientId'
            placeholder='Patient ID'
            name='patient_id'
            onChange={(e) => handleOnChange(e)}
          />
        </Form.Group>
        <Form.Group className='mb-3' htmlFor='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            id='name'
            name='name'
            placeholder='Name'
            onChange={(e) => handleOnChange(e)}
          />
        </Form.Group>
        <Form.Group className='mb-3' htmlFor='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            required
            id='address'
            name='address'
            placeholder='Address'
            onChange={(e) => handleOnChange(e)}
          />
        </Form.Group>
        <Form.Group className='mb-3' htmlFor='doctorId'>
          <Form.Label>Doctor ID</Form.Label>
          <Form.Control
            required
            id='doctorId'
            name='doctor_id'
            placeholder='Doctor ID'
            onChange={(e) => handleOnChange(e)}
          />
        </Form.Group>
        <Form.Group className='mb-3' htmlFor='age'>
          <Form.Label>Age</Form.Label>
          <Form.Control
            required
            id='age'
            name='age'
            placeholder='Age'
            onChange={(e) => handleOnChange(e)}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Gender</Form.Label>
          <Form.Select
            required
            name='gender'
            onChange={(e) => handleOnChange(e)}
          >
            <option></option>
            <option>Male</option>
            <option>Female</option>
          </Form.Select>
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default AddPatientScreen;
