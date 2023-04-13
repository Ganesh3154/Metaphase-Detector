import React, { useEffect, useRef } from "react";
import {
  Container,
  Table,
  InputGroup,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { useState } from "react";
import EditPatientModal from "./EditPatientModal";
import axios from "axios";

const DataTable = (props) => {
  const [search, setSearch] = useState({ search: "" });
  const [toggleSearch, setToggleSearch] = useState(false);
  const [filterData, setFilterData] = useState({ filter: "" });
  const [column, setColumn] = useState();
  const mountedRef = useRef(false);
  const [items, setItems] = useState([]);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editData, setEditData] = useState({});
  // const [confirm, setConfirm] = useState(false);
  const [toggleConfirm, setToggleConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState();

  const handleOnChange = (e) => {
    if (e.target.value.length == 0) {
      setToggleSearch(false);
    } else {
      setToggleSearch(true);
      setFilterData(
        items.filter((data) =>
          Object.keys(data).some((key) =>
            String(data[key])
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
          )
        )
      );
    }
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const getData = () => {
    axios.get(`http://localhost:8000/${props.path}`).then((res) => {
      const data = res.data;
      console.log(data);
      setItems(...items, data);
      console.log(res.data);
    });
  };

  const toggleEditfn = () => {
    setToggleEdit(!toggleEdit);
  };

  const refresh = () => {
    window.location.reload(false);
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    toggleEditfn();
    setEditData(items.filter((item) => item["id"] == id));
  };

  const handleDelete = (e, id) => {
    console.log(deleteId.id);
    e.preventDefault();
    console.log("im in");
    axios.delete(`http://localhost:8000/${props.path}/${id}`).then(() => {
      setItems(items.filter((item) => item["id"] != id));
      if (filterData.length > 0)
        setFilterData(filterData.filter((item) => item["id"] != id));
    });
    setToggleConfirm(false);
  };

  useEffect(() => {
    if (mountedRef.current) {
      setColumn(Object.keys(items[0]));
    }
  }, [items]);

  useEffect(() => {
    mountedRef.current = true;
    getData();
  }, []);

  useEffect(() => {
    console.log(column);
  }, []);

  return (
    <Container className='px-5 py-2' fluid>
      <Container fluid className='px-0'>
        <InputGroup className='mb-3'>
          <InputGroup.Text id='basic-addon1'>Search</InputGroup.Text>
          <Form.Control
            name='search'
            placeholder='Search'
            aria-label='Search'
            aria-describedby='basic-addon1'
            value={search.search}
            onChange={(e) => handleOnChange(e)}
          />
        </InputGroup>
      </Container>
      <Table bordered hover responsive variant='active'>
        <thead style={{ backgroundColor: "#383c44" }}>
          <tr style={{ color: "white" }}>
            {column?.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
            {column ? (
              <th>Actions</th>
            ) : (
              <th>
                <h1 className='text-center' style={{ color: "white" }}>
                  Loading...
                </h1>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {!toggleSearch
            ? items?.map((item, i) => (
                <tr key={i}>
                  {Object.values(item).map((cell, i) => {
                    if (
                      Object.keys(item).find((key) => item[key] === cell) ==
                      "analysed"
                    ) {
                      return (
                        <td key={i}>
                          {
                            <Form.Check
                              disabled
                              type='checkbox'
                              id='default-checkbox'
                              checked={cell}
                            />
                          }
                        </td>
                      );
                    } else return <td key={i}>{cell}</td>;
                  })}
                  <td>
                    {
                      <Button
                        size='sm'
                        onClick={(e) => {
                          setToggleConfirm(true);
                          setDeleteId(item["id"]);
                        }}
                      >
                        <i className='fa-solid fa-trash'></i>
                      </Button>
                    }{" "}
                    {
                      <Button
                        size='sm'
                        onClick={(e) => handleEdit(e, item["id"])}
                      >
                        <i className='fa-solid fa-pen-to-square'></i>
                      </Button>
                    }{" "}
                    {item["analysed"] ? (
                      <Button size='sm'>
                        <i className='fa-solid fa-eye'></i>
                      </Button>
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              ))
            : filterData?.map((item, i) => (
                <tr key={i}>
                  {Object.values(item).map((cell, i) => {
                    if (
                      Object.keys(item).find((key) => item[key] === cell) ==
                      "analysed"
                    ) {
                      return (
                        <td key={i}>
                          {
                            <Form.Check
                              disabled
                              type='checkbox'
                              id='default-checkbox'
                              checked={cell}
                            />
                          }
                        </td>
                      );
                    } else return <td key={i}>{cell}</td>;
                  })}
                  <td>
                    {
                      <Button
                        size='sm'
                        onClick={(e) => {
                          setToggleConfirm(true);
                          setDeleteId(item["id"]);
                        }}
                      >
                        <i className='fa-solid fa-trash'></i>
                      </Button>
                    }{" "}
                    {
                      <Button
                        size='sm'
                        onClick={(e) => handleEdit(e, item["id"])}
                      >
                        <i className='fa-solid fa-pen-to-square'></i>
                      </Button>
                    }{" "}
                    {item["analysed"] ? (
                      <Button size='sm'>
                        <i className='fa-solid fa-eye'></i>
                      </Button>
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>
      {toggleEdit ? (
        <EditPatientModal
          data={editData}
          path={props.path}
          toggle={toggleEditfn}
          refresh={refresh}
        />
      ) : (
        <></>
      )}
      {toggleConfirm ? (
        <>
          <div
            className='modal show'
            style={{
              display: "block",
              position: "absolute",
              paddingTop: "20%",
              background: "rgba(0, 0, 0, 0.7)",
            }}
          >
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Are you sure?</Modal.Title>
              </Modal.Header>
              <Modal.Footer>
                <Button
                  onClick={(e) => {
                    handleDelete(e, deleteId);
                  }}
                >
                  Yes
                </Button>
                <Button
                  onClick={() => {
                    setToggleConfirm(false);
                  }}
                >
                  No
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default DataTable;
