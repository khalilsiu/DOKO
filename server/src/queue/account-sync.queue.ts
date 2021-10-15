import { Injectable } from '@nestjs/common';
import { fetchAccountNFTs } from 'src/helpers/nfts';
import { NftMetadataService } from 'src/services/nft-metadata.service';
import Address from '../db/Address';
import { BaseQueue } from './base.queue';

@Injectable()
export class AccountSyncQueue extends BaseQueue {
  constructor(private nftMetadata: NftMetadataService) {
    super('AccountSync');
    this.setupQueue();
  }

  setupQueue() {
    super.setupQueue();

    this.queue.on('ready', () => {
      this.logger.log(`ready`);

      this.queue.process(10, async (job) => {
        const addressCollection = new Address();
        this.logger.log(`NFT Sync Start: ${job.id}`, job.data);
        const { address } = job.data;

        await addressCollection.updateOne(
          { address },
          {
            sync_status: 'progress',
            sync_progress: 0,
            timestamp: Date.now() / 1000,
          },
        );
        const nfts = await fetchAccountNFTs(address).then((items) =>
          items.sort((a, b) => {
            if (a.name && b.name) {
              return a.name > b.name ? 1 : -1;
            }

            if (a.name && !b.name) {
              return 1;
            }

            if (!a.name && b.name) {
              return -1;
            }

            return a.token_address > b.token_address
              ? 1
              : a.token_address < b.token_address
              ? -1
              : a.token_id > b.token_d
              ? 1
              : -1;
          }),
        );

        this.logger.log(`${address} - ${nfts.length}`);

        if (!nfts.length) {
          await addressCollection.updateOne(
            { address },
            {
              sync_status: 'empty',
              sync_progress: 0,
              timestamp: Date.now() / 1000,
            },
          );
          return;
        }

        nfts.forEach((nft, index) => {
          this.nftMetadata.queueNFTMetadata(nft, index, nfts.length - 1);
        });
      });
    });
  }
}
