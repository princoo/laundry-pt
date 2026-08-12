// The header SOA sends its provisioning key in. Named here rather than inline
// so the two provisioning routes and any future SOA-facing endpoint cannot
// drift apart on the spelling.
export const SOA_API_KEY_HEADER = 'x-soa-api-key'
