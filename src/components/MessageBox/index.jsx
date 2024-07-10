import React from "react";
import "./MessageBox.css";
import { isElement } from "lodash";

const MsgBox = ({ data, onClose, isDesktop, options }) => {
  console.log("msgbox", data, options?.Desktop);
  const { Caption, Text, Style, Btns } = data?.Properties;
  console.log({ Caption, Text, Style, Btns, isDesktop });
  const getIconClass = () => {
    switch (Style) {
      case "Info":
        return "info-icon";
      case "Query":
        return "query-icon";
      case "Warn":
        return "warn-icon";
      case "Error":
        return "error-icon";
      default:
        return "";
    }
  };


  let renderCheck = options.Desktop === 1 ? false : true
  return (
    <div className="msgbox-overlay">
      <div className={`msgbox-container ${renderCheck? 'with-border': ''}`}>
        {renderCheck && <div className= "msgbox-header with-border">{Caption}</div>}
        <div className="msgbox-body">
          {Style && Style !== "Msg" && (
            <span className={`icon ${getIconClass()}`}></span>
          )}
          <span>{Text}</span>
        </div>
        <div className={`msgbox-footer ${renderCheck ? 'with-border': ''}`}>
          {Array.isArray(Btns) ? (
            Btns.map((btn, index) => (
              <button
                key={index}
                className="rounded-button "
                onClick={() => onClose(`MsgBtn${index + 1}`, data?.ID)}
              >
                {btn.toLowerCase()}
              </button>
            ))
          ) : (
            <button
              className="rounded-button"
              onClick={() => onClose("MsgBtn1", data?.ID)}
            >
              {Btns}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MsgBox;
