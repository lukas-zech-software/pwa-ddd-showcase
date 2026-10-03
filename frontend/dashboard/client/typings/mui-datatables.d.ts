declare module 'mui-datatables' {
  import { ComponentType, ReactElement, ReactNode } from 'react';

  export type Column = {
    name: string;
    options?: ColumnOptions;
  };

  export type ColumnOptions = {
    display?: 'true' | 'false' | 'excluded';
    filter?: boolean;
    sort?: boolean;
    width?: number;
    headerNoWrap?: boolean;
    download?: boolean;
    customHeadRender?: (value: any, tableMeta: any, updateValue: any) => ReactNode;
    customBodyRender?: (value: any, tableMeta: any, updateValue: any) => string | ReactNode;
    customFilterRender?: (
      filterValue: string[],
      onChange: (value: any | any[]) => void,
      className: string,
    ) => string | ReactNode;
    customFilterFn?: (filterValue: any, columnValue: any) => boolean;
    customFilterValueRender?: (columnValue: any) => string | ReactNode;
  };

  export type TableOptions = {
    page?: number;
    count?: number;
    serverSide?: boolean;
    filterList?: any[];
    rowsSelected?: any[];
    filterType?: string;
    textLabels?: object;
    pagination?: boolean;
    usePaperPlaceholder?: boolean;
    selectableRows?: boolean;
    resizableColumns?: boolean;
    customToolbar?: () => ReactNode;
    customToolbarSelect?: (selectedRows: any[]) => ReactNode;
    customFooter?: () => ReactNode;
    caseSensitive?: boolean;
    responsive?: string;
    rowsPerPage?: number;
    rowsPerPageOptions?: number[];
    rowHover?: boolean;
    sortFilterList?: boolean;
    sort?: boolean;
    filter?: boolean;
    search?: boolean;
    print?: boolean;
    printBodyClass?: string;
    download?: boolean;
    downloadOptions?: { filename: string; separator: string };
    viewColumns?: boolean;
    onRowsSelect?: (currentRowsSelected: any[], rowsSelected: any[]) => void;
    onRowsDelete?: (rowsDeleted: any[]) => void;
    onRowClick?: (rowData: string[], rowMeta: { dataIndex: number; rowIndex: number }, event: any) => void;
    onCellClick?: (cellData: string, cellMeta: { colIndex: number; rowIndex: number; event: any }) => void;
    onChangePage?: (currentPage: number) => void;
    onChangeRowsPerPage?: (numberOfRows: number) => void;
    onSearchChange?: (searchText: string) => void;
    onFilterChange?: (changedColumn: string, filterList: any[]) => void;
    onColumnSortChange?: (changedColumn: string, direction: string) => void;
    onColumnViewChange?: (changedColumn: string, action: string) => void;
    onServerRequest?: (action: string, tableState: TableState) => void;
  };

  export type TableState = {
    page: number;
    rowsPerPage: number;
    filterList: any[];
  };

  export type ColumnDef = string | Column;

  export type TableProps = {
    title: string | ReactElement;
    columns: ColumnDef[];
    data: any[];
    options?: TableOptions;
  };

  export const MaterialDatatable: ComponentType<TableProps>;

  export const TableHeadCell: ComponentType<any>;

  export default MaterialDatatable;
}
