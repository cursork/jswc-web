import { useAppData } from '../../hooks';
import { rgbColor } from '../../utils';
import Canvas from '../Canvas';

const Rectangle = ({
  data,
  parentSize = JSON.parse(localStorage.getItem('formDimension')),
  posn = [0, 0],
}) => {
  const { Points, Size, FCol, Radius, Visible, FStyle, FillCol } = data?.Properties;
  const {socket} = useAppData()
  
  const pointsArray = Points && Points[0].map((y, i) => [Points[1][i], y]);
  const sizeArray = Size && Size[0].map((y, i) => [Size[1][i], y]);

  const hasFCol = data?.Properties.hasOwnProperty('FCol');
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        display: Visible == 0 ? 'none' : 'block',
      }}
      onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      
    >
      <svg height={parentSize && parentSize[0]} width={parentSize && parentSize[1]}>
        {pointsArray?.map((rectanglePoints, index) => {
          return (
            <rect
              id={index}
              rx={Radius && Radius[index * 0]}
              ry={Radius && Radius[index * 0]}
              x={rectanglePoints[0]}
              y={rectanglePoints[1]}
              width={sizeArray && sizeArray[index][0] + 1}
              height={sizeArray && sizeArray[index][1] + 1}
              fill={
                !FStyle
                  ? 'none'
                  : FStyle[index] == '-1'
                  ? 'none'
                  : rgbColor(FillCol && FillCol[index])
              }
              stroke={hasFCol ? FCol && rgbColor(FCol[index]) : 'rgb(0,0,0)'}
              strokeWidth={'1px'}

            />
          );
        })}
      </svg>
    </div>
  );
};

export default Rectangle;
