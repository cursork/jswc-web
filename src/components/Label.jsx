import { rgbColor, setStyle } from "../utils";
import "../styles/font.css";
import { useAppData } from "../hooks";

const Label = ({ data, gridValue }) => {
  let styles = setStyle(data?.Properties);


  const { findDesiredData, fontScale, socket } = useAppData();
  const haveColor = data?.Properties.hasOwnProperty("FCol");
  const haveFontProperty = data?.Properties.hasOwnProperty("Font");

  const { Visible, FontObj, Caption, Size, BCol } = data?.Properties;

  console.log("label", "noting", fontScale);
  // console.log("label", {data, BCol, Caption,  background: rgbColor(BCol)})

  if (haveColor) {
    styles = {
      ...styles,
      color: `rgb(${data?.Properties?.FCol[0]},${data?.Properties?.FCol[1]},${data?.Properties?.FCol[2]})`,
    };
  }

  if (haveFontProperty) {
    styles = {
      ...styles,
      fontFamily: data.Properties?.Font[0],
      fontSize: data?.Properties?.Font[1],
    };
  } else {
    const font = findDesiredData(FontObj && FontObj);
    const fontProperties = font && font?.Properties;
    styles = {
      ...styles,
      fontFamily: fontProperties?.PName,
      fontSize: fontProperties?.Size
        ? `${fontProperties.Size * fontScale}px`
        : `${12 * fontScale}px`,
      // fontSize: fontProperties?.Size ? `${fontProperties.Size * fontScale}px` : `${11 * fontScale}px`,
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
      background: BCol && rgbColor(BCol),
      // paddingLeft: '10px',
      // paddingRight: '10px'
    };
  }
  const handleMouseDown = (e) => {
    const shiftState = (e.shiftKey ? 1 : 0) + (e.ctrlKey ? 2 : 0); // Shift + Ctrl state
    const x = e.clientX;
    const y = e.clientY;
    const button = e.button;

    const mousedownEvent = JSON.stringify({
      Event: {
        EventName: "MouseDown",
        ID: data?.ID,
        Info: [x, y, button, shiftState],
      },
    });

    const exists = Event && Event.some((item) => item[0] === "MouseDown");
    if (!exists) return;
    console.log(mousedownEvent);
    socket.send(mousedownEvent);
  };

  const handleMouseUp = (e) => {
    const shiftState = (e.shiftKey ? 1 : 0) + (e.ctrlKey ? 2 : 0);
    const x = e.clientX;
    const y = e.clientY;
    const button = e.button;

    const mouseUpEvent = JSON.stringify({
      Event: {
        EventName: "MouseUp",
        ID: data?.ID,
        Info: [x, y, button, shiftState],
      },
    });

    const exists = Event && Event.some((item) => item[0] === "MouseUp");
    if (!exists) return;
    console.log(mouseUpEvent);
    socket.send(mouseUpEvent);
  };

  return (
    <div
      id={data?.ID}
      style={{ ...styles, display: Visible == 0 ? "none" : "block" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {!Caption ? (
        <span
          style={{
            display: "flex",
            justifyContent: typeof gridValue == "string" ? "start" : "end",
            fontSize: "12px",
            marginLeft: "5px",
          }}
        >
          {gridValue}
        </span>
      ) : (
        Caption
      )}
    </div>
  );
};

export default Label;
