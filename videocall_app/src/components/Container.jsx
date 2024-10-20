import React, { useState } from "react";
import { useMeeting, Constants } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";
import Controls from "./Controls";

function Container(props) {
  const [joined, setJoined] = useState(null);

  //Get the method which will be used to join the meeting.
  //We will also get the participants list to display all participants
  const { join, participants, enableScreenShare, disableScreenShare } =
    useMeeting({
      //callback for when meeting is joined successfully
      onMeetingJoined: () => {
        setJoined("JOINED");
      },
      //callback for when meeting is left
      onMeetingLeft: () => {
        props.onMeetingLeave();
        setJoined(null);
      },
    });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  const handleStartScreenShare = () => {
    enableScreenShare(); // Start screen sharing
  };

  const handleStopScreenShare = () => {
    disableScreenShare(); // Stop screen sharing
  };

  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined == "JOINED" ? (
        <div>
          <Controls
            onStartScreenShare={handleStartScreenShare}
            onStopScreenShare={handleStopScreenShare}
          />
          //For rendering all the participants in the meeting
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
      ) : joined && joined == "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}

export default Container;
