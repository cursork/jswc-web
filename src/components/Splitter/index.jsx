import { checkPeriod, excludeKeys } from '../../utils';
import { useAppData } from '../../hooks';
import SelectComponent from '../SelectComponent';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import VerticalSplitter from './VerticalSplitter';
import HorizontalSplitter from './HorizontalSplitter';

// const Splitter = ({ data }) => {
//   const { dataRef, socket, findDesiredData } = useAppData();

//   let formWidth = 800;
//   let formHeight = 800;

//   const { SplitObj1, SplitObj2, Style, Posn, Event, Visible, Size } = data?.Properties;

//   let parentKey = data?.ID?.split('.');

//   const [sizes, setSizes] = useState([Posn && Posn[1]]);
//   const [horizontalSize, setHorizontalSize] = useState([Posn && Posn[0]]);
//   const [clone1, setClone1] = useState(null);
//   const [clone2, setClone2] = useState(null);

//   const emitEvent = Event && Event[0];

//   const periodSplitObj1 = checkPeriod(SplitObj1);
//   const periodSplitObj2 = checkPeriod(SplitObj2);

//   const keySplit1 = SplitObj1?.split('.');
//   const keySplit2 = SplitObj2?.split('.');

//   let firstFormData = null;
//   let secondFormData = null;

//   if (periodSplitObj1 == 1 && periodSplitObj2 == 1) {
//     firstFormData = dataRef.current[keySplit1[0]][keySplit1[1]];
//     secondFormData = dataRef.current[keySplit2[0]][keySplit2[1]];
//   }

//   if (periodSplitObj1 == 2 && periodSplitObj2 == 2) {
//     firstFormData = dataRef.current[keySplit1[0]][keySplit1[1]][keySplit1[2]];
//     secondFormData = dataRef.current[keySplit2[0]][keySplit2[1]][keySplit2[2]];
//   }

//   const updatedFirstForm = excludeKeys(firstFormData);
//   const updatedSecondForm = excludeKeys(secondFormData);

//   const layoutCSS = {
//     height: '100%',
//   };

//   const initializeSplitterDimensions = () => {
//     if (Style && Style == 'Horz') {
//       const localStorageKeys = Object.keys(localStorage);

//       localStorageKeys.forEach((key) => {
//         const IDs = key.split('.');

//         if (IDs.length == 2 && IDs.includes('RIGHT')) {
//           const rightPaneDimensions = JSON.parse(localStorage.getItem(key));
//           const { Size } = rightPaneDimensions;

//           localStorage.setItem(
//             data?.ID,
//             JSON.stringify({
//               Event: {
//                 EventName: emitEvent && emitEvent[0],
//                 ID: data.ID,
//                 Info: Posn,
//                 Size: [3, Size[1]],
//               },
//             })
//           );

//           localStorage.setItem(
//             SplitObj1,
//             JSON.stringify({ Size: [Posn[0], Size[1]], Posn: [Posn[0], 0] })
//           );
//           localStorage.setItem(
//             SplitObj2,
//             JSON.stringify({
//               Size: [formHeight - (Posn[0] + 3), Size[1]],
//               Posn: [Posn[0] + 3, 0],
//             })
//           );
//         }
//       });
//     } else {
//       localStorage.setItem(
//         data?.ID,
//         JSON.stringify({
//           Event: {
//             EventName: emitEvent && emitEvent[0],
//             ID: data.ID,
//             Info: Posn,
//             Size: [formHeight, 3],
//           },
//         })
//       );

//       localStorage.setItem(
//         SplitObj1,
//         JSON.stringify({ Size: [formHeight, Posn[1]], Posn: [0, Posn[1]] })
//       );
//       localStorage.setItem(
//         SplitObj2,
//         JSON.stringify({
//           Size: [formHeight, formWidth - (Posn[1] + 3)],
//           Posn: [0, Posn[1] + 3],
//         })
//       );
//     }
//   };

//   const calculateVerticalDimensions = (leftWidth) => {
//     const rightWidth = formWidth - (leftWidth + 3);
//     localStorage.setItem(
//       SplitObj1,
//       JSON.stringify({ Size: [formHeight, leftWidth], Posn: [0, leftWidth] })
//     );
//     localStorage.setItem(
//       SplitObj2,
//       JSON.stringify({ Size: [formHeight, rightWidth], Posn: [0, leftWidth + 3] })
//     );

//     // Updated the position of top and bottom in Horizontal Splitter

//     const localStorageKeys = Object.keys(localStorage);

//     localStorageKeys.forEach((key) => {
//       const IDs = key.split('.');

//       // ******Updated the Width of the Horizontal Splitter on Moving Vertical Splitter
//       if (IDs.length == 3 && IDs.includes('SPLIT')) {
//         const { Event } = JSON.parse(localStorage.getItem(key));
//         const { Info } = Event;

//         localStorage.setItem(
//           key,
//           JSON.stringify({
//             Event: {
//               EventName: emitEvent && emitEvent[0],
//               ID: data.ID,
//               Info: Info,
//               Size: [3, rightWidth],
//             },
//           })
//         );
//       }

//       if (IDs.length == 3 && IDs.includes('TOP') && IDs.includes('RIGHT')) {
//         const topPreviousDimension = JSON.parse(localStorage.getItem(key));
//         const { Size, Posn } = topPreviousDimension;
//         localStorage.setItem(
//           key,
//           JSON.stringify({ Size: [Size[0], rightWidth], Posn: [Posn[0], 0] })
//         );
//       } else if (IDs.length == 3 && IDs.includes('BOT') && IDs.includes('RIGHT')) {
//         const bottomPreviousDimension = JSON.parse(localStorage.getItem(key));
//         const { Size, Posn } = bottomPreviousDimension;
//         localStorage.setItem(
//           key,
//           JSON.stringify({ Size: [Size[0], rightWidth], Posn: [Posn[0], 0] })
//         );
//       }
//     });
//   };

//   const calculateHorizontalDimensions = (topHeight) => {
//     const topDimensions = JSON.parse(localStorage.getItem(SplitObj1));
//     const bottomDimensions = JSON.parse(localStorage.getItem(SplitObj2));

//     localStorage.setItem(
//       data?.ID,
//       JSON.stringify({
//         Event: {
//           EventName: emitEvent && emitEvent[0],
//           ID: data.ID,
//           Info: [topHeight, 0],
//           Size: [3, topDimensions?.Size[1]],
//         },
//       })
//     );

//     localStorage.setItem(
//       SplitObj1,
//       JSON.stringify({
//         Size: [topHeight, topDimensions?.Size[1]],
//         Posn: [topHeight && topHeight, 0],
//       })
//     );
//     localStorage.setItem(
//       SplitObj2,
//       JSON.stringify({
//         Size: [formHeight - (topHeight + 3), bottomDimensions.Size[1]],
//         Posn: [topHeight + 3, 0],
//       })
//     );
//   };

//   useEffect(() => {
//     let splitObj1 = document.getElementById(SplitObj1);
//     let splitObj2 = document.getElementById(SplitObj2);

//     if (splitObj1) {
//       splitObj1.style.display = 'none';
//     }
//     if (splitObj2) {
//       splitObj2.style.display = 'none';
//     }
//   }, [data]);
//   // Horizontal Split

//   let splitObj1 = document.getElementById(SplitObj1)?.innerHTML;
//   let splitObj2 = document.getElementById(SplitObj2)?.innerHTML;

//   // console.log('split', splitObj2);

//   if (Style && Style == 'Horz') {
//     const isTopVisible = firstFormData && firstFormData?.Properties?.Visible;
//     const isBottomVisible = secondFormData && secondFormData?.Properties?.Visible;

//     return (
//       <div style={{ height: 800, background: 'white', display: Visible == 0 ? 'none' : 'block' }}>
//         <SplitPane
//           split='horizontal'
//           sizes={horizontalSize}
//           onChange={(sizes) => {
//             localStorage.setItem('coordinates', JSON.stringify(sizes));
//             setHorizontalSize(sizes);
//           }}
//           onDragEnd={(e) => {
//             const coordinates = JSON.parse(localStorage.getItem('coordinates'));

//             calculateHorizontalDimensions(Math.round(coordinates[0]));
//             console.log(
//               JSON.stringify({
//                 Event: {
//                   EventName: emitEvent && emitEvent[0],
//                   ID: data.ID,
//                   Info: [Math.round(coordinates[0]), 0, 3, 494],
//                 },
//               })
//             );

//             socket.send(
//               JSON.stringify({
//                 Event: {
//                   EventName: emitEvent && emitEvent[0],
//                   ID: data.ID,
//                   Info: [Math.round(coordinates[0]), 0, 3, 494],
//                 },
//               })
//             );
//           }}
//         >
//           <div>
//             <div
//               // dangerouslySetInnerHTML={{ __html: splitObj1 }}
//               style={{
//                 height: data?.Properties?.Posn[0],
//                 position: 'relative',
//                 background: 'white',
//                 display: isTopVisible == 0 ? 'none' : 'block',
//               }}
//             >
//               {Object.keys(updatedFirstForm).map((key) => (
//                 <SelectComponent inSplitter={'inSplitter'} data={updatedFirstForm[key]} />
//               ))}
//             </div>
//           </div>
//           <div style={{ border: '1px solid #F0F0F0' }}>
//             <div
//               // dangerouslySetInnerHTML={{ __html: splitObj2 }}
//               style={{
//                 position: 'absolute',
//                 flex: 1,
//                 background: 'white',
//                 display: isBottomVisible == 0 ? 'none' : 'block',
//               }}
//             >
//               {Object.keys(updatedSecondForm).map((key) => (
//                 <SelectComponent inSplitter={'inSplitter'} data={updatedSecondForm[key]} />
//               ))}
//             </div>
//           </div>
//         </SplitPane>
//       </div>
//     );
//   }

//   // Vertical Split

//   //Event Information

//   // Info [0,left,800,3]
//   // 800 is the height of the Splitter and 3 is the width of the splitter
//   //0 is the top position of the Splitter and left is the left position of the Splitter

//   const isLeftVisible = firstFormData && firstFormData?.Properties?.Visible;

//   const isRightVisible = secondFormData && secondFormData?.Properties?.Visible;

//   // splitObj1 = document.getElementById(SplitObj1)?.innerHTML;

//   // splitObj2 = document.getElementById(SplitObj2)?.innerHTML;

//   return (
//     <SplitPane
//       split='vertical'
//       sizes={sizes}
//       onChange={(value) => {
//         localStorage.setItem('coordinates', JSON.stringify(value));
//         setSizes(value);
//       }}
//       onDragEnd={(e) => {
//         const coordinates = JSON.parse(localStorage.getItem('coordinates'));
//         calculateVerticalDimensions(Math.round(coordinates[0]));
//         console.log(
//           JSON.stringify({
//             Event: {
//               EventName: emitEvent && emitEvent[0],
//               ID: data.ID,
//               Info: [0, Math.round(coordinates[0]), 800, 3],
//             },
//           })
//         );

//         socket.send(
//           JSON.stringify({
//             Event: {
//               EventName: emitEvent && emitEvent[0],
//               ID: data.ID,
//               Info: [0, Math.round(coordinates[0]), 800, 3],
//             },
//           })
//         );

//         localStorage.setItem(
//           data.ID,
//           JSON.stringify({
//             Event: {
//               EventName: emitEvent && emitEvent[0],
//               ID: data.ID,
//               Info: [0, Math.round(coordinates[0])],
//               Size: [formHeight, 3],
//             },
//           })
//         );
//       }}
//       style={{ display: Visible == 0 ? 'none' : 'block' }}
//     >
//       {/* left Subform */}
//       <Pane minSize={0} maxSize='100%'>
//         <div
//           style={{
//             ...layoutCSS,
//             border: '1px solid #F0F0F0',
//             background: 'white',
//             display: isLeftVisible == 0 ? 'none' : 'block',
//           }}
//         >
//           <div
//             // dangerouslySetInnerHTML={{ __html: splitObj1 }}
//             id='split-obj1'
//             style={{
//               width: data?.Properties?.Posn[1],
//               background: 'white',
//               position: 'relative',
//             }}
//           >
//             {Object.keys(firstFormData).map((key) => {
//               return <SelectComponent data={firstFormData[key]} />;
//             })}
//           </div>
//         </div>
//       </Pane>
//       {/* Right SubForm */}
//       <div style={{ ...layoutCSS, background: 'white' }}>
//         <div
//           // dangerouslySetInnerHTML={{ __html: splitObj2 }}
//           style={{ background: 'white', display: isRightVisible == 0 ? 'none' : 'block' }}
//         >
//           {Object.keys(updatedSecondForm).map((key) => (
//             <SelectComponent
//               inSplitter={'inSplitter'}
//               isSubForm={true}
//               data={updatedSecondForm[key]}
//             />
//           ))}
//         </div>
//       </div>
//     </SplitPane>
//   );
// };

// export default Splitter;

const Splitter = ({ data }) => {
  const { Style, Posn, SplitObj1, SplitObj2, Event } = data?.Properties;
  const { handleData } = useAppData();
  let formWidth = 800;
  let formHeight = 800;
  const emitEvent = Event && Event[0];

  const initializeSplitterDimensions = () => {
    if (Style && Style == 'Horz') {
      const localStorageKeys = Object.keys(localStorage);

      localStorageKeys.forEach((key) => {
        const IDs = key.split('.');

        if (IDs.length == 2 && IDs.includes('RIGHT')) {
          const rightPaneDimensions = JSON.parse(localStorage.getItem(key));

          const { Size } = rightPaneDimensions;

          localStorage.setItem(
            data?.ID,
            JSON.stringify({
              Event: {
                EventName: emitEvent && emitEvent[0],
                ID: data.ID,
                Info: Posn,
                Size: [3, Size[1]],
              },
            })
          );
          localStorage.setItem(
            SplitObj1,
            JSON.stringify({ Size: [Posn[0], Size[1]], Posn: [0, 0] })
          );

          handleData(
            {
              ID: SplitObj1,
              Properties: {
                Posn: [0, 0],
                Size: [Posn[0], Size[1]],
                BCol: [255, 255, 255],
              },
            },
            'WS'
          );
          localStorage.setItem(
            SplitObj2,
            JSON.stringify({
              Size: [formHeight - (Posn[0] + 3), Size[1]],
              Posn: [Posn[0] + 3, 0],
            })
          );
          handleData(
            {
              ID: SplitObj2,
              Properties: {
                Posn: [Posn[0] + 3, 0],
                Size: [formHeight - (Posn[0] + 3), Size[1]],
                BCol: [255, 255, 255],
              },
            },
            'WS'
          );
        }
      });
    } else {
      localStorage.setItem(
        data?.ID,
        JSON.stringify({
          Event: {
            EventName: emitEvent && emitEvent[0],
            ID: data.ID,
            Info: Posn,
            Size: [formHeight, 3],
          },
        })
      );

      localStorage.setItem(
        SplitObj1,
        JSON.stringify({ Size: [formHeight, Posn[1]], Posn: [0, Posn[1]] })
      );
      localStorage.setItem(
        SplitObj2,
        JSON.stringify({
          Size: [formHeight, formWidth - (Posn[1] + 3)],
          Posn: [0, Posn[1] + 3],
        })
      );

      handleData(
        {
          ID: SplitObj1,
          Properties: {
            BCol: [255, 255, 255],
          },
        },
        'WS'
      );

      handleData(
        {
          ID: SplitObj2,
          Properties: {
            BCol: [255, 255, 255],
          },
        },
        'WS'
      );
    }
  };

  useEffect(() => {
    initializeSplitterDimensions();
  }, []);

  if (Style && Style == 'Horz') {
    return <HorizontalSplitter data={data} />;
  }

  return <VerticalSplitter data={data} />;
};

export default Splitter;
