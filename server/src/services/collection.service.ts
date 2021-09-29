import { Controller, Logger } from '@nestjs/common';
import { CollectionsTransactionQueue } from 'src/queue/collections-transaction.queue';
// import InputDataDecoder from 'ethereum-input-data-decoder';
import { COLLECTIONS } from '../constants';
import Collections from '../db/Collections';
import { Moralis } from '../libs/moralis';
import { apis } from '../libs/scan-api';
import { NftMetadataService } from './nft-metadata.service';
import { NftService } from './nfts.service';

@Controller('collections')
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name);

  constructor(
    private nftMetadata: NftMetadataService,
    private nftService: NftService,
    private collectionTransactionQueue: CollectionsTransactionQueue,
  ) {}

  async indexCollections() {
    const coll = new Collections();

    this.logger.log('Started Indexing collections..');

    for (const collection of COLLECTIONS) {
      try {
        const chain = collection.chain.toLowerCase();
        const metadata = await Moralis.Web3API.token.getNFTMetadata({
          chain: chain as any,
          address: collection.address,
        });
        const transactions = await apis[chain].get('', {
          params: {
            module: 'account',
            action: 'txlist',
            address: collection.address,
            startblock: 0,
            page: 1,
            offset: 1,
            sort: 'asc',
          },
        });
        // console.log(transactions.data.result);
        // const abiRes = await apis[chain].get('', {
        //   params: {
        //     module: 'contract',
        //     action: 'getabi',
        //     address: collection.address,
        //   },
        // });
        // const abi = JSON.parse(abiRes.data.result);
        // this.logger.log(abi);
        // const input = new InputDataDecoder(abi).decodeData(transactions.data.result[0].input);
        // console.log(input);
        await coll.instance.updateOne(
          {
            token_address: collection.address,
          },
          {
            $set: {
              ...metadata,
              ...collection,
              start_ts: transactions.data.result[0].timeStamp,
              chain,
              // abi,
            },
          },
          {
            upsert: true,
          },
        );
        // await this.collectionTransactionQueue.createJob(collection, chain as any);
        // const items = await this.nftService.fetchCollectionNFTs(collection.address);

        // for (const item of items) {
        //   await this.nftMetadata.queueNFTMetadata(item);
        //   break;
        // }
      } catch (err) {
        console.error(err);
      }
    }
  }
}
