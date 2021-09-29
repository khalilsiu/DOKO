import { Injectable } from '@nestjs/common';
import { SingleNftQueue } from 'src/queue/single-nft.queue';
import { isOpenseaNFT } from '../libs/utils';
import { OpenseaQueue } from '../queue/opensea.queue';

@Injectable()
export class NftMetadataService {
  constructor(
    private openseaQueue: OpenseaQueue,
    private nftQueue: SingleNftQueue,
  ) {}

  async queueNFTMetadata(nft: any) {
    const q = isOpenseaNFT(nft) ? this.openseaQueue : this.nftQueue;
    const jobId = `${nft.token_address}_${nft.token_id}`;

    if (await q.queue.getJob(jobId)) {
      return;
    }
    await q.queue.createJob(nft).setId(jobId).save();
  }
}
