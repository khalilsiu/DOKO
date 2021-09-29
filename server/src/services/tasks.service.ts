import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NftService } from './nfts.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private nftService: NftService) {}

  @Cron('0 */1 * * *')
  async updateNFTs() {
    this.logger.log('[updateNFTsMetadata] start');
    await this.nftService.updateNFTs();
    this.logger.log('[updateNFTsMetadata] end');
  }
}
