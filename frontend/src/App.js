import logo from "./logo.svg";
import "./App.css";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./Screens/HomeScreen";
import DoctorScreen from "./Screens/DoctorScreen";
import PatientScreen from "./Screens/PatientScreen";
import AddDoctorScreen from "./Screens/AddDoctorScreen";
import AddPatientScreen from "./Screens/AddPatientScreen";
import DetectScreen from "./Screens/DetectScreen";
import AnalyseScreen from "./Screens/AnalyseScreen";

function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        {/* <Container> */}
        <Routes>
          <Route path='/' element={<HomeScreen />} exact />
          <Route path='/doctor' element={<DoctorScreen />} />
          <Route path='/addDoctor' element={<AddDoctorScreen />} />
          <Route path='/patient' element={<PatientScreen />} />
          <Route path='/addPatient' element={<AddPatientScreen />} />
          <Route path='/detect' element={<DetectScreen />} />
          <Route path='/analyse' element={<AnalyseScreen />} />
        </Routes>
        {/* </Container> */}
      </main>
      <Footer />
    </Router>
  );
}

export default App;
