import React from "react";
import { Form, Button, Container } from "react-bootstrap";

const AddDoctorScreen = () => {
  return (
    <Container>
      <Container className='ps-0 py-3 m-0' as='h1'>
        Add Doctor
      </Container>
      <Form>
        <Form.Group className='mb-3' htmlFor='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control id='name' placeholder='Name' />
        </Form.Group>
        <Form.Group className='mb-3' htmlFor='hospital'>
          <Form.Label>Hospital</Form.Label>
          <Form.Control id='hospital' placeholder='Hospital' />
        </Form.Group>
        <Form.Group className='mb-3' htmlFor='department'>
          <Form.Label>Department</Form.Label>
          <Form.Control id='department' placeholder='Department' />
        </Form.Group>
        <Form.Group className='mb-3' htmlFor='age'>
          <Form.Label>Age</Form.Label>
          <Form.Control id='age' placeholder='Age' />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Gender</Form.Label>
          <Form.Select>
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
