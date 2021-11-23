import OpenSeaAPI from '../../libs/opensea-api';
import { formatTx, sortTxsByDates } from '../../libs/utils';

export const fetchNFTOpensea = async (address: string, id: string) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  OpenSeaAPI.get(`/asset/${address}/${id}`);

export const fetchOpenSeaEvents = async (
  asset_contract_address: string,
  token_id: string,
  offset: number,
  limit: number,
  event_types: string[],
) => {
  const promises = [] as any;
  // eslint-disable-next-line no-restricted-syntax
  for (const eventType of event_types) {
    promises.push(
      OpenSeaAPI.get('/events', {
        params: {
          only_opensea: false,
          asset_contract_address,
          token_id,
          offset,
          limit,
          event_type: eventType,
        },
      }),
    );
  }
  try {
    const events: any = await Promise.all(promises);
    const merged_events = [
      ...events[0].data.asset_events,
      ...events[1].data.asset_events,
      ...events[2].data.asset_events,
    ];
    const formatted = merged_events.map((event: any) => formatTx(event, 'eth'));
    const sorted = sortTxsByDates(formatted);
    return sorted;
  } catch (err) {
    //   eslint-disable-next-line no-console
    console.error(err);
    return [];
  }
};

export default fetchOpenSeaEvents;
