import { Logger } from '@nestjs/common';
import * as Queue from 'bee-queue';

export abstract class BaseQueue {
  protected readonly logger: Logger;
  public readonly queue: Queue;

  constructor(
    queueName: string,
    config: Queue.QueueSettings = {
      prefix: 'doko',
      removeOnSuccess: true,
      removeOnFailure: true,
    },
  ) {
    this.logger = new Logger(queueName);
    this.queue = new Queue(queueName, config);
  }

  setupQueue() {
    this.queue.on('job succeeded', (jobId) => {
      this.logger.log(`JOB ${jobId} - SUCCESS\n`);
    });

    this.queue.on('job retrying', (jobId, error) => {
      this.logger.error(`JOB ${jobId} - RETRYING\n`, error);
    });

    this.queue.on('job failed', (jobId, error) => {
      this.logger.log(`JOB ${jobId} - FAILED\n`, error);
    });

    this.queue.on('error', (err) => {
      this.logger.error(`ERROR\n`, err);
    });
  }
}
