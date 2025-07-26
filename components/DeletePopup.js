import React from 'react';


const SuccessPopup = ({
    isOpen,
    onClose,
    message = "Bid Placed Successfully",
    subMessage = "Your bid has been recorded!"
  }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="overlay" onClick={handleClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <button className="closeBtn" onClick={handleClose}>✕</button>
        <div className="imageContainer">
          <img src="/assets/images/deleteimg.png" alt="Success" className="successImage" />
        </div>
        <div className="message">{message}</div>
        <div className="subMessage">{subMessage}</div>
      </div>
      <style jsx>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeInOverlay 0.5s ease-in-out;
          z-index: 1000;
        }
        .popup {
          background: linear-gradient(135deg, #ffffff, #ffff);
          padding: 50px 60px;
          border-radius: 16px;
          text-align: center;
          position: relative;
          animation: popupIn 0.6s ease-out;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          border: 1px solid #cceeff;
        }
        .closeBtn {
          position: absolute;
          top: 10px;
          right: 20px;
          border: none;
          background: transparent;
          font-size: 20px;
          cursor: pointer;
        }
        .imageContainer {
          margin-bottom: 20px;
        }
        .successImage {
          width: 100px;
          height: 100px;
          animation: bounce 0.6s ease-out;
        }
        .message {
          font-size: 30px;
          font-weight: bolder;
          color: #5cb85c;
          margin-bottom: 10px;
        }
        .subMessage {
          font-size: 20px;
          color: #555;
          margin-bottom: 10px;
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SuccessPopup;
