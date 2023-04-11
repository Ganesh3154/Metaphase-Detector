import React from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const HomeScreen = () => {
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
                <Card.Title as='h1'>
                  <i className='fa-solid fa-user'></i> Patient ID
                </Card.Title>
                <Card.Text>Name</Card.Text>
                <Card.Text>Doctor Name</Card.Text>
                <Card.Text as='h3'>dd/mm/yy</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='m-auto' style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title as='h1'>
                  <i className='fa-solid fa-user'></i> Patient ID
                </Card.Title>
                <Card.Text>Name</Card.Text>
                <Card.Text>Doctor Name</Card.Text>
                <Card.Text as='h3'>dd/mm/yy</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='m-auto' style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title as='h1'>
                  <i className='fa-solid fa-user'></i> Patient ID
                </Card.Title>
                <Card.Text>Name</Card.Text>
                <Card.Text>Doctor Name</Card.Text>
                <Card.Text as='h3'>dd/mm/yy</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className='m-auto' style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title as='h1'>
                  <i className='fa-solid fa-user'></i> Patient ID
                </Card.Title>
                <Card.Text>Name</Card.Text>
                <Card.Text>Doctor Name</Card.Text>
                <Card.Text as='h3'>dd/mm/yy</Card.Text>
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
