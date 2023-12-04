export interface IShopifyVariantOption {
  name: string;
  value: string;
}

export interface IFeaturedImage {
  alt: string;
  aspect_ratio: number;
  height: number;
  url: string;
  width: number;
}

export interface IShopifyQuantityRule {
  min: number | null;
  max: number | null;
  increment: number;
}

export interface IShopifyCartItem {
  id: number;
  handle: string;
  vendor: string;
  variant_title: string;
  options_with_values: IShopifyVariantOption[];
  variant_options: string[];
  product_description: string;
  product_title: string;
  requires_shipping: boolean;
  product_type: string;
  product_has_only_default_variant: boolean;
  gift_card: boolean;
  taxable: boolean;
  image: string;
  product_id: number;
  variant_id: number;
  key: string;
  properties: Record<string, string>;
  quantity: number;
  url: string;
  title: string;
  original_price: number;
  final_price: number;
  final_line_price: number;
  discounted_price: number;
  line_price: number;
  original_line_price: number;
  total_discount: number;
  discounts: string[];
  sku: string;
  grams: number;
  price: number;
  featured_image?: IFeaturedImage;
  url_to_remove: string;
  line_level_total_discount: number;
  quantity_rule: IShopifyQuantityRule;
  has_components: boolean;
  currency: string;
  items_subtotal_price: number;
  // cart_level_discount_applications: any[];
  // line_level_discount_allocations: any[];
}

export interface IShopifyCart {
  items: IShopifyCartItem[];
  token: string;
  note: string;
  attributes: Record<string, string>;
  original_total_price: number;
  total_price: number;
  total_discount: number;
  total_weight: number;
  item_count: number;
  items_subtotal_price: number;
}
