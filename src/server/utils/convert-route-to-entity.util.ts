const mapping: Record<string, string> = {
  companies: 'company',
  insights: 'insight',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
