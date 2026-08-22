# Security

The system employs a multi-layered security strategy:

1. **Authentication**: Supabase Auth (`auth.users`) is the sole source of truth.
2. **Authorization**: PostgreSQL Row Level Security (RLS) is strictly enforced on all tables. 
3. **Audit**: Sensitive administrative actions are automatically captured in `public.audit_logs`.
4. **Data Isolation**: RLS policies ensure strict data isolation between roles (e.g., customers can only access their own data).
5. **Secret Management**: No secrets are stored in the database or frontend; these must be managed via secure environment/secret management systems.
