import {
  Card,
  CardContent,
  CardHeader,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Typography,
}                        from '@material-ui/core';
import { Close }         from '@material-ui/icons';
import { CDN_BASE_URL }  from '@my-old-startup/common/enums/constants';
import {
  IApiCompany,
  IApiDeal,
}                        from '@my-old-startup/common/interfaces';
import {
  DealItemDetailsTable,
  DealSpecialItemDetailsTable,
}                        from '@my-old-startup/frontend-common/components/DealItemDetailsTable';
import * as React        from 'react';
import { isSpecialType } from '../../../../../common/enums';
import { CardMediaFix }  from '../../../../common/fixes/CardMediaFix';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        card:        {
          position: 'relative',
        },
      },
    ));

type Props = {
  company: IApiCompany;
  deal: IApiDeal;
};

export const DealDetailPreview: React.FC<Props> = ({ company, deal }: Props) => {
  const classes   = useStyles();
  const isSpecial = isSpecialType(deal.type);

  return (
    <Card className={classes.card}>
      <CardMediaFix image={CDN_BASE_URL + deal.image || '/static/deal.png'} title={deal.description.title}/>
      <CardHeader title={deal.description.title}/>
      <CardContent>
        <Typography variant="body2">
          {deal.description.description}
        </Typography>
        {isSpecial ? <DealSpecialItemDetailsTable deal={deal} company={company}/> :
          <DealItemDetailsTable deal={deal} company={company}/>}
      </CardContent>
    </Card>
  );
};
