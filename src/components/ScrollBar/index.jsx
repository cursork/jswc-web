import React, { useState, useRef } from 'react';
import { useAppData } from '../../hooks';
import './ScrollBar.css';

const ScrollBar = ({ data }) => {
  const { Align, Type, Thumb, Range } = data?.Properties;
  const isHorizontal = Type === 'Scroll' && Align === 'Bottom';
  const [scaledValue, setScaledValue] = useState(Thumb || 1);

  const { socket } = useAppData();
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const maxValue = Range;

  const trackHeight = 500;
  const trackWidth = 800;

  const handleThumbDrag = (event) => {
    event.preventDefault();

    const startPosition = isHorizontal ? event.clientX : event.clientY;

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
    if (thumbRef.current) {
      const trackRect = trackRef.current.getBoundingClientRect();
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
    }
  };

  let thumbPosition = (scaledValue / maxValue) * (trackHeight - 50); // Adjust for Height

  // adjust for the width
  if (isHorizontal) {
    thumbPosition = (scaledValue / maxValue) * (trackWidth - 50);
  }

  const maxThumbPosition = isHorizontal ? trackWidth - 50 : trackHeight - 100;

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

  const iconStyle = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    textAlign: 'center',
    backgroundColor: '#ccc',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    color: 'grey',
    border: '1px solid white',
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

  const incrementScale = () => {
    const newScaledValue = scaledValue + 1;
    if (newScaledValue <= maxValue) {
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

  const decrementScale = () => {
    const newScaledValue = scaledValue - 1;
    if (newScaledValue >= 1) {
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
      <div>
        {isHorizontal ? (
          <>
            <div
              className='scroll-bar-icon scroll-bar-icon-horizontal'
              style={{ ...iconStyle, left: '0' }}
              onClick={decrementScale}
            >
              ▼
            </div>
            <div
              className='scroll-bar-icon scroll-bar-icon-horizontal'
              style={{ ...iconStyle, right: '0' }}
              onClick={incrementScale}
            >
              ▲
            </div>
          </>
        ) : (
          <>
            <div
              className='scroll-bar-icon scroll-bar-icon-vertical'
              style={{ ...iconStyle, top: '0' }}
              onClick={decrementScale}
            >
              ▲
            </div>
            <div
              className='scroll-bar-icon scroll-bar-icon-vertical'
              style={{ ...iconStyle, bottom: '0' }}
              onClick={incrementScale}
            >
              ▼
            </div>
          </>
        )}
        <div
          className={`scroll-bar ${isHorizontal ? 'horizontal' : 'vertical'}`}
          style={{ ...trackStyle }}
          onMouseDown={handleThumbDrag}
          onClick={handleTrackClick}
          ref={trackRef}
        >
          <div className='thumb' style={{ ...thumbStyle }} ref={thumbRef}></div>
        </div>
      </div>
    </div>
  );
};

export default ScrollBar;
