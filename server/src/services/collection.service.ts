import { Controller, Logger } from '@nestjs/common';
import { CollectionsTransactionQueue } from 'src/queue/collections-transaction.queue';
// import InputDataDecoder from 'ethereum-input-data-decoder';
import { COLLECTIONS } from '../constants';
import Collections from '../db/Collections';
import Moralis from '../libs/moralis';
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
        const newMeta = {
          ...collection,
          ...metadata,
          start_ts: +transactions.data.result[0].timeStamp,
          chain,
          token_address: collection.address.toLowerCase(),
        };
        await coll.instance.updateOne(
          {
            token_address: newMeta.token_address,
          },
          {
            $set: newMeta,
          },
          {
            upsert: true,
          },
        );
        await this.collectionTransactionQueue.createJob(newMeta, chain as any);
        const items = await this.nftService.fetchCollectionNFTs(collection.address);

        const owners = {};

        items.forEach(async (item) => {
          // await this.nftMetadata.queueNFTMetadata(item);

          if (!owners[item.owner_of]) {
            owners[item.owner_of] = 0;
          }
          owners[item.owner_of] += 1;
        });

        await coll.instance.updateOne(
          {
            token_address: newMeta.token_address,
          },
          {
            $set: {
              owners: Object.keys(owners).length,
              items: items.length,
            },
          },
        );
      } catch (err) {
        this.logger.error(err);
      }
    }
  }
}
