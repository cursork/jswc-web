import { setStyle, generateHeader } from '../../utils';
import { useAppData } from '../../hooks';
import Cell from './Cell';
import { useEffect, useState } from 'react';

const Grid = ({ data }) => {
  const { findDesiredData } = useAppData();
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [tableProperty, setTableProperty] = useState({ row: false, column: false, body: false });

  const handleGridClick = (row, column, property) => {
    if (property == 'column') {
      setTableProperty({
        row: false,
        column: true,
        body: false,
      });
    } else if (property == 'row') {
      setTableProperty({
        row: true,
        column: false,
        body: false,
      });
    } else if (property == 'body') {
      setTableProperty({
        row: false,
        column: false,
        body: true,
      });
    }

    setSelectedGrid({ row, column });
  };

  let size = 0;

  const {
    Values,
    Input,
    ColTitles,
    RowTitles,
    CellWidths,
    Visible,
    CurCell,
    CellTypes,
    ShowInput,
    FormattedValues,
    BCol,
  } = data?.Properties;

  console.log('data', BCol);

  const style = setStyle(data?.Properties);

  if (!ColTitles) {
    size = Values[0]?.length + 1;
  }

  useEffect(() => {
    localStorage.setItem(
      data?.ID,
      JSON.stringify({
        Event: {
          CurCell: !CurCell ? [0, 0] : CurCell,
          Values,
        },
      })
    );
  }, [data]);

  // Grid without types

  return (
    <div
      id={data.ID}
      style={{
        ...style,
        border: '1px solid black',
        overflow: !ColTitles ? 'auto' : 'hidden',
        background: 'white',
        display: Visible == 0 ? 'none' : 'block',
      }}
    >
      {/* Table have column */}
      {ColTitles && (
        <div style={{ display: 'flex' }}>
          {ColTitles.length > 0 && !RowTitles ? null : (
            <Cell
              cellWidth={CellWidths + 50}
              title={''}
              column={0}
              row={0}
              isColumn={tableProperty.column}
              isRow={tableProperty.row}
              isBody={tableProperty.body}
              selectedGrid={selectedGrid}
              onClick={(row, column) => handleGridClick(row, column, 'column')}
            />
          )}

          {ColTitles.map((heading, column) => {
            return (
              <Cell
                isColumn={tableProperty.column}
                isRow={tableProperty.row}
                isBody={tableProperty.body}
                selectedGrid={selectedGrid}
                cellWidth={CellWidths && CellWidths[column]}
                title={heading}
                column={column + 1}
                onClick={(row, column) => handleGridClick(row, column, 'column')}
                highLightMe={tableProperty.body && selectedGrid.column === column + 1}
                row={0}
              />
            );
          })}
        </div>
      )}

      {/* Table not have column */}
      {!ColTitles ? (
        <div style={{ display: 'flex' }}>
          {generateHeader(size).map((letter, i) => {
            return i < size ? (
              <Cell
                isColumn={tableProperty.column}
                isRow={tableProperty.row}
                isBody={tableProperty.body}
                highLightMe={tableProperty.body && selectedGrid.column === i}
                row={0}
                title={letter}
                column={i}
                selectedGrid={selectedGrid}
                onClick={(row, column) => handleGridClick(row, column, 'column')}
              />
            ) : null;
          })}
        </div>
      ) : null}

      {/* Grid Body with types and without types you can find that check in the Cell component */}

      {Values?.map((tableValues, row) => {
        return (
          <div
            style={{
              display: 'flex',
            }}
          >
            {!ColTitles ? (
              <Cell
                cellWidth={CellWidths && CellWidths[row]}
                justify='start'
                isColumn={tableProperty.column}
                isRow={tableProperty.row}
                isBody={tableProperty.body}
                onClick={(row, column) => handleGridClick(row, column, 'row')}
                column={0}
                row={row + 1}
                title={row + 1}
                selectedGrid={selectedGrid}
                highLightMe={tableProperty.body && selectedGrid.row === row + 1}
              />
            ) : null}
            {RowTitles ? (
              <Cell
                cellWidth={CellWidths && CellWidths[row]}
                title={RowTitles[row]}
                selectedGrid={selectedGrid}
                row={row + 1}
                isColumn={tableProperty.column}
                isRow={tableProperty.row}
                isBody={tableProperty.body}
                highLightMe={tableProperty.body && selectedGrid.row === row + 1}
                onClick={(row, column) => handleGridClick(row, column, 'row')}
                column={0}
                justify='start'
              />
            ) : null}
            {tableValues.map((value, column) => {
              let cellType = CellTypes && CellTypes[row][column];
              const type = findDesiredData(Input && Input[cellType - 1]);
              const event = data?.Properties?.Event && data?.Properties?.Event;

              const backgroundColor = BCol && BCol[cellType - 1];

              return (
                <Cell
                  justify={type ? '' : typeof value == 'string' ? 'start' : 'end'}
                  cellWidth={CellWidths && CellWidths[column]}
                  title={value}
                  formattedValue={FormattedValues && FormattedValues[row][column]}
                  type={type}
                  parent={event}
                  row={row + 1}
                  location='inGrid'
                  column={column + 1}
                  selectedGrid={selectedGrid}
                  onClick={(row, column) => handleGridClick(row, column, 'body')}
                  isColumn={tableProperty.column}
                  isRow={tableProperty.row}
                  isBody={tableProperty.body}
                  values={Values}
                  ShowInput={ShowInput}
                  bgColor={backgroundColor}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Grid;
