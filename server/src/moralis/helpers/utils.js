module.exports = {
  isValidHttpUrl: string => {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
  },
  wait: time => new Promise(resolve => setTimeout(resolve, time)),
  isOpenseaNFT: nft => nft.token_uri.includes('api.opensea.io')
};
