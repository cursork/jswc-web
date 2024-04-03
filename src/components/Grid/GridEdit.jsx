import React, { useRef, useEffect, useState, useCallback } from 'react';
import { NumericFormat } from 'react-number-format';
import { useAppData } from '../../hooks';
import { calculateDateAfterDays, getObjectById, calculateDaysFromDate } from '../../utils';
import dayjs from 'dayjs';

const GridEdit = ({ data }) => {
  const inputRef = useRef(null);
  const dateRef = useRef(null);

  const [dateFormattedValue, setDateFormattedValue] = useState(data?.value);

  const { FieldType, Decimal } = data?.typeObj?.Properties;
  const { dataRef, findDesiredData, handleData, socket } = useAppData();
  const dateFormat = JSON.parse(getObjectById(dataRef.current, 'Locale'));
  const { ShortDate, Thousand, Decimal: decimalSeparator } = dateFormat?.Properties;
  const [inputValue, setInputValue] = useState(
    FieldType == 'Date'
      ? dayjs(calculateDateAfterDays(data?.value)).format(ShortDate && ShortDate)
      : data?.value
  );

  useEffect(() => {
    if (data.focused) {
      if (FieldType == 'Date') {
        dateRef?.current?.focus();
      } else {
        inputRef?.current?.focus();
      }
    }
  }, [data.focused]);

  const triggerCellChangedEvent = () => {
    // const gridEvent = findDesiredData(data?.gridId);
    const values = data?.gridValues;
    values[data?.row - 1][data?.column] = FieldType == 'Date' ? dateFormattedValue : inputValue;
    // handleData(
    //   {
    //     ID: data?.gridId,
    //     Properties: {
    //       ...gridEvent.Properties,
    //       Values: values,
    //       CurCell: [data?.row, data?.column + 1],
    //     },
    //   },
    //   'WS'
    // );

    const cellChangedEvent = JSON.stringify({
      Event: {
        EventName: 'CellChanged',
        ID: data?.gridId,
        Row: data?.row,
        Col: data?.column + 1,
        Value: FieldType == 'Date' ? dateFormattedValue : inputValue,
      },
    });

    const updatedGridValues = JSON.stringify({
      Event: {
        EventName: 'CellChanged',
        Values: values,
        CurCell: [data?.row, data?.column + 1],
      },
    });

    const formatCellEvent = JSON.stringify({
      FormatCell: {
        Cell: [data?.row, data?.column + 1],
        ID: data?.gridId,
        Value: FieldType == 'Date' ? dateFormattedValue : inputValue,
      },
    });

    localStorage.setItem(data?.gridId, updatedGridValues);

    localStorage.setItem(data?.gridId, cellChangedEvent);
    console.log(cellChangedEvent);
    const exists = data?.gridEvents && data?.gridEvents.some((item) => item[0] === 'CellChanged');
    if (!exists) return;
    socket.send(cellChangedEvent);

    if (!formatString) return;

    console.log(formatCellEvent);
    socket.send(formatCellEvent);
  };

  const handleEditEvents = () => {
    triggerCellChangedEvent();
  };

  if (FieldType == 'Date') {
    const handleTextClick = () => {
      inputRef.current.select();
      inputRef.current.showPicker();
    };
    const handleDateChange = (event) => {
      const selectedDate = dayjs(event.target.value).format(ShortDate);
      let value = calculateDaysFromDate(event.target.value) + 1;
      setInputValue(selectedDate);
      setDateFormattedValue(value);
    };
    return (
      <>
        <input
          ref={dateRef}
          id={`${data?.row}-${data?.column}`}
          style={{
            border: 0,
            outline: 0,
            width: '100%',
            height: '100%',
          }}
          value={inputValue}
          type='text'
          readOnly
          onClick={handleTextClick}
          onBlur={() => {
            handleEditEvents();
          }}
          onKeyDown={(e) => {
            if (
              e.key === 'ArrowRight' ||
              e.key === 'ArrowLeft' ||
              e.key === 'ArrowUp' ||
              e.key === 'ArrowDown'
            ) {
              inputRef?.current?.blur();
              dateRef?.current?.blur();
              return;
            }
            e.stopPropagation();
          }}
        />
        <input
          id={`${data?.row}-${data?.column}`}
          type='date'
          ref={inputRef}
          onChange={handleDateChange}
          style={{
            display: 'none',
          }}
        />
      </>
    );
  }

  if (FieldType == 'LongNumeric' || FieldType == 'Numeric') {
    return (
      <NumericFormat
        className='currency'
        allowLeadingZeros={true}
        getInputRef={inputRef}
        id={data?.typeObj?.ID}
        style={{
          width: '100%',
          border: 0,
          outline: 0,
          backgroundColor: data?.backgroundColor,
        }}
        onValueChange={(value) => {
          setInputValue(parseInt(value.value));
        }}
        decimalScale={Decimal}
        value={inputValue}
        decimalSeparator={decimalSeparator}
        thousandSeparator={Thousand}
        onBlur={(e) => {
          handleEditEvents();
        }}
        onKeyDown={(e) => {
          if (
            e.key === 'ArrowRight' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowUp' ||
            e.key === 'ArrowDown'
          ) {
            inputRef.current.blur();
            return;
          }
          e.stopPropagation();
        }}
      />
    );
  }

  return (
    <input
      ref={inputRef}
      type='text'
      id={`${data?.row}-${data?.column}`}
      style={{
        outline: 0,
        border: 0,
        width: '100%',
        height: '100%',
        backgroundColor: data?.backgroundColor,
      }}
      value={inputValue}
      onKeyDown={(e) => {
        if (
          e.key === 'ArrowRight' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown'
        ) {
          inputRef.current.blur();
          dateRef.current.blur();
          return;
        }
        e.stopPropagation();
      }}
      onChange={(e) => {
        e.stopPropagation();
        setInputValue(e.target.value);
      }}
      onBlur={(e) => {
        handleEditEvents();
      }}
    />
  );
};

export default GridEdit;

// onFocus={() => cellClick(data?.row, data?.column)}
// e.stopPropagation();
// cellClick(data.row, data.column);
//onClick={(e) => {
//   e.stopPropagation();
//   cellClick(data.row, data.column);
//}}

// onKeyDown={(e) => {
//   if (
//     e.key === 'ArrowRight' ||
//     e.key === 'ArrowLeft' ||
//     e.key === 'ArrowUp' ||
//     e.key === 'ArrowDown'
//   ) {
//     e.stopPropagation();
//     keyPress(e);
//   }
// }}
