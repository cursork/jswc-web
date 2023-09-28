import { setStyle, generateHeader } from '../../utils';
import { useAppData } from '../../hooks';
import Cell from './Cell';
import { useState } from 'react';

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

  const { Values, Input, ColTitles, RowTitles, CellWidths } = data?.Properties;

  const style = setStyle(data?.Properties);

  if (!ColTitles) {
    size = Values[0]?.length + 1;
  }

  // Grid without types

  return (
    <div
      style={{
        ...style,
        border: '1px solid black',
        overflow: !ColTitles ? 'auto' : 'hidden',
        background: 'white',
      }}
    >
      {/* Table have column */}
      {ColTitles && (
        <div style={{ display: 'flex' }}>
          {data.ID.includes('VGRID') ? (
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
          ) : null}
          {ColTitles.map((heading, column) => {
            return (
              <Cell
                isColumn={tableProperty.column}
                isRow={tableProperty.row}
                isBody={tableProperty.body}
                selectedGrid={selectedGrid}
                cellWidth={CellWidths}
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
                cellWidth={CellWidths}
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
                cellWidth={CellWidths + 50}
                title={RowTitles[row]}
                selectedGrid={selectedGrid}
                row={row + 1}
                isColumn={tableProperty.column}
                isRow={tableProperty.row}
                isBody={tableProperty.body}
                highLightMe={tableProperty.body && selectedGrid.row === row + 1}
                onClick={(row, column) => handleGridClick(row, column, 'row')}
                column={0}
              />
            ) : null}
            {tableValues.map((value, column) => {
              const type = findDesiredData(Input && Input[column]);
              return (
                <Cell
                  justify={type ? '' : 'end'}
                  cellWidth={CellWidths}
                  title={value}
                  type={type}
                  parent={data?.Properties?.Event && data?.Properties?.Event[0]}
                  row={row + 1}
                  column={column + 1}
                  selectedGrid={selectedGrid}
                  onClick={(row, column) => handleGridClick(row, column, 'body')}
                  isColumn={tableProperty.column}
                  isRow={tableProperty.row}
                  isBody={tableProperty.body}
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
