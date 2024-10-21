import React from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

function Controls({ onStartRecording, onStopRecording }) {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div>
      <button onClick={() => leave()}>Leave</button>
      <button onClick={() => toggleMic()}>toggleMic</button>
      <button onClick={() => toggleWebcam()}>toggleWebcam</button>
      <button onClick={onStartRecording}>Start Recording</button>
      <button onClick={onStopRecording}>Stop Recording</button>
    </div>
  );
}

export default Controls;
