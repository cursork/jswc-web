import * as Icons from './RibbonIcons';
import { RibbonButton } from 'react-bootstrap-ribbon';
import { Row, Col } from 'reactstrap';

const CustomRibbonButton = ({ data }) => {
  const { Icon, Caption } = data?.Properties;

  const IconComponent = Icons[Icon];
  return (
    <Row>
      <Col md={12}>
        <div className='d-flex align-items-center flex-column justify-content-center'>
          <IconComponent size={35} />
          <div className='text-center' style={{fontSize:'12px'}}>{Caption}</div>
        </div>
      </Col>
    </Row>
  );
};

export default CustomRibbonButton;
