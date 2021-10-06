import * as Queue from 'bee-queue';
import Address from 'src/db/Address';
import { BaseQueue } from './base.queue';

export abstract class NftBaseQueue extends BaseQueue {
  constructor(
    queueName: string,
    config: Queue.QueueSettings = {
      prefix: 'doko',
      removeOnSuccess: true,
      removeOnFailure: true,
    },
  ) {
    super(queueName, config);
  }

  protected async updateProgress(index: number, total: number, address: string) {
    const addressCollection = new Address();

    const status = await addressCollection.findOne({
      address,
    });
    const sync_progress = Math.floor((index / total) * 100);

    if (status.sync_progress > sync_progress) {
      return;
    }

    if (index === total) {
      await addressCollection.updateOne(
        { address },
        {
          sync_status: 'done',
          sync_progress: 0,
          timestamp: Date.now() / 1000,
        },
      );
    } else {
      await addressCollection.updateOne(
        { address },
        {
          sync_status: 'progress',
          sync_progress,
          timestamp: Date.now() / 1000,
        },
      );
    }
  }
}
