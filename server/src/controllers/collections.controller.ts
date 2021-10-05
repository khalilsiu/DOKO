import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import Collections from 'src/db/Collections';
import NFTS from 'src/db/Nfts';
import { CollectionService } from 'src/services/collection.service';

@Controller('collections')
export class CollectionsController {
  constructor(private collectionService: CollectionService) {}

  @Post('index')
  async indexCollections() {
    return await this.collectionService.indexCollections();
  }

  @Get(':address')
  async getCollection(@Param('address') address: string) {
    const coll = new Collections();
    const collection = await coll.findOne({ token_address: address.toLowerCase() });
    return collection;
  }

  @Get(':address/nfts')
  async getNfts(@Param('address') address: string, @Query() query: any) {
    const coll = new NFTS();
    const { offset, direction, term } = query;
    const filter: any = { token_address: address.toLowerCase() };

    if (term) {
      filter.$text = {
        $search: term,
      };
    }

    const nfts = await coll.instance
      .find(filter)
      .sort({ 'metadata.name': +direction || 1, name: +direction || 1, _id: 1 } as any)
      .skip(+offset || 0)
      .limit(12)
      .toArray();
    return nfts;
  }
}
