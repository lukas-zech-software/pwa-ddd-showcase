import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  createStyles,
  Theme,
  withStyles,
  WithStyles,
}                     from '@material-ui/core';
import amber          from '@material-ui/core/colors/amber';
import Alert          from '@material-ui/lab/Alert';
import clsx           from 'clsx';
import * as React     from 'react';
import { locale }     from '../common/locales';
import { fullHeight } from '../styles/common';

const styles = (theme: Theme) => {
  const boxShadowWidth = theme.spacing(0.5);

  return createStyles({
                        card:        fullHeight,
                        warningText: {
                          '& *': {},
                        },
                        warningCard: {
                          borderWidth: 1,
                          borderStyle: 'solid',
                          boxShadow:   `${boxShadowWidth}px ${boxShadowWidth}px ${boxShadowWidth}px 0px ${amber[700]}`,
                        },
                        button:      {
                          margin: theme.spacing(1),
                        },
                        actions:     {
                          flexDirection: 'row-reverse',

                        },
                        alert:        {
                          cursor:          'pointer',
                        },
                        avatar:      {
                          backgroundColor: 'transparent',
                          color:           theme.palette.text.primary + ' !important',
                        },
                      });
};

type Props = WithStyles<typeof styles> & {
  submit: () => void;
  header: string | React.ReactNode;
  className?: string;
  subheader?: string;
  hasWarning?: boolean;
  isDirty?: boolean;

  subForm?: boolean;
  disabled?: boolean;
  action?: React.ReactNode;
  saveButtonLabel?: string;
};

class _BaseCompanyFormCard extends React.Component<Props, {}> {
  public render(): JSX.Element {
    const {
            classes,
            children,
            subForm,
            disabled,
            hasWarning,
            isDirty,
            header,
            submit,
            subheader,
            className,
            action,
            saveButtonLabel,
          } = this.props;

    const markWarnings = isDirty || hasWarning;

    return (
      <Card className={clsx(classes.card, className, { [classes.warningCard]: markWarnings })}>
        <CardHeader title={header} subheader={subheader} action={action}/>
        <Collapse in={isDirty} timeout={{ enter: 500 }}>
          {isDirty && (
            <Alert severity="warning"  className={classes.alert} onClick={() => submit()}>{locale.common.buttons.isDirty}</Alert>
          )}
        </Collapse>

        <CardContent>
          {children}
        </CardContent>

        {/* no own buttons on subforms*/}
        {!subForm && (
          <CardActions className={classes.actions}>
            <Button color="primary" variant="contained" aria-label="Add" className={classes.button} disabled={disabled}
                    onClick={() => submit()}>
              {saveButtonLabel || locale.common.buttons.save}
            </Button>
          </CardActions>
        )}
      </Card>
    );
  }
}

export const BaseCompanyFormCard = withStyles(styles)(_BaseCompanyFormCard);
