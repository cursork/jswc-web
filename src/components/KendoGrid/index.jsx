import {Grid, GridColumn} from '@progress/kendo-react-grid';
import '@progress/kendo-theme-default/dist/all.css';

// ColTitles and Values must be indexed the same
const KendoGrid = ({ data }) => {
  const { ColTitles, Values, Posn } = data?.Properties;

  const gridData = Values.map((row) => {
      let gd = {};
      ColTitles.forEach((ct, i) => 
        gd[ct] = row[i]
      );
      return gd;
    });

  return (
    <div style={{ position: 'absolute', top: Posn && Posn[0], left: Posn && Posn[1] }}>
      <Grid data={gridData}>
        {
          ColTitles.map((ct, _) =>
            <GridColumn field={ct} title={ct}/>
          )
        }
      </Grid>
    </div>
  );
};

export default KendoGrid;
