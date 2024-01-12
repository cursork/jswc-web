import { rgbColor } from '../../utils';
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
  ShowInput = 0,
  bgColor = [255, 255, 255],
  cellFont = null,
  fontColor = [0, 0, 0],
  formatString = '',
}) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (divRef.current && divRef.current.contains(event.target)) {
        setIsFocused(true);
        onClick(row, column);
      } else {
        setIsFocused(false);
      }
    };

    document.addEventListener('dblclick', handleDocumentClick);

    return () => {
      document.removeEventListener('dblclick', handleDocumentClick);
    };
  }, []);

  if (!type && !Array.isArray(title)) {
    return (
      <div
        onClick={() => onClick(row, column)}
        style={{
          borderRight: '1px solid  #EFEFEF',
          borderBottom: '1px solid  #EFEFEF',
          minWidth: cellWidth ? cellWidth : '100px',
          maxWidth: cellWidth ? cellWidth : '100px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: justify,
          overflow: 'hidden',
          margin: 0,
          color: rgbColor(fontColor),
          cursor: 'pointer',
          background: rgbColor(bgColor),
          // background: selectedGrid
          //   ? selectedGrid.column == column && !isRow && !isBody
          //     ? '#C7E9FF'
          //     : selectedGrid.row == row && !isColumn && !isBody
          //     ? '#C7E9FF'
          //     : highLightMe
          //     ? '#C7E9FF'
          //     : null
          //   : null,
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

  if (!type && Array.isArray(title)) {
    return (
      <div
        onClick={() => onClick(row, column)}
        style={{
          borderRight: '1px solid  #EFEFEF',
          borderBottom: '1px solid  #EFEFEF',
          minWidth: cellWidth ? cellWidth : '100px',
          maxWidth: cellWidth ? cellWidth : '100px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: justify,
          flexDirection: 'column',
          overflow: 'hidden',
          margin: 0,
          cursor: 'pointer',
          color: rgbColor(fontColor),
          background: rgbColor(bgColor),
        }}
      >
        {title.map((th) => {
          if (th == '') return <br />;
          return <div>{th}</div>;
        })}
      </div>
    );
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const { Properties } = type;

  let justifiedStyles = {
    display: 'flex',
    justifyContent: 'center',
  };

  if (Properties.Type == 'Edit') {
    if (typeof title == 'string') {
      justifiedStyles = {
        ...justifiedStyles,
        justifyContent: 'flex-start',
        paddingLeft: '5px',
      };
    } else {
      justifiedStyles = {
        ...justifiedStyles,
        justifyContent: 'flex-end',
        paddingRight: '5px',
      };
    }
  } else if (Properties.Type == 'Button') {
    justifiedStyles = {
      ...justifiedStyles,
      justifyContent: 'center',
    };
  } else if (Properties.Type == 'Label') {
    if (typeof title == 'string') {
      justifiedStyles = {
        ...justifiedStyles,
        justifyContent: 'flex-start',
        paddingLeft: '5px',
      };
    } else {
      justifiedStyles = {
        ...justifiedStyles,
        justifyContent: 'flex-end',
        paddingRight: '5px',
      };
    }
  }

  const fontProperties = cellFont && cellFont?.Properties;

  let fontStyles = {
    fontFamily: fontProperties?.PName,
    fontSize: !fontProperties?.Size ? '11px' : '12px',
    textDecoration: !fontProperties?.Underline
      ? 'none'
      : fontProperties?.Underline == 1
      ? 'underline'
      : 'none',
    fontStyle: !fontProperties?.Italic ? 'none' : fontProperties?.Italic == 1 ? 'italic' : 'none',
    fontWeight: !fontProperties?.Weight ? 0 : fontProperties?.Weight,
  };

  let cellStyles = {
    borderRight: '1px solid  #EFEFEF',
    borderBottom: '1px solid  #EFEFEF',
    minWidth: cellWidth ? cellWidth : '100px',
    maxWidth: cellWidth ? cellWidth : '100px',
    minHeight: '20px',
    maxHeight: '20px',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    background: rgbColor(bgColor),
  };

  // Render the formatted values and the Input
  return (
    <div
      ref={divRef}
      id={type?.ID}
      style={{ ...cellStyles, ...(isFocused || ShowInput == 1 ? fontStyles : justifiedStyles) }}
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
          formatString={formatString}
        />
      ) : (
        <p
          style={{ ...fontStyles, ...justifiedStyles, margin: 0, padding: 0 }}
          onBlur={() => setIsFocused(false)}
        >
          {formattedValue}
        </p>
      )}
    </div>
  );
};

export default Cell;
