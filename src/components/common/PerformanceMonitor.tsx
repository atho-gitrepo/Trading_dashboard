import { useEffect, useRef } from 'react';
import { logger } from '@/utils/logger';

interface PerformanceMonitorProps {
  componentName: string;
  children: React.ReactNode;
}

export function PerformanceMonitor({ componentName, children }: PerformanceMonitorProps) {
  const mountTime = useRef(performance.now());

  useEffect(() => {
    const unmountTime = performance.now();
    const duration = unmountTime - mountTime.current;

    logger.debug(`Component ${componentName} mounted for ${duration.toFixed(2)}ms`);

    return () => {
      const totalDuration = performance.now() - mountTime.current;
      if (totalDuration > 100) {
        logger.warn(`Component ${componentName} was active for ${totalDuration.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  return <>{children}</>;
}
