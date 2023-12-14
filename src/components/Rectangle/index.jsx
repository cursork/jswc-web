import { rgbColor } from '../../utils';
import Canvas from '../Canvas';

const Rectangle = ({
  data,
  parentSize = JSON.parse(localStorage.getItem('formDimension')),
  posn = [0, 0],
}) => {
  const { Points, Size, FCol, Radius, Visible } = data?.Properties;

  const pointsArray = Points[0].map((y, i) => [Points[1][i], y]);
  const sizeArray = Size[0].map((y, i) => [Size[1][i], y]);

  return (
    <div
      style={{
        // position: 'absolute',
        // top: posn[0],
        // left: posn[1],
        display: Visible == 0 ? 'none' : 'block',
      }}
    >
      <svg height={parentSize[0]} width={parentSize[1]}>
        {pointsArray.map((rectanglePoints, index) => {
          return (
            <rect
              rx={Radius[index * 0]}
              ry={Radius[index * 0]}
              x={rectanglePoints[0]}
              y={rectanglePoints[1]}
              width={sizeArray[index][0]}
              height={sizeArray[index][1]}
              fill='none'
              stroke={rgbColor(FCol[index])}
              strokeWidth={'1px'}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Rectangle;
