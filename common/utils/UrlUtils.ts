export function replaceUmlauts(value: string): string {
  value = value.replace(/Ä/g, 'Ae');
  value = value.replace(/ä/g, 'ae');

  value = value.replace(/Ö/g, 'Oe');
  value = value.replace(/ö/g, 'oe');

  value = value.replace(/Ü/g, 'ue');
  value = value.replace(/ü/g, 'ue');

  value = value.replace(/ß/g, 'ss');

  value = value.replace(/"'`´“„/g, '');

  value = value.replace(/&/g, 'und');

  value = value.replace(/É/g, 'E');
  value = value.replace(/é/g, 'e');

  value = value.replace(/Â/g, 'A');
  value = value.replace(/â/g, 'a');

  return value;
}

export function urlSafe(value: string): string {
  if (value === undefined) {
    return '';
  }

  value = value.toLowerCase();
  value = replaceUmlauts(value);
  value = value.replace(/\W/g, '-');

  return encodeURIComponent(value);
}

type SeoCompany = {
  id: string;
  title: string;
  city: string;
};

export function getCompanySeoUrl(company: SeoCompany, route: string): string {
  const basePath  = route.toString().replace(':companyId', company.id),
        seoString = `${urlSafe(company.title)}-${urlSafe(company.city)}`;

  return `${basePath}/${seoString}`;
}
