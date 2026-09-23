export const DASHBOARD_ROUTES = Object.freeze({
  citizen: "/citizen/dashboard",
  admin: "/admin/dashboard",
  worker: "/worker/dashboard",
  superadmin: "/superadmin/dashboard",
});

export function getDashboardPath(role) {
  return DASHBOARD_ROUTES[role] || DASHBOARD_ROUTES.citizen;
}
