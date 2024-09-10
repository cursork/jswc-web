import {useState} from 'react';
import {filterBy, orderBy} from "@progress/kendo-data-query";
import {Grid, GridColumn} from '@progress/kendo-react-grid';
import '@progress/kendo-theme-default/dist/all.css';

// ColTitles and Values must be indexed the same
const KendoGrid = ({ data }) => {
  const { ColTitles, Values, Posn, Attributes } = data?.Properties;

  const gridData = Values.map((row) => {
      let gd = {};
      ColTitles.forEach((ct, i) => 
        gd[ct] = row[i]
      );
      return gd;
    });

  const attrs = {};
  Attributes.forEach((kv) => attrs[kv[0]] = kv[1]);

  const initialFilter = {
    logic: "and",
    filters: [],
  };
  const [filter, setFilter] = useState(initialFilter);
  
  const initialSort = [];
  const [sort, setSort] = useState(initialSort);

  return (
    <div style={{ position: 'absolute', top: Posn && Posn[0], left: Posn && Posn[1] }}>
      <Grid
      data={orderBy(filterBy(gridData, filter), sort)}
      navigatable={true}
      filterable={attrs['filterable'] == 1}
      filter={filter}
      onFilterChange={(e) => setFilter(e.filter)}
      sortable={attrs['sortable'] == 1 ? {
        allowUnsort: true,
        mode: "multiple",
      } : undefined}
      sort={sort}
      onSortChange={(e) => setSort(e.sort)}
      >
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
