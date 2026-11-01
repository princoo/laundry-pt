export interface Brand {
  orgName: string;
  shortName: string;
  appName: string;
  address: string;
  helpLine: string;
  logoSrc: string;
  qrLogoSrc: string;
  appUrl: string;
  locale: string;
  keycloakClientId: string;
}

export const DEFAULT_BRAND: Brand = {
  orgName: "SALT of Akagera",
  shortName: "SALT",
  appName: "SALT Laundry",
  address: "Akagera National Park, Rwanda",
  helpLine: "Need help? Dial 0 for the front desk.",
  logoSrc: "/salt-logo.png",
  qrLogoSrc: "/qrcode-logo.png",
  appUrl: "http://localhost:3000",
  locale: "en_RW",
  keycloakClientId: "soa.laundry",
};
