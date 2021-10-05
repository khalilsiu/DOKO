import { Controller, Get, InternalServerErrorException, Logger, Param } from '@nestjs/common';
import axios from 'axios';
import NFTS from 'src/db/Nfts';
import { NftsController } from './nfts.controller';

@Controller('nft')
export class NftController {
  private readonly logger = new Logger(NftsController.name);

  @Get('eth/events/:address/:id/:offset/:limit')
  async fetchEvents(
    @Param('address') address: string,
    @Param('id') id: string,
    @Param('offset') offset: number,
    @Param('limit') limit: number,
  ) {
    try {
      const res = await axios.get(
        `https://api.opensea.io/api/v1/events?&asset_contract_address=${address}&token_id=${id}&only_opensea=false&offset=${offset}&limit=${limit}`,
      );
      return res.data;
    } catch (err) {
      this.logger.error(err, 'fetchEvents');
      throw new InternalServerErrorException(err);
    }
  }

  @Get('eth/lastsale/:address/:id')
  async fetchLastSale(@Param('address') address: string, @Param('id') id: string) {
    try {
      const res = await axios.get(`https://api.opensea.io/api/v1/asset/${address}/${id}`);
      return res.data;
    } catch (err) {
      this.logger.error(err, 'fetchLastSale');
      throw new InternalServerErrorException(err);
    }
  }

  @Get(':address/:id')
  async getNFT(@Param('address') address: string, @Param('id') id: string) {
    const collection = new NFTS();
    const query = {
      token_address: address.toLowerCase(),
      token_id: id.toString(),
    };
    return await collection.findOne(query);
  }
}
