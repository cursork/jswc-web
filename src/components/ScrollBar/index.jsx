import React, { useState, useRef } from 'react';
import { Icons } from '../../common';
import { useAppData } from '../../hooks';
import './ScrollBar.css';

const ScrollBar = ({ data }) => {
  const { FA } = Icons;
  const { Align, Type, Thumb, Range } = data?.Properties;
  const isHorizontal = Type === 'Scroll' && Align === 'Bottom';
  const [scaledValue, setScaledValue] = useState(Thumb || 1);

  const [showButtons, setShowButtons] = useState(false);

  const handleTrackMouseEnter = () => {
    setShowButtons(true);
  };

  const handleTrackMouseLeave = () => {
    setShowButtons(false);
  };

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

  let thumbPosition = (scaledValue / maxValue) * (trackHeight - 40); // Adjust for Height

  // adjust for the width
  if (isHorizontal) {
    thumbPosition = (scaledValue / maxValue) * (trackWidth - 40);
  }

  const maxThumbPosition = isHorizontal ? trackWidth - 50 : trackHeight - 100;

  const trackStyle = {
    width: isHorizontal ? `${trackWidth}px` : '10px',
    height: isHorizontal ? '10px' : `${trackHeight}px`,
  };

  const thumbStyle = {
    width: isHorizontal ? '40px' : '6px',
    height: isHorizontal ? '6px' : '40px',
    backgroundColor: '#9E9E9E',
    position: 'absolute',
    left: isHorizontal ? `${thumbPosition}px` : 2,
    top: isHorizontal ? 2 : `${thumbPosition}px`,
    cursor: 'pointer',
    borderRadius: '5px',
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
    <div
      onMouseEnter={handleTrackMouseEnter}
      onMouseLeave={handleTrackMouseLeave}
      style={isHorizontal ? horizontalPosition : verticalPosition}
    >
      <div>
        {isHorizontal && showButtons ? (
          <>
            <div
              className='scroll-bar-icon scroll-bar-icon-horizontal icon-style'
              style={{ left: '0' }}
              onClick={decrementScale}
            >
              <FA.FaCaretDown />
            </div>
            <div
              className='scroll-bar-icon scroll-bar-icon-horizontal icon-style'
              style={{ right: '0' }}
              onClick={incrementScale}
            >
              <FA.FaCaretUp />
            </div>
          </>
        ) : showButtons ? (
          <>
            <>
              <div
                className='scroll-bar-icon scroll-bar-icon-vertical icon-style'
                style={{ top: '0' }}
                onClick={decrementScale}
              >
                <FA.FaCaretUp />
              </div>
              <div
                className='scroll-bar-icon scroll-bar-icon-vertical icon-style'
                style={{ bottom: '0' }}
                onClick={incrementScale}
              >
                <FA.FaCaretDown />
              </div>
            </>
          </>
        ) : null}
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
