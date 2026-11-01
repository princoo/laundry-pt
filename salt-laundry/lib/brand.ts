import { DEFAULT_BRAND, type Brand } from "@/lib/constants/brand";
import { APP_URL, KEYCLOAK_CLIENT_ID } from "@/lib/constants/auth";


const env = (name: string) => process.env[name]?.trim() || undefined;

export function getBrand(): Brand {
  const orgName = env("ORG_NAME") ?? DEFAULT_BRAND.orgName;
  const shortName =
    env("ORG_SHORT_NAME") ??
    (orgName === DEFAULT_BRAND.orgName ? DEFAULT_BRAND.shortName : orgName);
  return {
    orgName,
    shortName,
    appName: env("APP_NAME") ?? `${shortName} Laundry`,
    address: env("ORG_ADDRESS") ?? DEFAULT_BRAND.address,
    helpLine: env("GUEST_HELP_LINE") ?? DEFAULT_BRAND.helpLine,
    logoSrc: env("BRAND_LOGO_URL") ?? DEFAULT_BRAND.logoSrc,
    qrLogoSrc: env("BRAND_QR_LOGO_URL") ?? DEFAULT_BRAND.qrLogoSrc,
    appUrl: APP_URL || DEFAULT_BRAND.appUrl,
    locale: env("APP_LOCALE") ?? DEFAULT_BRAND.locale,
    keycloakClientId: KEYCLOAK_CLIENT_ID,
  };
}
