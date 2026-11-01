-- The mirror row now keys on the Netiiv Account (Keycloak) subject instead of
-- the SOA user id. Existing rows keep their old SOA ids in the renamed column
-- until the person signs in, when the row is adopted by verified email and the
-- subject is written over it (services/keycloakUser.service.ts).
ALTER TABLE "users" RENAME COLUMN "soaId" TO "keycloakId";
ALTER INDEX "users_soaId_key" RENAME TO "users_keycloakId_key";
