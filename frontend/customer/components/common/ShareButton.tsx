import {
  createStyles,
  IconButton,
  withStyles,
  WithStyles,
}                                   from '@material-ui/core';
import ShareIcon                    from '@material-ui/icons/Share';
import {
  IApiCompany,
  IApiDeal,
}                                   from '@my-old-startup/common/interfaces';
import { SUPPORTS_SHARING }         from '@my-old-startup/frontend-common/constants';
import { globalMessageService }     from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { logService }               from '@my-old-startup/frontend-common/services/LogService';
import * as React                   from 'react';
import {
  companyRichShareEvent,
  companyUrlCopyEvent,
  dealRichShareEvent,
  dealUrlCopyEvent,
  newsRichShareEvent,
}                                   from '../../common/GAEvent';
import { locale }                   from '../../common/locales';
import { customerAnalyticsService } from '../../services/customerAnalyticsService';

const styles = () => createStyles({});

type Props = WithStyles<typeof styles> & {
  url: string;
  title: string;
  text?: string;
  className?: string;
  type?: 'deal' | 'company' | 'news';
  deal?: Pick<IApiDeal, 'id'>;
  company?: Pick<IApiCompany, 'id'>;
};

/**
 * Displays a share button which either shares vie WebAPI or copies a link to the clipboard
 *
 * If the browser does not support the share or clipboard api, this component renders `null` and is not displayed
 */
class _ShareButton extends React.PureComponent<Props> {
  public componentDidMount(): void {
    this.setState({ supportsSharing: SUPPORTS_SHARING });
  }

  public render(): React.ReactElement | null {
    return (
      <IconButton
        aria-label="Share Link"
        onClick={e => {
          e.stopPropagation();
          this.onClick();
        }}
        className={this.props.className}
      >
        <ShareIcon/>
      </IconButton>
    );
  }

  /**
   * Callback for when the button is clicked
   */
  private onClick(): void {
    if (navigator.share !== undefined) {
      return this.share();
    }

    if (navigator.clipboard !== undefined) {
      return this.copyToClipboard();
    }

    logService.error('No viable sharing solution');
  }

  /**
   * Writes the target to the clipboard and displays a message on either success or failure
   */
  private copyToClipboard(): void {
    const { url, title, type, company, deal } = this.props;

    // If `navigator` or `navigator.clipboard` are undefined, this cannot be called, gated by the first line of `render`
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    navigator!.clipboard.writeText(url)
      .then(() => {
        globalMessageService.pushMessage(
          {
            message: locale.sharing.copyToClipboard(title),
            variant: 'success',
          },
        );

        if (!company) {
          return;
        }

        const gaEvent = type === 'company' ? companyUrlCopyEvent({ company }) : dealUrlCopyEvent(
          {
            company,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            deal: deal!,
          },
        );
        customerAnalyticsService.trackEvent(gaEvent);
      })
      .catch((e: any) => {
        logService.error('Copy to clipboard failed', e);
        globalMessageService.pushMessage(
          {
            message: locale.error.shareToClipboard,
            variant: 'error',
          },
        );
      });
  }

  /**
   * If rich share API is available use it
   */
  private share(): void {
    const { url, title, text, type, company, deal } = this.props;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    navigator.share!(
      {
        url,
        title,
        text: text || '',
      },
    )
      .then(() => {
        globalMessageService.pushMessage(
          {
            message: locale.sharing.share(title),
            variant: 'success',
          },
        );

        if (!company) {
          return;
        }

        let gaEvent;

        switch (type) {
          case 'company':
            gaEvent = companyRichShareEvent({ company });
            break;
          case 'deal':
            gaEvent = dealRichShareEvent({
                                           company,
                                           deal: deal!,
                                         });
            break;
          default:
          case 'news':
            gaEvent = newsRichShareEvent({
                                           company,
                                           deal: deal!,
                                         });

        }

        customerAnalyticsService.trackEvent(gaEvent);

      })
      .catch(error => {
        const err: DOMException = error;

        if (err.message === 'Abort due to cancellation of share.') {
          // Action was cancelled
          return;
        } else {
          if (!company) {
            return;
          }
          const gaEvent = type === 'company' ? companyRichShareEvent({ company }) : dealRichShareEvent(
            {
              company,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              deal: deal!,
            },
          );
          customerAnalyticsService.trackEvent(gaEvent);

          globalMessageService.pushMessage(
            {
              message: locale.sharing.share(title),
              variant: 'success',
            },
          );
        }
      });
  }
}

export const ShareButton = withStyles(styles)(_ShareButton);
