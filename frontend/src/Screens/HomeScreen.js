import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";

const HomeScreen = () => {
  const [patients, setPatients] = useState({});

  const getData = () => {
    axios
      .get(`http://localhost:8000/recent_patient`)
      .then((res) => {
        const data = res.data;
        console.log(res.data);
        setPatients(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log(patients);
  }, [patients]);

  return (
    <>
      {/* <Container className='py-5 text-center'>
        <h1 className='m-0'>Welcome to Metaphase Detector</h1>
      </Container> */}
      <Container className='py-3'>
        <Container className='py-5 text-center'>
          <h1 className='m-0'>Recent patients</h1>
        </Container>
        <Row className='py-3'>
          <Col>
            <Card className='m-auto' style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title as='h4'>
                  <i className='fa-solid fa-user'></i> Patient ID:{" "}
                  {patients[0]?.id}
                </Card.Title>
                <Card.Text as='h4'>Name: {patients[0]?.name}</Card.Text>
                <Card.Text>Doctor Id: {patients[0]?.doctor_id}</Card.Text>
                <Card.Text as='h3'>Age: {patients[0]?.age}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='m-auto' style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title as='h4'>
                  <i className='fa-solid fa-user'></i> Patient ID:{" "}
                  {patients[1]?.id}
                </Card.Title>
                <Card.Text as='h4'>Name: {patients[1]?.name}</Card.Text>
                <Card.Text>Doctor Id: {patients[1]?.doctor_id}</Card.Text>
                <Card.Text as='h3'>Age: {patients[1]?.age}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='m-auto' style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title as='h4'>
                  <i className='fa-solid fa-user'></i> Patient ID:{" "}
                  {patients[2]?.id}
                </Card.Title>
                <Card.Text as='h4'>Name: {patients[2]?.name}</Card.Text>
                <Card.Text>Doctor Id: {patients[2]?.doctor_id}</Card.Text>
                <Card.Text as='h3'>Age: {patients[2]?.age}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='m-auto' style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title as='h4'>
                  <i className='fa-solid fa-user'></i> Patient ID:{" "}
                  {patients[3]?.id}
                </Card.Title>
                <Card.Text as='h4'>Name: {patients[3]?.name}</Card.Text>
                <Card.Text>Doctor Id: {patients[3]?.doctor_id}</Card.Text>
                <Card.Text as='h3'>Age: {patients[3]?.age}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className='pt-5'>
          <Col className='p-9'>
            <Card className='m-auto' style={{ width: "18rem" }}>
              <Card.Body>
                <Container>
                  <Row>
                    <Card.Title className='text-center' as='h1'>
                      <i className='fa-solid fa-user'></i>
                    </Card.Title>
                  </Row>
                  <Row style={{ height: "15rem" }}>
                    <Button
                      variant='light'
                      style={{ border: "1px solid rgba(0, 0, 0, 0.175)" }}
                    >
                      <LinkContainer
                        to='addPatient'
                        style={{
                          color: "#55595c",
                          height: "100%",
                          paddingTop: "40%",
                        }}
                      >
                        <Card.Text className='text-center' as='h1'>
                          +
                        </Card.Text>
                      </LinkContainer>
                    </Button>
                  </Row>
                </Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomeScreen;
