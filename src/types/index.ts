export type CampusLocation = {
  id: string;
  name: string;
  cluster: 'North Campus' | 'South Campus' | 'Greater Noida' | 'Sonipat';
  hostels: string[];
  nextPickupDay: string;
  ambassadorName: string;
};

export type BagSizeOption = {
  size: 'small' | 'medium' | 'bulk';
  label: string;
  itemCountDesc: string;
  itemMin: number;
  itemMax: number;
  avgPayoutCash: number;
  avgPayoutCredit: number;
  bagColor: string;
};

export type GarmentCondition = 'Mint' | 'Excellent' | 'Good';

export type ThriftProduct = {
  id: string;
  title: string;
  brand: 'Zara' | 'H&M' | 'Savana' | 'Uniqlo' | "Levi's" | 'Urbanic' | 'Bershka' | 'Mango';
  category: 'Outerwear' | 'Tops & Knitwear' | 'Bottoms & Denim' | 'Co-ords' | 'Dresses';
  originalPrice: number;
  thriftPrice: number;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  condition: GarmentCondition;
  campusOrigin: string;
  material: string;
  aiVerificationScore: number;
  sanitizationBatch: string;
  steamTreatedAt: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  styleType: 'oversized_jacket' | 'knit_sweater' | 'vintage_denim' | 'utility_cargo' | 'streetwear_hoodie' | 'pleated_skirt';
  tags: string[];
  inStock: boolean;
  featured?: boolean;
};

export type CartItem = {
  product: ThriftProduct;
  quantity: number;
};

export type PickupBooking = {
  id: string;
  campusId: string;
  campusName: string;
  hostelDorm: string;
  contactName: string;
  phone: string;
  upiId?: string;
  bagSize: 'small' | 'medium' | 'bulk';
  estimatedItems: number;
  estimatedPayout: number;
  payoutMethod: 'upi' | 'store_credit';
  slotDate: string;
  slotTime: string;
  status: 'scheduled' | 'assigned' | 'in_transit' | 'appraised' | 'paid';
  createdAt: string;
};

export type RouteStop = {
  id: string;
  campus: string;
  hostelName: string;
  bagsCount: number;
  scheduledTime: string;
  ambassador: string;
  status: 'pending' | 'in_progress' | 'completed';
  payoutTotal: number;
};

export type RoutePlan = {
  id: string;
  zone: string;
  date: string;
  totalBags: number;
  totalEstPayout: number;
  efficiencyScore: number;
  estimatedCostPerBag: number;
  stops: RouteStop[];
};

export type UnitEconomics = {
  monthlyRevenueTarget: number;
  monthlyRevenueCurrent: number;
  contributionMarginTarget: number;
  contributionMarginCurrent: number;
  pickupCostTarget: number;
  pickupCostCurrent: number;
  sellThroughTarget: number;
  sellThroughCurrent: number;
  totalBagsLiquidated: number;
  totalCashDisbursed: number;
  activeAmbassadors: number;
  litersWaterSaved: number;
  kgCarbonDiverted: number;
};

export type AppraisalDemoResult = {
  brand: string;
  category: string;
  estimatedRetail: number;
  payoutCash: number;
  payoutCredit: number;
  conditionGrade: GarmentCondition;
  seamIntegrity: number;
  fabricPurity: string;
  turnaroundEstimate: string;
};
