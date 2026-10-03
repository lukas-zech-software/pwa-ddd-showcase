import {
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                   from '@material-ui/core';
import { AccessTime }               from '@material-ui/icons';
import {
  IApiCompany,
  IApiDeal,
}                                   from '@my-old-startup/common/interfaces';
import { getPercent }               from '@my-old-startup/common/utils/deals';
import { MinimumPersonIcon }        from '@my-old-startup/frontend-common/components';
import { locale }                   from '@my-old-startup/frontend-common/locales';
import * as React                   from 'react';
import { DealType }                 from '../../../../../common/enums';
import { locale as customerLocale } from '../../../common/locales';

const styles = (theme: Theme) =>
  // noinspection JSSuspiciousNameCombination
  createStyles(
    {
      detailTable:     {
        'width':     '100%',
        'textAlign': 'center',

        'borderCollapse': 'collapse',
        'border':         '2px solid white',

        '& td': {
          border:        `1px solid ${theme.palette.grey[700]}`,
          padding:       theme.spacing(1),
          width:         '33%',
          verticalAlign: 'top',
        },
      },
      firstRow:        {
        '& td': {
          padding:      0,
          borderBottom: `none !important`,
        },
      },
      secondRow:       {
        '& td': {
          borderTop: `none !important`,
        },
      },
      kitchenCell:     {
        'listStyleType': 'none',
        'margin':        0,
        'padding':       0,

        '& li': {
          lineHeight: 1.5,
          fontSize:   10,
        },
      },
      tableCellHeader: {
        color: theme.palette.text.hint,
      },
      timeIcon:        {
        top:         2,
        position:    'relative',
        marginRight: theme.spacing(1),
      },

    },
  )
;

type Props = { deal: IApiDeal; company: IApiCompany } & WithStyles<typeof styles>;

const _DealItemDetailsTable: React.SFC<Props> = (props: Props) => {
  const { classes, deal }              = props;
  const { date, value, details, type } = deal;

  const percent        = getPercent(value.discountValue, value.originalValue);
  const isZeroPercent  = percent === 0;
  const percentText    = isZeroPercent ? '-' : `${percent} %`;
  const hideBothPrices = type === DealType.DISCOUNT_WHOLE_BILL || type === DealType.DISCOUNT_CATEGORY;
  const isSpecialDeal  = type === DealType.SPECIAL;
  const isAddonDeal    = type === DealType.ADDON;

  const TableCellHeader: React.SFC<{ label: string }> = ({ label }: { label: string }) => (
    <Typography variant="caption" className={classes.tableCellHeader}>
      {label}
    </Typography>
  );

  function getDiscount(): React.ReactNode {
    if (isSpecialDeal) {
      return (
        <>
          <TableCellHeader label={' '}/>
          <Typography variant="subtitle1">
            -
          </Typography>
        </>
      );
    }

    if (isAddonDeal) {
      return (
        <>
          <TableCellHeader label={locale.deals.table.labels.discountPercent}/>
          <Typography variant="subtitle1" color={isZeroPercent ? 'textPrimary' : 'error'} style={{ fontWeight: 500 }}>
            {getPercent(value.originalValue, value.originalValue + value.discountValue)} %
          </Typography>
        </>
      );
    }

    return (
      <>
        <TableCellHeader label={locale.deals.table.labels.discountPercent}/>
        <Typography variant="subtitle1" color={isZeroPercent ? 'textPrimary' : 'error'} style={{ fontWeight: 500 }}>
          {percentText}
        </Typography>
      </>
    );
  }

  function getOriginalPrice(): React.ReactNode {
    if (isAddonDeal) {
      return (
        <>
          <TableCellHeader label={locale.deals.table.labels.originalPrice}/>
          <Typography variant="subtitle1">
            {locale.format.currency(value.originalValue + value.discountValue)} &euro;
          </Typography>
        </>
      );
    }

    if (hideBothPrices || isSpecialDeal) {
      return (
        <>
          <TableCellHeader label={locale.deals.table.labels.originalPrice}/>
          <Typography variant="subtitle1">
            -
          </Typography>
        </>
      );
    }

    return (
      <>
        <TableCellHeader label={locale.deals.table.labels.originalPrice}/>
        <Typography variant="subtitle1">
          {locale.format.currency(value.originalValue)} &euro;
        </Typography>
      </>
    );
  }

  function getDiscountPrice(): React.ReactNode {
    if (hideBothPrices) {
      return (
        <>
          <TableCellHeader label={locale.deals.table.labels.discountPrice}/>
          <Typography variant="subtitle1">
            -
          </Typography>
        </>
      );
    }

    if (isAddonDeal) {
      return (
        <>
          <TableCellHeader label={locale.deals.table.labels.discountPrice}/>
          <Typography variant="subtitle1">
            {locale.format.currency(value.originalValue)} &euro;
          </Typography>
        </>
      );
    }

    return (
      <>
        <TableCellHeader label={locale.deals.table.labels.discountPrice}/>
        <Typography variant="subtitle1">
          {locale.format.currency(value.discountValue)} &euro;
        </Typography>
      </>
    );
  }

  return (
    <table className={classes.detailTable}>
      <tbody>
        <tr className={classes.firstRow}>
          <td colSpan={3}>
            <Grid container justify="flex-start">
              <Grid item xs={false}>
                <AccessTime className={classes.timeIcon}/>
              </Grid>
              <Grid item xs={false}>
                <Typography variant="overline">
                  {customerLocale.format.dealTime(date.validFrom, date.validTo)}
                </Typography>
              </Grid>
            </Grid>
          </td>
        </tr>
        <tr className={classes.secondRow}>
          <td>
            <TableCellHeader label={locale.deals.table.labels.type}/>
            <Typography variant="overline">
              {locale.company.types[props.company.contact.type]}
            </Typography>
          </td>
          <td>
            <TableCellHeader label={locale.deals.table.labels.tags}/>
            <Typography variant="overline">
              <ul className={props.classes.kitchenCell}>
                {details.tags.map((x, i) => <li key={i}>{locale.deals.table.tags[x]}</li>)}
              </ul>
            </Typography>
          </td>
          <td>
            <TableCellHeader label={locale.deals.table.labels.minimumPersonCount}/>
            <MinimumPersonIcon minPersonCount={details.minimumPersonCount}/>
          </td>
        </tr>
        <tr>
          <td>
            {getDiscount()}
          </td>
          <td>
            {getOriginalPrice()}
          </td>
          <td>
            {getDiscountPrice()}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const DealItemDetailsTable = withStyles(styles)(_DealItemDetailsTable);
