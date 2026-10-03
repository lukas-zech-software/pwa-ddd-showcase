export type IMarketUrlContext = {
  marketId: string;
};

export type ICompanyUrlContext = {
  companyId: string;
};

export type IDealUrlContext = {
  dealId: string;
} & ICompanyUrlContext;
