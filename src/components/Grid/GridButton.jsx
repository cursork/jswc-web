import React, { useRef, useEffect, useState } from "react";
import { useAppData } from "../../hooks";
import { handleMouseDown, handleMouseEnter, handleMouseLeave, handleMouseMove, handleMouseUp, handleMouseWheel } from "../../utils";

const GridButton = ({ data }) => {
  console.log("GridButton", data);
  const buttonRef = useRef(null);
  const { handleData, socket, findDesiredData } = useAppData();
  const [checkInput, setCheckInput] = useState(data?.value);
  const [showInput, setShowInput] = useState(data?.showInput);
  const [isFocused, setisFocused] = useState(false);
  useEffect(() => {
    if (data.focused) {
      buttonRef?.current?.focus();
    }
  }, [data.focused, showInput]);

  const {  Event } = data?.typeObj?.Properties;

  const handleCellChangedEvent = (value) => {
    const gridEvent = findDesiredData(data?.gridId);
    const values = data?.gridValues;

    values[data?.row - 1][data?.column] = value ? 1 : 0;
    handleData(
      {
        ID: data?.gridId,
        Properties: {
          ...gridEvent.Properties,
          Values: values,
          CurCell: [data?.row, data?.column + 1],
        },
      },
      "WS"
    );

    const triggerEvent = JSON.stringify({
      Event: {
        EventName: "CellChanged",
        ID: data?.gridId,
        Row: data?.row,
        Col: data?.column + 1,
        Value: value ? 1 : 0,
      },
    });

    const updatedGridValues = JSON.stringify({
      Event: {
        EventName: "CellChanged",
        Values: values,
        CurCell: [data?.row, data?.column + 1],
      },
    });

    const formatCellEvent = JSON.stringify({
      FormatCell: {
        Cell: [data?.row, data?.column + 1],
        ID: data?.gridId,
        Value: value ? 1 : 0,
      },
    });

    localStorage.setItem(data?.gridId, updatedGridValues);
    console.log(triggerEvent);
    const exists =
      data?.gridEvent &&
      data?.gridEvent.some((item) => item[0] === "CellChanged");
    if (!exists) return;
    console.log(formatCellEvent);
    socket.send(formatCellEvent);
    socket.send(triggerEvent);
    localStorage.setItem(
      "isChanged",
      JSON.stringify({ isChange: true, value: value ? 1 : 0 })
    );
  };

  const handleCheckBoxEvent = (value) => {
    // handleSelectEvent(value);
    handleCellChangedEvent(value);
  };

  const fontProperties = data?.cellFont && data?.cellFont?.Properties;

  let fontStyles = {
    fontFamily: fontProperties?.PName,
    fontSize: !fontProperties?.Size ? "12px" : "12px",
    // fontSize: !fontProperties?.Size ? '11px' : '12px',
    textDecoration: !fontProperties?.Underline
      ? "none"
      : fontProperties?.Underline == 1
      ? "underline"
      : "none",
    fontStyle: !fontProperties?.Italic
      ? "none"
      : fontProperties?.Italic == 1
      ? "italic"
      : "none",
    fontWeight: !fontProperties?.Weight ? 0 : fontProperties?.Weight,
  };

  return (
    <>
      {!showInput ? (
        <div
          // onMouseDown={(e) => {
          //   handleMouseDown(e, socket, Event, data?.gridId);
          // }}
          // onMouseUp={(e) => {
          //   handleMouseUp(e, socket, Event, data?.gridId);
          // }}
          // onMouseEnter={(e) => {
          //   handleMouseEnter(e, socket, Event, data?.gridId);
          // }}
          // onMouseMove={(e) => {
          //   handleMouseMove(e, socket, Event, data?.gridId);
          // }}
          // onMouseLeave={(e) => {
          //   handleMouseLeave(e, socket, Event, data?.gridId);
          // }}
          // onWheel={(e) => {
          //   handleMouseWheel(e, socket, Event, data?.gridId);
          // }}
          id={`${data?.typeObj?.ID}`}
          onDoubleClick={() => {
            setShowInput(true);
            setisFocused(true);
          }}
          ref={buttonRef}
          tabIndex={"1"}
          // onDoubleClick={() => setShowInput(true)}
          style={{
            backgroundColor: data?.backgroundColor,
            ...fontStyles,
            outline: 0,
            paddingRight: "5px",
          }}
        >
          {!data?.formattedValue ? (
            <input
              ref={buttonRef}
              id={`${data?.typeObj?.ID}`}
              type="checkbox"
              checked={checkInput}
              onChange={(e) => {
                setCheckInput(e.target.checked);
                handleCheckBoxEvent(e.target.checked);
              }}
              // onBlur={() => setShowInput(false)}
              style={{
                backgroundColor: data?.backgroundColor,
                outline: 0,
                marginLeft: "3px",
              }}
              // onMouseDown={(e) => {
              //   handleMouseDown(e, socket, Event,data?.gridId);
              // }}
              // onMouseUp={(e) => {
              //   handleMouseUp(e, socket, Event, data?.gridId);
              // }}
              // onMouseEnter={(e) => {
              //   handleMouseEnter(e, socket, Event, data?.gridId);
              // }}
              // onMouseMove={(e) => {
              //   handleMouseMove(e, socket, Event, data?.gridId);
              // }}
              // onMouseLeave={(e) => {
              //   handleMouseLeave(e, socket, Event, data?.gridId);
              // }}
              // onWheel={(e) => {
              //   handleMouseWheel(e, socket, Event, data?.gridId);
              // }}
            />
          ) : (
            data?.formattedValue
          )}
        </div>
      ) : (
        <input
          ref={buttonRef}
          id={`${data?.typeObj?.ID}.r${data?.row + 1}.c${data?.column + 1}`}
          type="checkbox"
          checked={checkInput}
          onChange={(e) => {
            setCheckInput(e.target.checked);
            handleCheckBoxEvent(e.target.checked);
          }}
          onBlur={() => setShowInput(false)}
          style={{
            backgroundColor: data?.backgroundColor,
            outline: 0,
            marginLeft: "3px",
          }}
          onMouseDown={(e) => {
            handleMouseDown(e, socket, Event,data?.gridId);
          }}
          onMouseUp={(e) => {
            handleMouseUp(e, socket, Event, data?.gridId);
          }}
          onMouseEnter={(e) => {
            handleMouseEnter(e, socket, Event, data?.gridId);
          }}
          onMouseMove={(e) => {
            handleMouseMove(e, socket, Event, data?.gridId);
          }}
          onMouseLeave={(e) => {
            handleMouseLeave(e, socket, Event, data?.gridId);
          }}
          onWheel={(e) => {
            handleMouseWheel(e, socket, Event, data?.gridId);
          }}
        />
      )}
    </>
  );
};

export default GridButton;
