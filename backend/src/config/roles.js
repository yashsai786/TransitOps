/**
 * TransitOps - Centralized Roles and Permissions Configuration
 * Defines standardized role identifiers, granular permission strings,
 * and role-to-permission mappings for the platform.
 */

export const ROLES = {
  FLEET_MANAGER: 'fleet_manager',
  DISPATCHER: 'dispatcher',
  SAFETY_OFFICER: 'safety_officer',
  FINANCIAL_ANALYST: 'financial_analyst'
};

export const PERMISSIONS = {
  // Dashboard & System
  DASHBOARD_READ: 'dashboard:read',

  // Vehicle Registry
  VEHICLES_READ: 'vehicles:read',
  VEHICLES_MANAGE: 'vehicles:manage',

  // Driver Compliance & Safety
  DRIVERS_READ: 'drivers:read',
  DRIVERS_MANAGE: 'drivers:manage',
  DRIVERS_SAFETY_READ: 'drivers:safety:read',
  DRIVERS_COMPLIANCE_READ: 'drivers:compliance:read',
  COMPLIANCE_READ: 'compliance:read',

  // Trip Management & Dispatch
  TRIPS_READ: 'trips:read',
  TRIPS_CREATE: 'trips:create',
  TRIPS_DISPATCH: 'trips:dispatch',
  TRIPS_UPDATE: 'trips:update',
  TRIPS_MANAGE: 'trips:manage',

  // Maintenance & Shop Orders
  MAINTENANCE_READ: 'maintenance:read',
  MAINTENANCE_MANAGE: 'maintenance:manage',

  // Fuel, Expenses & Reporting
  FINANCE_READ: 'finance:read',
  FUEL_READ: 'fuel:read',
  EXPENSES_READ: 'expenses:read',
  REPORTS_READ: 'reports:read'
};

export const ROLE_DEFINITIONS = {
  [ROLES.FLEET_MANAGER]: {
    name: ROLES.FLEET_MANAGER,
    description: 'Executive authority over fleet assets, driver assignments, maintenance, and analytics',
    permissions: [
      PERMISSIONS.DASHBOARD_READ,
      PERMISSIONS.VEHICLES_READ,
      PERMISSIONS.VEHICLES_MANAGE,
      PERMISSIONS.DRIVERS_READ,
      PERMISSIONS.DRIVERS_MANAGE,
      PERMISSIONS.DRIVERS_SAFETY_READ,
      PERMISSIONS.DRIVERS_COMPLIANCE_READ,
      PERMISSIONS.COMPLIANCE_READ,
      PERMISSIONS.TRIPS_READ,
      PERMISSIONS.TRIPS_CREATE,
      PERMISSIONS.TRIPS_DISPATCH,
      PERMISSIONS.TRIPS_UPDATE,
      PERMISSIONS.TRIPS_MANAGE,
      PERMISSIONS.MAINTENANCE_READ,
      PERMISSIONS.MAINTENANCE_MANAGE,
      PERMISSIONS.FINANCE_READ,
      PERMISSIONS.FUEL_READ,
      PERMISSIONS.EXPENSES_READ,
      PERMISSIONS.REPORTS_READ
    ]
  },
  [ROLES.DISPATCHER]: {
    name: ROLES.DISPATCHER,
    description: 'Vehicle and driver dispatching, route scheduling, and live trip status management',
    permissions: [
      PERMISSIONS.DASHBOARD_READ,
      PERMISSIONS.VEHICLES_READ,
      PERMISSIONS.DRIVERS_READ,
      PERMISSIONS.TRIPS_READ,
      PERMISSIONS.TRIPS_CREATE,
      PERMISSIONS.TRIPS_DISPATCH,
      PERMISSIONS.TRIPS_UPDATE
    ]
  },
  [ROLES.SAFETY_OFFICER]: {
    name: ROLES.SAFETY_OFFICER,
    description: 'Driver safety scores, licence validity verification, and regulatory compliance monitoring',
    permissions: [
      PERMISSIONS.DASHBOARD_READ,
      PERMISSIONS.DRIVERS_READ,
      PERMISSIONS.DRIVERS_SAFETY_READ,
      PERMISSIONS.DRIVERS_COMPLIANCE_READ,
      PERMISSIONS.COMPLIANCE_READ,
      PERMISSIONS.VEHICLES_READ
    ]
  },
  [ROLES.FINANCIAL_ANALYST]: {
    name: ROLES.FINANCIAL_ANALYST,
    description: 'Operational expenses, fuel accounting, maintenance costs, and ROI analytics',
    permissions: [
      PERMISSIONS.DASHBOARD_READ,
      PERMISSIONS.FINANCE_READ,
      PERMISSIONS.FUEL_READ,
      PERMISSIONS.EXPENSES_READ,
      PERMISSIONS.MAINTENANCE_READ,
      PERMISSIONS.REPORTS_READ
    ]
  }
};

