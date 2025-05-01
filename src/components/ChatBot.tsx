import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

type Message = {
  sender: 'user' | 'bot';
  text?: string;
  image?: string;
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  



  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    setIsTyping(true);
    setInput('');
    setSelectedFile(null);
    if (!input.trim() && !selectedFile) return;
  
    // Create preview image URL (not base64 for performance)
    let imagePreviewUrl: string | undefined;
    if (selectedFile) {
      imagePreviewUrl = URL.createObjectURL(selectedFile);
    }
  
    // Include image in user message
    const userMsg: Message = {
      sender: 'user',
      text: input,
      image: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
    };
    setMessages(prev => [...prev, userMsg]);
    const historyForUpload = selectedFile ? [...messages, userMsg] : [...messages];
    const formData = new FormData();
    formData.append("message", input);
    let endpoint = "http://localhost:8000/api/swiftbot/chat";
  
    if (selectedFile) {
      formData.append("file", selectedFile);
      formData.append("history", JSON.stringify([...messages, { sender: "user", text: input }]));
      endpoint = "http://localhost:8000/api/swiftbot/image";
    }
    else {
      formData.append("message", input);
    }
  
    try {
      const res = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsTyping(false);
  
      const reply =
        res.data.refund_status ||
        res.data.refund_decision ||
        res.data.order_status ||
        res.data.bot_reply ||
        "🤖 Sorry, I couldn't understand.";
  
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 12,
        maxWidth: 350,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}>
     <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          borderRadius: '50%',
          backgroundColor: '#003b4a',
          color: 'white',
          width: 60,
          height: 60,
          fontSize: 28,
          border: 'none',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}
      >
        💬
      </button>


      {isOpen && (
        <div style={chatboxStyle}>
          <div style={headerStyle}>
            <span>🤖 SwiftBot</span>
            <button onClick={toggleChat} style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>×</button>
          </div>
          <div style={messageContainerStyle}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                margin: '6px 10px',
              }}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Uploaded"
                  style={{
                    maxWidth: '200px',
                    borderRadius: 8,
                    marginBottom: 4,
                  }}
                />
              )}
             {msg.sender === 'bot' ? (
                <div style={botMsgStyle}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <div style={userMsgStyle}>{msg.text}</div>
              )}
            </div>
          ))}
          {isTyping && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                margin: '6px 10px',
              }}
            >
              <div style={botMsgStyle}>
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          </div>
          
          {selectedFile && (
            <div style={{ fontSize: '12px', padding: '0 10px', color: '#555' }}>
              📎 Attached: {selectedFile.name}
            </div>
          )}
          <div style={{ padding: 10, display: 'flex', gap: 6 }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image"
            style={{
              backgroundColor: '#eee',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              fontSize: 20,
              cursor: 'pointer'
            }}
          >
            📎
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message..."
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 20,
              border: '1px solid #ccc'
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              backgroundColor: '#003b4a', // SwiftBite primary
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              fontSize: 18,
              cursor: 'pointer'
            }}
            title="Send"
          >
            📤
          </button>

          {/* Hidden input for image upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
        </div>
      )}
    </div>
  );
};

// Basic inline styles
const floatingButtonStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '10px 14px',
  fontSize: '24px',
  borderRadius: '50%',
  border: 'none',
  background: '#007bff',
  color: 'white',
  cursor: 'pointer',
};

const chatboxStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '70px',
  right: '20px',
  width: '500px', // increased width
  height: '620px', // new height
  background: 'white',
  border: '1px solid #ccc',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 0 10px rgba(0,0,0,0.2)',
  zIndex: 9999,
};

const headerStyle: React.CSSProperties = {
  backgroundColor: '#003b4a',
  color: '#ffffff',
  padding: '12px 16px',
  fontWeight: 'bold',
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const messageContainerStyle: React.CSSProperties = {
  height: '500px',
  overflowY: 'scroll',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

const userMsgStyle: React.CSSProperties = {
  alignSelf: 'flex-end',
  background: '#daf8ff',
  padding: '10px 14px',
  borderRadius: '18px 18px 0 18px',
  maxWidth: '75%',
  fontSize: '14px',
};

const botMsgStyle: React.CSSProperties = {
  alignSelf: 'flex-start',
  background: '#f5f5f5',
  padding: '10px 14px',
  borderRadius: '18px 18px 18px 0',
  maxWidth: '75%',
  fontSize: '14px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box',
  borderTop: '1px solid #ccc',
};

export default ChatBot;
