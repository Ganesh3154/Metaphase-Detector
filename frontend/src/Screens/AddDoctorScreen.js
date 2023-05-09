import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";

const AddDoctorScreen = () => {
  const [doctor, setDoctor] = useState({});

  const submit = (e) => {
    e.preventDefault();
    console.log(doctor);
    axios
      .post("http://localhost:8000/doctor", doctor)
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
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  return (
    <Container>
      <Container className='ps-0 py-3 m-0' as='h1'>
        Add Doctor
      </Container>
      <Form
        onSubmit={(e) => {
          submit(e);
        }}
      >
        <Form.Group className='mb-3' htmlFor='patient_id'>
          <Form.Label>Doctor ID</Form.Label>
          <Form.Control
            id='doctorId'
            placeholder='Doctor ID'
            name='doctor_id'
            onChange={(e) => handleOnChange(e)}
          />
        </Form.Group>
        <Form.Group className='mb-3' htmlFor='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            id='name'
            placeholder='Name'
            name='name'
            onChange={(e) => handleOnChange(e)}
          />
        </Form.Group>
        <Form.Group className='mb-3' htmlFor='hospital'>
          <Form.Label>Hospital</Form.Label>
          <Form.Control
            id='hospital'
            placeholder='Hospital'
            name='hospital'
            onChange={(e) => handleOnChange(e)}
          />
        </Form.Group>
        <Form.Group className='mb-3' htmlFor='department'>
          <Form.Label>Department</Form.Label>
          <Form.Control
            id='department'
            placeholder='Department'
            name='department'
            onChange={(e) => handleOnChange(e)}
          />
        </Form.Group>
        <Form.Group className='mb-3' htmlFor='age'>
          <Form.Label>Age</Form.Label>
          <Form.Control
            id='age'
            placeholder='Age'
            name='age'
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

export default AddDoctorScreen;
