import SelectComponent from '../SelectComponent';

const Cell = ({
  title,
  type = '',
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
}) => {
  if (!type) {
    return (
      <div
        onClick={() => onClick(row, column)}
        style={{
          borderRight: '1px solid  #F8F8F8',
          borderBottom: '1px solid  #F8F8F8',
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
          padding: 0,
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
        {title?.toString()?.slice(0, 10)}
      </div>
    );
  }

  return (
    <div
      style={{
        borderRight: '1px solid  #F8F8F8',
        borderBottom: '1px solid  #F8F8F8',
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
      <SelectComponent data={type} inputValue={title} event={parent} row={row} column={column} />
    </div>
  );
};

export default Cell;
