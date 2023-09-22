import { useState } from 'react';
import { useAppData } from '../../hooks';
import './ScrollBar.css';

const ScrollBar = ({ data }) => {
  const { Align, Type, Thumb, Range } = data?.Properties;
  const isHorizontal = Type === 'Scroll' && Align === 'Bottom';
  const [scaledValue, setScaledValue] = useState(Thumb || 1); // Initialize the scaled value to 1

  const { socket } = useAppData();

  const trackHeight = 500; // Height of the scroll track in pixels
  const trackWidth = 800; // Width of the scroll track in pixels
  const maxValue = Range; // Maximum value of the scroll

  let thumbPosition = (scaledValue / maxValue) * (trackHeight - 50); // Adjust for Height

  // adjust for the width
  if (isHorizontal) {
    thumbPosition = (scaledValue / maxValue) * (trackWidth - 50);
  }

  const trackStyle = {
    width: isHorizontal ? `${trackWidth}px` : '10px',
    height: isHorizontal ? '10px' : `${trackHeight}px`,
    backgroundColor: '#ccc',
    position: 'relative',
    border: '1px solid white',
  };

  const thumbStyle = {
    width: '50px',
    height: '50px',
    backgroundColor: 'grey',
    position: 'absolute',
    left: isHorizontal ? `${thumbPosition}px` : 0,
    top: isHorizontal ? 0 : `${thumbPosition}px`,
    cursor: 'pointer',
  };

  const verticalPosition = {
    position: 'absolute',
    top: 0,
    right: 0,
  };

  const horizontalPosition = {
    position: 'absolute',
    left: 0,
    bottom: 0,
  };

  const handleThumbDrag = (event) => {
    event.preventDefault();
    const startPosition = isHorizontal ? event.clientX : event.clientY;

    // Decide the maximum thumb position according to the orientation
    const maxThumbPosition = isHorizontal ? trackWidth : trackHeight;

    const handleMouseMove = (moveEvent) => {
      const currentPosition = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
      const newPosition = thumbPosition + (currentPosition - startPosition);

      const newThumbPosition = Math.max(0, Math.min(maxThumbPosition, newPosition));
      const newScaledValue = (newThumbPosition / maxThumbPosition) * maxValue;

      if (newScaledValue >= 1 && newScaledValue <= maxValue) {
        setScaledValue(newScaledValue);

        console.log(
          'Event',
          JSON.stringify({
            Event: {
              EventName: data?.Properties?.Event[0],
              ID: data?.ID,
              Info: [Math.round(scaledValue), Math.round(newScaledValue)],
            },
          })
        );

        localStorage.setItem(
          'lastEvent',
          JSON.stringify({
            Event: {
              EventName: data?.Properties?.Event[0],
              ID: data?.ID,
              Info: [Math.round(scaledValue), Math.round(newScaledValue)],
            },
          })
        );

        socket.send(
          JSON.stringify({
            Event: {
              EventName: data?.Properties?.Event[0],
              ID: data?.ID,
              Info: [Math.round(scaledValue), Math.round(newScaledValue)],
            },
          })
        );
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTrackClick = (event) => {
    const trackRect = event.currentTarget.getBoundingClientRect();
    const clickPosition = isHorizontal
      ? event.clientX - trackRect.left
      : event.clientY - trackRect.top;

    const newScaledValue = isHorizontal
      ? (clickPosition / trackWidth) * maxValue
      : (clickPosition / (trackHeight - 50)) * maxValue;

    if (newScaledValue >= 1 && newScaledValue <= maxValue) {
      setScaledValue(newScaledValue);

      console.log(
        'Event',
        JSON.stringify({
          Event: {
            EventName: data?.Properties?.Event[0],
            ID: data?.ID,
            Info: [Math.round(scaledValue), Math.round(newScaledValue)],
          },
        })
      );

      localStorage.setItem(
        'lastEvent',
        JSON.stringify({
          Event: {
            EventName: data?.Properties?.Event[0],
            ID: data?.ID,
            Info: [Math.round(scaledValue), Math.round(newScaledValue)],
          },
        })
      );

      socket.send(
        JSON.stringify({
          Event: {
            EventName: data?.Properties?.Event[0],
            ID: data?.ID,
            Info: [Math.round(scaledValue), Math.round(newScaledValue)],
          },
        })
      );
    }
  };

  return (
    <div style={isHorizontal ? horizontalPosition : verticalPosition}>
      <div
        className={`scroll-bar ${isHorizontal ? 'horizontal' : 'vertical'}`}
        style={{ ...trackStyle }}
        onMouseDown={(e) => handleThumbDrag(e)}
        onClick={(e) => handleTrackClick(e)}
      >
        <div className='thumb' style={{ ...thumbStyle }}></div>
      </div>
    </div>
  );
};

export default ScrollBar;
