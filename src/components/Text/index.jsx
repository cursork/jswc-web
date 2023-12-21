import { rgbColor } from '../../utils';

const Text = ({ data }) => {
  const { Visible, Points, Text, FCol } = data?.Properties;

  const parentSize = JSON.parse(localStorage.getItem('formDimension'));

  const pointsArray = Points && Points[0].map((y, i) => [Points[1][i], y]);

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
              font-family='Arial'
              font-size='12'
              fill={FCol ? rgbColor(FCol && FCol[index]) : 'black'}
            >
              {Text[index]}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
export default Text;


