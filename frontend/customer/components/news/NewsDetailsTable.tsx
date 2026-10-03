import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
}                 from '@material-ui/core';
import {
  IApiCompany,
  IApiDeal,
}                 from '@my-old-startup/common/interfaces';
import { locale } from '@my-old-startup/frontend-common/locales';
import * as React from 'react';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
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

        detailTable: {
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
      }));

type Props = { deal: IApiDeal; company: IApiCompany };

export const NewsDetailsTable: React.SFC<Props> = (props: Props) => {
  const classes           = useStyles();
  const { deal, company } = props;
  const { details }       = deal;

  const TableCellHeader: React.SFC<{ label: string }> = ({ label }: { label: string }) => (
    <Typography variant="caption" className={classes.tableCellHeader}>
      {label}
    </Typography>
  );

  return (
    <table className={classes.detailTable}>
      <tbody>
        <tr>
          <td>
            <TableCellHeader label={locale.deals.table.labels.type}/>
            <Typography variant="overline">
              {locale.company.types[company.contact.type]}
            </Typography>
          </td>
          <td>
            <TableCellHeader label={locale.deals.table.labels.tags}/>
            <Typography variant="overline">
              <ul className={classes.kitchenCell}>
                {details.tags.map((x, i) => <li key={i}>{locale.deals.table.tags[x]}</li>)}
              </ul>
            </Typography>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
