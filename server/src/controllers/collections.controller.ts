import { Controller, Post } from '@nestjs/common';
import { CollectionService } from 'src/services/collection.service';

@Controller('collections')
export class CollectionsController {
  constructor(private collectionService: CollectionService) {}

  @Post('index')
  async indexCollections() {
    return await this.collectionService.indexCollections();
  }
}
