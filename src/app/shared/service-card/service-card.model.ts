export interface ServicePkg {
  title: string;
  price: string;
  priceNote?: string;
  meta: string;
  items: string[];
  featured?: boolean;
  tag?: string;
}

export interface ServiceCta {
  label: string;
  route: string;
  fragment?: string;
}
