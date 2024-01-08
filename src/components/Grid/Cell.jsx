import SelectComponent from '../SelectComponent';
import { useState, useRef, useEffect } from 'react';

const Cell = ({
  title,
  type = '',
  location = '',
  parent = '',
  row = '',
  column = '',
  cellWidth = '',
  justify = 'center',
  onClick = () => {},
  selectedGrid = { row: 0, column: 0 },
  isColumn = false,
  isRow = false,
  isBody = false,
  highLightMe = false,
  values = [],
  formattedValue = null,
  ShowInput=0
}) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  if (!type) {
    return (
      <div
        onClick={() => onClick(row, column)}
        style={{
          borderRight: '1px solid  #EFEFEF',
          borderBottom: '1px solid  #EFEFEF',
          // width: cellWidth ? cellWidth : '100px',
          minWidth: cellWidth ? cellWidth : '100px',
          maxWidth: cellWidth ? cellWidth : '100px',
          fontSize: '12px',
          minHeight: '20px',
          maxHeight: '20px',
          display: 'flex',

          alignItems: 'center',
          justifyContent: justify,
          overflow: 'hidden',
          margin: 0,
          cursor: 'pointer',
          background: selectedGrid
            ? selectedGrid.column == column && !isRow && !isBody
              ? '#C7E9FF'
              : selectedGrid.row == row && !isColumn && !isBody
              ? '#C7E9FF'
              : highLightMe
              ? '#C7E9FF'
              : null
            : null,
        }}
      >
        <span
          style={{
            paddingLeft: justify == 'start' ? '4px' : '0px',
            paddingRight: justify == 'end' ? '4px' : '0px',
          }}
        >
          {title?.toString()?.slice(0, 10)}
        </span>
      </div>
    );
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (divRef.current && divRef.current.contains(event.target)) {
        setIsFocused(true);
      } else {
        setIsFocused(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div
      ref={divRef}
      id={type?.ID}
      style={{
        borderRight: '1px solid  #EFEFEF',
        borderBottom: '1px solid  #EFEFEF',
        minWidth: cellWidth ? cellWidth : '100px',
        maxWidth: cellWidth ? cellWidth : '100px',
        minHeight: '20px',
        maxHeight: '20px',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        fontSize: '12px',
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {isFocused || ShowInput == 1 ? (
        <SelectComponent
          location={location}
          data={type}
          inputValue={title}
          event={parent}
          row={row}
          column={column}
          values={values}
        />
      ) : (
        <p onBlur={() => setIsFocused(false)}>{formattedValue}</p>
      )}
    </div>
  );
};

export default Cell;
