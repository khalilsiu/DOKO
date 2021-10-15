import { Controller, Get, Param } from '@nestjs/common';
import Address from 'src/db/Address';

@Controller('address')
export class AddressController {
  @Get(':address')
  async getAddress(@Param('address') address: string) {
    const collection = new Address();
    const data = await collection.findOne({ address });
    return data;
  }
}
