export interface ConfirmModal {
  open: boolean;
  title: string;
  subTitle: string;
  onConfirm: () => void;
  type: "approve" | "decline" | "delete";
  buttonLabel: string;
}
export interface Alert {
  id: string;
  msg: string;
  title?: string;
  alertType: string;
}

export interface User {
  id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  photo?: string;
  password?: string;
}
export interface Staff {
  id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  photo?: string;
  password?: string;
}
export interface NewStaff extends Omit<Staff, "id"> {}

export interface Branding {
  id: number;
  primaryColor: string;
  secondaryColor: string;
  darkModeDefault: boolean;
  logoLight?: string;
  logoDark?: string;
  updatedAt: string;
}

export interface NewBranding extends Omit<Branding, "id" | "updatedAt"> {}

export interface Broker {
  id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  photo?: string;
  approved?: boolean;
  password?: string;
  approvedDate?: string;
  serviceExprireDate?: string;
  avilableForWork?: boolean;
  hasCar?: boolean;
  totalPoints?: number;
  services?: Service[];
  Connection?: Connection[];
}

export interface Service {
  id: number;
  name: string;
  description: string;
  serviceRate: number;
  slug?: string;
}
export interface NewService extends Omit<Service, "id"> {}

export interface Topup {
  id: number;
  tx_ref?: string;
  broker?: Broker;
  package?: Package;
}

export interface Package {
  id: number;
  totalDays: number;
  name: string;
  discount: number;
  status: "ACTIVE" | "INACTIVE";
  Topup?: Topup[];
}
export interface NewPackage extends Omit<Package, "id"> {}

export interface Connection {
  id: number;
  user: User;
  broker: Broker;
  service: Service;
  reasonForCancellation?: string;
  status: "ACCEPTED" | "REQUESTED" | "DECLINED" | "CANCELLED";
  locationLongtude: number;
  locationLatitude: number;
  userHasCalled: boolean;
  locationName?: string;
}

export interface ICounterStat {
  labels: string[];
  data: string[];
}

export interface IServiceStat {
  brokersCount: number;
  serviceName: string;
}
