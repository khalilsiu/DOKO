import { Injectable } from '@nestjs/common';
import { setMetadata } from 'src/helpers/nfts';
import { NftBaseQueue } from './nft-base.queue';

@Injectable()
export class OpenseaQueue extends NftBaseQueue {
  constructor() {
    super('OpenseaQueue');
    this.setupQueue();
  }

  setupQueue() {
    super.setupQueue();

    this.queue.on('ready', () => {
      this.logger.log(`ready`);

      this.queue.process(1, async (job) => {
        const { index, total, ...nft } = job.data;
        this.logger.log(job.data, `${job.id} [start]`);

        try {
          await setMetadata(job.data);
        } catch (err) {
          this.logger.error(err, `${job.id} [error]`);
        }

        if (index && total) {
          this.updateProgress(index, total, nft.owner_of);
        }
      });
    });
  }
}
