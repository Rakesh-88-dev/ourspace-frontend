import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

const socket = io("https://ourspace-backend-szfy.onrender.com");

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const bottomRef = useRef();

  const myId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // join socket
  useEffect(() => {
    socket.emit("join", myId);
  }, []);

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("https://ourspace-backend-szfy.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  // fetch messages when user selected
  useEffect(() => {
    if (!selectedUser) return;
    // ✅ MARK MESSAGES AS SEEN
socket.emit("mark_seen", {
  senderId: selectedUser._id,
  receiverId: myId,
});

    const fetchMessages = async () => {
      const res = await axios.get(
        `https://ourspace-backend-szfy.onrender.com/api/messages/${selectedUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data);
    };

    fetchMessages();
  }, [selectedUser]);

  // receive messages
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receive_message");
  }, []);

  // ✅ LISTEN FOR SEEN STATUS
useEffect(() => {
  socket.on("messages_seen", () => {
    setMessages((prev) =>
      prev.map((m) =>
        m.senderId === myId ? { ...m, status: "seen" } : m
      )
    );
  });

  return () => socket.off("messages_seen");
}, []);

  // send message
  const sendMessage = () => {
    if (!text.trim() || !selectedUser) return;

    socket.emit("send_message", {
  senderId: myId,
  receiverId: selectedUser._id,
  text,
  status: "sent", // ✅ ADD THIS
});

    setText("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const handleEmoji = (emojiData) => {
  setText((prev) => prev + emojiData.emoji);
};

return (
  <div className="flex h-screen bg-[#111b21] text-white">

    {/* 🧑 LEFT - CHAT LIST */}
    <div className="w-72 bg-[#202c33] border-r border-[#2a3942] flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-[#2a3942] font-semibold">
        Chats
      </div>

      {/* Users */}
      <div className="flex-1 overflow-y-auto">
        {users.map((u) => (
          <div
            key={u._id}
            onClick={() => setSelectedUser(u)}
            className={`p-4 cursor-pointer border-b border-[#2a3942] hover:bg-[#2a3942] ${
              selectedUser?._id === u._id && "bg-[#2a3942]"
            }`}
          >
            <p className="font-medium">{u.name}</p>
            <p className="text-xs text-gray-400">Tap to chat</p>
          </div>
        ))}
      </div>
    </div>

    {/* 💬 RIGHT - CHAT AREA */}
    <div className="flex-1 flex flex-col">

      {!selectedUser ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          Select a chat
        </div>
      ) : (
        <>
          {/* 🔝 CHAT HEADER */}
          <div className="bg-[#202c33] p-4 border-b border-[#2a3942] flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
            <div>
              <p className="font-semibold">{selectedUser.name}</p>
              <p className="text-xs text-gray-400">online</p>
            </div>
          </div>

          {/* 💬 MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#0b141a] space-y-2">

            {messages.map((m, i) => {
              const isMe = m.senderId.toString() === myId;

              return (
                <div
                  key={i}
                  className={`flex ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 max-w-xs text-sm relative ${
                      isMe
                        ? "bg-[#005c4b] text-white rounded-lg rounded-br-none"
                        : "bg-[#202c33] text-white rounded-lg rounded-bl-none"
                    }`}
                  >  {m.text}

  {/* 🕒 TIME + STATUS */}
  <div className="flex items-center justify-end gap-1 text-[10px] mt-1">

    {/* TIME */}
    <span className="text-gray-300">
      {new Date(m.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>

    {/* STATUS (ONLY FOR MY MESSAGES) */}
    {isMe && (
      <span
        className={`${
          m.status === "seen"
            ? "text-blue-400"
            : "text-gray-300"
        }`}
      >
        {m.status === "sent" && "✓"}
        {m.status === "delivered" && "✓✓"}
        {m.status === "seen" && "✓✓"}
      </span>
    )}
  </div>
</div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>

          {/* ✏️ INPUT BAR */}
          <div className="bg-[#202c33] p-3 flex items-center gap-2">

            {/* Emoji */}
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-xl px-2"
            >
              😊
            </button>

            {/* Input */}
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message"
              className="flex-1 bg-[#2a3942] px-4 py-2 rounded-full outline-none"
            />

            {/* Send */}
            <button
              onClick={sendMessage}
              className="bg-[#00a884] px-4 py-2 rounded-full"
            >
              ➤
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="absolute bottom-20 left-72 z-50">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
}