import React, { useEffect, useRef } from "react";
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

const TextArea = ({ data }) => {
  const { handleData, socket } = useAppData();
  const textareaRef = useRef(null);
  let styles = setStyle(data?.Properties);

  const { Text, Font, CSS, Event } = data?.Properties;
  const customStyles = parseFlexStyles(CSS);
  console.log("data seltext", data?.Properties);

  useEffect(() => {
    console.log("seltext in useEffect", Text, JSON.parse(localStorage.getItem(data.ID)).Text );
    handleData(
      {
        ID: data.ID,
        Properties: {
          Text: Text ? Text : JSON.parse(localStorage.getItem(data.ID)).Text,
        },
      },
      "WS"
    );

    //   // {"WS":}
  }, [Text]);

  let updatedStyles = {
    ...styles,
    scrollbarWidth: "thin",
    scrollbarColor: "transparent transparent",
    fontFamily: Font && Font[0],
    fontSize: Font && `${Font[1]}px`,
    ...customStyles,
  };

  if (Text) {
    localStorage.setItem(data.ID, JSON.stringify(data.Properties));
  }

  const textString = Array.isArray(Text) ? Text.join("\n") : Text;

  const handleMouseUpLocal = (e, type) => {
    if (type === "mouseUp") {
      handleMouseUp(e, socket, Event, data?.ID);
    } else if (type === "mouseDown") {
      handleMouseDown(e, socket, Event, data?.ID);
    } else if (type === "mouseLeave") {
      handleMouseLeave(e, socket, Event, data?.ID);
    } else if (type === "mouseEnter") {
      handleMouseEnter(e, socket, Event, data?.ID);
    } else if (type === "mouseMove") {
      handleMouseMove(e, socket, Event, data?.ID);
    } else if (type === "mouseWheel") {
      handleMouseWheel(e, socket, Event, data?.ID);
    } else if (type === "dblclick") {
      handleMouseDoubleClick(e, socket, Event, data?.ID);
    }
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
    console.log({ selText });

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
        onMouseUp={(e) => {
          handleMouseUpLocal(e, "mouseUp");
        }}
        onMouseDown={(e) => {
          handleMouseUpLocal(e, "mouseDown");
        }}
        onMouseEnter={(e) => {
          handleMouseUpLocal(e, "mouseEnter");
        }}
        onMouseLeave={(e) => {
          handleMouseUpLocal(e, "mouseLeave");
        }}
        onMouseMove={(e) => {
          handleMouseUpLocal(e, "mouseMove");
        }}
        onWheel={(e) => {
          handleMouseUpLocal(e, "mouseWheel");
        }}
        onDoubleClick={(e) => {
          handleMouseUpLocal(e, "dblclick");
        }}
        spellCheck={false}
      />
    </div>
  );
};

export default TextArea;
