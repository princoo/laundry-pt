// One page size for every listing in the app- request queues, catalogue, users.
export const DEFAULT_PAGE_SIZE = 10;

// Ceiling on a client-supplied ?limit, so a hand-edited URL can't ask for the
// whole table in one query.
export const MAX_PAGE_SIZE = 100;
