import React, { useRef } from "react";
import {
  handleMouseDoubleClick,
  handleMouseDown,
  handleMouseEnter,
  handleMouseLeave,
  handleMouseMove,
  handleMouseUp,
  handleMouseWheel,
  parseFlexStyles,
  setStyle,
} from "../../utils";
import "./textArea.css";
import "../../styles/font.css";
import { useAppData } from "../../hooks";

const TextArea = ({ data, onUpdateProperties }) => {
  const { handleData, socket } = useAppData();
  const textareaRef = useRef(null);
  let styles = setStyle(data?.Properties);

  const { Text, Font, CSS, Event } = data?.Properties;
  const customStyles = parseFlexStyles(CSS);

  let updatedStyles = {
    ...styles,
    scrollbarWidth: "thin",
    scrollbarColor: "transparent transparent",
    fontFamily: Font && Font[0],
    fontSize: Font && `${Font[1]}px`,
    ...customStyles,
  };

  // Convert Text array to string if in Multi mode
  const textString = Array.isArray(Text) ? Text.join("\n") : Text;

  const handleMouseUpLocal = (e) => {
    handleMouseUp(e, socket, Event, data?.ID);
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const textLines = textString.split("\n");

    const offsetToLineColumn = (offset, lines) => {
      let totalChars = 0;
      for (let i = 0; i < lines.length; i++) {
        const lineLength = lines[i].length;
        if (offset <= totalChars + lineLength) {
          const lineNumber = i + 1;
          const columnNumber = offset - totalChars + 1;
          return [lineNumber, columnNumber];
        }
        totalChars += lineLength + 1;
      }
      const lineNumber = lines.length;
      const columnNumber = lines[lines.length - 1].length + 1;
      return [lineNumber, columnNumber];
    };

    const startLineCol = offsetToLineColumn(selectionStart, textLines);
    const endLineCol = offsetToLineColumn(selectionEnd, textLines);

    const selText = [startLineCol, endLineCol];

    handleData(
      {
        ID: data?.ID,
        Properties: {
          SelText: selText,
        },
      },
      "WS"
    );
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <textarea
        ref={textareaRef}
        className="textArea"
        style={updatedStyles}
        defaultValue={textString}
        onMouseUp={handleMouseUpLocal}
        onKeyUp={handleMouseUpLocal}
        onMouseDown={(e) => {
          handleMouseDown(e, socket, Event, data?.ID);
        }}
        onMouseEnter={(e) => {
          handleMouseEnter(e, socket, Event, data?.ID);
        }}
        onMouseMove={(e) => {
          handleMouseMove(e, socket, Event, data?.ID);
        }}
        onMouseLeave={(e) => {
          handleMouseLeave(e, socket, Event, data?.ID);
        }}
        onWheel={(e) => {
          handleMouseWheel(e, socket, Event, data?.ID);
        }}
        onDoubleClick={(e) => {
          handleMouseDoubleClick(e, socket, Event, data?.ID);
        }}
        spellCheck={false}
      />
    </div>
  );
};

export default TextArea;
