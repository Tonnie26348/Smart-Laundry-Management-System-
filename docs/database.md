# Database Design

PostgreSQL is the source of truth for the Smart Laundry Management System.

## Schema Overview
The database uses a normalized relational model. Primary keys are `UUID`s generated via `uuid-ossp`.

## Core Entities
- **profiles:** Extends `auth.users`, stores user roles (admin, manager, staff, delivery, customer).
- **services:** Definitions of laundry services and base pricing.
- **laundry_items:** Specific clothing items linked to services.
- **customers:** Extended customer profile info (phone, address, loyalty).
- **orders:** Primary transaction entity.
- **order_items:** Line items per order.
- **audit_logs:** Activity tracking.

## Security
- All sensitive tables are protected by Row Level Security (RLS). Policies are defined to restrict data access based on user role and ownership.

## Audit Fields
- Every table includes `created_at` (default NOW()).
- Most tables include `updated_at` (default NOW()).
- `audit_logs` tracks table changes.
