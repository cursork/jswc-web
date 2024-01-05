import SelectComponent from '../SelectComponent';

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
}) => {
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

  console.log({ type });

  return (
    <div
      style={{
        borderRight: '1px solid  #EFEFEF',
        borderBottom: '1px solid  #EFEFEF',
        minWidth: '100px',
        maxWidth: '100px',
        minHeight: '20px',
        maxHeight: '20px',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
      onClick={() => onClick(row, column)}
    >
      <SelectComponent
        location={location}
        data={type}
        inputValue={title}
        event={parent}
        row={row}
        column={column}
        values={values}
      />
    </div>
  );
};

export default Cell;
