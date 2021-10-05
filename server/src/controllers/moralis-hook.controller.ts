import { BadRequestException, Body, Controller, Logger, Post } from '@nestjs/common';
import { NftMetadataService } from 'src/services/nft-metadata.service';
import NFTS from '../db/Nfts';
import Moralis from '../libs/moralis';

@Controller('webhooks')
export class MoralisHookController {
  private readonly logger = new Logger(MoralisHookController.name);

  constructor(private nftMetadata: NftMetadataService) {}

  @Post('nft-transfer')
  async afterSaveNftTransactions(@Body() body: any) {
    this.logger.log('afterSaveNftTransactions:', body);

    const {
      object: { to_address, token_address, token_id, className },
    } = body;

    const addressClassMapping = {
      EthNFTTransfers: 'Eth',
      BscNFTTransfers: 'Bsc',
      PolygonNFTTransfers: 'Polygon',
    };

    if (!addressClassMapping[className]) {
      throw new BadRequestException({ error: 'unsupported chain' });
    }
    const collection = new NFTS();
    const query = { token_id, token_address };

    if (to_address === '0x000000000000000000000000000000000000dEaD') {
      await collection.deleteOne(query);
      return { success: true };
    }

    try {
      const nft = await Moralis.Web3API.token.getTokenIdMetadata({
        address: token_address,
        token_id,
        chain: addressClassMapping[className].toLowerCase(),
      });
      await this.nftMetadata.queueNFTMetadata(nft);
    } catch (err) {
      this.logger.error('afterSaveNftTransactions [WEBHOOK]', err);
      return { success: false, token_id, token_address };
    }
    return { success: true };
  }
}
