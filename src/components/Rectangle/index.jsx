import { rgbColor } from '../../utils';

const Rectangle = ({ data }) => {
  const { Points, Size, FCol, Radius } = data?.Properties;

  return (
    <div>
      {Points.map((rectanglePoints, index) => {
        let top = index * 40;
        let left = index * 38;
        return (
          <div style={{ position: 'absolute', left, top }}>
            <svg height='200px' width='200px'>
              <rect
                rx={Radius[index * 0]}
                ry={Radius[index * 0]}
                x={rectanglePoints[1] - 40}
                y={rectanglePoints[0]}
                width='50'
                height='30'
                fill='none'
                stroke={rgbColor(FCol[index])}
                strokeWidth={'1px'}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default Rectangle;
