-- Application Roles Enum
CREATE TYPE app_role AS ENUM (
    'administrator',
    'manager',
    'laundry_staff',
    'delivery_staff',
    'customer'
);
