import React from "react";
import "./MessageBox.css";

const MsgBox = ({ data, onClose }) => {
  console.log("msgbox", data);
  const { Caption, Text, Style, Btns } = data?.Properties;
  console.log({Caption, Text, Style, Btns})
  const getIconClass = () => {
    switch (Style) {
      case 'Info':
        return 'info-icon';
      case 'Query':
        return 'query-icon';
      case 'Warn':
        return 'warn-icon';
      case 'Error':
        return 'error-icon';
      default:
        return '';
    }
  };
  return (
    <div className="msgbox-overlay">
      <div className="msgbox-container">
        <div className="msgbox-header">{Caption}</div>
        <div className="msgbox-body">
          {Style && Style !== 'Msg' && <span className={`icon ${getIconClass()}`}></span>}
          <span>{Text}</span>
        </div>
        <div className="msgbox-footer">
          {Array.isArray(Btns) ? (
            Btns.map((btn, index) => (
              <button key={index} className="rounded-button " onClick={() => onClose(`MsgBtn${index + 1}`, data?.ID)}>
                {btn.toLowerCase()}
              </button>
            ))
          ) : (
            <button className="rounded-button" onClick={() => onClose('MsgBtn1', data?.ID)}>
              {Btns}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MsgBox;
