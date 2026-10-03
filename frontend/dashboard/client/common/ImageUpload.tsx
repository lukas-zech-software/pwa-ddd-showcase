import {
  AppBar,
  createStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Tab,
  Tabs,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                         from '@material-ui/core';
import { ExpandMore }                     from '@material-ui/icons';
import RefreshIcon                        from '@material-ui/icons/Refresh';
import { CDN_BASE_URL }                   from '@my-old-startup/common/enums/constants';
import { ImageConfiguration }             from '@my-old-startup/common/interfaces/ImageConfiguration';
import { IS_OLD_IOS_VERSION }             from '@my-old-startup/frontend-common/constants';
import { authenticationService }          from '@my-old-startup/frontend-common/services/AuthenticationService';
import { globalMessageService }           from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { logService }                     from '@my-old-startup/frontend-common/services/LogService';
import { requestService }                 from '@my-old-startup/frontend-common/services/RequestService';
import clsx                               from 'clsx';
import FilePondPluginFileValidateType     from 'filepond-plugin-file-validate-type';
import FilePondPluginImageCrop            from 'filepond-plugin-image-crop';
import FilePondPluginImageEdit            from 'filepond-plugin-image-edit';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageTransform       from 'filepond-plugin-image-preview';
import FilePondPluginImageResize          from 'filepond-plugin-image-resize';
import FilePondPluginImagePreview         from 'filepond-plugin-image-transform';
import FilePondPluginImageValidateSize    from 'filepond-plugin-image-validate-size';
import React, {
  ErrorInfo,
  PureComponent,
}                                         from 'react';
import {
  File,
  FilePond,
  registerPlugin,
}                                         from 'react-filepond';
import { IApiCompanyImages }              from '../../../../common/interfaces';
import * as Doka                          from '../external/doka.esm.min.js';
import { allCompaniesStore }              from '../pages/registration/AllCompaniesStore';
import { companyStore }                   from '../stores/CompanyStore';
import { CustomSnackbarContent }          from './CustomSnackbarContent';
import { HistoryImages }                  from './HistoryImages';
import { locale }                         from './locales';
import { StockImages }                    from './StockImages';
import { ImageTab }                       from './types';

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImageResize,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform,
  FilePondPluginImageCrop,
  FilePondPluginImageEdit,
  FilePondPluginFileValidateType,
  FilePondPluginImageValidateSize,
);

const styles = (theme: Theme) =>
  createStyles(
    {
      root:            {
        display:  'flex',
        flexWrap: 'wrap',
      },
      formControl:     {
        margin:   theme.spacing(1),
        minWidth: 120,
      },
      chips:           {
        display:  'flex',
        flexWrap: 'wrap',
      },
      chip:            {
        margin: theme.spacing(0.25),
      },
      uploadContainer: {
        marginTop:                   theme.spacing(1),
        '& .filepond--panel-root':   {
          borderRadius:    0,
          backgroundColor: 'transparent',
        },
        '& .filepond--drop-label':   {
          height:                         200,
          [theme.breakpoints.down('sm')]: {
            height: 100,
          },
        },
        '& .filepond--label-action': {
          textDecoration: 'none',
        },
      },
      rightIcon:       {
        marginLeft: theme.spacing(1),
      },
      oldDeviceHint:   {
        marginTop:    theme.spacing(-2),
        marginBottom: theme.spacing(1),
        marginLeft:   theme.spacing(1),
        marginRight:  theme.spacing(1),
      },
      imageContainer:  {
        marginTop: theme.spacing(2),
      },
      tabBar:          {
        flexGrow:        1,
        backgroundColor: theme.palette.background.paper,
      },
      hidden:          {
        display: 'none',
      },
    },
  );

type Props = WithStyles<typeof styles> & {
  successMessage: string;
  imageConfig: ImageConfiguration;
  targetUrl: string;
  propertyName: string;
  selectedImage: string | undefined;
  /**
   * History and Own images return a string, while upload return the object from the API
   * @param image
   */
  onImageProcessed: (image: IApiCompanyImages | string) => void;
  onImageAdded?: () => void;
  onImageRemoved?: () => void;
  hideTabs?: boolean;
  hideStock?: boolean;
  hideHistory?: boolean;
  noEdit?: boolean;
  acceptedFileTypes?: string[];
};

type State = {
  files: any[];
  hasError: boolean;
  isInit: boolean;
  wasRemoved: boolean;
  imageTab: ImageTab;
};

class ImageUpload extends PureComponent<Props, State> {
  private pond: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      files:      [],
      hasError:   false,
      isInit:     false,
      wasRemoved: false,
      imageTab:   ImageTab.UPLOAD,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logService.error(`ImageUpload caught error: ${error}`, {
      error,
      errorInfo,
    });
    this.setState({ hasError: true });
  }

  public getFilePond(): React.ReactNode {
    const {
            imageConfig,
            successMessage,
            propertyName,
            selectedImage,
            noEdit,
            acceptedFileTypes,
          }            = this.props;
    const imagesToShow = [selectedImage];

    if (this.state.hasError === true) {
      return (
        <CustomSnackbarContent
          snackbarVariant="error"
          message={locale.common.error.defaultErrorMessage}
          buttonIcon={RefreshIcon}
          onClose={() => window.location.reload()}
        />
      );
    }

    return (
      <FilePond
        ref={(ref) => (this.pond = ref)}
        name={propertyName}
        allowImageEdit={!noEdit}
        allowPaste
        allowReplace
        imageEditInstantEdit={this.state.isInit}
        allowFileSizeValidation
        allowFileTypeValidation
        acceptedFileTypes={acceptedFileTypes || ['image/png', 'image/jpeg', 'image/svg+xml']}
        imageCropAspectRatio={`${imageConfig.width}:${imageConfig.height}`}
        imageEditEditor={Doka.create({
                                       /*Labels*/
                                       ...locale.common.upload,
                                     })}
        /*Labels*/
        {...locale.common.upload}
        imageResizeTargetWidth={imageConfig.width}
        imageResizeTargetHeight={imageConfig.height}
        imagePreviewTransparencyIndicator={'grid'}
        styleLoadIndicatorPosition={'center bottom'}
        styleProgressIndicatorPosition={'center bottom'}
        styleImageEditButtonEditItemPosition={'right bottom'}
        server={this.getImageServerConfig()}
        onerror={(error: any) => {
          logService.error(error);
          globalMessageService.pushMessage({
                                             message: locale.common.error.defaultErrorMessage,
                                             variant: 'error',
                                           });
        }}
        onprocessfile={async (error: any) => {
          if (error) {
            logService.error(error);
            globalMessageService.pushMessage(
              {
                message: locale.common.error.defaultErrorMessage,
                variant: 'error',
              },
            );
          } else {
            globalMessageService.pushMessage(
              {
                message: successMessage,
                variant: 'success',
              },
            );
            // refresh the logos
            await allCompaniesStore.loadCompanies();
          }
        }}
        beforeRemoveFile={(error:any, file:any) => {
          if (this.props.onImageRemoved) {
            this.props.onImageRemoved();
          }

          this.setState(
            {
              files: [],
            },
          );
        }}
        onaddfile={() => {
          if (this.state.isInit) {
            if (this.props.onImageAdded) {
              this.props.onImageAdded();
            }
          }
          // activate instant edit only after the initial files were set
          this.setState({ isInit: true });
        }}
        onupdatefiles={(fileItems: any[]) => {
          // Set current file objects to this.state
          this.setState(
            {
              files: fileItems.map((fileItem) => fileItem.file),
            },
          );
        }}
      >
        {imagesToShow.map((file, index) => (
          <File key={index} src={file} origin="local"/>
        ))}
      </FilePond>
    );
  }

  public getOldDeviceHint(): React.ReactNode {
    if (!IS_OLD_IOS_VERSION) {
      return null;
    }

    return (
      <ExpansionPanel className={this.props.classes.oldDeviceHint}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
          <Grid container justify="center">
            <Grid item>
              <Typography variant={'caption'} align="center">
                {locale.forms.apiCompanyImages.oldDeviceHint}
              </Typography>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container justify="center">
            <Grid item>
              <Typography variant={'caption'} align="center">
                <img style={{
                  width:    this.props.imageConfig.width,
                  maxWidth: '100%',
                }}
                     src={CDN_BASE_URL + this.props.selectedImage}/>
              </Typography>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  public getUploadContent(): React.ReactNode {
    return (
      <>
        {this.getOldDeviceHint()}
      </>
    );
  }

  public getHistoryContent(): React.ReactNode {
    return (
      <HistoryImages
        companyId={companyStore.currentCompany!.id}
        onSave={(fileName) => {
          this.setState({ files: [fileName] });
          this.props.onImageProcessed(fileName);
        }}
      />
    );
  }

  public getStockContent(): React.ReactNode {
    return (
      <StockImages
        onSave={(fileName) => {
          this.setState({ files: [fileName] });
          this.props.onImageProcessed(fileName);
        }}
      />
    );
  }

  public getTabContent(): React.ReactNode {
    switch (this.state.imageTab) {
      case ImageTab.HISTORY:
        return this.getHistoryContent();
      case ImageTab.STOCK:
        return this.getStockContent();
      case ImageTab.UPLOAD:
      default:
        return this.getUploadContent();
    }
  }

  public render(): React.ReactNode {
    const { classes, hideStock, hideHistory, hideTabs } = this.props;
    const { imageTab }                                  = this.state;

    if (this.state.hasError === true) {
      return (
        <CustomSnackbarContent
          snackbarVariant="error"
          message={locale.common.error.defaultErrorMessage}
          buttonIcon={RefreshIcon}
          onClose={() => window.location.reload()}
        />
      );
    }

    return (
      <div className={classes.uploadContainer}>
        <link
          href="https://storage.googleapis.com/static.my-old-startups-domain.de/css/filepond-plugin-image-preview.min.css"
          type="text/css"
          rel="stylesheet"
        />
        <link
          href="https://storage.googleapis.com/static.my-old-startups-domain.de/css/filepond.min.css"
          type="text/css"
          rel="stylesheet"
        />
        <link
          href="https://storage.googleapis.com/static.my-old-startups-domain.de/css/doka.5.min.css"
          type="text/css"
          rel="stylesheet"
        />

        <AppBar position="static" className={classes.tabBar}>
          {hideTabs === undefined && (
            <Tabs
            value={imageTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(_, value) => this.setState({ imageTab: value })}
            aria-label="disabled tabs example"
          >
            <Tab label={locale.createDealWizard.image.tab[ImageTab.UPLOAD]} value={ImageTab.UPLOAD}/>
            {hideStock !== true && <Tab label={locale.createDealWizard.image.tab[ImageTab.STOCK]} value={ImageTab.STOCK}/>}
            {hideHistory !== true && <Tab label={locale.createDealWizard.image.tab[ImageTab.HISTORY]} value={ImageTab.HISTORY}/>}
          </Tabs>
          )}
        </AppBar>
        {/*We always need the file pond ref but sometimes hidden */}
        <div className={clsx({ [classes.hidden]: imageTab !== ImageTab.UPLOAD })}>{this.getFilePond()}</div>

        {this.getTabContent()}
      </div>
    );
  }

  private getImageServerConfig(): object {
    const authToken = authenticationService.getAuthToken();
    const baseUrl   = requestService
      .getBaseUrl()
      .toString()
      .slice(0, -1);

    return {
      url:     baseUrl,
      process: {
        url:             this.props.targetUrl,
        withCredentials: true,
        headers:         {
          Authorization: `Bearer ${authToken}`,
        },
        onload:          (response: string) => {
          if (response) {
            this.props.onImageProcessed(JSON.parse(response));
          }
        },
        ondata:          (formData: any) => {
          formData.append('fileType', this.state.files[0].type ? this.state.files[0].type : 'application/jpg');
          return formData;
        },
      },
      load:    async (file: string, load: Function, errorCb: Function) => {
        try {
          const response = await fetch(
            new Request(CDN_BASE_URL + file, { mode: 'cors' }),
          );
          const blob     = await response.blob();
          load(blob);
        } catch (error) {
          errorCb(error);
        }
      },
      remove:  null,
      restore: null,
      fetch:   null,
      revert:  null,
    };
  }

  /* private async restoreDefault(): Promise<void> {
     this.setState({ files: [] });
     await this.props.restoreDefault();

     globalMessageService.pushMessage(
       {
         message: locale.forms.apiCompanyImages.restoreMessage,
         variant: 'success',
       },
     );
   }*/
}

export default withStyles(styles)(ImageUpload);
