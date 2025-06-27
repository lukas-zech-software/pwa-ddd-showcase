import {
  CardHeader,
  makeStyles,
  Theme,
}                                      from '@material-ui/core';
import IconButton                      from '@material-ui/core/IconButton';
import CloseIcon                       from '@material-ui/icons/Close';
import React                           from 'react';
import { MuiButtonContainedSecondary } from '../../styles/theme';

const useStyles = makeStyles((theme: Theme) => ({

  cardHeader:     {
    padding:       theme.spacing(1),
    paddingTop:    0,
    paddingBottom: 0,
    position:      'relative',
    zIndex:        1010,
  },
  icon:           {
    fontSize:        30,
    backgroundColor: MuiButtonContainedSecondary.backgroundColor,
    borderRadius:    '50%',
    opacity:         1,
  },
  distanceAction: {
    position: 'absolute',
    right:    0,
    margin:   0,
  },

}));

type Props = {
  onClose: () => void;
}

export const MapCardHeader: React.SFC<Props> = ({ onClose }: Props) => {
  const classes = useStyles();

  return (
    <CardHeader
      classes={{ action: classes.distanceAction }}
      className={classes.cardHeader}
      action={(
        <IconButton
          key="close"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClose();
          }}
        >
          <CloseIcon className={classes.icon}/>
        </IconButton>
      )}
    />
  );
};
