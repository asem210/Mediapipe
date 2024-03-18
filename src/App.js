import React, { useRef, useEffect } from "react";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";

import { Pose } from "@mediapipe/pose";
import * as poseprop from "@mediapipe/pose";
// import LandmarkGrid from '@mediapipe/control_utils_3d';

import "./App.css";

import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  // const landmarkRef = useRef(null);
  // const connect = window.drawConnectors;
  var camera = null;

  function onResults(results) {
    try {
      // const videoElement = webcamRef.current.video;
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d");
      // const landmarkContainer = landmarkRef.current;
      // console.log('container: ',landmarkContainer)
      // const grid = new LandmarkGrid(landmarkContainer);

      // if (!results.poseLandmarks) {
      //   grid.updateLandmarks([]);
      //   return;
      // }

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      // canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);

      // Only overwrite existing pixels.
      canvasCtx.globalCompositeOperation = "source-in";
      // canvasCtx.fillStyle = '#00FF00';
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

      // Only overwrite missing pixels.
      canvasCtx.globalCompositeOperation = "destination-atop";

      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      canvasCtx.globalCompositeOperation = "source-over";
      drawConnectors(
        canvasCtx,
        results.poseLandmarks,
        poseprop.POSE_CONNECTIONS,
        { lineWidth: 1 }
      ); //lime
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        lineWidth: 0.5,
      }); //red
      canvasCtx.restore();
    } catch (error) {
      console.log("error in results image", error);
    }

    // grid.updateLandmarks(results.poseWorldLandmarks);
  }
  // }

  // setInterval(())
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);
  return (
    <body>
      <h1>
        Detección de postura utilizando la tarea PoseLandmarker de MediaPipe
      </h1>
      <section id="demos" class="">
        <h2>
          Demo: Detección en imágenes <b>(por implementar)</b>{" "}
        </h2>
        <p>
          <b>Haz click en una imagen a continuación</b> para ver los puntos
          clave del cuerpo.
        </p>
        <div class="detectOnClick">
          <img
            src="https://assets.codepen.io/9177687/woman-ge0f199f92_640.jpg"
            width="100%"
            crossorigin="anonymous"
            title="Click to get detection!"
          />
        </div>
        <div class="detectOnClick">
          <img
            src="https://assets.codepen.io/9177687/woman-g1af8d3deb_640.jpg"
            width="100%"
            crossorigin="anonymous"
            title="Click to get detection!"
          />
        </div>
        <h2>
          Demo: Detección continua de puntos de referencia de postura en la
          cámara web
        </h2>
        <p>
          Párate frente a tu cámara web para obtener detección en tiempo real de
          puntos de referencia de postura. <br />
        </p>

        <div>
          <center>
            <div className="App">
              <Webcam
                ref={webcamRef}
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zindex: 1,
                  width: 0,
                  height: 0,
                }}
              />{" "}
              <canvas
                ref={canvasRef}
                className="output_canvas"
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zindex: 9,
                  width: 640,
                  height: 480,
                }}
              ></canvas>
              {/* <div
          ref={landmarkRef}
          className="landmark-grid-container"
        ></div> */}
            </div>
          </center>
        </div>
      </section>
    </body>
  );
}

export default App;
