import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Import the UUID generator
import "./home.css";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const RoomForm = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const handleCreateRoom = () => {
    const newRoomId = uuidv4(); // Generate a new UUID
    setRoomId(newRoomId); // Update the state
    toast.success("New room created");
  };

  const handleJoinRoom = () => {
    if (!roomId) {
      toast.error("Room Id is required");
      return;
    }

    if (!username) {
      toast.error("Username is required");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleEnter = (e) => {
    if (e.code === "Enter") {
      handleJoinRoom();
    }
  };
  return (
    <div className="room-form-container">
      <div className="form-box">
        <div className="home-header">
          <FontAwesomeIcon icon={faCode} className="editor-icon" />
          <h1>Codebrew</h1>
        </div>
        <form>
          <div className="form-group">
            <label htmlFor="roomId">Room ID</label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)} // Allow manual editing if needed
              placeholder="Enter Room ID or Generate One"
              onKeyUp={handleEnter}
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              onKeyUp={handleEnter}
            />
          </div>
          <div className="button-group">
            <button type="button" onClick={handleJoinRoom} className="btn join">
              JOIN
            </button>
            <button
              type="button"
              onClick={handleCreateRoom}
              className="btn create"
            >
              CREATE ROOM
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default RoomForm;
