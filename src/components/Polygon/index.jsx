import { useAppData } from "../../hooks";
import { rgbColor } from "../../utils";

const Poly = ({ data }) => {
  const { FCol, FillCol, LWidth, Points, FStyle, Visible } = data?.Properties;
  const { socket } = useAppData();

  const parentSize = JSON.parse(localStorage.getItem("formDimension"));
  const hasFCol = data?.Properties.hasOwnProperty("FCol");
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
      style={{ position: "absolute", display: Visible == 0 ? "none" : "block" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <svg
        height={parentSize && parentSize[0]}
        width={parentSize && parentSize[1]}
      >
        {Points?.map((polygonPoints, index) => {
          const flatArray =
            polygonPoints &&
            polygonPoints[0].map((x, i) => [polygonPoints[1][i], x]);

          return (
            <polygon
              id={index}
              key={index}
              points={flatArray && flatArray.flat().join(" ")}
              fill={
                FStyle && FStyle[index] == "-1"
                  ? "none"
                  : FillCol && rgbColor(FillCol[index])
              }
              stroke={hasFCol ? FCol && rgbColor(FCol[index]) : "rgb(0,0,0)"}
              stroke-width={LWidth && LWidth[index]}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Poly;
