import { register } from '../../lib/jobs/job-registry.js';
import { container } from '../../lib/di/container.js';
import { AssignmentService } from './service/assignment.service.js';
import { TOKENS } from '../../lib/di/tokens.js';
import { logger } from '../../lib/logger/logger.js';
import { env } from '../../lib/config/env.js';

export function registerAssignmentJobs(): void {
  const cronExpression = `${env.delivery.assignmentTickSec} */${env.delivery.assignmentTickMin} * * * *`;

  register({
    name: `assignment-tick`,
    cron: cronExpression,
    handler: async () => {
      const assignmentService = container.resolve<AssignmentService>(TOKENS.AssignmentService);
      const result = await assignmentService.tickRegion();
      console.log(result, 'result from tick region');
      if (result.processed > 0) {
        logger.info('assignment.tick processed successfully', { ...result });
      }
    },
  });
}
