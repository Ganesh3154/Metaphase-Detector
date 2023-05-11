import React, { useState, useEffect, useRef } from "react";
import styles from "./ViewImages.module.css";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const ViewImages = (props) => {
  const mountedRef = useRef(false);
  const [imgSrc, setImgSrc] = useState();
  const [mainImg, setMainImg] = useState();
  // src: "https://source.unsplash.com/ufFIweqSPd4/800x800",
  //   });

  const changeImg = (e) => {
    console.log(e.target.src);
    setMainImg([e.target.src]);
  };

  useEffect(() => {
    mountedRef.current = true;
    axios
      .get(`http://localhost:8000/patient/images/analyse/${props.viewId}`)
      .then((res) => {
        console.log(res.data);
        setImgSrc(res.data);
        setMainImg(
          `http://127.0.0.1:8080/analyse/${props.viewId}/${res.data[0].path}`
        );
      });
  }, []);

  return (
    <>
      <div
        className='modal show'
        style={{
          display: "block",
          position: "absolute",
          background: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <Modal
          backdrop='static'
          show={props.toggleView}
          size='lg'
          style={{ paddingTop: "5%" }}
        >
          <Modal.Header>
            <Modal.Title>Analysable Images</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {imgSrc && (
              <>
                <img src={mainImg} id={styles.main} />
                <div id={styles.thumbnails}>
                  {/* <img
                    src='https://source.unsplash.com/ufFIweqSPd4/800x800'
                    onClick={(e) => {
                      changeImg(e);
                    }}
                  />
                  <img
                    src='https://source.unsplash.com/O0uCm1WLnA0/800x800'
                    onClick={(e) => {
                      changeImg(e);
                    }}
                  />
                  <img
                    src='https://source.unsplash.com/pV5ckb2HEVk/800x800'
                    onClick={(e) => {
                      changeImg(e);
                    }}
                  />
                  <img
                    src='https://source.unsplash.com/j9QEFAQqaXc/800x800'
                    onClick={(e) => {
                      changeImg(e);
                    }}
                  />
                  <img
                    src='https://source.unsplash.com/EXkbaeN05lY/800x800'
                    onClick={(e) => {
                      changeImg(e);
                    }}
                  />
                  <img
                    src='https://source.unsplash.com/B2mq60Ksrsg/800x800'
                    onClick={(e) => {
                      changeImg(e);
                    }}
                  /> */}
                  {imgSrc?.map((item, i) => (
                    <img
                      key={i}
                      src={`http://127.0.0.1:8080/analyse/${props.viewId}/${item.path}`}
                      onClick={(e) => {
                        changeImg(e);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
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
            {/* <Button
              variant='primary'
              type='submit'
              onClick={(e) => {
                submit(e);
              }}
            >
              Submit
            </Button> */}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ViewImages;
