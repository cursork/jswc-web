import { setStyle, extractStringUntilSecondPeriod } from '../utils';
import { useAppData } from '../hooks';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { getObjectById } from '../utils';

const Button = ({ data, inputValue, event = '', row = '', column = '', location = '' }) => {
  const styles = setStyle(data?.Properties);
  const { socket, findDesiredData, dataRef, handleData } = useAppData();
  const { Picture, State, Visible, Event, Caption, Align } = data?.Properties;
  const inputRef = useRef();

  const [checkInput, setCheckInput] = useState();

  const [radioValue, setRadioValue] = useState(State ? State : 0);

  const hasCaption = data.Properties.hasOwnProperty('Caption');

  const isCheckBox = data?.Properties?.Style && data?.Properties?.Style == 'Check';

  const isRadio = data?.Properties?.Style && data?.Properties?.Style == 'Radio';

  const ImageData = findDesiredData(Picture && Picture);

  const buttonEvent = data.Properties.Event && data?.Properties?.Event[0];

  const decideInput = () => {
    if (location == 'inGrid') {
      return setCheckInput(inputValue);
    }
    setCheckInput(State && State);
  };

  useEffect(() => {
    decideInput();
  }, [data]);

  const handleCellChangedEvent = (value) => {
    const triggerEvent = JSON.stringify({
      Event: {
        EventName: 'CellChanged',
        ID: extractStringUntilSecondPeriod(data?.ID),
        Row: parseInt(row),
        Col: parseInt(column),
        Value: value ? 1 : 0,
      },
    });
    localStorage.setItem(extractStringUntilSecondPeriod(data?.ID), triggerEvent);
    const exists = event && event.some((item) => item[0] === 'CellChanged');
    if (!exists) return;
    console.log(triggerEvent);
    socket.send(triggerEvent);
  };

  const handleSelectEvent = (value) => {
    const triggerEvent = JSON.stringify({
      Event: {
        EventName: 'Select',
        ID: data?.ID,
        Value: value ? 1 : 0,
      },
    });
    localStorage.setItem(data?.ID, triggerEvent);
    const exists = Event && Event.some((item) => item[0] === 'Select');
    if (!exists) return;
    console.log(triggerEvent);
    socket.send(triggerEvent);
  };

  const handleCheckBoxEvent = (value) => {
    if (location == 'inGrid') {
      handleSelectEvent(value);
      handleCellChangedEvent(value);
    } else {
      handleSelectEvent(value);
    }
  };

  const handleCellMove = () => {
    if (location !== 'inGrid') return;
    const parent = inputRef.current.parentElement;
    const grandParent = parent.parentElement;
    const superParent = grandParent.parentElement;
    const nextSibling = superParent.nextSibling;
    const element = nextSibling?.querySelectorAll('input');
    element &&
      element.forEach((inputElement) => {
        if (inputElement.id === data?.ID) {
          inputElement.focus();
        }
      });
  };

  const handleKeyPress = (e) => {
    if (e.key == 'Enter') handleCellMove();
  };

  if (isCheckBox) {
    return (
      <div
        style={{
          ...styles,
          marginLeft: '10px',
          zIndex: 1,
          display: Visible == 0 ? 'none' : 'flex',
        }}
      >
        {Align && Align == 'Left' ? (
          <div className='me-1' style={{ fontSize: '12px' }}>
            {Caption}
          </div>
        ) : null}
        <input
          ref={inputRef}
          onKeyDown={(e) => handleKeyPress(e)}
          id={data?.ID}
          type='checkbox'
          defaultChecked={checkInput}
          onChange={(e) => {
            handleCheckBoxEvent(e.target.checked);
          }}
        />
        {!Align || Align == 'Right' ? (
          <div className='ms-1' style={{ fontSize: '12px' }}>
            {Caption}
          </div>
        ) : null}
      </div>
    );
  }

  if (isRadio) {
    const handleRadioSelectEvent = (value) => {
      const emitEvent = JSON.stringify({
        Event: {
          EventName: 'Select',
          ID: data?.ID,
          Value: value,
        },
      });
      const exists = Event && Event.some((item) => item[0] === 'Select');
      if (!exists) return;
      console.log({ emitEvent });
      socket.send(emitEvent);
    };

    const handleRadioButton = (id, value) => {
      const parentElement = document.getElementById(extractStringUntilSecondPeriod(data?.ID));
      var radioInputs = parentElement.getElementsByTagName('input');
      for (var i = 0; i < radioInputs.length; i++) {
        var radioId = radioInputs[i].id;
        const button = JSON.parse(getObjectById(dataRef.current, radioId));
        handleData({
          ID: button.ID,
          Properties: {
            ...button?.Properties,
            State: data?.ID == button?.ID ? 1 : 0,
          },
        });
      }

      handleRadioSelectEvent(value);
    };

    useEffect(() => {
      setRadioValue(State);
    }, [data]);

    return (
      <div style={{ ...styles, zIndex: 1, display: Visible == 0 ? 'none' : 'flex' }}>
        {Align && Align == 'Left' ? <div className='me-1'>{Caption}</div> : null}
        <input
          name={extractStringUntilSecondPeriod(data?.ID)}
          id={data?.ID}
          checked={radioValue}
          type='radio'
          value={Caption}
          onChange={(e) => {
            handleRadioButton(data?.ID, e.target.checked);
            // handleCheckBoxEvent(e.target.checked);
          }}
        />
        {!Align || Align == 'Right' ? <div className='ms-1'>{Caption}</div> : null}
      </div>
    );
  }

  return (
    <div
      id={data?.ID}
      onClick={() => {
        console.log(
          JSON.stringify({
            Event: {
              EventName: buttonEvent[0],
              ID: data?.ID,
            },
          })
        );

        socket.send(
          JSON.stringify({
            Event: {
              EventName: buttonEvent[0],
              ID: data?.ID,
            },
          })
        );
      }}
      style={{
        ...styles,
        border: '1px solid black',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        borderRadius: '4px',
        borderColor: '#ccc',
        fontSize: '11px',
        cursor: 'pointer',
        zIndex: 1,
        display: Visible == 0 ? 'none' : 'flex',
      }}
    >
      {ImageData ? <img src={`http://localhost:22322/${ImageData?.Properties?.File}`} /> : null}
      {hasCaption ? data?.Properties?.Caption : null}
    </div>
  );
};

export default Button;
