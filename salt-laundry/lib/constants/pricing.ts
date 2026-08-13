export const VAT_RATE = 0.18;
// Express surcharge, per the hotel's printed price list ("Express Service: 10%").
export const EXPRESS_RATE = 0.1;

// The surcharge as a whole-number percent, for labels — derived from the rate
// so the two can never disagree, the same way the VAT label is.
export const EXPRESS_RATE_PERCENT = Math.round(EXPRESS_RATE * 100);
