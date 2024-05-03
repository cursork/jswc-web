import { useRef, useEffect, useState } from 'react';

const GridLabel = ({ data }) => {
  const labelRef = useRef();
  const [isEditable, setisEditable] = useState(false);

  useEffect(() => {
    if (data.focused) {
      labelRef?.current?.focus();
    }
  }, [data.focused]);

  const fontProperties = data?.cellFont && data?.cellFont?.Properties;

  let fontStyles = {
    fontFamily: fontProperties?.PName,
    fontSize: !fontProperties?.Size ? '11px' : '12px',
    textDecoration: !fontProperties?.Underline
      ? 'none'
      : fontProperties?.Underline == 1
      ? 'underline'
      : 'none',
    fontStyle: !fontProperties?.Italic ? 'none' : fontProperties?.Italic == 1 ? 'italic' : 'none',
    fontWeight: !fontProperties?.Weight ? 0 : fontProperties?.Weight,
  };

  return (
    <>
      {!isEditable ? (
        <div
          style={{
            backgroundColor: data?.backgroundColor,
            outline: 0,
            ...fontStyles,
            textAlign: data?.typeObj?.Properties?.Justify,
            paddingRight: '5px',
          }}
          onDoubleClick={() => setisEditable(true)}
        >
          {data?.formattedValue}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: data?.backgroundColor,
            outline: 0,
            ...fontStyles,
            textAlign: data?.typeObj?.Properties?.Justify,
            paddingRight: '5px',
          }}
          onBlur={() => setisEditable(false)}
          ref={labelRef}
        >
          {data?.value}
        </div>
      )}
    </>
  );
};

export default GridLabel;
