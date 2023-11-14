import { checkPeriod, excludeKeys } from '../../utils';
import { useAppData } from '../../hooks';
import SelectComponent from '../SelectComponent';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import { useRef, useState } from 'react';
import { useEffect } from 'react';

const Splitter = ({ data }) => {
  const { dataRef } = useAppData();
  const { socket } = useAppData();
  const verticalSplitter = useRef();

  let formWidth = 800;
  let formHeight = 800;

  const { SplitObj1, SplitObj2, Style, Posn } = data?.Properties;
  const [sizes, setSizes] = useState([100, '30%', 'auto']);
  const [horizontalSize, setHorizontalSize] = useState([100, 200, 'auto']);

  const periodSplitObj1 = checkPeriod(SplitObj1);
  const periodSplitObj2 = checkPeriod(SplitObj2);

  const keySplit1 = SplitObj1?.split('.');
  const keySplit2 = SplitObj2?.split('.');

  let firstFormData = null;
  let secondFormData = null;

  if (periodSplitObj1 == 1 && periodSplitObj2 == 1) {
    firstFormData = dataRef.current[keySplit1[0]][keySplit1[1]];
    secondFormData = dataRef.current[keySplit2[0]][keySplit2[1]];
  }

  if (periodSplitObj1 == 2 && periodSplitObj2 == 2) {
    firstFormData = dataRef.current[keySplit1[0]][keySplit1[1]][keySplit1[2]];
    secondFormData = dataRef.current[keySplit2[0]][keySplit2[1]][keySplit2[2]];
  }

  const updatedFirstForm = excludeKeys(firstFormData);
  const updatedSecondForm = excludeKeys(secondFormData);

  const layoutCSS = {
    height: '100%',
  };

  const initializeSplitterDimensions = () => {
    localStorage.setItem(
      data?.ID,
      JSON.stringify({
        Event: {
          EventName: data?.Properties?.Event[0],
          ID: data.ID,
          Info: Posn,
        },
      })
    );

    if (Style && Style == 'Horz') {
      const localStorageKeys = Object.keys(localStorage);

      localStorageKeys.forEach((key) => {
        const IDs = key.split('.');

        if (IDs.length == 2 && IDs.includes('RIGHT')) {
          const rightPaneDimensions = JSON.parse(localStorage.getItem(key));
          const { Size } = rightPaneDimensions;

          localStorage.setItem(
            SplitObj1,
            JSON.stringify({ Size: [Posn[0], Size[1]], Posn: [Posn[0], 0] })
          );
          localStorage.setItem(
            SplitObj2,
            JSON.stringify({
              Size: [formHeight - (Posn[0] + 3), Size[1]],
              Posn: [Posn[0] + 3, 0],
            })
          );
        }
      });
    } else {
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
    }
  };

  const calculateVerticalDimensions = (leftWidth) => {
    const rightWidth = formWidth - (leftWidth + 3);
    localStorage.setItem(
      SplitObj1,
      JSON.stringify({ Size: [formHeight, leftWidth], Posn: [0, leftWidth] })
    );
    localStorage.setItem(
      SplitObj2,
      JSON.stringify({ Size: [formHeight, rightWidth], Posn: [0, leftWidth + 3] })
    );

    // Updated the position of top and bottom

    const localStorageKeys = Object.keys(localStorage);

    localStorageKeys.forEach((key) => {
      const IDs = key.split('.');

      if (IDs.length == 3 && IDs.includes('TOP') && IDs.includes('RIGHT')) {
        const topPreviousDimension = JSON.parse(localStorage.getItem(key));
        const { Size, Posn } = topPreviousDimension;
        localStorage.setItem(
          key,
          JSON.stringify({ Size: [Size[0], rightWidth], Posn: [Posn[0], 0] })
        );
      } else if (IDs.length == 3 && IDs.includes('BOT') && IDs.includes('RIGHT')) {
        const bottomPreviousDimension = JSON.parse(localStorage.getItem(key));
        const { Size, Posn } = bottomPreviousDimension;
        localStorage.setItem(
          key,
          JSON.stringify({ Size: [Size[0], rightWidth], Posn: [Posn[0], 0] })
        );
      }
    });
  };

  const calculateHorizontalDimensions = (topHeight) => {
    const topDimensions = JSON.parse(localStorage.getItem(SplitObj1));
    const bottomDimensions = JSON.parse(localStorage.getItem(SplitObj2));

    localStorage.setItem(
      SplitObj1,
      JSON.stringify({ Size: [topHeight, topDimensions.Size[1]], Posn: [topHeight, 0] })
    );
    localStorage.setItem(
      SplitObj2,
      JSON.stringify({
        Size: [formHeight - (topHeight + 3), bottomDimensions.Size[1]],
        Posn: [topHeight + 3, 0],
      })
    );
  };

  useEffect(() => {
    initializeSplitterDimensions();
  }, []);

  // Horizontal Split

  if (Style && Style == 'Horz') {
    return (
      <div style={{ height: 800, background: 'white' }}>
        <SplitPane
          split='horizontal'
          sizes={horizontalSize}
          onChange={(sizes) => {
            localStorage.setItem('coordinates', JSON.stringify(sizes));
            setHorizontalSize(sizes);
          }}
          onDragEnd={(e) => {
            const coordinates = JSON.parse(localStorage.getItem('coordinates'));

            calculateHorizontalDimensions(Math.round(coordinates[0]));
            console.log(
              JSON.stringify({
                Event: {
                  EventName: data?.Properties?.Event[0],
                  ID: data.ID,
                  Info: [Math.round(coordinates[0]), 0, 3, 494],
                },
              })
            );

            socket.send(
              JSON.stringify({
                Event: {
                  EventName: data?.Properties?.Event[0],
                  ID: data.ID,
                  Info: [Math.round(coordinates[0]), 0, 3, 494],
                },
              })
            );

            localStorage.setItem(
              data?.ID,
              JSON.stringify({
                Event: {
                  EventName: data?.Properties?.Event[0],
                  ID: data.ID,
                  Info: [Math.round(coordinates[0]), 0],
                },
              })
            );
          }}
        >
          <div>
            <div
              style={{
                height: data?.Properties?.Posn[0],
                position: 'relative',
                background: 'white',
              }}
            >
              {Object.keys(updatedFirstForm).map((key) => (
                <SelectComponent data={updatedFirstForm[key]} />
              ))}
            </div>
          </div>
          <div style={{ border: '1px solid #F0F0F0' }}>
            <div style={{ position: 'absolute', flex: 1, background: 'white' }}>
              {Object.keys(updatedSecondForm).map((key) => (
                <SelectComponent data={updatedSecondForm[key]} />
              ))}
            </div>
          </div>
        </SplitPane>
      </div>
    );
  }

  // Vertical Split

  //Event Information

  // Info [0,left,800,3]
  // 800 is the height of the Splitter and 3 is the width of the splitter
  //0 is the top position of the Splitter and left is the left position of the Splitter

  return (
    <SplitPane
      split='vertical'
      sizes={sizes}
      onChange={(value) => {
        localStorage.setItem('coordinates', JSON.stringify(value));
        setSizes(value);
      }}
      onDragEnd={(e) => {
        const coordinates = JSON.parse(localStorage.getItem('coordinates'));
        calculateVerticalDimensions(Math.round(coordinates[0]));
        console.log(
          JSON.stringify({
            Event: {
              EventName: data?.Properties?.Event[0],
              ID: data.ID,
              Info: [0, Math.round(coordinates[0]), 800, 3],
            },
          })
        );

        socket.send(
          JSON.stringify({
            Event: {
              EventName: data?.Properties?.Event[0],
              ID: data.ID,
              Info: [0, Math.round(coordinates[0]), 800, 3],
            },
          })
        );

        localStorage.setItem(
          data.ID,
          JSON.stringify({
            Event: {
              EventName: data?.Properties?.Event[0],
              ID: data.ID,
              Info: [0, Math.round(coordinates[0])],
            },
          })
        );
      }}
    >
      {/* left Subform */}
      <Pane minSize={0} maxSize='100%'>
        <div style={{ ...layoutCSS, border: '1px solid #F0F0F0', background: 'white' }}>
          <div
            style={{
              width: data?.Properties?.Posn[1],
              background: 'white',
              position: 'relative',
            }}
          >
            {Object.keys(updatedFirstForm).map((key) => (
              <SelectComponent data={updatedFirstForm[key]} />
            ))}
          </div>
        </div>
      </Pane>
      {/* Right SubForm */}
      <div style={{ ...layoutCSS, background: 'white' }}>
        <div style={{ background: 'white' }}>
          {Object.keys(updatedSecondForm).map((key) => (
            <SelectComponent data={updatedSecondForm[key]} />
          ))}
        </div>
      </div>
    </SplitPane>
  );
};

export default Splitter;
