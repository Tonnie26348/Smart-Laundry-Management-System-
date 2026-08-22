# Database Architecture

The Smart Laundry Management System utilizes PostgreSQL (via Supabase) as the authoritative backend.

## Schema Overview
- **Authentication**: `auth.users` linked to `public.profiles`.
- **Core Entities**: Customers, Employees, Services, Orders, Payments, Inventory.
- **Financials**: Invoices, Receipts, Loyalty, Discounts.
- **Security**: Row Level Security (RLS) is strictly enforced on all operational tables.
- **Performance**: Targeted indexing on frequently queried foreign keys, statuses, and timestamps.
