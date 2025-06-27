import { CompanyType }    from '@my-old-startup/common/enums/types';
import { ErrorCode }      from '@my-old-startup/common/error/ErrorCode';
import { HttpStatusCode } from '@my-old-startup/common/http/HttpStatusCode';
import {
  ErrorCodeMessages,
  HttpStatusCodeMessages,
}                         from '@my-old-startup/common/interfaces/types';
import * as commonLocales from '@my-old-startup/frontend-common/locales';
/* tslint:disable:max-line-length */

export const locale = {
  common:    {
    error: {
      restart:                'Restart',
      contactSupport:         'Contact support',
      defaultErrorMessage:    'A technical error occurred. Please try again later.',
      validationErrorMessage: 'Please check the errors above',
      statusCode:             {
                                [HttpStatusCode.NOT_FOUND]:      `Url invalid (${HttpStatusCode.NOT_FOUND})`,
                                [HttpStatusCode.NOT_AUTHORIZED]: `Not logged in (${HttpStatusCode.NOT_AUTHORIZED})`,
                              } as HttpStatusCodeMessages,
      errorCode:              {
                                [ErrorCode.WEB_SERVER_NO_GEO_DATA_FOUND]: 'We could not find this address, please check your input',
                              } as ErrorCodeMessages,

    },
  },
  format:    commonLocales.EN.format,
  login:     {
    header:  'Log into my-old-startups-domain Hub',
    buttons: {
      register: 'Login now',
    },
  },
  dashboard: {
    header: {
      appBar:    'my-old-startups-domain Admin Hub',
      companies: 'Admin - Companies',
      users:     'Admin - Users',
      deals:     'Admin - Deals',
    },
    enums:  {
      companyType: {
        [CompanyType.CAFE]:       'Café',
        [CompanyType.IMBISS]:     'Snack Bar',
        [CompanyType.RESTAURANT]: 'Restaurant',
        [CompanyType.FOODTRUCK]:  'Food truck',
      },
    },

    buttons:   {
      refresh: 'Refresh',
    },
    menuItems: {
      companies: 'Companies',
      users:     'Users',
      deals:     'Deals',
      settings:  'Settings',
      header:    {
        loginHint: 'Please login to use the dashboard',
        login:     'Login',
        logout:    'Logout',
      },
    },
    table:     {
      headerTopics:    {
        contact: 'Contact',
        details: 'Details',
        status:  'Status',
        options: 'Options',
      },
      header:          {
        title:            'Name',
        userName:         'Username',
        address:          'Address',
        zipCode:          'Zip code',
        telephone:        'Telephone',
        email:            'Email',
        authID:           'AuthID',
        website:          'Website',
        type:             'Type',
        isApproved:       'Approved',
        hasAcceptedTerms: 'Has Accepted Terms',
        isBlocked:        'Blocked',
        created:          'Created',
        lastLogin:        'Last Login',
        update:           'Updated',
        contactName:      'Contact person',
        contactPhone:     'Contact phone',
        contactEmail:     'Contact mail',
      },
      buttons:         {
        approve: 'Approve',
      },
      deleteDialog:    {
        header:  (itemType: 'company' | 'user'): string => `Delete ${itemType}?`,
        body:    (itemType: string, title: string) => `Do you really want do delete the ${itemType} "${title}"? This cannot be undone.`,
        buttons: {
          cancel: 'Cancel',
          delete: 'Delete',
        },
      },
      companyDialogue: {
        header:      (user: string) => `Restaurants owned by user ${user}`,
        buttons:     {
          ok: 'Ok',
        },
        noCompanies: 'No restaurants found',
      },
    },
  },
};
