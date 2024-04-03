import React, { useRef, useEffect, useState } from 'react';

const GridCell = ({ data, keyPress }) => {
  const cellRef = useRef(null);

  useEffect(() => {
    if (data.focused) {
      cellRef?.current?.focus();
    }
  }, [data.focused]);

  return (
    <div
      style={{ outline: 0 }}
      ref={cellRef}
      id={`${data?.row}-${data?.column}`}
      tabIndex='0'
      // onKeyDown={(e) => {
      //   keyPress(e);
      // }}
    >
      {data?.value}
    </div>
  );
};

export default GridCell;
