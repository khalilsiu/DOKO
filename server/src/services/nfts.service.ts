import { Injectable, Logger } from '@nestjs/common';
import { Moralis } from '../libs/moralis';
import { CHAINS } from '../constants';
import NFTS from 'src/db/Nfts';
import { NftMetadataService } from './nft-metadata.service';
import { AccountSyncQueue } from 'src/queue/account-sync.queue';

@Injectable()
export class NftService {
  private readonly logger = new Logger(NftService.name);

  constructor(
    private nftMetadata: NftMetadataService,
    private accountSyncQueue: AccountSyncQueue,
  ) {}

  async fetchCollectionNFTs(address: string, chain?: string) {
    if (chain && !CHAINS.includes(chain)) {
      return [];
    }
    const chains = chain ? [chain] : CHAINS;

    try {
      let all = [];

      for (const chain of chains) {
        let nfts = [];

        while (1) {
          const { total, result } = await Moralis.Web3API.token.getNFTOwners({
            address,
            chain: chain as any,
          });
          nfts = nfts.concat(result);

          if (nfts.length >= total) {
            nfts = nfts.map((nft) => ({ ...nft, chain }));
            break;
          }
        }
        all = all.concat(nfts);
      }
      return all;
    } catch (err) {
      this.logger.error('fetchCollectionNFTs:\n', err);
      return [];
    }
  }

  async updateNFTs(address?: string) {
    console.log('updateNFTs:', address);
    const query = { metadata_updated: false };

    if (address) {
      query['owner_of'] = address;
    }
    const collection = new NFTS();
    const nfts = await collection.find(query);
    this.logger.log('updateNFTs: ', nfts.length);

    for (const nft of nfts) {
      await this.nftMetadata.queueNFTMetadata(nft);
    }
  }

  async processSyncNFTsJob(address: string) {
    await this.accountSyncQueue.queue.createJob({ address }).setId(address).retries(2).save();
  }

  async syncNFTs(address: string, address_status: any) {
    try {
      switch (address_status.sync_status) {
        case 'empty':
          return;
        case 'progress':
          const job = await this.accountSyncQueue.queue.getJob(address);

          if (job) {
            this.logger.log('syncNFTs [IN PROGRESS] -', job.data);
            return;
          }
          await this.processSyncNFTsJob(address);
          return;
        case 'done':
          return;
        case 'new':
          await this.processSyncNFTsJob(address);
          return;
      }
    } catch (err) {
      this.logger.error('syncNFTs:', err);
    }
  }
}
