import { useEffect } from 'react';

import { excludeKeys, setStyle, getImageStyles } from '../../utils';
import SelectComponent from '../SelectComponent';
import { useAppData } from '../../hooks';

const SubForm = ({ data }) => {
  const PORT = localStorage.getItem('PORT');
  const { findDesiredData } = useAppData();
  const { Size, Posn, Picture } = data?.Properties;

  const parentSize = JSON.parse(localStorage.getItem('formDimension'));
  const styles = setStyle(data?.Properties);
  const updatedData = excludeKeys(data);

  const ImageData = findDesiredData(Picture && Picture[0]);

  const imageStyles = getImageStyles(Picture && Picture[1], PORT, ImageData);

  let updatedStyles = { ...styles, ...imageStyles };

  useEffect(() => {
    localStorage.setItem(
      data.ID,
      JSON.stringify({
        Size: !Size ? [parentSize[0], parentSize[1]] : Size,
        Posn: !Posn ? [0, 0] : Posn,
      })
    );
  }, []);

  return (
    <div
      style={{
        ...updatedStyles,
        height: !Size ? parentSize[0] : Size[0],
        width: !Size ? parentSize[1] : Size[1],
        top: !Posn ? 0 : Posn[0],
        left: !Posn ? 0 : Posn[1],
        position: 'absolute',
      }}
    >
      {Object.keys(updatedData).map((key) => {
        return <SelectComponent data={updatedData[key]} />;
      })}
    </div>
  );
};

export default SubForm;
