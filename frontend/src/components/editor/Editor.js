import React, { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import RealtimeEditor from "../realtimeEditor/RealtimeEditor"; // Import your RealtimeEditor component
import "./Editor.css"; // Import external CSS file
import Avatar from '../avatar/Avatar'
import { initSocket } from "../../socket";

const Editor = () => {
  const socketRef = useRef() ; 

  const [clientList, setClientList] = useState([
    { socketId: "1", name: "Alice" },
    { socketId: "2", name: "Bob" },
    { socketId: "3", name: "Charlie" },
  ]);

  const copyRoomId = () => {
    navigator.clipboard.writeText("ROOM_ID_1234"); // Replace with your actual room ID logic
    alert("Room ID copied to clipboard!");
  };

  const leaveRoom = () => {
    alert("You have left the room."); // Replace with actual leave room logic
  };

  useEffect(() => {
    socketRef.current = initSocket() ; 

  }, [])
  


  return (
    <div className="main-page">
      <div className="side-drawer">
        <div className="upper-container">
          <div className="project-title">
            <FontAwesomeIcon icon={faCode} className="editor-icon" />
            <h2>Code Editor</h2>
          </div>
          <div className="display-clients">
            <h3>Connected</h3>
            <div className="client-list">
              {clientList.map((client) => <Avatar  username={client.name}/>)}
            </div>
          </div>
        </div>
        <div className="buttons-container">
          <Button
            variant="contained"
            className="copy-room-btn"
            onClick={copyRoomId}
          >
            Copy Room ID
          </Button>
          <Button
            variant="contained"
            className="leave-room-btn"
            onClick={leaveRoom}
            style={{ backgroundColor: "#f44336" }}
          >
            Leave Room
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="editor-area">
        <RealtimeEditor />
      </div>
    </div>
  );
};

export default Editor;
