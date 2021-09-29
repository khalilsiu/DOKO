import { Injectable } from '@nestjs/common';
import { setMetadata } from 'src/helpers/nfts';
import { BaseQueue } from './base.queue';

@Injectable()
export class SingleNftQueue extends BaseQueue {
  constructor() {
    super(SingleNftQueue.name, {
      prefix: 'doko',
      removeOnSuccess: true,
      removeOnFailure: true,
    });
    this.setupQueue();
  }

  setupQueue() {
    super.setupQueue();
    this.queue.on('ready', () => {
      this.logger.log(`ready`);

      this.queue.process(24, async (job) => {
        this.logger.log(`${job.id}: Start`, job.data);
        await setMetadata(job.data);
      });
    });
  }
}
