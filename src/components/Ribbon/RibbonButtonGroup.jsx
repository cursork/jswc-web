import * as AppIcons from './RibbonIcons';

const CustomRibbonButtonGroup = ({ data }) => {
  const dataSplit = (title) => {
    return title.substring(0, 5) + '..';
  };
  const { Captions, Icons } = data?.Properties;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {Captions.map((title, i) => {
        let IconComponent = AppIcons[Icons[i]];
        return (
          <div>
            <IconComponent size={25} />

            <p style={{ fontSize: '11px', fontWeight: 'bolder' }}>{dataSplit(title)}</p>
            {/* <div style={{ fontSize: '12px', textAlign: 'center' }}>{title}</div> */}
          </div>
        );
      })}
    </div>
  );
};

export default CustomRibbonButtonGroup;
