import React, { useState, useEffect } from "react";
import { Container, Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const EditDoctorModal = (props) => {
  const [doctor, setDoctor] = useState();

  useEffect(() => {
    const data = {
      doctor_id: props.data[0].id,
      name: props.data[0].name,
      hospital: props.data[0].hospital,
      age: props.data[0].age,
      gender: props.data[0].gender,
      department: props.data[0].department,
    };
    console.log(data);
    setDoctor(data);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    console.log(doctor);
    axios
      .put(`http://localhost:8000/${props.path}/${doctor.doctor_id}`, doctor)
      .then((res) => {
        console.log(doctor);
        props.refresh();
      })
      .catch((err) => {
        alert("OOPS SOMETHING WENT WRONG", err);
      });
    props.toggle();
  };

  //   useEffect(() => {
  //     console.log(patient);
  //   }, [patient]);

  const handleOnChange = (e) => {
    console.log(e.target.name, " ", e.target.value);
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div
        className='modal show'
        style={{
          display: "block",
          position: "absolute",
          paddingTop: "5%",
          background: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Edit Doctor</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className='mb-3' htmlFor='patientId'>
                <Form.Label>ID</Form.Label>
                <Form.Control
                  disabled
                  defaultValue={props.data[0].id}
                  id='patient_id'
                  name='patient_id'
                  placeholder='Patient ID'
                  //   onChange={(e) => handleOnChange(e)}
                />
              </Form.Group>
              <Form.Group className='mb-3' htmlFor='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  defaultValue={props.data[0].name}
                  required
                  id='name'
                  name='name'
                  placeholder='Name'
                  onChange={(e) => handleOnChange(e)}
                />
              </Form.Group>
              <Form.Group className='mb-3' htmlFor='address'>
                <Form.Label>Hospital</Form.Label>
                <Form.Control
                  defaultValue={props.data[0].hospital}
                  required
                  id='hospital'
                  name='hospital'
                  placeholder='Hospital'
                  onChange={(e) => handleOnChange(e)}
                />
              </Form.Group>
              <Form.Group className='mb-3' htmlFor='address'>
                <Form.Label>Department</Form.Label>
                <Form.Control
                  defaultValue={props.data[0].department}
                  required
                  id='department'
                  name='department'
                  placeholder='Department'
                  onChange={(e) => handleOnChange(e)}
                />
              </Form.Group>
              {/* <Form.Group className='mb-3' htmlFor='doctorId'>
                <Form.Label>Doctor ID</Form.Label>
                <Form.Control
                  defaultValue={props.data[0].doctor_id}
                  required
                  id='doctorId'
                  name='doctor_id'
                  placeholder='Doctor ID'
                  onChange={(e) => handleOnChange(e)}
                />
              </Form.Group> */}
              <Form.Group className='mb-3' htmlFor='age'>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  defaultValue={props.data[0].age}
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
                  <option>{props.data[0].gender}</option>
                  <option>Male</option>
                  <option>Female</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => {
                props.toggle();
              }}
            >
              Close
            </Button>
            <Button
              variant='primary'
              type='submit'
              onClick={(e) => {
                submit(e);
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    </>
  );
};

export default EditDoctorModal;
