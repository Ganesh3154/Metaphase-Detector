import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
  return (
    <header>
      <Navbar bg='dark' expand='lg' variant='dark'>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>MetaPhase Detector</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <LinkContainer to='/'>
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <NavDropdown title='Doctor' id='basic-nav-dropdown'>
                <LinkContainer to='/addDoctor'>
                  <NavDropdown.Item>Add Doctor</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/doctor'>
                  <NavDropdown.Item>View/Edit Doctor</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <NavDropdown title='Patient' id='basic-nav-dropdown'>
                <LinkContainer to='/addPatient'>
                  <NavDropdown.Item>Add Patient</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/patient'>
                  <NavDropdown.Item>View/Edit Patient</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <NavDropdown title='Run' id='basic-nav-dropdown'>
                <LinkContainer to='/detect'>
                  <NavDropdown.Item>Detect</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/analyse'>
                  <NavDropdown.Item>Analyse</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              {/* <LinkContainer to='/detector'>
                <Nav.Link>Run MetaPhase Detector</Nav.Link>
              </LinkContainer> */}
            </Nav>
            <Nav className='ms-auto'>
              <Nav.Link href='login'>
                <i className='fas fa-user'></i> Log in
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
