# Database Design

PostgreSQL is the source of truth.

- **Normalization:** Mandatory.
- **Security:** RLS (Row Level Security) is required for all tables.
- **Migration:** All schema changes must be applied via Supabase migrations.
