import { rgbColor } from '../../utils';

const Rectangle = ({ data }) => {
  const { Points, Size, FCol, Radius } = data?.Properties;

  return (
    <div>
      {Points.map((rectanglePoints, index) => {
        return (
          <svg height='200px' width='200px'>
            <rect
              rx={Radius[index]}
              ry={Radius[index]}
              x={rectanglePoints[0]}
              y={rectanglePoints[1]}
              width='50'
              height='30'
              fill='none'
              stroke={rgbColor(FCol[index])}
            />
          </svg>
        );
      })}
    </div>
  );
};

export default Rectangle;
