import { useEffect, useState } from 'react';
import { useAppData } from '../../hooks';

const VerticalSplitter = ({ data }) => {
  const { Posn, SplitObj1, SplitObj2, Event } = data?.Properties;
  const [position, setPosition] = useState({ left: Posn && Posn[1] });
  const [isResizing, setResizing] = useState(false);
  const { handleData, reRender, socket } = useAppData();
  let formWidth = 800;
  let formHeight = 800;
  const emitEvent = Event && Event[0];

  let verticalStyles = {
    width: '3px',
    height: '100%',
    backgroundColor: '#CCCCCC',
    cursor: 'col-resize',
    position: 'absolute',
    top: Posn && Posn[0],
    left: position?.left,
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        let newLeft = e.clientX;
        newLeft = Math.max(0, Math.min(newLeft, formWidth - 3));
        const rightWidth = formWidth - (newLeft + 3);

        handleData(
          {
            ID: SplitObj1,
            Properties: {
              Posn: [0, 0],
              Size: [formHeight, newLeft],
              BCol: [255, 255, 255],
            },
          },
          'WS'
        );

        handleData(
          {
            ID: SplitObj2,
            Properties: {
              Posn: [0, newLeft + 3],
              Size: [formHeight, rightWidth],
              BCol: [255, 255, 255],
            },
          },
          'WS'
        );

        localStorage.setItem(
          data?.ID,
          JSON.stringify({
            Event: {
              EventName: emitEvent && emitEvent[0],
              ID: data.ID,
              Info: [0, newLeft, formWidth, 3],
              Size: [formHeight, 3],
            },
          })
        );
        reRender();

        setPosition({ left: newLeft });
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setResizing(false);
        const { Event: customEvent } = JSON.parse(localStorage.getItem(data?.ID));
        const { Size, ...event } = customEvent;
        const exists = Event && Event?.some((item) => item[0] === 'EndSplit');
        if (!exists) return;
        console.log(JSON.stringify({ Event: { ...event } }));
        socket.send(JSON.stringify({ Event: { ...event } }));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setResizing(true);
  };

  return <div onMouseDown={handleMouseDown} style={verticalStyles}></div>;
};

export default VerticalSplitter;
