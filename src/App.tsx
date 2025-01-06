// components
import IFrame from "./IFrame";
import ZoomMeet from "./ZoomMeet";

const App = () => {
  return (
    <>
      <ZoomMeet />
      <br />
      <IFrame style={{ width: "500px", height: "320px" }}>
        <ZoomMeet />
      </IFrame>
    </>
  );
};

export default App;
