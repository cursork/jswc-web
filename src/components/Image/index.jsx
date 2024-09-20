import { useAppData } from '../../hooks';
import { handleMouseDown, handleMouseEnter, handleMouseLeave, handleMouseMove, handleMouseUp, parseFlexStyles, renderImage } from '../../utils';

const Image = ({ data }) => {
  const PORT = localStorage.getItem('PORT');
  const { findDesiredData, socket } = useAppData();
  const { Points, Picture, Visible,Event, CSS } = data?.Properties;
  const customStyles = parseFlexStyles(CSS)

  const pointsArray = Points && Points[0].map((y, i) => [Points[1][i], y]);
  const parentSize = JSON.parse(localStorage.getItem('formDimension'));

  return (
    <div
      id={data?.ID}
      style={{
        display: Visible == 0 ? 'none' : 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        display: Visible == 0 ? 'none' : 'block',
        ...customStyles
      }}
      onMouseDown={(e) => {
        handleMouseDown(e, socket, Event,data);
      }}
      onMouseUp={(e) => {
        handleMouseUp(e, socket, Event, data);
      }}
      onMouseEnter={(e) => {
        handleMouseEnter(e, socket, Event, data);
      }}
      onMouseMove={(e) => {
        handleMouseMove(e, socket, Event, data);
      }}
      onMouseLeave={(e) => {
        handleMouseLeave(e, socket, Event, data);
      }}
      
    >
      <svg height={parentSize && parentSize[0]} width={parentSize && parentSize[1]}>
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
