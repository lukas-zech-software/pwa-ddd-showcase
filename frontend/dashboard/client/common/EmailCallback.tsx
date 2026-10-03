import {
  Card,
  CardContent,
  Typography,
}                                from '@material-ui/core';
import { Loading }               from '@my-old-startup/frontend-common/components/Loading';
import { authenticationService } from '@my-old-startup/frontend-common/services/AuthenticationService';
import * as React                from 'react';

function parseQuery(queryString:string) {
    var query:any = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

export class EmailCallback extends React.Component {
  public componentWillMount(): void {

    const urlParams = parseQuery(window.location.search);
    const success   = urlParams['success'];

    if (success === 'true') {
      authenticationService.renewToken().then(() => {
        window.location.replace(window.location.origin);
      }).catch(() => {
        authenticationService.logOutHard();
      });
    } else {
      authenticationService.logOutHard();
    }
  }

  public render(): JSX.Element {
    const urlParams = parseQuery(window.location.search);
    const success   = urlParams['success'];

    if (success === 'true') {
      return <Loading center/>;
    }

    const message = urlParams['message'];
    const code    = urlParams['code'];

    if (message || code) {
      return <Card>
        <CardContent>
          <Typography paragraph variant="h5">
            Leider ist ein Fehler aufgetreten
          </Typography>
          <br/>
          <Typography paragraph variant="h5">
            Message: {message}
          </Typography>
          <Typography paragraph variant="h5">
            Code: {code}
          </Typography>
          <Typography paragraph variant="h5">
            <a href="#" onClick={() => authenticationService.logOutHard()}>Bitte melden Sie sich hier erneut an, um
              fortzufahren</a>
          </Typography>
        </CardContent>
      </Card>;
    }
    return <Loading center/>;
  }
}
