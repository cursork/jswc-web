import { getObjectById, rgbColor } from '../../utils';
import { useAppData } from '../../hooks';
import { useEffect, useState } from 'react';

function useForceRerender() {
  const [_state, setState] = useState(true);
  const reRender = () => {
    setState((prev) => !prev);
  };
  return { reRender };
}

const Text = ({ data, fontProperties }) => {
  // console.log({ fontProperties });

  const { Visible, Points, Text, FCol, FontObj } = data?.Properties;
  const { findDesiredData, dataRef } = useAppData();

  const { reRender } = useForceRerender();

  const parentSize = JSON.parse(localStorage.getItem('formDimension'));

  const pointsArray = Points && Points[0].map((y, i) => [Points[1][i], y]);
  // const [fontProperties, setFontProperties] = useState(null);

  // const font = JSON.parse(getObjectById(dataRef?.current, FontObj));

  // console.log({ font });

  // const fontProperties = font && font?.Properties;

  // console.log({ font });

  // console.log({ fontProperties });

  // console.log({ pointsArray });
  // console.log({ Text });

  // console.log({ fontProperties });

  // useEffect(() => {
  //   console.log('Change the Rotate');
  // }, [fontProperties?.Rotate]);
  // useEffect(() => {
  //   reRender();
  // }, []);

  // useEffect(() => {
  //   // setInterval(() => {
  //   //   setRotate((prev) => prev + 0.3);
  //   // }, 200);
  //   const font = findDesiredData(FontObj && FontObj);

  //   setFontProperties(font && font?.Properties);

  //   // console.log('Font', font?.Properties);
  //   // console.log(font?.Properties?.Rotate, 'values');
  //   setRotate(font?.Properties?.Rotate);
  // }, [fontProperties?.Rotate]);

  return (
    <>
      {/* {JSON.stringify(fontProperties)} */}
      <div
        style={{
          position: 'absolute',
          display: Visible == 0 ? 'none' : 'block',
          top: 0,
          left: 0,
        }}
      >
        <svg height={parentSize && parentSize[0]} width={parentSize && parentSize[1]}>
          {pointsArray?.map((textPoints, index) => {
            return (
              <text
                alignment-baseline='middle'
                dy='0.7em'
                x={textPoints[0]}
                y={textPoints[1]}
                font-family={fontProperties?.PName}
                font-size={!fontProperties?.Size ? '11px' : `${fontProperties?.Size}px`}
                fill={FCol ? rgbColor(FCol && FCol[index]) : 'black'}
                font-style={
                  !fontProperties?.Italic ? 'none' : fontProperties?.Italic == 1 ? 'italic' : 'none'
                }
                font-weight={!fontProperties?.Weight ? 0 : fontProperties?.Weight}
                text-decoration={
                  !fontProperties?.Underline
                    ? 'none'
                    : fontProperties?.Underline == 1
                    ? 'underline'
                    : 'none'
                }
                transform={`translate(${textPoints[0]}, ${textPoints[1]}) rotate(${
                  fontProperties?.Rotate * (180 / Math.PI)
                }) translate(${-textPoints[0]}, ${-textPoints[1]})`}
              >
                {pointsArray.length >= 1
                  ? Text[index].replace(/ /g, '\u00A0') // Replace space with &nbsp;
                  : Text?.map((text, textIndex) => {
                      const lineHeight = textIndex === 0 ? '0.7em' : '1em';
                      return (
                        <tspan x={textPoints[0]} dy={lineHeight}>
                          {text}
                        </tspan>
                      );
                    })}
              </text>
            );
          })}
        </svg>
      </div>
    </>
  );
};
export default Text;
