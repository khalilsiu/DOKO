import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenseaQueue } from './queue/opensea.queue';
import { SingleNftQueue } from './queue/single-nft.queue';
import { NftMetadataService } from './services/nft-metadata.service';
import { AccountSyncQueue } from './queue/account-sync.queue';
import { CollectionService } from './services/collection.service';
import { NftService } from './services/nfts.service';
import { TasksService } from './services/tasks.service';
import { MoralisHookController } from './controllers/moralis-hook.controller';
import { NftsController } from './controllers/nfts.controller';
import { AddressController } from './controllers/address.controller';
import { NftController } from './controllers/nft.controller';
import { CollectionsController } from './controllers/collections.controller';
import { CollectionsTransactionQueue } from './queue/collections-transaction.queue';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [
    AppController,
    MoralisHookController,
    CollectionsController,
    NftsController,
    NftController,
    AddressController,
  ],
  providers: [
    AppService,
    OpenseaQueue,
    SingleNftQueue,
    NftMetadataService,
    AccountSyncQueue,
    CollectionService,
    NftService,
    TasksService,
    CollectionsTransactionQueue,
  ],
})
export class AppModule {}
