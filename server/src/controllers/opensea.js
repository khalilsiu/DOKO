const axios =  require('axios');

const controller = {
	fetchEvents: async(req, res) => {
		const {address, id, offset, limit} = req.params;
		try {
			let _r = await axios.get(`https://api.opensea.io/api/v1/events?&asset_contract_address=${address}&token_id=${id}&only_opensea=false&offset=${offset}&limit=${limit}`);
			return res.json(_r.data);
		}
		catch(e){
			console.log(e);
		}
	},
	fetchLastSale: async(req, res) => {
		const {address, id} = req.params;
		let _r = await axios.get(`https://api.opensea.io/api/v1/asset/${address}/${id}`);
		return res.json(_r.data);
	}

}

module.exports = controller; 
