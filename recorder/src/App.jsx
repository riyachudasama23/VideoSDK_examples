import "./App.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";

import { authToken, createMeeting } from "./API";
import Container from "./components/Container";
import JoinScreen from "./components/JoinScreen";

function App() {
  const [meetingId, setMeetingId] = useState(null);
  //const [mode, setMode] = useState("CONFERENCE");

  //You have to get the MeetingId from the API created earlier
  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Riya Chudasama",
        //This will be the mode of the participant CONFERENCE or VIEWER
      }}
      token={authToken}
    >
      <Container meetingId={meetingId} onMeetingLeave={onMeetingLeave} />{" "}
      {/* <MeetingView */}
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default App;
