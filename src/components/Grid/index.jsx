import { setStyle } from '../../utils';
import { useAppData } from '../../hooks';
import Cell from './Cell';

const Grid = ({ data }) => {
  const { findDesiredData } = useAppData();

  const alphabets = Array.from({ length: 26 }, (_, index) =>
    String.fromCharCode('A'.charCodeAt(0) + index)
  );

  let size = 0;

  const { Values, Input, ColTitles, RowTitles, CellWidths } = data?.Properties;

  const style = setStyle(data?.Properties);

  if (!ColTitles) {
    size = Values[0]?.length;
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {data.ID.includes('VGRID') ? <Cell cellWidth={CellWidths + 50} title={''} /> : null}
          {ColTitles.map((heading) => {
            return <Cell cellWidth={CellWidths} title={heading} />;
          })}
        </div>
      )}

      {/* Table not have column */}
      {!ColTitles ? (
        <div style={{ display: 'flex' }}>
          <Cell cellWidth={CellWidths} title={''} />
          {alphabets.map((letter, i) => {
            return i < size ? <Cell title={letter} /> : null;
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
            {!ColTitles ? <Cell cellWidth={CellWidths} title={row + 1} /> : null}
            {RowTitles ? <Cell cellWidth={CellWidths + 50} title={RowTitles[row]} /> : null}
            {tableValues.map((value, column) => {
              const type = findDesiredData(Input && Input[column]);
              return (
                <Cell
                  cellWidth={CellWidths}
                  title={value}
                  type={type}
                  parent={data?.Properties?.Event && data?.Properties?.Event[0]}
                  row={row}
                  column={column}
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
