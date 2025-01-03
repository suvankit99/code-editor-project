import React, { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import RealtimeEditor from "../realtimeEditor/RealtimeEditor"; // Import your RealtimeEditor component
import "./Editor.css"; // Import external CSS file
import Avatar from "../avatar/Avatar";
import { initSocket } from "../../socket";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ACTIONS from "../../actions";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";

const Editor = () => {
  const socketRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username; // Safely access the username
  const { roomId } = useParams();
  const [clientList, setClientList] = useState([]);

  const copyRoomId = () => {
    navigator.clipboard.writeText("ROOM_ID_1234"); // Replace with your actual room ID logic
    alert("Room ID copied to clipboard!");
  };

  const leaveRoom = () => {
    alert("You have left the room."); // Replace with actual leave room logic
  };
  const handleSocketError = (err) => {
    console.log("Socket error:", err);
    toast.error("Socket connection failed. Please try again later.");
  };
  useEffect(() => {
    const init = async () => {
      socketRef.current = io(process.env.REACT_APP_BACKEND_URL);
      socketRef.current.on("connect_error", handleSocketError);
      socketRef.current.on("connect_failed", handleSocketError);
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, joinedUserSocketId }) => {
          if (
            username !== location.state?.username &&
            socketRef.current.id !== joinedUserSocketId
          ) {
            console.log("toast called");
            toast.success(`${username} has joined the room`);
          }

          setClientList(clients);
          console.log("clientlist ", clients);
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED , ({socketId , username}) => {
        toast.success(`${username} left the room`) ; 
        setClientList((prev) => {return prev.filter(client => client.socketId !== socketId)})
      })
    };

    init();
    return () => {
      // clean up socket connection
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOIN);
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, []);

  if (!roomId) {
    navigate("/");
  }
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
              {clientList.map((client) => (
                <Avatar key={client.socketId} username={client.username} />
              ))}
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
      <Toaster position="top-right" />
    </div>
  );
};

export default Editor;
