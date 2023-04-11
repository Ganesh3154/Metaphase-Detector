import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { Button } from "react-bootstrap";

const DetectorScreen = () => {
  const getUsers = () => {
    axios.get("http://localhost:8000/users").then((res) => {
      console.log(res.data);
    });
  };

  return (
    <Button
      onClick={() => {
        getUsers();
      }}
    >
      Detect
    </Button>
  );
};

export default DetectorScreen;
