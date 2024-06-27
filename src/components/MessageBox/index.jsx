import React from "react";
import "./MessageBox.css";

const MsgBox = ({ data, onClose }) => {
  console.log("msgbox", data);
  const { Caption, Text, Style, Btns } = data?.Properties;
  const renderIcon = () => {
    switch (Style) {
      case "Info":
        return <i className="icon info-icon">i</i>;
      case "Query":
        return <i className="icon query-icon">?</i>;
      case "Warn":
        return <i className="icon warn-icon">!</i>;
      case "Error":
        return <i className="icon error-icon">x</i>;
      default:
        return null;
    }
  };

  return (
    <div className="msgbox-overlay">
      <div className="msgbox-container">
        <div className="msgbox-header">{Caption}</div>
        <div className="msgbox-body">
          {renderIcon()}
          <span>{Text}</span>
        </div>
        <div className="msgbox-footer">
          {Btns.map((btn, index) => (
            <button key={index} onClick={() => onClose(`MsgBtn${index + 1}`)}>
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MsgBox;
