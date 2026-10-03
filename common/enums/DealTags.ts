export type DealTags = DealTagsDish | DealTagsRegion | DealTagsType | DealTagsDrinks;

export enum DealTagsDish {
  Burger      = 'Burger',
  Sushi       = 'Sushi',
  Pizza       = 'Pizza',
  Salat       = 'Salat',
  Doener      = 'Doener',
  Pasta       = 'Pasta',
  Steak       = 'Steak',
  Meeresfruechte = 'Meeresfruechte',
  // Fisch          = 'Fisch',
  Kuchen      = 'Kuchen',
  // Sandwich       = 'Sandwich',
  Currywurst  = 'Currywurst',
  Pommes      = 'Pommes',
  Falafel     = 'Falafel',
  Teigtaschen = 'Teigtaschen',
  Bowl        = 'Bowl',
}

export enum DealTagsRegion {
  Italienisch = 'Italienisch',
  Mexikanisch = 'Mexikanisch',
  Mediterran    = 'Mediterran',
  Asiatisch = 'Asiatisch',
  Griechisch    = 'Griechisch',
  Indisch = 'Indisch',
  Japanisch = 'Japanisch',
  Tuerkisch = 'Türkisch',
  Deutsch = 'Deutsch',
  Belgisch = 'Belgisch',
  Vietnamesisch = 'Vietnamesisch',
  Franzoesisch = 'Franzoesisch',
  Amerikanisch = 'Amerikanisch',
  Persisch = 'Persisch',
  Chinesisch = 'Chinesisch',
  Libanesisch = 'Libanesisch',
  Argentinisch = 'Argentinisch',
  Afrikanisch = 'Afrikanisch',
}

export enum DealTagsType {
  Vegetarisch = 'Vegetarisch',
  Vegan = 'Vegan',
  Gesundes = 'Gesundes',
  // eslint-disable-next-line @typescript-eslint/camelcase
  Gut_Buergerlich = 'Gut_Bürgerlich',
  // eslint-disable-next-line @typescript-eslint/camelcase
  // Low_Carb        = 'Low_Carb',
  Bio = 'Bio',
  Glutenfrei = 'Glutenfrei',
  Laktosefrei = 'Laktosefrei',
  Buffet = 'Büfett',
  FastFood = 'Fast Food',
  Fruehstuck = 'Fruehstuck',
  Mittagessen = 'Mittagessen',
  Abendessen = 'Abendessen',
}

export enum DealTagsDrinks {
  Cocktails = 'Cocktails',
  Coffee = 'Coffee',
  Tea = 'Tea',
  Wine = 'Wine',
  Beer = 'Beer',
  Softdrinks = 'Softdrinks',
  Water = 'Water',
}

export const AllDealTags: any = {
  ...DealTagsDish,
  ...DealTagsRegion,
  ...DealTagsType,
  ...DealTagsDrinks,
};
