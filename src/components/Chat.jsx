import { useState, useEffect } from "react";

import io from "socket.io-client";

import "./Chat.css";

const socket = io("http://localhost:3001");

function Chat() {

    // Stores current input value
    const [message, setMessage] = useState("");

    // Stores username
    const [username, setUsername] = useState("");

    // Stores all chat messages
    const [messages, setMessages] = useState([]);


    // Ask username once when app loads
    useEffect(() => {

        const name = prompt("Enter your username");

        if (name) {
            setUsername(name);
        }

    }, []);


    // Listen for incoming messages
    useEffect(() => {

        socket.on("receive_message", (data) => {

            setMessages((prevMessages) => [

                ...prevMessages,

                {
                    ...data,

                    // Check if message belongs to current user
                    type:
                        data.username === username
                            ? "sent"
                            : "received"

                }

            ]);

        });

        // Cleanup listener
        return () => {
            socket.off("receive_message");
        };

    }, [username]);


    // Function to send message
    function sendMessage() {

        const trimmedMessage = message.trim();

        // Prevent empty messages
        if (trimmedMessage === "") {
            return;
        }

        // Create message object
        const newMessage = {
            text: trimmedMessage,
            username: username
        };

        // Send message to backend
        socket.emit("send_message", newMessage);

        // Clear input field
        setMessage("");

    }


    return (

        <div className="chat-container">

            {/* Sidebar */}
            <div className="sidebar">

                <h2>Chat Rooms</h2>

                <ul className="room-list">
                    <li>General</li>
                    <li>Gaming</li>
                    <li>Music</li>
                </ul>

            </div>


            {/* Main Chat Area */}
            <div className="chat-area">

                {/* Header */}
                <div className="chat-header">
                    <h2>General Room</h2>
                </div>


                {/* Messages */}
                <div className="messages">

                    {
                        messages.map((msg, index) => (

                            <div
                                key={index}
                                className={`message ${msg.type}`}
                            >

                                <p>
                                    <strong>
                                        {
                                            msg.username === username
                                                ? "You"
                                                : msg.username
                                        }:
                                    </strong>
                                    {msg.text}
                                </p>

                            </div>

                        ))
                    }

                </div>


                {/* Input Area */}
                <div className="input-area">

                    <input
                        type="text"
                        value={message}
                        placeholder="Type a message..."

                        // Update input state
                        onChange={(event) =>
                            setMessage(event.target.value)
                        }

                        // Send message on Enter key
                        onKeyDown={(event) => {

                            if (event.key === "Enter") {
                                sendMessage();
                            }

                        }}
                    />


                    {/* Send Button */}
                    <button onClick={sendMessage}>
                        Send
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Chat;