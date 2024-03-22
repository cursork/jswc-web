import { rgbColor } from '../../utils';

const Ecllipse = ({ data }) => {
  const parentSize = JSON.parse(localStorage.getItem('formDimension'));

  const { FillCol, Start } = data?.Properties;
  const startingAngles = Start.map((angle) => parseFloat(angle));

  // Center of the ellipse
  const cx = 160;
  const cy = 210;

  const rx = 150;
  const ry = 200;

  // Generate slices based on starting angles
  const slices = startingAngles.map((startAngle, index) => {
    // Calculate the ending angle for the slice
    const endAngle = index < startingAngles.length - 1 ? startingAngles[index + 1] : 2 * Math.PI;

    // Calculate start and end points of the arc
    const startX = cx + rx * Math.cos(startAngle);
    const startY = cy + ry * Math.sin(startAngle);
    const endX = cx + rx * Math.cos(endAngle);
    const endY = cy + ry * Math.sin(endAngle);

    // Construct the path for the slice
    const path = `M ${cx} ${cy} L ${startX} ${startY} A ${rx} ${ry} 0 0 1 ${endX} ${endY} Z`;

    // Return a <path> element for the slice
    return (
      <path key={index} d={path} fill={rgbColor(FillCol[index])} stroke='black' strokeWidth='1' />
    );
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <svg height={parentSize && parentSize[0]} width={parentSize && parentSize[1]}>
        <rect x='10' y='10' width='400' height='300' fill='none' />
        <ellipse cx={cx} cy={cy} rx='150' ry='200' fill='none' stroke='black' />

        {slices}
      </svg>
    </div>
  );
};
export default Ecllipse;
