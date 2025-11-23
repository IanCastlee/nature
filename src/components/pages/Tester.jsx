import { useState } from "react";

export default function Tester({ summary }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSend = async () => {
    const res = await fetch("send_to_messenger.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: summary.image,
        name,
        phone,
      }),
    });

    const text = await res.text();
    console.log(text);

    alert("Sent to the page's Messenger inbox!");
    setShowModal(false);
  };

  return (
    <div>
      {/* Summary (the clickable card) */}
      <div
        style={{
          padding: 10,
          border: "1px solid #ccc",
          marginBottom: 10,
          cursor: "pointer",
        }}
        onClick={() => setShowModal(true)}
      >
        <h3>{summary.title}</h3>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: "0",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              width: "400px",
              borderRadius: "10px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{summary.title}</h2>

            <img
              src={summary.image}
              alt="summary"
              style={{ width: "100%", borderRadius: "8px" }}
            />

            <p>{summary.description}</p>

            {/* Name */}
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />

            {/* Phone */}
            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              style={{
                marginTop: "15px",
                padding: "10px",
                width: "100%",
                background: "#1877f2",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send to Messenger
            </button>

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "10px",
                padding: "10px",
                width: "100%",
                background: "#ccc",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
