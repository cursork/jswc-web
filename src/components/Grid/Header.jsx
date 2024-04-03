import { isArray } from 'lodash';

const Header = ({ data }) => {
  if (isArray(data?.value)) {
    return (
      <div style={{ backgroundColor: data?.backgroundColor, color: data?.color }}>
        {data?.value.map((th) => {
          if (th == '') return <br />;
          return <div>{th}</div>;
        })}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: data?.backgroundColor, color: data?.color }}>{data?.value}</div>
  );
};

export default Header;
