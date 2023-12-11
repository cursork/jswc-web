import * as AppIcons from './RibbonIcons';
import { Row, Col } from 'reactstrap';

const CustomRibbonButtonGroup = ({ data }) => {
  const dataSplit = (title) => {
    return title.substring(0, 5) + '..';
  };
  const { Captions, Icons } = data?.Properties;

  const colSize = Captions?.length == 4 ? 6 : 12;

  return (
    <Row>
      {Captions.map((title, i) => {
        let IconComponent = AppIcons[Icons[i]];
        return (
          <Col md={colSize} className='d-flex align-items-center justify-content-center '>
            <IconComponent size={25} />
            <div style={{ fontSize: '12px', textAlign: 'center' }}>{title?.slice(0, 10)}</div>
          </Col>
        );
      })}
    </Row>
  );
};

export default CustomRibbonButtonGroup;
