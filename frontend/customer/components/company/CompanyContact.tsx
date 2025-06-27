import {
  makeStyles,
  Typography,
}                              from '@material-ui/core';
import { CompanyType }         from '@my-old-startup/common/enums/types';
import { IApiCompanyMinimal } from '@my-old-startup/common/interfaces/IApiCompany';
import clsx                    from 'clsx';
import * as React              from 'react';
import { locale }              from '../../common/locales';

const useStyles = makeStyles(() => (
  {
    iconGridItem:       {
      'color': 'red',
      '& > *': {
        paddingTop: 0,
      },
    },
    companyContactLine: {
      fontStyle: 'italic',
      '&.first': {
        paddingTop: 0,
      },
    },
  }
));

type Props = { company: IApiCompanyMinimal };

const _CompanyContact: React.SFC<Props> = (props: Props) => {
  const { company } = props;
  const classes     = useStyles();

  return (
    <>
      {/*Do not show contact data for Food Trucks*/}
      {company.contact.type !== CompanyType.FOODTRUCK && (
        <Typography variant="caption" component={'address' as any}
                    className={clsx(classes.companyContactLine, 'first')}>
          {locale.format.address(company.contact)}
        </Typography>
      )}

      {company.contact.telephone && (
        <Typography variant="caption" className={classes.companyContactLine}>
          +49 {company.contact.telephone}
        </Typography>
      )}

      {company.contact.secondaryTelephone && (
        <Typography variant="caption" className={classes.companyContactLine}>
          +49 {company.contact.secondaryTelephone} (<i>{company.contact.secondaryTelephoneReason}</i>)
        </Typography>
      )}

      {/*keep default height for Food Trucks*/}
      {company.contact.type === CompanyType.FOODTRUCK && (
        <br/>
      )}
    </>
  );
};

export const CompanyContact = (_CompanyContact);
