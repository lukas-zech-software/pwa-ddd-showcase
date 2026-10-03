import { createStyles, IconButton, Tooltip, withStyles, WithStyles } from '@material-ui/core';
import DeleteIcon                                                    from '@material-ui/icons/Delete';
import FilterIcon                                                    from '@material-ui/icons/FilterList';
import * as React                                                    from 'react';

const styles = () => createStyles({
  iconButton: {
    marginRight: '24px',
    top:         '50%',
    display:     'inline-block',
    position:    'relative',
    transform:   'translateY(-50%)',
  },
  deleteIcon: {
    color: '#000',
  },
});

type Props = WithStyles<typeof styles>;

class _DealsTableToolbar extends React.Component<Props> {
  public render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <div className={'custom-toolbar-select'}>
        <Tooltip title={'icon 2'}>
          <IconButton className={classes.iconButton}>
            <FilterIcon className={classes.deleteIcon}/>
          </IconButton>
        </Tooltip>
        <Tooltip title={'icon 1'}>
          <IconButton className={classes.iconButton}>
            <DeleteIcon className={classes.deleteIcon}/>
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

export const DealsTableToolbar = withStyles(styles)(_DealsTableToolbar);
