import {
  createStyles,
  InputAdornment,
  Paper,
  withStyles,
  WithStyles,
} from '@material-ui/core';

import * as React           from 'react';
import { FormTooltip }      from '../FormTooltip';
import { CompanyFormField } from './CompanyFormField';

const styles = () => createStyles(
  {
    button: {
      zIndex:    100,
      padding:   6,
      border:    'none',
      boxShadow: 'none',
    },
  },
);
type SocialMediaService = 'facebook' | 'instagram' | 'twitter';

const socialMediaMasks: Record<SocialMediaService, string> = {
  facebook:  'facebook.com/',
  instagram: 'instagram.com/',
  twitter:   'twitter.com/',
};

const socialMediaBaseUrls: Record<SocialMediaService, string> = {
  facebook:  '(?:https?://)?(www.)?facebook.com/',
  instagram: '(?:https?://)?(www.)?instagram.com/',
  twitter:   '(?:https?://)?(www.)?twitter.com/',
};

type Props = WithStyles<typeof styles> & {
  propertyName: SocialMediaService;
  errorMessage: string | undefined;
  label: string;
  /**
   * The full URL for the social media account
   */
  value: string;
  tooltip?: string;
  isOptional?: boolean;
  emptyStringToUndefined?: boolean;
  onValueChange(socialMediaUrl: string | undefined): void;
};

class _CompanySocialMediaField extends React.PureComponent<Props> {
  private readonly maskMatcher: RegExp;
  private readonly baseUrlMatcher: RegExp;
  private readonly startAdornmentText: string;

  public constructor(props: Props) {
    super(props);

    this.maskMatcher        = new RegExp(socialMediaMasks[props.propertyName]);
    this.baseUrlMatcher     = new RegExp(socialMediaBaseUrls[props.propertyName]);
    this.startAdornmentText = socialMediaMasks[props.propertyName];
  }

  public render(): React.ReactNode {
    const {
      errorMessage,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value,
      tooltip,
      label,
      propertyName,
      isOptional,
      emptyStringToUndefined,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      classes,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onValueChange,
      // eslint-disable-next-line @typescript-eslint/tslint/config
      ...inputProps
    } = this.props;

    return (
      <CompanyFormField errorMessage={errorMessage}
                        helperText={errorMessage}
                        value={this.replaceUrl(value)}
                        onBlur={(event) => this.onChange(event.currentTarget.value)}
                        onValueChange={(inputText) => this.onChange(inputText)}
                        label={label}
                        name={propertyName}
                        optional={isOptional}
                        emptyStringToUndefined={emptyStringToUndefined}
                        propertyName={propertyName}
                        InputProps={{
                          endAdornment:   (tooltip !== undefined && <FormTooltip form title={tooltip}/>),
                          startAdornment: (
                            <InputAdornment position="start">
                              <Paper square className={classes.button}>
                                {this.startAdornmentText}
                              </Paper>
                            </InputAdornment>
                          ),
                        }}
                        {...inputProps}
      />
    );
  }

  private replaceUrl(text: string): string {
    return text.replace(this.baseUrlMatcher, '').replace(this.maskMatcher, '');
  }

  private onChange(rawValue: string | undefined): void {
    if (rawValue === undefined) {
      this.props.onValueChange(undefined);
      return;
    }
    const socialMediaUrl = this.replaceUrl(rawValue);

    if (socialMediaUrl === '') {
      this.props.onValueChange(undefined);
      return;
    }

    this.props.onValueChange(socialMediaUrl);
  }
}

export const CompanySocialMediaField = withStyles(styles)(_CompanySocialMediaField);
