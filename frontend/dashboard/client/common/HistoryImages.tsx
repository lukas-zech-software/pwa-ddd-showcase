import {
  Card,
  CardContent,
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                 from '@material-ui/core';
import { CDN_BASE_URL }           from '@my-old-startup/common/enums/constants';
import { Loading }                from '@my-old-startup/frontend-common/components';
import { globalMessageService }   from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { logService }             from '@my-old-startup/frontend-common/services/LogService';
import clsx                       from 'clsx';
import React, { PureComponent }   from 'react';
import LazyLoad                   from 'react-lazyload';
import { CardMediaFix }           from '../../../common/fixes/CardMediaFix';
import { dashboardCompanyFacade } from '../facade/DashboardCompanyFacade';
import { locale }                 from './locales';

const styles = (theme: Theme) =>
  createStyles(
    {
      appBar:       {
        position: 'relative',
      },
      flex:         {
        flex: 1,
      },
      root:         {
        '& *':           {
          userSelect: 'none',
        },
        display:         'flex',
        flexWrap:        'wrap',
        justifyContent:  'space-around',
        overflowY:       'auto',
        backgroundColor: theme.palette.background.paper,
        margin:          theme.spacing(1),
      },
      gridListTile: {
        height:       'fit-content',
        border:       '1px solid rgba(0, 0, 0, 0)',
        '&:hover':    {
          border:    `1px solid ${theme.palette.grey[500]}`,
          boxShadow: `1px -1px 5px -1px ${theme.palette.grey[500]}`,
        },
        '&.selected': {
          border:    `2px solid ${theme.palette.primary.main}`,
          boxShadow: `1px -1px 5px -1px ${theme.palette.primary.main}`,
        },
      },
    },
  );

type Props = WithStyles<typeof styles> & {
  companyId: string;
  onSave(image: string): void;
};

type State = {
  images: string[] | undefined;
  selected: string | undefined;
};

class _HistoryImages extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      images:   undefined,
      selected: undefined,
    };
  }

  public async componentDidMount(): Promise<void> {
    try {
      const images = await dashboardCompanyFacade.getHistoryImages(this.props.companyId);
      if (images === undefined) {
        throw new Error('No history images found');
      }
      this.setState({ images });
    } catch (error) {
      logService.error('Error fetching history images', error);

      globalMessageService.pushMessage(
        {
          message: locale.dashboard.dealsPage.messages.newDealFailed,
          variant: 'error',
        },
      );
    }
  }

  public render(): React.ReactNode {
    const { classes, onSave } = this.props;
    const { images }          = this.state;

    if (images === undefined) {
      return (
        <Card elevation={0} className={classes.root}>
          <CardContent>
            <Typography variant={'caption'} align="center">
              <Loading/>
            </Typography>
          </CardContent>
        </Card>
      );
    }

    if (images.length === 0) {
      return (
        <Card elevation={0} className={classes.root}>
          <CardContent>
            <Typography variant={'caption'} align="center">
              {locale.createDealWizard.image.noImagesFound}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card elevation={0} className={classes.root}>
        <Grid container spacing={2} style={{
          width:  '100%',
          margin: 0,
        }}>
          {images.map((img, i) => {
            img = '/' + img;

            return (
              <Grid item xs={12} sm={6}
                    key={img}
                    className={clsx(classes.gridListTile, { ['selected']: img === this.state.selected })}
                    onClick={() => {
                      this.setState({ selected: img });
                      onSave(img);
                    }}
              >
                <Card>
                  <LazyLoad offset={200}>
                    <CardMediaFix
                      alt={`Deal ${i + 1}`}
                      title={`Deal ${i + 1}`}
                      image={CDN_BASE_URL + img}
                    />
                  </LazyLoad>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Card>
    );
  }
}

export const HistoryImages = withStyles(styles)(_HistoryImages);
