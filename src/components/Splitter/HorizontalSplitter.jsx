import { useState, useEffect } from 'react';
import { useAppData, useResizeObserver } from '../../hooks';
import { extractStringUntilSecondPeriod } from '../../utils';

const HorizontalSplitter = ({ data }) => {
  const { Size: SubformSize, Posn: SubFormPosn } = JSON.parse(
    localStorage.getItem(extractStringUntilSecondPeriod(data?.ID))
  );

  const { Posn, SplitObj1, SplitObj2, Event } = data?.Properties;
  const [position, setPosition] = useState({ top: Posn && Posn[0] });
  const [isResizing, setResizing] = useState(false);
  const { handleData, reRender, socket } = useAppData();
  const dimensions = useResizeObserver(
    document.getElementById(extractStringUntilSecondPeriod(data?.ID))
  );
  const [oldFormValues, setoldFormValues] = useState(SubformSize && SubformSize);

  useEffect(() => {
    if (!position) return;
    if (!oldFormValues) return;
    const calculateTop =
      position && position.top && oldFormValues && oldFormValues[0]
        ? (position.top / oldFormValues[0]) * dimensions.height
        : 0;
    setPosition({ top: calculateTop });

    handleData(
      {
        ID: SplitObj1,
        Properties: {
          Posn: [0, 0],
          Size: [calculateTop, dimensions.width],
        },
      },
      'WS'
    );

    handleData(
      {
        ID: SplitObj2,
        Properties: {
          Posn: [calculateTop + 3, 0],
          Size: [dimensions.height - (calculateTop + 3), dimensions.width],
        },
      },
      'WS'
    );

    reRender();
  }, [dimensions]);

  let formHeight = dimensions.height;
  const emitEvent = Event && Event[0];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        let newTop = e.clientY;

        const parentSize = JSON.parse(
          localStorage.getItem(extractStringUntilSecondPeriod(data?.ID))
        );
        const { Size } = parentSize;

        newTop = Math.max(0, Math.min(newTop, formHeight));
        handleData(
          {
            ID: SplitObj1,
            Properties: {
              Posn: [0, 0],
              Size: [newTop, Size[1]],
            },
          },
          'WS'
        );

        handleData(
          {
            ID: SplitObj2,
            Properties: {
              Posn: [newTop + 3, 0],
              Size: [formHeight - (newTop + 3), Size[1]],
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
              Info: [newTop, 0, 3, formHeight],
              Size: [3, 800],
            },
          })
        );
        reRender();
        setPosition({ top: newTop });
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
  }, [isResizing, position.top]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setResizing(true);
  };

  let horizontalStyles = {
    width: '100%',
    height: '3px',
    backgroundColor: '#F0F0F0',
    cursor: 'row-resize',
    position: 'absolute',
    top: position?.top,
    left: 0,
  };

  return <div style={horizontalStyles} onMouseDown={(e) => handleMouseDown(e)}></div>;
};

export default HorizontalSplitter;
