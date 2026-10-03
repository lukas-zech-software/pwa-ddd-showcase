import {
  createStyles,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  WithStyles,
  withStyles,
}                   from '@material-ui/core';
import { Phone }    from '@material-ui/icons';
import * as React   from 'react';
import { useState } from 'react';
import { locale }   from '../../common/locales';

const styles = () => createStyles(
  {
    paper:  {
      borderRadius: 0,
    },
    hidden: {
      zIndex:   999,
      opacity:  0,
      position: 'absolute',
      top:      3,
      left:     5,
      height:   40,
      width:    40,
    },
  },
);

type Props = {
  telephone?: string;
  secondaryTelephone?: string;
  secondaryTelephoneReason?: string;
} & WithStyles<typeof styles>;

function _MultiPhoneButton(props: Props): JSX.Element {
  const { classes, telephone,secondaryTelephone,secondaryTelephoneReason } = props;

  const [open, setOpen] = useState<boolean>();

  if (secondaryTelephone === undefined) {
    return (
      <IconButton href={`tel:+49${telephone}`}>
        <Phone/>
      </IconButton>
    );
  }

  function callNumber(phoneNumber: string | undefined): void {
    if (phoneNumber === undefined) {
      return;
    }

    setOpen(false);
    window.open(`tel:+49${phoneNumber}`, '_self');
  }

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <Phone/>
      </IconButton>

      <Drawer ModalProps={{ style: { zIndex: 9999999 } }} anchor="bottom" open={open} onClose={() => setOpen(false)}>
        <Paper className={classes.paper}>
          <List>
            <ListItem divider button disabled>
              <ListItemText primary={locale.phone.selectPhoneNumber}/>
            </ListItem>

            <ListItem divider button onClick={() => callNumber(telephone)}>
              <ListItemText primary={`+49 ${telephone} (Standard)`}/>
            </ListItem>

            <ListItem button onClick={() => callNumber(secondaryTelephone)}>
              <ListItemText
                primary={`+49 ${secondaryTelephone} (${secondaryTelephoneReason})`}/>
            </ListItem>
          </List>
        </Paper>
      </Drawer>
    </>
  );
}

export const MultiPhoneButton = withStyles(styles)(_MultiPhoneButton);
