export interface ServicePkg {
  title: string;
  price: string;
  priceNote?: string;
  meta: string;
  items: string[];
  featured?: boolean;
  tag?: string;
}

export interface ServiceCallToAction {
  label: string;
  route: string;
  fragment?: string;
}
