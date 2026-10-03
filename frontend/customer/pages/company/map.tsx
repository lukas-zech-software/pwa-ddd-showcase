import { NoSsr }   from '@material-ui/core';
import * as React  from 'react';
import { MapType } from '../../common/types';
import MapView     from '../../components/map/MapView';

class _MapPage extends React.Component {
  render() {
    return (
      <NoSsr>
        <MapView type={MapType.COMPANIES}/>
      </NoSsr>
    );
  }
}

export default _MapPage;
