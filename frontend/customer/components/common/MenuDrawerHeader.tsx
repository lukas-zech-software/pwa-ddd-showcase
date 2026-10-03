import {
  createStyles,
  Divider,
  List,
  Paper,
  Theme,
  withStyles,
  WithStyles,
}                              from '@material-ui/core';
import * as React              from 'react';
import { CDN_STATIC_BASE_URL } from '../../../../common/enums';

const styles = (theme: Theme) => createStyles(
  {
    container:     {
      width:           '100%',
      backgroundColor: 'inherit',
    },
    listIcon:      {},
    listIconLogin: {
      width:  40,
      height: 40,
    },
    text:      {},
    title:     {},
    subheader: {
      wordBreak: 'break-all',
    },

    avatar: {
      'width':            140,
      'height':           140,
      'background-color': '#eee',
    },
    avatarIcon: {
      width:      '160px',
      margin:'0 auto',
      display:'block',
      padding:    theme.spacing(1),
      paddingTop: theme.spacing(2),
    },
  },
);

type Props = {} & WithStyles<typeof styles>;

type State = {
  showLogout: boolean;
};

class _MenuDrawerHeader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showLogout: false,
    };
  }

  public render(): React.ReactNode {
    const { container, avatarIcon } = this.props.classes;

    return (
      <Paper elevation={0} square className={container}>

        <a href="https://my-old-startups-domain.de/" target="_self">
          <img alt="Logo" src={CDN_STATIC_BASE_URL + '/images/logo/logo_wide.png'} className={avatarIcon}/>
        </a>

        <List>
          <Divider/>
        </List>
      </Paper>
    );
  }
}

export const MenuDrawerHeader = withStyles(styles)(_MenuDrawerHeader);
