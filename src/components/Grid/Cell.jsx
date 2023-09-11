import SelectComponent from '../SelectComponent';

const Cell = ({ title, type = '', parent = '', row = '', column = '' }) => {
 

  if (!type) {
    return (
      <div
        style={{
          borderRight: '1px solid  #D3D3D3',
          borderBottom: '1px solid  #D3D3D3',
          minWidth: '120px',
          textAlign: 'center',
          minHeight: '23px',
        }}
      >
        {title?.toString()?.slice(0, 11)}
      </div>
    );
  }

  return (
    <div
      style={{
        borderRight: '1px solid  #D3D3D3',
        borderBottom: '1px solid  #D3D3D3',
        minWidth: '120px',
        minHeight: '23px',
      }}
    >
      <SelectComponent data={type} inputValue={title} event={parent} row={row} column={column} />
    </div>
  );
};

export default Cell;
