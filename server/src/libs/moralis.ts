import * as MoralisInstance from 'moralis/node';
import MoralisNode from 'moralis';

MoralisInstance.initialize(process.env.MORALIS_APPLICATION_ID, '', process.env.MORALIS_MASTER_KEY);
MoralisInstance.serverURL = process.env.MORALIS_SERVER_URL;

console.log(MoralisInstance.serverURL);

export default MoralisInstance as MoralisNode;
