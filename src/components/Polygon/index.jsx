import { rgbColor } from '../../utils';

import { useRef, useEffect } from 'react';

const Poly = ({ data }) => {
  const { FCol, FillCol, LWidth, Points, FStyle } = data?.Properties;

  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      const svgElement = svgRef.current;
      const bbox = svgElement.getBBox();

      console.log({ bbox });

      svgElement.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
    }
  }, [Points, FStyle, FillCol, FCol, LWidth]);

  return (
    <div style={{ position: 'absolute' }}>
      <svg height='60px'>
        {Points.map((polygonPoints, index) => {
          const flatArray = polygonPoints[0].map((x, i) => [polygonPoints[1][i], x]);

          return (
            <polygon
              key={index}
              points={flatArray.flat().join(' ')}
              fill={FStyle[index] == '-1' ? 'none' : rgbColor(FillCol[index])}
              stroke={rgbColor(FCol[index])}
              stroke-width={LWidth[index]}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Poly;
