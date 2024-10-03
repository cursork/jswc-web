import React, { useRef, useEffect, useState } from 'react';
import { handleKeyPressUtils } from '../../utils';

const GridCell = ({ data, keyPress }) => {
  const cellRef = useRef(null);
  const [isEditable, setisEditable] = useState(false);

  useEffect(() => {
    if (data.focused) {
      cellRef?.current?.focus();
    }
  }, [data.focused]);

  const {Event} = data.typeObj.Properties;

  return (
    <>
      {!isEditable ? (
        <div
          style={{
            backgroundColor: data?.backgroundColor,
            outline: 0,
            // ...fontStyles,
            textAlign: data?.typeObj?.Properties?.Justify,
            paddingRight: '5px',
          }}
          onDoubleClick={(e) => setisEditable(true)}
        >
          {!data?.formattedValue ? data.value : data?.formattedValue}
        </div>
      ) : (
        <div
          style={{
            outline: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: data?.align,
            paddingLeft: '5px',
            paddingRight: '5px',
            height: '100%',
            width: '100%',
            textAlign: data?.align,
            backgroundColor: data?.backgroundColor,
          }}
          onBlur={() => setisEditable(false)}
          ref={cellRef}
          id={data?.typeObj?.ID}
          tabIndex='0'
          onKeyDown={(e) => {
            handleKeyPressUtils(e, socket, Event, data?.typeObj?.ID);
          }}
        >
          {data?.value}
        </div>
      )}
    </>
  );
};

export default GridCell;
