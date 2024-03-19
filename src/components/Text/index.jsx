import { rgbColor } from '../../utils';
import { useAppData } from '../../hooks';

const Text = ({ data }) => {
  const { Visible, Points, Text, FCol, FontObj } = data?.Properties;
  const { findDesiredData } = useAppData();

  const parentSize = JSON.parse(localStorage.getItem('formDimension'));

  const pointsArray = Points && Points[0].map((y, i) => [Points[1][i], y]);

  const font = findDesiredData(FontObj && FontObj);
  const fontProperties = font && font?.Properties;

  // console.log({ fontProperties });
  console.log({ pointsArray });
  console.log({ Text });

  return (
    <div
      style={{
        position: 'absolute',
        display: Visible == 0 ? 'none' : 'block',
        top: 0,
        left: 0,
      }}
    >
      <svg height={parentSize[0]} width={parentSize[1]}>
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
            >
              {pointsArray.length >= 1
                ? Text[index]
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
  );
};
export default Text;
