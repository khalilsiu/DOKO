export const isValidHttpUrl = (string: string) => {
  let url: URL;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

export const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const isOpenseaNFT = (nft: any) =>
  nft.token_uri && nft.token_uri.includes('api.opensea.io');
