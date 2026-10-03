import {
  CircularProgress,
  createStyles,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                           from '@material-ui/core';
import DefaultCheckedIcon   from '@material-ui/icons/CheckCircle';
import DefaultNCheckedIcon  from '@material-ui/icons/RemoveCircleOutline';
import { IApiCompany }      from '@my-old-startup/common/interfaces/IApiCompany';
import { IApiDeal }         from '@my-old-startup/common/interfaces/IApiDeal';
// eslint-disable-next-line @typescript-eslint/tslint/config
import { BooleanCell2 }     from '@my-old-startup/frontend-common/components/table/BooleanCell2';
import { alertColors }      from '@my-old-startup/frontend-common/style';
import { parseFloatDe }     from '@my-old-startup/frontend-common/utils/format';
import clsx                 from 'clsx';
import { observer }         from 'mobx-react';
import MUIDataTable, {
  Column,
  ColumnOptions,
  TableOptions,
}                           from 'mui-datatables';
import * as React           from 'react';
import { DayOfWeek }        from '../../../../../../common/enums';
import { locale }           from '../../../common/locales';
import { dealStore }        from '../../../stores/DealStore';
import { DealsOptionsMenu } from '../common/DealsOptionsMenu';
import { CustomHeaderCell } from './CustomHeaderCell';

export enum DealTableVariant {
  Archive,
  Upcoming,
  RecentDeal,
}

const styles = (theme: Theme) => createStyles(
  {
    notPublishedIcon: {
      color: alertColors(theme).warning,
    },
    loading:          {
      margin: 'auto',
    },
    table:            {
      '& tr': {
        cursor: 'pointer',
      },
      '& th': {
        position:        'sticky',
        top:             0,
        left:            0,
        zIndex:          100,
        backgroundColor: '#fff',
      },
    },
    tableRecent:      {
      marginBottom: theme.spacing(2),
    },
    tableTitle:       {
      color: theme.palette.grey.A700,
    },
  },
);

type Props = WithStyles<typeof styles> & {
  deals?: IApiDeal[];
  currentCompany: IApiCompany;
  variant: DealTableVariant;
};

type State = {
  selectedDeal: IApiDeal | undefined;
  menuAnchorEl: any | undefined;
};

// TODO: Make underlying table responsive
@observer
class _DealsTable extends React.Component<Props, State> {
  private data: any[];

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedDeal: undefined,
      menuAnchorEl: undefined,
    };
  }

  public componentDidMount(): void {
    dealStore.fetchAllDeals(this.props.currentCompany);
  }

  public render(): React.ReactNode {
    const { selectedDeal, menuAnchorEl } = this.state;
    const { classes, variant }           = this.props;
    let deals                            = this.props.deals;

    if (deals === undefined) {
      deals = variant === DealTableVariant.Archive ? dealStore.dealsArchive : dealStore.dealsUpcoming;
    }

    // HACK: Need to use dealStore.allDeals some how to subscribe to changes made by deleting a deal
    deals = deals || dealStore.allDeals;

    if (deals === undefined) {
      return (<CircularProgress className={classes.loading}/>);
    }

    if (deals.length === 0 && variant === DealTableVariant.RecentDeal) {
      return null;
    }

    this.data = deals.reduce<any[]>(
      (all, deal) => {
        const values: any[] = [
          deal.date.validFrom,
          deal.date.validFrom,
          deal.date.validTo,
          deal.value.originalValue,
          deal.value.discountValue,
          deal.description.title,
          deal.description.description,
          deal.details.minimumPersonCount,
          deal.published,
          deal.isStatic,
          deal.location ? deal.location.location : null,
        ];
        all.push(values);
        (values as any)['deal'] = deal;
        return all;
      },
      []);

    const options: TableOptions = {
      sort:           true,
      textLabels:     locale.table.textLabels,
      selectableRows: false,
      rowHover:       true,
      filterType:     'dropdown',
      responsive:     'scroll',
      onCellClick:    (cellData, cellMeta) => {
        this.setState({
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        selectedDeal: deals![cellMeta.rowIndex],
                        menuAnchorEl: cellMeta.event.currentTarget,
                      });
      },
    };

    if (variant === DealTableVariant.RecentDeal) {
      options.sort         = false;
      options.search       = false;
      options.customFooter = () => null;
    }

    const columns = this.getColumnOptions(options);

    return (
      <div className={clsx(classes.table, { [classes.tableRecent]: variant === DealTableVariant.RecentDeal })}>
        <MUIDataTable title={
          <Typography component={'span' as any}
                      className={classes.tableTitle}
                      variant="subtitle1">
            {locale.dashboard.dealsPage.table.header[variant]}
          </Typography>
        }
                      data={this.data}
                      columns={columns}
                      options={options}
        />
        {selectedDeal && (
          <DealsOptionsMenu
            variant={this.props.variant}
            company={this.props.currentCompany}
            deal={selectedDeal}
            menuAnchorEl={menuAnchorEl}
            onClose={() => this.setState({
                                           selectedDeal: undefined,
                                           menuAnchorEl: undefined,
                                         })}
          />
        )}
      </div>
    );

  }

  private getPublishedOptions(): ColumnOptions {
    return {
      customFilterValueRender: (x) =>
                                 x === 'true'
                                   ? locale.dashboard.dealsPage.table.columnHeader.published
                                   : locale.dashboard.dealsPage.table.tooltips.notPublished,
      customFilterFn:          (
                                 [filterValue = locale.common.dropdown.all],
                                 columnValue,
                               ) => {
        const isPublished = columnValue !== null;
        return filterValue === locale.common.dropdown.all
          ? false
          : isPublished.toString() !== filterValue.toString();
      },
      customBodyRender:        (published) => (
        <BooleanCell2
          value={published !== null}
          CheckedIcon={<DefaultCheckedIcon/>}
          NotCheckedIcon={
            <DefaultNCheckedIcon
              className={this.props.classes.notPublishedIcon}
            />
          }
          tooltip={{
            true:  locale.format.timestamp(published || 0),
            false: locale.dashboard.dealsPage.table.tooltips.notPublished,
          }}
        />
      ),
      customFilterRender:      (filterValue, onChange, className) => (
        <FormControl key="published" className={className}>
          <InputLabel htmlFor="published">
            {locale.dashboard.dealsPage.table.columnHeader.published}
          </InputLabel>
          <Select
            value={filterValue.toString() || locale.common.dropdown.all}
            name="published"
            onChange={(event) => onChange(event.target.value)}
            input={<Input name="published"/>}
          >
            <MenuItem value={locale.common.dropdown.all} key={0}>
              {locale.common.dropdown.all}
            </MenuItem>
            <MenuItem value="true" key={1}>
              {locale.dashboard.dealsPage.table.columnHeader.published}
            </MenuItem>
            <MenuItem value="false" key={2}>
              {locale.dashboard.dealsPage.table.tooltips.notPublished}
            </MenuItem>
          </Select>
        </FormControl>
      ),
    };
  }

  private getStaticOptions(): ColumnOptions {
    return {
      customFilterValueRender: (x) =>
                                 x === 'true'
                                   ? locale.dashboard.dealsPage.table.columnHeader.isStatic
                                   : locale.dashboard.dealsPage.table.tooltips.notStatic,
      customFilterFn:          (
                                 [filterValue = locale.common.dropdown.all],
                                 columnValue,
                               ) => {
        const isStatic = columnValue !== undefined;
        return filterValue === locale.common.dropdown.all
          ? false
          : isStatic.toString() !== filterValue.toString();
      },
      customBodyRender:        (isStatic, column) => {
        const deal = this.data[column.rowIndex].deal;

        if (!deal.isStatic) {
          return (
            <DefaultNCheckedIcon
              className={this.props.classes.notPublishedIcon}
            />
          );
        }

        return (
          <Typography variant="body2">
            Jeden &nbsp;
            {(deal.staticDays || []).map((x: DayOfWeek) => locale.common.weekday[x]).join(', ')}
          </Typography>
        );
      },
      customFilterRender:      (filterValue, onChange, className) => (
        <FormControl key="isStatic" className={className}>
          <InputLabel htmlFor="isStatic">
            {locale.dashboard.dealsPage.table.columnHeader.isStatic}
          </InputLabel>
          <Select
            value={filterValue.toString() || locale.common.dropdown.all}
            name="isStatic"
            onChange={(event) => onChange(event.target.value)}
            input={<Input name="isStatic"/>}
          >
            <MenuItem value={locale.common.dropdown.all} key={0}>
              {locale.common.dropdown.all}
            </MenuItem>
            <MenuItem value="true" key={1}>
              {locale.dashboard.dealsPage.table.columnHeader.isStatic}
            </MenuItem>
            <MenuItem value="false" key={2}>
              {locale.dashboard.dealsPage.table.tooltips.notStatic}
            </MenuItem>
          </Select>
        </FormControl>
      ),
    };
  }

  private getLocationOptions(): ColumnOptions {
    return {
      customBodyRender: (location) => (
        <BooleanCell2
          value={location !== null}
          CheckedIcon={<DefaultCheckedIcon/>}
          NotCheckedIcon={
            <DefaultNCheckedIcon
              className={this.props.classes.notPublishedIcon}
            />
          }
        />
      ),
    };
  }

  private getNumberOptions(name: string, label: string): ColumnOptions {
    return {
      customBodyRender:        (x) => `${locale.format.currency(x)} €`,
      customFilterValueRender: (x) => `${label}:  > ${x} €`,
      customFilterFn:          ([filterValue], columnValue) =>
                                 filterValue && parseFloatDe(filterValue) > parseFloatDe(columnValue),
      customFilterRender:      ([filterValue], onChange, className) => (
        <TextField
          key={name}
          label={label}
          className={className}
          defaultValue={filterValue}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
    };
  }

  /**
   * Responsible for date-only rendering of a timestamp
   * @param name: the property being rendered
   * @param label: The localized label for the field
   * @param options
   */
  private getDateOptions(
    name: string,
    label: string,
    options?: ColumnOptions,
  ): ColumnOptions {
    const localeOptions = {
      year:  'numeric',
      month: 'long',
      day:   'numeric',
    };
    return {
      customBodyRender:        (x, column) => {
        if (!x) {
          return '';
        }

        const deal = this.data[column.rowIndex].deal;

        const prefix = deal.isStatic ? 'ab ' : '';

        return prefix + new Date(x).toLocaleDateString(locale.culture, localeOptions);
      },
      customFilterValueRender: (x) =>
                                 x ? label + ' ' + new Date(x).toLocaleDateString() : null,
      customFilterFn:          ([filterValue], columnValue) =>
                                 filterValue &&
                                 new Date(filterValue).getTime() >= new Date(columnValue).getTime(),
      customFilterRender:      ([filterValue], onChange, className) => (
        <TextField
          key={name}
          label={label}
          className={className}
          type="date"
          defaultValue={filterValue || new Date().toJSON().split('T')[0]}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
      ...options,
    };
  }

  /**
   * Responsible for time-only rendering of a timestamp
   * @param name: the property being rendered
   * @param label: The localized label for the field
   */
  private getTimeOptions(name: string, label: string): ColumnOptions {
    const options = {
      hour:   '2-digit',
      minute: '2-digit',
    };
    return {
      customBodyRender:        (x) =>
                                 x ? new Date(x).toLocaleTimeString(locale.culture, options) : '',
      customFilterValueRender: (x) =>
                                 x ? label + ' ' + new Date(x).toLocaleDateString() : null,
      customFilterFn:          ([filterValue], columnValue) =>
                                 filterValue &&
                                 new Date(filterValue).getTime() >= new Date(columnValue).getTime(),
      customFilterRender:      ([filterValue], onChange, className) => (
        <TextField
          key={name}
          label={label}
          className={className}
          type="date"
          defaultValue={filterValue || new Date().toJSON().split('T')[0]}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
    };
  }

  private getColumnOptions(options: TableOptions): Column[] {
    return [
      {
        name:    locale.dashboard.dealsPage.table.columnHeader.validFromDate,
        options: this.getDateOptions(
          'validFrom',
          locale.dashboard.dealsPage.table.columnHeader.validFromDate,
          {
            filter:           false,
            customHeadRender: (column: any, handleToggleColumn: Function) => (
              <CustomHeaderCell
                key={column.index}
                width={90}
                column={column}
                options={options}
                handleToggleColumn={handleToggleColumn}
              />
            ),
          },
        ),
      },
      {
        name:    locale.dashboard.dealsPage.table.columnHeader.validFrom,
        options: this.getTimeOptions(
          'validFrom',
          locale.dashboard.dealsPage.table.columnHeader.validFrom,
        ),
      },
      {
        name:    locale.dashboard.dealsPage.table.columnHeader.validTo,
        options: this.getTimeOptions(
          'validTo',
          locale.dashboard.dealsPage.table.columnHeader.validTo,
        ),
      },
      {
        name:    locale.dashboard.dealsPage.table.columnHeader.originalValue,
        options: this.getNumberOptions(
          'originalValue',
          locale.dashboard.dealsPage.table.columnHeader.originalValue,
        ),
      },
      {
        name:    locale.dashboard.dealsPage.table.columnHeader.discountValue,
        options: this.getNumberOptions(
          'discountValue',
          locale.dashboard.dealsPage.table.columnHeader.discountValue,
        ),
      },
      {
        name:    locale.dashboard.dealsPage.table.columnHeader.title,
        options: { filter: true },
      },
      {
        name:    locale.dashboard.dealsPage.table.columnHeader.description,
        options: {
          display: 'false',
        },
      },
      {
        name:    locale.dashboard.dealsPage.table.columnHeader.minimumPersonCount,
        options: {
          filter:           false,
          customHeadRender: (column: any, handleToggleColumn: Function) => (
            <CustomHeaderCell key={column.index}
                              width={40}
                              column={column}
                              options={options}
                              handleToggleColumn={handleToggleColumn}
            />
          ),

        },
      },
      {
        name:    locale.dashboard.dealsPage.table.columnHeader.published,
        options: this.getPublishedOptions(),
      },
      {
        name:    locale.dashboard.dealsPage.table.columnHeader.isStatic,
        options: this.getStaticOptions(),
      },
      {
        name:    locale.dashboard.dealsPage.table.columnHeader.location,
        options: {
          ...this.getLocationOptions(),
          filter:  false,
          display: 'false',
        },
      },
    ];
  }
}

export const DealsTable = withStyles(styles)(_DealsTable);
