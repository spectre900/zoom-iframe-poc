import { useRef, useEffect, useCallback, useState } from "react";
import ZoomVideo, { Stream } from "@zoom/videosdk";

// utils
import { meetingCreds } from "./utils";

const ZoomMeet = () => {
  const client = useRef(ZoomVideo.createClient());
  const stream = useRef<typeof Stream>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [meetOn, setMeetOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const startMeet = useCallback(async () => {
    try {
      setLoading(true);
      await client.current.join(
        meetingCreds.topic,
        meetingCreds.token,
        Math.random().toString(36),
        meetingCreds.sessionPassword
      );
      stream.current = client.current.getMediaStream();
      setLoading(false);
      setMeetOn(true);
      console.log("Log: Meeting started");
    } catch (error: any) {
      setLoading(false);
      console.log("Log: Meeting start failed", error);
      if (error && error.reason === "duplicated operation") {
        alert("Can only start one meeting at a time");
      }
    }
  }, []);

  const enableVideo = useCallback(async () => {
    if (videoRef.current && stream.current) {
      try {
        setLoading(true);
        await stream.current.startVideo({ videoElement: videoRef.current });
        setLoading(false);
        setVideoOn(true);
        console.log("Log: Camera enabled");
      } catch (error) {
        setLoading(false);
        console.log("Log: Camera enable failed", error);
      }
    }
  }, []);

  const disableVideo = useCallback(() => {
    stream.current?.stopVideo();
    setVideoOn(false);
    console.log("Log: Camera disabled");
  }, []);

  const endMeet = useCallback(() => {
    if (stream.current?.isCapturingVideo()) {
      disableVideo();
    }
    client.current.leave();
    setMeetOn(false);
    console.log("Log: Meeting left");
  }, [disableVideo]);

  useEffect(() => {
    client.current.init("en-US", "Global");
    return () => {
      if (meetOn) {
        endMeet();
      }
    };
  }, []);

  return (
    <div style={{ width: "480px" }}>
      <video
        ref={videoRef}
        style={{ width: "100%", aspectRatio: 16 / 9, backgroundColor: "black" }}
      />
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        {loading ? (
          "loading..."
        ) : (
          <>
            {!meetOn ? (
              <button onClick={startMeet}> Start meeting</button>
            ) : (
              <>
                {!videoOn ? (
                  <button onClick={enableVideo}> Enable Video</button>
                ) : (
                  <button onClick={disableVideo}> Disable Video</button>
                )}
                <button onClick={endMeet}>End meeting</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ZoomMeet;
