import { useEffect, useState } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";

const END_POINT = "http://localhost:5000";
let socket;

function Message({ isAuthenticated, user, room }) {
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");

  useEffect(() => {
    socket = io(END_POINT, {
      transports: ["websocket", "polling", "flashsocket"],
    });
    if (user) {
      socket.emit("joinRoom", { name: user.name, room });
    }
  }, [END_POINT, user]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  });

  function handleInput(e) {
    e.preventDefault();
    setMessage(e.target.value);
  }

  function handleSendMessage() {
    if (message) {
      socket.emit("sendMessage", { name: user.name, msg: message, room });
      setMessage("");
    }
  }

  function renderMessage(item, index) {
    if (item.name !== "Admin")
      return (
        <div
          className={
            item.name === user.name ? "flex justify-end" : "flex justify-start"
          }
        >
          <div
            key={index}
            className={
              item.name === user.name
                ? "w-auto max-w-full inline-block p-2 rounded-xl bg-blue-500 my-1 text-white"
                : "w-auto max-w-full inline-block p-2 rounded-xl bg-gray-400 my-1"
            }
          >
            <p className="text-s font-bold w-auto max-w-full">{item.name}</p>
            <p className="w-auto max-w-full">{item.msg}</p>
          </div>
        </div>
      );
    return <div key={index}>{item.msg}</div>;
  }

  return (
    <div className="h-full w-full">
      <div className="h-80p mx-2">
        <div className="text-2xl box-content">Message</div>
        <div className="text-xs">
          {messages?.map((item, index) => renderMessage(item, index))}
        </div>
      </div>

      <div className="h-20p flex border-t p-2 items-center">
        <div className="h-full w-11/12 p-1">
          <input
            type="text"
            name="message"
            placeholder="Ab"
            value={message}
            onChange={handleInput}
            className="h-full w-full text-xs no-scrollbar resize-none outline-none border-gray-400 border rounded-full p-2"
          />
        </div>
        <div className="h-full flex items-center w-1/12 text-xl">
          <button onClick={handleSendMessage} className="focus:outline-none">
            <svg width="1em" height="1em" viewBox="0 0 15 15">
              <g fill="none">
                <path
                  d="M14.5.5l.46.197a.5.5 0 0 0-.657-.657L14.5.5zm-14 6l-.197-.46a.5.5 0 0 0-.06.889L.5 6.5zm8 8l-.429.257a.5.5 0 0 0 .889-.06L8.5 14.5zM14.303.04l-14 6l.394.92l14-6l-.394-.92zM.243 6.93l5 3l.514-.858l-5-3l-.514.858zM5.07 9.757l3 5l.858-.514l-3-5l-.858.514zm3.889 4.94l6-14l-.92-.394l-6 14l.92.394zM14.146.147l-9 9l.708.707l9-9l-.708-.708z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Message);
