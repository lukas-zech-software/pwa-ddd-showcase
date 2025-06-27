import {
  TableHeadCell,
  TableOptions,
}                 from 'mui-datatables';
import * as React from 'react';

type CustomHeaderCellProps = {
  options: TableOptions;
  column: any;
  width: number;
  handleToggleColumn: Function;
};

export const CustomHeaderCell: React.FC<CustomHeaderCellProps> = (
  { handleToggleColumn, options, width, column }) => (
  <TableHeadCell
    key={column.index}
    index={column.index}
    type={'cell'}
    sort={column.sort}
    sortDirection={column.sortDirection}
    toggleSort={handleToggleColumn}
    hint={column.hint}
    options={options}
  >
    <div key={column.index} style={{ width }}>{column.label}</div>
  </TableHeadCell>
);
