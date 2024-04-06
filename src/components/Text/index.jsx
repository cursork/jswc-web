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

  const { Visible, Points, Text, FCol, BCol } = data?.Properties;

  const { reRender } = useForceRerender();

  const parentSize = JSON.parse(localStorage.getItem('formDimension'));

  const pointsArray = Points && Points[0].map((y, i) => [Points[1][i], y]);

  const calculateTextDimensions = (wordsArray, fontSize = 11) => {
    // Create a hidden div element to calculate text dimensions
    const container = document.createElement('div');
    container.style.visibility = 'hidden';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.fontSize = fontSize + 'px'; // Set font size

    // Iterate through the array of words
    wordsArray.forEach((word) => {
      // Create a span element for each word
      const span = document.createElement('div');
      span.textContent = word;
      span.style.display = 'block'; // Start each word on a new line
      container.appendChild(span);
    });

    // Append the container to the body
    document.body.appendChild(container);

    // Retrieve dimensions
    const width = container.offsetWidth;
    const height = container.offsetHeight - 11;

    // Remove the container from the body
    document.body.removeChild(container);

    return { height, width };
  };

  return (
    <>
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
            const dimensions = calculateTextDimensions(
              Text,
              !fontProperties?.Size ? '11px' : `${fontProperties?.Size}px`
            );

            const textWidth = dimensions?.width + 30; // replace with actual calculation
            const textHeight = dimensions?.height + 10; // replace with actual calculation

            return (
              <g key={index}>
                <rect
                  x={textPoints[0]}
                  y={textPoints[1]}
                  width={textWidth}
                  height={textHeight}
                  transform={`translate(${textPoints[0]}, ${textPoints[1]}) rotate(${
                    fontProperties?.Rotate * (180 / Math.PI)
                  }) translate(${-textPoints[0]}, ${-textPoints[1]})`}
                  fill={BCol ? rgbColor(BCol) : 'transparent'} // Set your desired background color here
                />
                <text
                  // fill='red'
                  alignment-baseline='middle'
                  dy='0.7em'
                  x={textPoints[0]}
                  y={textPoints[1]}
                  font-family={fontProperties?.PName}
                  font-size={!fontProperties?.Size ? '11px' : `${fontProperties?.Size}px`}
                  fill={FCol ? rgbColor(FCol) : 'black'}
                  font-style={
                    !fontProperties?.Italic
                      ? 'none'
                      : fontProperties?.Italic == 1
                      ? 'italic'
                      : 'none'
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
                //{' '}
              </g>
            );
          })}
        </svg>
      </div>
    </>
  );
};
export default Text;
