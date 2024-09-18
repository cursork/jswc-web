import { useAppData } from '../../hooks';
import { rgbColor } from '../../utils';
const Circle = ({ data }) => {
  const parentSize = JSON.parse(localStorage.getItem('formDimension'));
  const { FillCol, Start, FCol, Points, Radius } = data?.Properties;
const {socket} = useAppData()
  const generatePieChartPaths = (startAngles) => {
    const cx = Points && Points[1][0];
    const cy = Points && Points[0][0];
    const rx = Radius && Radius[0];
    const ry = Radius && Radius[0];

    const paths = [];

    for (let i = 0; i < startAngles?.length; i++) {
      const startAngle = -startAngles[i];
      const endAngle = i === startAngles?.length - 1 ? 2 * Math.PI : -startAngles[i + 1];

      const startX = cx + rx * Math.cos(startAngle);
      const startY = cy + ry * Math.sin(startAngle);
      const endX = cx + rx * Math.cos(endAngle);
      const endY = cy + ry * Math.sin(endAngle);

      const path = `
                M ${cx},${cy}
                L ${startX},${startY}
                A ${rx},${ry} 0 0,0 ${endX},${endY}
                Z
            `;

      paths.push({
        d: path,
        fill: 'none',
        stroke: FCol && rgbColor(FCol[i]),
        strokeWidth: '1',
      });
    }

    return paths;
  };

  const paths = generatePieChartPaths(Start);
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
      }}
      onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
    >
      <svg height={parentSize && parentSize[0]} width={parentSize && parentSize[1]}>
        {paths.map((path, index) => (
          <path
            key={index}
            d={path.d}
            fill={path.fill}
            stroke={path.stroke}
            strokeWidth={path.strokeWidth}
          />
        ))}
      </svg>
    </div>
  );
};

export default Circle;
