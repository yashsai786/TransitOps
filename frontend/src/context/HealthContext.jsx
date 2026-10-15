import { HealthContext } from './healthContextDef.js';
import { useHealthCheck } from '../hooks/useHealthCheck.js';

/**
 * Context Provider component
 */
export const HealthProvider = ({ children }) => {
  const health = useHealthCheck(true);

  return (
    <HealthContext.Provider value={health}>
      {children}
    </HealthContext.Provider>
  );
};
