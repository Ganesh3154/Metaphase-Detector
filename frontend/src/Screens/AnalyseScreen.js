import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import "./DetectScreen.css";
// import React, { useState } from "https://cdn.skypack.dev/react@17.0.1";
import shortid from "https://cdn.skypack.dev/shortid@2.2.16";
import ViewImages from "../components/ViewImages";

const AnalyseScreen = () => {
  // const getUsers = () => {
  //   axios.get("http://localhost:8000/users").then((res) => {
  //     console.log(res.data);
  //   });
  // };

  const [id, setId] = useState();
  const [selectedfile, SetSelectedFile] = useState([]);
  const [Files, SetFiles] = useState([]);
  const [img, setImg] = useState([]);
  const [toggleView, setToggleView] = useState(false);
  const path = "analyse";
  const title = "analysable";

  const toggleViewfn = () => {
    setToggleView(!toggleView);
  };

  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const InputChange = (e) => {
    // --For Multiple File Input
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      images.push(e.target.files[i]);
      let reader = new FileReader();
      let file = e.target.files[i];
      reader.onloadend = () => {
        SetSelectedFile((preValue) => {
          return [
            ...preValue,
            {
              id: shortid.generate(),
              filename: e.target.files[i].name,
              filetype: e.target.files[i].type,
              fileimage: reader.result,
              datetime:
                e.target.files[i].lastModifiedDate.toLocaleString("en-IN"),
              filesize: filesizes(e.target.files[i].size),
            },
          ];
        });
      };
      if (e.target.files[i]) {
        reader.readAsDataURL(file);
      }
    }
    setImg(e.target.files);
  };

  const DeleteSelectFile = (id) => {
    if (window.confirm("Are you sure you want to delete this Image?")) {
      const result = selectedfile.filter((data) => data.id !== id);
      SetSelectedFile(result);
    } else {
      // alert('No');
    }
  };

  const FileUploadSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Array.from(img).forEach((images) => {
      formData.append("file", images);
    });
    // form reset on submit
    e.target.reset();
    if (selectedfile.length > 0) {
      for (let index = 0; index < selectedfile.length; index++) {
        SetFiles((preValue) => {
          return [...preValue, selectedfile[index]];
        });
      }
      axios
        .post(`http://localhost:8000/patient/analyse/${id}`, formData)
        .then((res) => {
          console.log(res);
          toggleViewfn();
        });
      SetSelectedFile([]);
    } else {
      alert("Please select file");
    }
  };

  useEffect(() => {
    console.log(selectedfile);
  }, [selectedfile]);

  const DeleteFile = async (id) => {
    if (window.confirm("Are you sure you want to delete this Image?")) {
      const result = Files.filter((data) => data.id !== id);
      SetFiles(result);
    } else {
      // alert('No');
    }
  };

  return (
    <Container>
      <Container className='ps-0 py-3 m-0' as='h1'>
        Analyse Metaphase
      </Container>
      <div className='fileupload-view'>
        <div className='row justify-content-center m-0'>
          <div className='col-md-6'>
            <div className='card mt-5'>
              <div className='card-body'>
                <div className='kb-data-box'>
                  <div className='kb-modal-data-title'></div>
                  <Form onSubmit={FileUploadSubmit}>
                    <Form.Group className='mb-3' htmlFor='patient_id'>
                      <Form.Label>Patient ID</Form.Label>
                      <Form.Control
                        id='patientId'
                        placeholder='Patient ID'
                        name='patient_id'
                        required
                        onChange={(e) => setId(e.target.value)}
                      />
                    </Form.Group>
                    <div className='kb-data-title pt-2'>
                      <h6>Upload 100x Images</h6>
                    </div>
                    <div className='kb-file-upload'>
                      <div className='file-upload-box'>
                        <input
                          type='file'
                          id='fileupload'
                          className='file-upload-input'
                          onChange={InputChange}
                          multiple
                        />
                        <span>
                          Drag and drop or{" "}
                          <span className='file-link'>Choose your files</span>
                        </span>
                      </div>
                    </div>
                    <div className='kb-attach-box mb-3'>
                      {selectedfile.map((data, index) => {
                        const {
                          id,
                          filename,
                          filetype,
                          fileimage,
                          datetime,
                          filesize,
                        } = data;
                        return (
                          <div className='file-atc-box' key={id}>
                            {filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                              <div className='file-image'>
                                {" "}
                                <img src={fileimage} alt='' />
                              </div>
                            ) : (
                              <div className='file-image'>
                                <i className='far fa-file-alt'></i>
                              </div>
                            )}
                            <div className='file-detail'>
                              <h6>{filename}</h6>
                              <p></p>
                              <p>
                                <span>Size : {filesize} &nbsp;</span>
                                <span className='ml-2'>
                                  Modified Time : {datetime}
                                </span>
                              </p>
                              <div className='file-actions'>
                                <button
                                  type='button'
                                  className='file-action-btn'
                                  onClick={() => DeleteSelectFile(id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className='kb-buttons-box'>
                      <button
                        type='submit'
                        className='btn btn-primary form-submit'
                      >
                        Analyse
                      </button>
                    </div>
                  </Form>
                  {toggleView && (
                    <ViewImages
                      viewId={id}
                      toggle={toggleViewfn}
                      toggleView={toggleView}
                      path={path}
                      title={title}
                    />
                  )}
                  {/* {Files.length > 0 ? (
                    <div className='kb-attach-box'>
                      <hr />
                      {Files.map((data, index) => {
                        const {
                          id,
                          filename,
                          filetype,
                          fileimage,
                          datetime,
                          filesize,
                        } = data;
                        return (
                          <div className='file-atc-box' key={index}>
                            {filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                              <div className='file-image'>
                                {" "}
                                <img src={fileimage} alt='' />
                              </div>
                            ) : (
                              <div className='file-image'>
                                <i className='far fa-file-alt'></i>
                              </div>
                            )}
                            <div className='file-detail'>
                              <h6>{filename}</h6>
                              <p>
                                <span>Size : {filesize}</span>
                                <span className='ml-3'>
                                  Modified Time : {datetime}
                                </span>
                              </p>
                              <div className='file-actions'>
                                <button
                                  className='file-action-btn'
                                  onClick={() => DeleteFile(id)}
                                >
                                  Delete
                                </button>
                                <a
                                  href={fileimage}
                                  className='file-action-btn'
                                  download={filename}
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    ""
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AnalyseScreen;
