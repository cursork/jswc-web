import { rgbColor } from '../../utils';

const Rectangle = ({ data }) => {
  const { Points, Size, FCol, Radius } = data?.Properties;

  return (
    <div>
      {Points.map((rectanglePoints, index) => {
        let top = index * 35;
        let left = index * 25;
        return (
          <div style={{ position: 'absolute', top, left }}>
            <svg height='200px' width='200px'>
              <rect
                rx={Radius[index * 0]}
                ry={Radius[index * 0]}
                x={rectanglePoints[0]}
                y={rectanglePoints[1]}
                width='50'
                height='30'
                fill='none'
                stroke={rgbColor(FCol[index])}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default Rectangle;
