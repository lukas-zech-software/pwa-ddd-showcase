import {
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                            from '@material-ui/core';
import { IApiCompany }       from '@my-old-startup/common/interfaces/IApiCompany';
import { IApiDeal }          from '@my-old-startup/common/interfaces/IApiDeal';
import * as React            from 'react';
import { getPercent }        from '../../../common/utils/deals';
import { locale }            from '../locales';
import { MinimumPersonIcon } from './MinimumPersonIcon';

const styles = (theme: Theme) => createStyles(
  {
    detailTable: {
      'width':     '100%',
      'textAlign': 'center',

      'borderCollapse': 'collapse',
      'border':         '2px solid white',

      '& td': {
        border:  `1px solid ${theme.palette.grey[700]}`,
        padding: theme.spacing(1),
        width:   '33%',
      },
    },
    trTopRow:    {
      'border': '2px solid white',
    },
    kitchenCell: {
      'listStyleType': 'none',
      'margin':        0,
      'padding':       0,

      '& li': {
        lineHeight: 1.5,
        fontSize:   10,
      },
    },
  },
);

type Props = { deal: IApiDeal; company: IApiCompany } & WithStyles<typeof styles>;

const _DealItemDetailsTable: React.SFC<Props> = (props: Props) => (
  <table className={props.classes.detailTable}>
    <tbody>
      <tr className={props.classes.trTopRow}>
        <td colSpan={3}>
          <Typography variant="overline">
            {locale.deals.table.dealTime(props.deal.date.validFrom, props.deal.date.validTo)}
          </Typography>
        </td>
      </tr>
      <tr>
        <td>
          <Typography variant="caption">
            {locale.deals.table.labels.type}
          </Typography>
          <br/>
          <Typography variant="overline">
            {locale.company.types[props.company.contact.type]}
          </Typography>
        </td>
        <td>
          <Typography variant="caption">
            {locale.deals.table.labels.tags}
          </Typography>
          <Typography variant="overline">
            <ul className={props.classes.kitchenCell}>
              {props.deal.details.tags.map((x, i) => <li key={i}>{locale.deals.table.tags[x]}</li>)}
            </ul>
          </Typography>
        </td>
        <td>
          <Typography variant="caption">
            {locale.deals.table.labels.minimumPersonCount}
          </Typography>
          <br/>
          <Typography variant="overline">
            <MinimumPersonIcon minPersonCount={props.deal.details.minimumPersonCount}/>
          </Typography>
        </td>
      </tr>
      <tr>
        <td>
          <Typography variant="caption">
            {locale.deals.table.labels.discountPercent}
          </Typography>
          <Typography variant="subtitle1" color="error" style={{ fontWeight: 600 }}>
            {getPercent(props.deal.value.discountValue, props.deal.value.originalValue)} %
          </Typography>
        </td>
        <td>
          <Typography variant="caption">
            {locale.deals.table.labels.originalPrice}
          </Typography>
          <Typography variant="subtitle1">
            <s>
              {locale.format.currency(props.deal.value.originalValue)} &euro;
            </s>
          </Typography>
        </td>
        <td>
          <Typography variant="caption">
            {locale.deals.table.labels.discountPrice}
          </Typography>
          <Typography variant="subtitle1">
            {locale.format.currency(props.deal.value.discountValue)} &euro;
          </Typography>
        </td>
      </tr>
    </tbody>
  </table>
);

export const DealItemDetailsTable = withStyles(styles)(_DealItemDetailsTable);

const _DealSpecialItemDetailsTable: React.SFC<Props> = (props: Props) => (
  <table className={props.classes.detailTable}>
    <tbody>
      <tr className={props.classes.trTopRow}>
        <td colSpan={2}>
          <Typography variant="overline">
            {locale.deals.table.dealTime(props.deal.date.validFrom, props.deal.date.validTo)}
          </Typography>
        </td>
      </tr>
      <tr>
        <td>
          <Typography variant="caption">
            {locale.deals.table.labels.type}
          </Typography>
          <br/>
          <Typography variant="overline">
            {locale.company.types[props.company.contact.type]}
          </Typography>
        </td>
        <td>
          <Typography variant="caption">
            {locale.deals.table.labels.tags}
          </Typography>
          <Typography variant="overline">
            <ul className={props.classes.kitchenCell}>
              {props.deal.details.tags.map((x, i) => <li key={i}>{locale.deals.table.tags[x]}</li>)}
            </ul>
          </Typography>
        </td>
      </tr>
    </tbody>
  </table>
);

export const DealSpecialItemDetailsTable = withStyles(styles)(_DealSpecialItemDetailsTable);
