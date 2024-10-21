import React, { useState } from "react";
import { useMeeting, Constants } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";
import Controls from "./Controls";
import { authToken } from "../API";

function Container(props) {
  const [joined, setJoined] = useState(null);
  //Get the method which will be used to join the meeting.
  //We will also get the participants list to display all participants
  const { join, participants, startRecording, stopRecording } = useMeeting({
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

  const handleStartRecording = () => {
    const webhookUrl = "https://example.com"; // Replace with your actual webhook URL

    const transcription = {
      enabled: true,
      summary: {
        enabled: true,
        prompt:
          "Write summary in sections like Title, Agenda, Speakers, Action Items, Outlines, Notes and Summary",
      },
    };

    // Start recording with transcription settings
    startRecording(webhookUrl, null, null, transcription);
  };

  const handleStopRecording = async () => {
    // Stop recording
    stopRecording();
    await fetchTranscription(props.meetingId);
  };

  const fetchTranscription = async (roomId) => {
    const options = {
      method: "GET",
      headers: {
        Authorization: authToken, // Replace with your actual token
        "Content-Type": "application/json",
      },
    };

    const url = `https://api.videosdk.live/ai/v1/post-transcriptions?roomId=${roomId}`;

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Transcription Data:", data); // Handle your transcription data here

      // Accessing specific fields from the response
      if (data.transcriptions && data.transcriptions.length > 0) {
        const transcriptionDetails = data.transcriptions[0];
        console.log(
          "Transcription File Paths:",
          transcriptionDetails.transcriptionFilePaths
        );

        // Example of accessing the summary if available
        if (transcriptionDetails.summary) {
          console.log("Summary:", transcriptionDetails.summary);
        }
      }
    } catch (error) {
      console.error("Error fetching transcription:", error);
    }
  };

  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined == "JOINED" ? (
        <div>
          <Controls
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
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
