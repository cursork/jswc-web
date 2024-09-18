import { useAppData } from '../../hooks';
import { renderImage } from '../../utils';

const Image = ({ data }) => {
  const PORT = localStorage.getItem('PORT');
  const { findDesiredData, socket } = useAppData();
  const { Points, Picture, Visible } = data?.Properties;

  const pointsArray = Points && Points[0].map((y, i) => [Points[1][i], y]);
  const parentSize = JSON.parse(localStorage.getItem('formDimension'));
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
        display: Visible == 0 ? 'none' : 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        display: Visible == 0 ? 'none' : 'block',
      }}
      onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      
    >
      <svg height={parentSize && parentSize[0]} width={parentSize && parentSize[1]}>
        {pointsArray.map((imagePoints, index) => {
          const imageObject = findDesiredData(Picture && Picture[index]);
          const ImageUrl = renderImage(PORT, imageObject);
          return <image href={ImageUrl} x={imagePoints[0]} y={imagePoints[1]} />;
        })}
      </svg>
    </div>
  );
};

export default Image;
