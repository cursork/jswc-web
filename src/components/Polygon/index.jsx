import { useAppData } from "../../hooks";
import { handleMouseDown, handleMouseEnter, handleMouseLeave, handleMouseMove, handleMouseUp, parseFlexStyles, rgbColor } from "../../utils";

const Poly = ({ data }) => {
  const { FCol, FillCol, LWidth, Points, FStyle, Visible, Event, CSS } = data?.Properties;
  const { socket } = useAppData();
  const customStyles = parseFlexStyles(CSS)

  const parentSize = JSON.parse(localStorage.getItem("formDimension"));
  const hasFCol = data?.Properties.hasOwnProperty("FCol");

  return (
    <div
      id={data?.ID}
      style={{ position: "absolute", display: Visible == 0 ? "none" : "block" ,...customStyles}}
      onMouseDown={(e) => {
        handleMouseDown(e, socket, Event,data);
      }}
      onMouseUp={(e) => {
        handleMouseUp(e, socket, Event, data);
      }}
      onMouseEnter={(e) => {
        handleMouseEnter(e, socket, Event, data);
      }}
      onMouseMove={(e) => {
        handleMouseMove(e, socket, Event, data);
      }}
      onMouseLeave={(e) => {
        handleMouseLeave(e, socket, Event, data);
      }}
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
