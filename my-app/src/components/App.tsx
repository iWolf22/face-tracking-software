import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import StopCircleIcon from '@mui/icons-material/StopCircleOutlined';
import Grid from '@mui/material/Grid';
import FooterButtons from './FooterButtons';

type faceAPI = faceapi.WithAge<faceapi.WithGender<faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection; }, faceapi.FaceLandmarks68>>>>[];

function App() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [ faceDetection, setFaceDetection ] = useState<faceAPI>();
  const [ running, setRunning ] = useState(false);
  var clockInterval: NodeJS.Timer;

  useEffect(() => {
    startVideo();
    if (videoRef) {
      loadModels();
    }
  }, []);

  function startVideo() {
    navigator.mediaDevices.getUserMedia( {video:true} )
    .then((currentStream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = currentStream;
      }
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  function stopVideo() {
    navigator.mediaDevices.getUserMedia( {video:true} )
    .then((currentStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
        const tracks = currentStream?.getTracks();
        tracks.forEach(track => track.stop());
    })
  }

  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      faceapi.nets.ageGenderNet.loadFromUri('./models'),
      ]).then(()=>{
        setRunning(true);
    })
  }

  useEffect(() => {
    if (running) {
        clockInterval = setInterval(faceMyDetect, 50);
      }
      return () => clearInterval(clockInterval);
  }, [running]);

  var videoWidth = "832";
  var videoHeight = "468";
  var calY = 7;
  var calX = 100;

  var colorList = ["#7dbeff", "#cb96ff", "#ff9191", "#eda55d", "#9acd68", "#6ecfcf"];
  var colorNames = ["Blue", "Purple", "Red", "Orange", "Green", "Cyan"];

  async function faceMyDetect() {
    if (videoRef.current) {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
      setFaceDetection(detections);
      const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
      const ctx = canvas?.getContext("2d");

      var faces = JSON.parse(JSON.stringify(detections));

      ctx?.clearRect(0, 0, Number(videoWidth), Number(videoHeight));
      for (let i = 0; i < detections.length; i++) {
        if (ctx) ctx.strokeStyle = colorList[i % colorList.length];
        ctx?.strokeRect( Number(videoWidth) - faces[i].detection._box._x - faces[i].detection._box._width - calX, faces[i].detection._box._y - calY, faces[i].detection._box._width, faces[i].detection._box._height);
        if (ctx) ctx.fillStyle = colorList[i % colorList.length];
        for (let j = 0; j < faces[i].landmarks._positions.length; j++) {
          ctx?.fillRect( Number(videoWidth) - faces[i].landmarks._positions[j]._x - calX, faces[i].landmarks._positions[j]._y - calY, 3, 3);
        }
      }
    }
    setRunning(true);
  }

  var fontStyling = {fontFamily: 'JetBrains Mono, monospace', padding: '0px', margin: '0px', color: '#a6b5c5'};

  function specialFontStyling( percent : number ) {
    if (percent > 0.40) {
      return {fontFamily: 'JetBrains Mono, monospace', padding: '0px', margin: '0px', color: '#9acd68'};
    } else {
      return {fontFamily: 'JetBrains Mono, monospace', padding: '0px', margin: '0px', color: '#a6b5c5'}
    }
  }

  return (
    <Container maxWidth="lg">
      <div style={{display: 'flex', justifyContent: 'center', paddingTop: '25px'}}>
        <h1 style={fontStyling}>Face Tracking Software</h1>
      </div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <p style={fontStyling}>
          Built with TypeScript, ReactJS, MaterialUI, and TensorFlow!
          <br/>Can track multiple faces. Predicts based off of someone's
          <br/>appearance, their age, gender, or emotional state.</p>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: '15px'}}>
        <p style={fontStyling}>Made With ❤️ By Joshua Dierickse</p>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '15px'}}>
          <FooterButtons />
        </div>

      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{position: 'relative'}}>
          <video crossOrigin="anonymous" width={videoWidth} height={videoHeight} ref={videoRef} autoPlay id="videoElement"></video>
          <canvas id="myCanvas" width={videoWidth} height={videoHeight} style={{position: 'absolute', top: '0px', left: '0px'}}></canvas>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'center', gap: '10px', padding: '10px'}}>
        <Button variant="contained" startIcon={<PlayCircleFilledWhiteIcon />} onClick={startVideo}>
          Camera On
        </Button>
        <Button variant="contained" startIcon={<StopCircleIcon />} onClick={stopVideo}>
          Camera Off
        </Button>
      </div>

        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ sm: 4, md: 8, lg: 12 }}>
          {faceDetection?.map((face, index) => {
          var newFace = JSON.parse(JSON.stringify(face));
          return (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Card variant="outlined" style={{padding: '10px', border: '1px solid', borderColor: '#a6b5c5', backgroundColor: '#1a2128'}}>
                <h3 style={{fontFamily: 'JetBrains Mono, monospace', padding: '0px', margin: '0px', color: colorList[index % colorList.length]}}>{colorNames[index % colorNames.length]} Person</h3>
                <hr style={{color: '#a6b5c5'}}/>
                <p style={specialFontStyling(newFace.expressions.neutral)}>😐 neutral: {Math.round(newFace.expressions.neutral * 100)}%</p>
                <p style={specialFontStyling(newFace.expressions.happy)}>😊 happy: {Math.round(newFace.expressions.happy * 100)}%</p>
                <p style={specialFontStyling(newFace.expressions.sad)}>😭 sad: {Math.round(newFace.expressions.sad * 100)}%</p>
                <p style={specialFontStyling(newFace.expressions.angry)}>😡 angry: {Math.round(newFace.expressions.angry * 100)}%</p>
                <p style={specialFontStyling(newFace.expressions.fearful)}>😨 fearful: {Math.round(newFace.expressions.fearful * 100)}%</p>
                <p style={specialFontStyling(newFace.expressions.disgusted)}>🤮 disgusted: {Math.round(newFace.expressions.disgusted * 100)}%</p>
                <p style={specialFontStyling(newFace.expressions.surprised)}>😱 surprised: {Math.round(newFace.expressions.surprised * 100)}%</p>
                <p style={fontStyling}>🚻 gender: {newFace.gender} {Math.round(newFace.genderProbability * 100)}%</p>
                <p style={fontStyling}>🎂 age: {Math.round(newFace.age)}</p>
              </Card>
            </Grid>
          )
          })}
        </Grid>
    </Container>
    
  );
}

export default App;
