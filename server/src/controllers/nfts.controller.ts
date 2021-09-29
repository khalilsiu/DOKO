import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { NftService } from 'src/services/nfts.service';
import Address from '../db/Address';
import NFTS from '../db/Nfts';
import { Moralis } from '../libs/moralis';

@Controller('nfts')
export class NftsController {
  private readonly logger = new Logger(NftsController.name);

  constructor(private nftService: NftService) {}

  @Get()
  async filterNFTs(@Query() queryParam: any) {
    this.logger.log(queryParam);
    const { offset, address, token_address, chain, term, direction } = queryParam;
    const collection = new NFTS();
    const query: any = {};

    address && (query.owner_of = address.toLowerCase());
    token_address && (query.token_address = token_address);

    if (chain) {
      query.chain = {
        $in: chain,
      };
    }

    if (term) {
      query.$text = {
        $search: term,
      };
    }

    const items = await collection.instance
      .find(query)
      .sort({
        'metadata.name': +direction || 1,
        name: +direction || 1,
        _id: 1,
      } as any)
      .skip(+offset || 0)
      .limit(12)
      .toArray();

    return items;
  }

  @Post('index')
  async indexNFTs(@Body() body: any) {
    const { address, reindex } = body;

    this.logger.log(`indexCollections: ${address}`);

    for (const chain of ['Eth', 'Bsc', 'Polygon']) {
      Moralis.Cloud.run(`watch${chain}Address`, {
        address,
      });
    }

    let status: any;

    try {
      const collection = new Address();

      if (reindex) {
        const nftsCollection = new NFTS();
        await Promise.all([
          collection.deleteOne({ address }),
          nftsCollection.deleteMany({ address }),
        ]);
      } else {
        status = await collection.findOne({ address });
      }

      if (!status) {
        status = {
          address,
          sync_status: 'new',
          sync_progress: 0,
          last_error: null,
        };
        await collection.insertOne(status);
      }
    } catch (err) {
      this.logger.error('Address Status get Error:', err);
    }

    await this.nftService.syncNFTs(address, status);
    // await
    return { success: true, message: 'Successfully indexed' };
  }
}
