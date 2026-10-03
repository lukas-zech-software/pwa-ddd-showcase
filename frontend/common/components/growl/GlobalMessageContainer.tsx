import {
  Snackbar,
  WithStyles,
  withStyles,
}                               from '@material-ui/core';
import { SnackbarOrigin }       from '@material-ui/core/Snackbar';
import * as React               from 'react';
import { globalMessageService } from '../../services/GlobalMessageService';
import { IGlobalMessage }       from '../../types';
import { GlobalMessageContent } from './GlobalMessageContent';

const styles = () => ({});

type Props = {
  origin?: SnackbarOrigin;
  hideClose?: boolean;
} & WithStyles<typeof styles>;

type State = {
  currentMessage: IGlobalMessage | undefined;
  isOpen: boolean;
};

export const GlobalMessageContainer = withStyles(styles)(
  class GlobalMessageContainer extends React.Component<Props, State> {

    public constructor(props: Props) {
      super(props);
      this.state = {
        isOpen:         false,
        currentMessage: undefined,
      };
    }

    public componentDidMount(): void {
      globalMessageService.setHandler(() => {
        if (this.state.isOpen) {
          // this will close the current snackbar and trigger the onExited handler
          this.setState({ isOpen: false });
        } else {
          this.processQueue();
        }
      });
    }

    public render(): React.ReactNode {
      const { origin }                 = this.props;
      const { isOpen, currentMessage } = this.state;

      if (currentMessage === undefined) {
        return null;
      }

      return (
        <Snackbar
          anchorOrigin={origin || {
            vertical:   'top',
            horizontal: 'center',
          }}
          autoHideDuration={currentMessage.duration || 6000}
          resumeHideDuration={0}
          onClose={(e, reason) => this.onClose(reason)}
          onExited={() => this.onExited()}
          open={isOpen}
        >
          <GlobalMessageContent
            key={currentMessage.id}
            onClose={() => this.onClose('closed')}
            message={currentMessage}
            hideClose
          />
        </Snackbar>
      );
    }

    private processQueue(): void {
      if (globalMessageService.hasMessages()) {
        this.setState({
                        currentMessage: globalMessageService.getMessage(),
                        isOpen:         true,
                      });
      }
    }

    private onClose(reason: string): void {
      if (reason === 'clickaway') {
        return;
      }
      this.setState({ isOpen: false });
    }

    private onExited(): void {
      this.processQueue();
    }
  },
);
