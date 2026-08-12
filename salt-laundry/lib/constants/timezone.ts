// The hotel's own timezone, and the only one that means anything in this app.
//
// Every promise the laundry makes is a wall-clock promise made at the hotel:
// "returned by 7:00 p.m." means 7:00 p.m. in Akagera, not on whichever machine
// happens to be running the server, and not UTC. Deployment moves; the hotel
// does not.
export const HOTEL_TIMEZONE = 'Africa/Kigali'
