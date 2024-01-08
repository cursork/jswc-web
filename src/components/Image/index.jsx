import { useAppData } from '../../hooks';
import { renderImage } from '../../utils';

const Image = ({ data }) => {
  const PORT = localStorage.getItem('PORT');
  const { findDesiredData } = useAppData();
  const { Points, Picture, Visible } = data?.Properties;

  const pointsArray = Points && Points[0].map((y, i) => [Points[1][i], y]);
  const parentSize = JSON.parse(localStorage.getItem('formDimension'));

  return (
    <div
      style={{
        display: Visible == 0 ? 'none' : 'block',
      }}
    >
      <svg height={parentSize[0]} width={parentSize[1]}>
        {pointsArray.map((imagePoints, index) => {
          const imageObject = findDesiredData(Picture && Picture[index]);
          const ImageUrl = renderImage(PORT, imageObject);
          return <image href={ImageUrl} x={imagePoints[0]} y={imagePoints[1]} />;
        })}
      </svg>
    </div>
  );
};

export default Image;
