import { setStyle } from '../../utils';
import { useAppData } from '../../hooks';

const ListView = ({ data }) => {
  const PORT = localStorage.getItem('PORT');

  const { findDesiredData } = useAppData();

  const { View, Border, ColTitles, ImageIndex, ImageListObj, Items, ReportInfo } = data?.Properties;

  const styles = setStyle(data?.Properties);

  //   console.log({ View });

  //   console.log({ data });

  // Icon bigger Icon

  const ImageListView = ({
    orientation = 'row',
    Images = [],
    parentOrientation = 'row',
    height,
    width,
    imageHeight,
    imageWidth,
  }) => {
    return (
      <div
        className={`d-flex flex-${parentOrientation}`}
        style={{ ...styles, border: !Border ? null : '1px solid black' }}
      >
        {Items?.map((item, index) => {
          return (
            <div
              style={{ width, height }}
              className={`d-flex flex-${orientation} align-items-center`}
            >
              <img
                style={{ width: imageWidth, height: imageHeight }}
                src={`http://localhost:${PORT}${Images[index]}`}
              />
              <span style={{ fontSize: '12px' }}>{item}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (View == 'Icon') {
    const ImageData = findDesiredData(ImageListObj && ImageListObj[0]);
    const Images = ImageData?.Properties?.Files;
    const ImageSize = ImageData?.Properties?.Size;
    return (
      <ImageListView
        orientation='column'
        height={`${ImageSize[0] + 15}px`}
        width={`${ImageSize[1] + 30}px`}
        Images={Images}
        imageHeight={`${ImageSize[0]}px`}
        imageWidth={`${ImageSize[1]}px`}
      />
    );
  }

  if (View == 'SmallIcon') {
    const ImageData = findDesiredData(ImageListObj && ImageListObj[1]);
    const Images = ImageData?.Properties?.Files;
    const ImageSize = ImageData?.Properties?.Size;
    return (
      <ImageListView
        imageHeight={`${ImageSize[0]}px`}
        imageWidth={`${ImageSize[1]}px`}
        orientation='row'
        height={`${ImageSize[0] + 15}px`}
        width={`${ImageSize[1] + 30}px`}
        Images={Images}
      />
    );
  }
  if (View == 'List') {
    const ImageData = findDesiredData(ImageListObj && ImageListObj[1]);
    const Images = ImageData?.Properties?.Files;
    const ImageSize = ImageData?.Properties?.Size;
    return (
      <ImageListView
        imageHeight={`${ImageSize[0]}px`}
        imageWidth={`${ImageSize[1]}px`}
        parentOrientation={'column'}
        orientation='row'
        height={`${ImageSize[0]}px`}
        width={`${ImageSize[1] + 30}px`}
        Images={Images}
      />
    );
  }
  if (View == 'Report') {
    // console.log({ ColTitles });

    return (
      <div style={{ ...styles, border: !Border ? null : '1px solid black' }}>
        {/* Header of the Report */}
        Report
      </div>
    );
  }
};

export default ListView;
