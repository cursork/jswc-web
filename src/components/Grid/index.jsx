import { useAppData, useResizeObserver } from '../../hooks';
import Cell from './Cell';
import { useEffect, useState, useRef } from 'react';
import { extractStringUntilSecondPeriod, setStyle, generateHeader } from '../../utils';

const Grid = ({ data }) => {
  const { findDesiredData, socket } = useAppData();
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [tableProperty, setTableProperty] = useState({ row: false, column: false, body: false });
  const dimensions = useResizeObserver(
    document.getElementById(extractStringUntilSecondPeriod(data?.ID))
  );

  let size = 0;
  const {
    Size,
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
    CellFonts,
    RowTitleBCol,
    RowTitleFCol,
    ColTitleBCol,
    ColTitleFCol,
    TitleHeight,
    TitleWidth,
    FormatString,
    VScroll = 0,
    HScroll = 0,
    Attach,
    Event,
  } = data?.Properties;

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
    localStorage.setItem(
      data?.ID,
      JSON.stringify({
        Event: {
          CurCell: [row, column],
          Values,
        },
      })
    );

    setSelectedGrid({ row, column });
  };

  const [height, setHeight] = useState(Size[0]);
  const [width, setWidth] = useState(Size[1]);

  const style = setStyle(data?.Properties);
  const cells = useRef([]);

  useEffect(() => {
    if (cells.current.length > 0) {
      cells.current[0].focus(); // Set initial focus on the first cell
    }
  }, []);

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

    if (CurCell) {
      setSelectedGrid({ row: CurCell[0], column: CurCell[1] });
      setTableProperty({
        row: false,
        column: false,
        body: true,
      });
    }
  }, [data]);

  useEffect(() => {
    if (!Attach) return;
    setWidth(dimensions?.width - 73);
    setHeight(dimensions?.height - 73);
  }, [dimensions]);

  // Grid without types
  const handleKeyPress = (e) => {
    const exists = Event && Event.some((item) => item[0] === 'KeyPress');
    if (!exists) return;

    const isAltPressed = e.altKey ? 4 : 0;
    const isCtrlPressed = e.ctrlKey ? 2 : 0;
    const isShiftPressed = e.shiftKey ? 1 : 0;
    const charCode = e.key.charCodeAt(0);
    let shiftState = isAltPressed + isCtrlPressed + isShiftPressed;

    let event = JSON.stringify({
      Event: {
        EventName: 'KeyPress',
        ID: data?.ID,
        Info: [e.key, charCode, e.keyCode, shiftState],
      },
    });
    console.log(event);
    socket.send(event);
  };

  return (
    <div
      tabIndex='0'
      onKeyDown={handleKeyPress}
      id={data.ID}
      style={{
        ...style,
        height,
        width,
        border: '1px solid black',
        overflow: !ColTitles ? 'auto' : 'hidden',
        background: 'white',
        display: Visible == 0 ? 'none' : 'block',
        overflowX: HScroll == -3 ? 'scroll' : HScroll == -1 || HScroll == -2 ? 'auto' : 'hidden',
        overflowY: VScroll == -3 ? 'scroll' : VScroll == -1 || HScroll == -2 ? 'auto' : 'hidden',
      }}
    >
      {/* Table have column */}
      {ColTitles && (
        <div style={{ display: 'flex' }}>
          {RowTitles?.length > 1 ? (
            <Cell
              key={0}
              cellWidth={TitleWidth && TitleWidth}
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
                fontColor={ColTitleFCol}
                bgColor={ColTitleBCol}
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
                key={column + 1}
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
                key={i}
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
                cellWidth={100}
                justify='start'
                isColumn={tableProperty.column}
                isRow={tableProperty.row}
                isBody={tableProperty.body}
                onClick={(row, column) => handleGridClick(row, column, 'row')}
                column={0}
                key={0}
                row={row + 1}
                title={row + 1}
                selectedGrid={selectedGrid}
                highLightMe={tableProperty.body && selectedGrid.row === row + 1}
              />
            ) : null}
            {RowTitles ? (
              <Cell
                fontColor={RowTitleFCol}
                bgColor={RowTitleBCol}
                cellWidth={TitleWidth && TitleWidth}
                title={RowTitles[row]}
                selectedGrid={selectedGrid}
                row={row + 1}
                isColumn={tableProperty.column}
                isRow={tableProperty.row}
                isBody={tableProperty.body}
                highLightMe={tableProperty.body && selectedGrid.row === row + 1}
                onClick={(row, column) => handleGridClick(row, column, 'row')}
                column={0}
                key={0}
                justify='start'
              />
            ) : null}
            {tableValues.map((value, column) => {
              let cellType = CellTypes && CellTypes[row][column];
              const type = findDesiredData(Input && Input[cellType - 1]);
              const event = data?.Properties?.Event && data?.Properties?.Event;
              const backgroundColor = BCol && BCol[cellType - 1];
              const cellFont = findDesiredData(CellFonts && CellFonts[cellType - 1]);

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
                  cellFont={cellFont}
                  formatString={FormatString && FormatString[cellType - 1]}
                  key={column + 1}
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

// import React, { useState, useEffect } from 'react';
// import { setStyle, generateHeader, extractStringUntilSecondPeriod } from '../../utils';
// import { useResizeObserver, useAppData } from '../../hooks';
// import GridEdit from './GridEdit';
// import GridSelect from './GridSelect';
// import GridButton from './GridButton';
// import GridCell from './GridCell';
// import Header from './Header';

// const Grid = ({ data }) => {
//   return <GridComponent key={data?.ID} data={data} />;
// };

// const GridComponent = ({ data }) => {
//   const { findDesiredData, socket } = useAppData();
//   const dimensions = useResizeObserver(
//     document.getElementById(extractStringUntilSecondPeriod(data?.ID))
//   );

//   const {
//     Size,
//     Values,
//     Input,
//     ColTitles,
//     RowTitles,
//     CellWidths,
//     Visible,
//     CurCell,
//     CellTypes,
//     ShowInput,
//     FormattedValues,
//     BCol,
//     CellFonts,
//     RowTitleBCol,
//     RowTitleFCol,
//     ColTitleBCol,
//     ColTitleFCol,
//     TitleHeight,
//     TitleWidth,
//     FormatString,
//     VScroll = 0,
//     HScroll = 0,
//     Attach,
//     Event,
//   } = data?.Properties;

//   const [height, setHeight] = useState(Size[0]);
//   const [width, setWidth] = useState(Size[1]);
//   const [rows, setRows] = useState(0);
//   const [columns, setColumns] = useState(0);
//   const [focusedCell, setFocusedCell] = useState({ row: 0, column: 0 });
//   const style = setStyle(data?.Properties);

//   useEffect(() => {
//     if (!Attach) return;
//     setWidth(dimensions?.width - 73);
//     setHeight(dimensions?.height - 73);
//   }, [dimensions]);

//   useEffect(() => {
//     if (!ColTitles) setColumns(Values[0]?.length + 1);
//     else setColumns(ColTitles?.length);

//     if (Values) setRows(Values?.length + 1);
//   }, [data]);

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.key == 'ArrowRight') {
//         setFocusedCell((prevState) => ({
//           ...prevState,
//           column: prevState.column + 1,
//         }));
//       } else if (event.key == 'ArrowLeft') {
//         setFocusedCell((prevState) => ({
//           ...prevState,
//           column: prevState.column - 1,
//         }));
//       } else if (event.key == 'ArrowUp') {
//         setFocusedCell((prevState) => ({
//           ...prevState,
//           row: prevState.row - 1,
//         }));
//       } else if (event.key == 'ArrowDown') {
//         setFocusedCell((prevState) => ({
//           ...prevState,
//           row: prevState.row + 1,
//         }));
//       }
//     };

//     const gridElement = document.getElementById(data?.ID);
//     gridElement.addEventListener('focus', () => {
//       document.addEventListener('keydown', handleKeyDown);
//     });
//     gridElement.addEventListener('blur', () => {
//       document.removeEventListener('keydown', handleKeyDown);
//     });

//     // document.addEventListener('keydown', handleKeyDown);

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       gridElement.removeEventListener('focus', () => {
//         document.addEventListener('keydown', handleKeyDown);
//       });
//       gridElement.removeEventListener('blur', () => {
//         document.removeEventListener('keydown', handleKeyDown);
//       });
//     };
//   }, []);

//   const modifyGridData = () => {
//     let data = [];

//     // Push the header Information
//     if (ColTitles) {
//       let header = [];
//       for (let i = 0; i < ColTitles?.length; i++) {
//         let obj = {
//           value: ColTitles[i],
//           type: 'header',
//         };

//         header.push(obj);
//       }
//       data.push(header);
//     } else if (!ColTitles) {
//       let headerArray = generateHeader(columns).map((alphabet) => {
//         return {
//           value: alphabet,
//           type: 'header',
//         };
//       });
//       data.push(headerArray);
//     }

//     // Make the body the Grid Like if it have Input Array that means it have types
//     if (!Input) {
//       for (let i = 0; i < Values?.length; i++) {
//         let body = [];
//         let obj = {
//           type: 'cell',
//           value: i + 1,
//         };
//         body.push(obj);
//         for (let j = 0; j <= columns; j++) {
//           let obj = {
//             type: 'cell',
//             value: Values[i][j],
//           };
//           body.push(obj);
//         }
//         data.push(body);
//       }
//     } else if (Input) {
//       for (let i = 0; i < Values?.length; i++) {
//         let body = [];
//         for (let j = 0; j < columns; j++) {
//           let cellType = CellTypes && CellTypes[i][j];
//           const type = findDesiredData(Input && Input[cellType - 1]);
//           const event = data?.Properties?.Event && data?.Properties?.Event;
//           const backgroundColor = BCol && BCol[cellType - 1];
//           const cellFont = findDesiredData(CellFonts && CellFonts[cellType - 1]);

//           let obj = {
//             type: type?.Properties?.Type,
//             value: Values[i][j],
//             event,
//             backgroundColor,
//             cellFont,
//             typeObj: type,
//           };
//           body.push(obj);
//         }
//         data.push(body);
//       }
//     }

//     return data;
//   };

//   const gridData = modifyGridData();

//   const components = {
//     Edit: (data) => {
//       return <GridEdit data={data} />;
//     },
//     Button: (data) => {
//       return <GridButton data={data} />;
//     },
//     cell: (data) => {
//       return <GridCell data={data} />;
//     },
//     header: (data) => {
//       return <Header data={data} />;
//     },
//     Combo: (data) => {
//       return <GridSelect data={data} />;
//     },
//   };

//   return (
//     <div
//       tabIndex='0'
//       id={data?.ID}
//       style={{
//         ...style,
//         height,
//         width,
//         border: '1px solid black',
//         overflow: !ColTitles ? 'auto' : 'hidden',
//         background: 'white',
//         display: Visible == 0 ? 'none' : 'block',
//         overflowX: HScroll == -3 ? 'scroll' : HScroll == -1 || HScroll == -2 ? 'auto' : 'hidden',
//         overflowY: VScroll == -3 ? 'scroll' : VScroll == -1 || HScroll == -2 ? 'auto' : 'hidden',
//       }}
//     >
//       {/* {Array(rows)
//         .fill(0)
//         ?.map((row, rowi) => {
//           return (
//             <div style={{ display: 'flex' }}>
//               {Array(columns)
//                 .fill(0)
//                 ?.map((column, columni) => {
//                   const isFocused = focusedCell.row === rowi && focusedCell.column === columni;
//                   return (
//                     <div
//                       style={{
//                         border: isFocused ? '2px solid blue' : '1px solid  #EFEFEF',
//                         // borderRight: '1px solid  #EFEFEF',
//                         // borderBottom: '1px solid  #EFEFEF',
//                         minWidth: CellWidths ? CellWidths[column] : '100px',
//                         maxWidth: CellWidths ? CellWidths[column] : '100px',
//                         fontSize: '12px',
//                         backgroundColor: focusedCell.column === columni ? 'lightblue' : 'white',
//                       }}
//                     >
//                       {`(${rowi},${columni})`}
//                     </div>
//                   );
//                 })}
//               <br />
//             </div>
//           );
//         })} */}
//       {gridData.map((row, rowi) => {
//         return (
//           <div style={{ display: 'flex' }}>
//             {row.map((data, columni) => {
//               const isFocused = focusedCell.row === rowi && focusedCell.column === columni;
//               const Component = components[data?.type];
//               return (
//                 <div
//                   style={{
//                     borderRight: isFocused ? '1px solid blue' : '1px solid  #EFEFEF',
//                     borderBottom: isFocused ? '1px solid blue' : '1px solid  #EFEFEF',
//                     minWidth: '100px',
//                     maxWidth: '100px',
//                     fontSize: '12px',
//                     minHeight: '20px',
//                     maxHeight: '20px',
//                     backgroundColor:
//                       focusedCell.column === columni && data.type == 'header'
//                         ? 'lightblue'
//                         : 'white',
//                     textAlign: data.type == 'header' ? 'center' : 'left',
//                   }}
//                 >
//                   <Component {...data} />
//                 </div>
//               );
//             })}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Grid;
