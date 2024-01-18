export default async (req, context) => {
  const data = await fetch(`https://api.sandbox.immutable.com/v1/chains/imtbl-zkevm-testnet/collections/${process.env.CONTRACT_ADDRESS}/nfts/refresh-metadata`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-immutable-api-key': process.env.IMMUTABLE_API_KEY
    },
    body: await req.text()
  }).then(res => res.json());

  return Response.json({ data }, { status: 200 });
};
