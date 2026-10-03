import { Avatar, createStyles, withStyles, WithStyles } from '@material-ui/core';
import AccountCircleIcon                                from '@material-ui/icons/Home';
import { CDN_BASE_URL }                                 from '@my-old-startup/common/enums/constants';
import { observer }                                     from 'mobx-react';
import * as React                                       from 'react';
import { companyStore }                                 from '../../stores/CompanyStore';

const styles = () => createStyles({
  avatar: {
    width:  140,
    height: 140,
  },
  avatarIcon: {
    width:  '100%',
    height: '100%',
  },
});

type Props = WithStyles<typeof styles>;

@observer
class _DashboardMenuAccountHeaderAvatar extends React.Component<Props> {

  public render(): React.ReactNode {
    const { avatar, avatarIcon } = this.props.classes;

    const company = companyStore.currentCompany;

    if (company === undefined) {
      return <Avatar className={avatar}><AccountCircleIcon className={avatarIcon}/></Avatar>;
    }

    return (
      <Avatar className={avatar}>
        <img src={CDN_BASE_URL + company.images.logo} className={avatarIcon}/>
      </Avatar>
    );
  }
}

export const DashboardMenuAccountHeaderAvatar = withStyles(styles)(_DashboardMenuAccountHeaderAvatar);
