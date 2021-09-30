import { Injectable } from '@nestjs/common';
import { components } from 'moralis/types/generated/web3Api';
import { fromWei } from 'web3-utils';

import Transaction from 'src/db/Transaction';
import Moralis from 'src/libs/moralis';
import { BaseQueue } from './base.queue';
import Collections from 'src/db/Collections';

@Injectable()
export class CollectionsTransactionQueue extends BaseQueue {
  constructor() {
    super(CollectionsTransactionQueue.name);
    this.setupQueue();
  }

  setupQueue() {
    super.setupQueue();

    this.queue.on('ready', () => {
      this.logger.log(`ready`);
      this.process();
    });
  }

  async createJob(collection: any, chain: components['schemas']['chainList']) {
    const existing = await this.queue.getJob(collection.address);

    if (existing) {
      await this.queue.removeJob(existing.id);
    }
    await this.queue
      .createJob({
        collection,
        chain,
      })
      .setId(collection.address)
      .save();
  }

  private async indexTransactions(collection: any, chain: components['schemas']['chainList']) {
    const trCollection = new Transaction();
    let allTransactions = await trCollection.find({});

    while (1) {
      const res = await Moralis.Web3API.token.getContractNFTTransfers({
        chain,
        address: collection.token_address,
        offset: allTransactions.length,
        limit: 1000,
        order: 'block_timestamp.ASC',
      });
      if (res.result.length) {
        await trCollection.instance.insertMany(res.result);
      }
      allTransactions = allTransactions.concat(res.result);

      if (res.total <= allTransactions.length) {
        break;
      }
    }
    const totalVolume = allTransactions.reduce((sum, t) => +fromWei(t.value, 'ether') + sum, 0);
    const coll = new Collections();

    await coll.instance.updateOne(
      {
        token_address: collection.token_address,
      },
      {
        $set: {
          total_volume: totalVolume,
        },
      },
    );
  }

  private process() {
    this.queue.process(2, async (job) => {
      this.logger.log(job.data, `${job.id} [start]`);

      try {
        await this.indexTransactions(job.data.collection, job.data.chain);
      } catch (err) {
        this.logger.error(err, `${job.id} [error]`);
      }
    });
  }
}
