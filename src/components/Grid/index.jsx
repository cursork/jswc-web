// import { useAppData, useResizeObserver } from '../../hooks';
// import Cell from './Cell';
// import { useEffect, useState, useRef } from 'react';
// import { extractStringUntilSecondPeriod, setStyle, generateHeader } from '../../utils';

// const Grid = ({ data }) => {
//   const { findDesiredData, socket } = useAppData();
//   const [selectedGrid, setSelectedGrid] = useState(null);
//   const [tableProperty, setTableProperty] = useState({ row: false, column: false, body: false });
//   const dimensions = useResizeObserver(
//     document.getElementById(extractStringUntilSecondPeriod(data?.ID))
//   );

//   let size = 0;
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

//   const handleGridClick = (row, column, property) => {
//     if (property == 'column') {
//       setTableProperty({
//         row: false,
//         column: true,
//         body: false,
//       });
//     } else if (property == 'row') {
//       setTableProperty({
//         row: true,
//         column: false,
//         body: false,
//       });
//     } else if (property == 'body') {
//       setTableProperty({
//         row: false,
//         column: false,
//         body: true,
//       });
//     }
//     localStorage.setItem(
//       data?.ID,
//       JSON.stringify({
//         Event: {
//           CurCell: [row, column],
//           Values,
//         },
//       })
//     );

//     setSelectedGrid({ row, column });
//   };

//   const [height, setHeight] = useState(Size[0]);
//   const [width, setWidth] = useState(Size[1]);

//   const style = setStyle(data?.Properties);
//   const cells = useRef([]);

//   useEffect(() => {
//     if (cells.current.length > 0) {
//       cells.current[0].focus(); // Set initial focus on the first cell
//     }
//   }, []);

//   if (!ColTitles) {
//     size = Values[0]?.length + 1;
//   }

//   useEffect(() => {
//     localStorage.setItem(
//       data?.ID,
//       JSON.stringify({
//         Event: {
//           CurCell: !CurCell ? [0, 0] : CurCell,
//           Values,
//         },
//       })
//     );

//     if (CurCell) {
//       setSelectedGrid({ row: CurCell[0], column: CurCell[1] });
//       setTableProperty({
//         row: false,
//         column: false,
//         body: true,
//       });
//     }
//   }, [data]);

//   useEffect(() => {
//     if (!Attach) return;
//     setWidth(dimensions?.width - 73);
//     setHeight(dimensions?.height - 73);
//   }, [dimensions]);

//   // Grid without types
//   const handleKeyPress = (e) => {
//     const exists = Event && Event.some((item) => item[0] === 'KeyPress');
//     if (!exists) return;

//     const isAltPressed = e.altKey ? 4 : 0;
//     const isCtrlPressed = e.ctrlKey ? 2 : 0;
//     const isShiftPressed = e.shiftKey ? 1 : 0;
//     const charCode = e.key.charCodeAt(0);
//     let shiftState = isAltPressed + isCtrlPressed + isShiftPressed;

//     let event = JSON.stringify({
//       Event: {
//         EventName: 'KeyPress',
//         ID: data?.ID,
//         Info: [e.key, charCode, e.keyCode, shiftState],
//       },
//     });
//     console.log(event);
//     socket.send(event);
//   };

//   return (
//     <div
//       tabIndex='0'
//       onKeyDown={handleKeyPress}
//       id={data.ID}
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
//       {/* Table have column */}
//       {ColTitles && (
//         <div style={{ display: 'flex' }}>
//           {RowTitles?.length > 1 ? (
//             <Cell
//               key={0}
//               cellWidth={TitleWidth && TitleWidth}
//               title={''}
//               column={0}
//               row={0}
//               isColumn={tableProperty.column}
//               isRow={tableProperty.row}
//               isBody={tableProperty.body}
//               selectedGrid={selectedGrid}
//               onClick={(row, column) => handleGridClick(row, column, 'column')}
//             />
//           ) : null}

//           {ColTitles.map((heading, column) => {
//             return (
//               <Cell
//                 fontColor={ColTitleFCol}
//                 bgColor={ColTitleBCol}
//                 isColumn={tableProperty.column}
//                 isRow={tableProperty.row}
//                 isBody={tableProperty.body}
//                 selectedGrid={selectedGrid}
//                 cellWidth={CellWidths && CellWidths[column]}
//                 title={heading}
//                 column={column + 1}
//                 onClick={(row, column) => handleGridClick(row, column, 'column')}
//                 highLightMe={tableProperty.body && selectedGrid.column === column + 1}
//                 row={0}
//                 key={column + 1}
//               />
//             );
//           })}
//         </div>
//       )}

//       {/* Table not have column */}
//       {!ColTitles ? (
//         <div style={{ display: 'flex' }}>
//           {generateHeader(size).map((letter, i) => {
//             return i < size ? (
//               <Cell
//                 isColumn={tableProperty.column}
//                 isRow={tableProperty.row}
//                 isBody={tableProperty.body}
//                 highLightMe={tableProperty.body && selectedGrid.column === i}
//                 row={0}
//                 title={letter}
//                 column={i}
//                 selectedGrid={selectedGrid}
//                 onClick={(row, column) => handleGridClick(row, column, 'column')}
//                 key={i}
//               />
//             ) : null;
//           })}
//         </div>
//       ) : null}

//       {/* Grid Body with types and without types you can find that check in the Cell component */}

//       {Values?.map((tableValues, row) => {
//         return (
//           <div
//             style={{
//               display: 'flex',
//             }}
//           >
//             {!ColTitles ? (
//               <Cell
//                 cellWidth={100}
//                 justify='start'
//                 isColumn={tableProperty.column}
//                 isRow={tableProperty.row}
//                 isBody={tableProperty.body}
//                 onClick={(row, column) => handleGridClick(row, column, 'row')}
//                 column={0}
//                 key={0}
//                 row={row + 1}
//                 title={row + 1}
//                 selectedGrid={selectedGrid}
//                 highLightMe={tableProperty.body && selectedGrid.row === row + 1}
//               />
//             ) : null}
//             {RowTitles ? (
//               <Cell
//                 fontColor={RowTitleFCol}
//                 bgColor={RowTitleBCol}
//                 cellWidth={TitleWidth && TitleWidth}
//                 title={RowTitles[row]}
//                 selectedGrid={selectedGrid}
//                 row={row + 1}
//                 isColumn={tableProperty.column}
//                 isRow={tableProperty.row}
//                 isBody={tableProperty.body}
//                 highLightMe={tableProperty.body && selectedGrid.row === row + 1}
//                 onClick={(row, column) => handleGridClick(row, column, 'row')}
//                 column={0}
//                 key={0}
//                 justify='start'
//               />
//             ) : null}
//             {tableValues.map((value, column) => {
//               let cellType = CellTypes && CellTypes[row][column];
//               const type = findDesiredData(Input && Input[cellType - 1]);
//               const event = data?.Properties?.Event && data?.Properties?.Event;
//               const backgroundColor = BCol && BCol[cellType - 1];
//               const cellFont = findDesiredData(CellFonts && CellFonts[cellType - 1]);

//               return (
//                 <Cell
//                   justify={type ? '' : typeof value == 'string' ? 'start' : 'end'}
//                   cellWidth={CellWidths && CellWidths[column]}
//                   title={value}
//                   formattedValue={FormattedValues && FormattedValues[row][column]}
//                   type={type}
//                   parent={event}
//                   row={row + 1}
//                   location='inGrid'
//                   column={column + 1}
//                   selectedGrid={selectedGrid}
//                   onClick={(row, column) => handleGridClick(row, column, 'body')}
//                   isColumn={tableProperty.column}
//                   isRow={tableProperty.row}
//                   isBody={tableProperty.body}
//                   values={Values}
//                   ShowInput={ShowInput}
//                   bgColor={backgroundColor}
//                   cellFont={cellFont}
//                   formatString={FormatString && FormatString[cellType - 1]}
//                   key={column + 1}
//                 />
//               );
//             })}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Grid;

import React, { useState, useEffect, useRef } from 'react';
import { setStyle, generateHeader, extractStringUntilSecondPeriod, rgbColor } from '../../utils';
import { useResizeObserver, useAppData } from '../../hooks';
import GridEdit from './GridEdit';
import GridSelect from './GridSelect';
import GridButton from './GridButton';
import GridCell from './GridCell';
import Header from './Header';
import GridLabel from './GridLabel';

const Grid = ({ data }) => {
  return <GridComponent key={data?.ID} data={data} />;
};

const GridComponent = ({ data }) => {
  const gridId = data?.ID;

  const { findDesiredData, socket } = useAppData();
  const dimensions = useResizeObserver(
    document.getElementById(extractStringUntilSecondPeriod(data?.ID))
  );
  const handleKeyDownRef = useRef(null);

  const {
    Size,
    Values,
    Input,
    ColTitles,
    RowTitles,
    CellWidths,
    CellHeights,
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

  const [height, setHeight] = useState(Size[0]);
  const [width, setWidth] = useState(Size[1]);
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedColumn, setSelectedColumn] = useState(0);
  const [focusedCell, setFocusedCell] = useState({ row: 0, column: 0 });
  const [tableData, setTableData] = useState([]);
  const style = setStyle(data?.Properties);

  useEffect(() => {
    if (!Attach) return;
    setWidth(dimensions?.width - 73);
    setHeight(dimensions?.height - 73);
  }, [dimensions]);

  useEffect(() => {
    if (!ColTitles) setColumns(Values[0]?.length + 1);
    else setColumns(ColTitles?.length);

    if (Values) setRows(Values?.length + 1);
  }, [data]);

  const handleCellMove = (row, column, value) => {
    const cellMoveEvent = JSON.stringify({
      Event: {
        ID: data?.ID,
        EventName: 'CellMove',
        Info: [row, column, 0, 0, 0, value],
      },
    });

    const exists = Event && Event?.some((item) => item[0] === 'CellMove');
    if (!exists) return;
    console.log(cellMoveEvent);
    socket.send(cellMoveEvent);
  };

  const handleKeyDown = (event) => {
    // const gridData = JSON.parse(localStorage.getItem(data?.ID));
    const table = event.target.id.split('-');

    const isAltPressed = event.altKey ? 4 : 0;
    const isCtrlPressed = event.ctrlKey ? 2 : 0;
    const isShiftPressed = event.shiftKey ? 1 : 0;
    const charCode = event.key.charCodeAt(0);
    let shiftState = isAltPressed + isCtrlPressed + isShiftPressed;

    const exists = Event && Event?.some((item) => item[0] === 'KeyPress');

    if (exists) {
      console.log(
        JSON.stringify({
          Event: {
            EventName: 'KeyPress',
            ID: data?.ID,
            Info: [event.key, charCode, event.keyCode, shiftState],
          },
        })
      );
      socket.send(
        JSON.stringify({
          Event: {
            EventName: 'KeyPress',
            ID: data?.ID,
            Info: [event.key, charCode, event.keyCode, shiftState],
          },
        })
      );
    }

    if (event.key === 'ArrowRight') {
      setSelectedColumn((prev) => Math.min(prev + 1, columns - 1));
      handleCellMove(
        parseInt(table[0]),
        parseInt(table[1]) + 2,
        Values[parseInt(table[0]) - 1][parseInt(table[1])]
      );
    } else if (event.key === 'ArrowLeft') {
      // setSelectedColumn((prev) => prev - 1);
      setSelectedColumn((prev) => Math.max(prev - 1, 0));
      handleCellMove(
        parseInt(table[0]),
        parseInt(table[1]),
        Values[parseInt(table[0]) - 1][parseInt(table[1])]
      );
    } else if (event.key === 'ArrowUp') {
      // setSelectedRow((prev) => prev - 1);
      setSelectedRow((prev) => Math.max(prev - 1, 1));
      handleCellMove(
        parseInt(table[0]) - 1,
        parseInt(table[1]) + 1,
        Values[parseInt(table[0]) - 1][parseInt(table[1])]
      );
    } else if (event.key === 'ArrowDown') {
      // setSelectedRow((prev) => prev + 1);
      setSelectedRow((prev) => Math.min(prev + 1, rows - 1));
      handleCellMove(
        parseInt(table[0]) + 1,
        parseInt(table[1]) + 1,
        Values[parseInt(table[0]) - 1][parseInt(table[1])]
      );
    }
  };

  const modifyGridData = () => {
    let data = [];
    // Push the header Information
    if (ColTitles) {
      // Add the empty cell in the header when the default Row Titles is present
      let header = [];
      let emptyobj = {
        value: '',
        type: 'header',
        width: !TitleWidth ? 100 : TitleWidth,
        height: !TitleHeight ? 20 : TitleHeight,
      };

      // push the obj when TitleWidth is present
      !TitleWidth && !RowTitles ? null : header.push(emptyobj);

      for (let i = 0; i < ColTitles?.length; i++) {
        let obj = {
          value: ColTitles[i],
          type: 'header',
          backgroundColor: rgbColor(ColTitleBCol),
          color: rgbColor(ColTitleFCol),
          width: !CellWidths ? 100 : Array.isArray(CellWidths) ? CellWidths[i] : CellWidths,
          height: !TitleHeight ? 20 : TitleHeight,
        };

        header.push(obj);
      }

      // header = RowTitles
      //   ? [
      //       {
      //         value: '',
      //         type: 'header',
      //         width: RowTitles ? (!TitleWidth ? 100 : TitleWidth) : CellWidths,
      //       },
      //       ...header,
      //     ]
      //   : [...header];

      data.push(header);
    } else if (!ColTitles) {
      let headerArray = generateHeader(columns).map((alphabet) => {
        return {
          value: alphabet,
          type: 'header',
          width: !TitleWidth ? 100 : TitleWidth,
          height: !TitleHeight ? 20 : TitleHeight,
        };
      });
      data.push(headerArray);
    }

    // Make the body the Grid Like if it have Input Array that means it have types
    if (!Input) {
      for (let i = 0; i < Values?.length; i++) {
        let body = [];
        let obj = {
          type: 'cell',
          value: RowTitles ? RowTitles[i] : i + 1,
          width: RowTitles ? (!TitleWidth ? 100 : TitleWidth) : 100,
          height: !CellHeights ? 20 : Array.isArray(CellHeights) ? CellHeights[i] : CellHeights,
          align: 'start',
        };
        body.push(obj);
        for (let j = 0; j <= columns; j++) {
          let obj = {
            type: 'cell',
            value: Values[i][j],
            width: !CellWidths ? 100 : Array.isArray(CellWidths) ? CellWidths[i] : CellWidths,
            height: !CellHeights ? 20 : Array.isArray(CellHeights) ? CellHeights[j] : CellHeights,
            align: 'end',
          };
          body.push(obj);
        }
        data.push(body);
      }
    } else if (Input) {
      for (let i = 0; i < Values?.length; i++) {
        let body = [];

        // Decide to add the RowTitles If the TitleWidth is Greater than 0
        let obj = {
          type: 'cell',
          value: RowTitles ? RowTitles[i] : i + 1,
          width: !TitleWidth ? 100 : TitleWidth,
          height: !CellHeights ? 20 : Array.isArray(CellHeights) ? CellHeights[i] : CellHeights,
          align: 'start',
        };

        !TitleWidth ? null : body.push(obj);

        for (let j = 0; j < columns; j++) {
          let cellType = CellTypes && CellTypes[i][j];
          const type = findDesiredData(Input?.length > 1 ? Input && Input[cellType - 1] : Input[0]);
          const event = data?.Properties?.Event && data?.Properties?.Event;
          const backgroundColor = BCol && BCol[cellType - 1];
          const cellFont = findDesiredData(CellFonts && CellFonts[cellType - 1]);

          let obj = {
            type: !type ? 'cell' : type?.Properties?.Type,
            value: Values[i][j],
            event,
            backgroundColor: rgbColor(backgroundColor),
            cellFont,
            typeObj: type,
            formattedValue: FormattedValues && FormattedValues[i][j],
            formatString: FormatString && FormatString[cellType - 1],
            width: !CellWidths ? 100 : Array.isArray(CellWidths) ? CellWidths[j] : CellWidths,
            height: !CellHeights ? 20 : Array.isArray(CellHeights) ? CellHeights[i] : CellHeights,
          };
          body.push(obj);
        }
        data.push(body);
      }
    }

    return data;
  };

  const handleCellClick = (row, column) => {
    setFocusedCell({ row, column });
  };

  const gridData = modifyGridData();

  console.log({ gridData });

  const components = {
    Edit: (data) => {
      return <GridEdit data={data} keyPress={handleKeyDown} />;
    },
    Button: (data) => {
      return <GridButton data={data} gridId={data?.ID} gridValues={Values} />;
    },
    cell: (data) => {
      return (
        <GridCell
          gridEvent={Event}
          data={data}
          keyPress={handleKeyDown}
          cellClick={handleCellClick}
        />
      );
    },
    header: (data) => {
      return <Header data={data} keyPress={handleKeyDown} cellClick={handleCellClick} />;
    },
    Combo: (data) => {
      return (
        <GridSelect
          gridEvent={Event}
          data={data}
          keyPress={handleKeyDownRef.current}
          cellClick={handleCellClick}
        />
      );
    },
    Label: (data) => {
      return <GridLabel data={data} />;
    },
  };

  

  return (
    <div
      // onKeyDown={handleKeyDown}
      tabIndex='0'
      id={data?.ID}
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
      {gridData?.map((row, rowi) => {
        return (
          <div style={{ display: 'flex' }}>
            {row.map((data, columni) => {
              const isFocused = selectedRow === rowi && selectedColumn === columni;
              const Component = components[data?.type];

              return (
                <div
                  // tabIndex={rowi}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColumn(columni);
                    setSelectedRow(rowi);
                  }}
                  // onChange={() => {
                  //   setSelectedColumn(columni);
                  //   setSelectedRow(rowi);
                  // }}
                  onKeyDown={handleKeyDown}
                  id={`${gridId}.r${rowi + 1}.c${columni + 1}`}
                  style={{
                    borderRight: isFocused ? '1px solid blue' : '1px solid  #EFEFEF',
                    borderBottom: isFocused ? '1px solid blue' : '1px solid  #EFEFEF',
                    // minWidth: !CellWidths ? '100px' : CellWidths[columni],
                    // maxWidth: !CellWidths ? '100px' : CellWidths[columni],
                    fontSize: '12px',
                    minHeight: `${data?.height}px`,
                    maxHeight: `${data?.height}px`,
                    minWidth: `${data?.width}px`,
                    maxWidth: `${data?.width}px`,
                    minheight: `${data?.height}px`,
                    maxheight: `${data?.height}px`,
                    backgroundColor:
                      selectedColumn === columni && data.type == 'header'
                        ? 'lightblue'
                        : rgbColor(data?.backgroundColor),
                    textAlign: data.type == 'header' ? 'center' : 'left',
                    overflow: 'hidden',
                  }}
                >
                  {!data.type ? null : (
                    <Component
                      showInput={ShowInput}
                      backgroundColor={data?.backgroundColor}
                      gridId={gridId}
                      gridValues={Values}
                      gridEvent={Event}
                      focused={isFocused}
                      row={rowi}
                      column={columni}
                      {...data}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Grid;
