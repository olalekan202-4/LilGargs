// src/hooks/useCollectionNFTs.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { PublicKey, Connection } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

/**
 * Custom hook to fetch all NFTs belonging to a specific Solana collection ID
 * by first fetching NFTs owned by a broad account (like the creator or a marketplace account)
 * and then filtering by the collection.
 *
 * @param {PublicKey | null} collectionId The Public Key of the NFT collection (e.g., from LaunchMyNFT).
 * @param {Connection} connection The Solana Connection object.
 * @returns {{nfts: Array<Object>, loading: boolean, error: Error | null, refreshCollectionNFTs: Function}}
 */
export const useCollectionNFTs = (collectionId, connection) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Metaplex instance
  const metaplex = useMemo(() => Metaplex.make(connection), [connection]);

  // IMPORTANT: You might need to change this if your NFTs are not owned by the creator wallet
  // but rather by a specific marketplace wallet or a different "owner" during minting.
  // For LaunchMyNFT, this could be your Creator ID or a common marketplace address.
  // For demonstration, let's assume you want to fetch NFTs owned by the creator wallet,
  // or a general address if they are listed.
  // If you only want to show *all* NFTs in existence for a collection, regardless of owner,
  // this is a more complex problem requiring an indexer (like Helius DAS API, or a custom one).
  // For now, let's use a placeholder if you don't have a specific owner to query,
  // but ideally you'd query a wallet that holds *some* of these collection NFTs initially.
  // Let's use a dummy public key for now for `findAllByOwner` if no specific owner is provided,
  // but if you have a "deployer" or "creator" wallet that might hold unsold NFTs, use that.
  // For general available NFTs for purchase, this method is NOT truly efficient for a large collection
  // as it relies on querying by owner and filtering.
  // The truly efficient way (e.g. for a marketplace) is via DAS API's `searchAssets` with `grouping: collection`.

  const fetchCollectionNFTs = useCallback(async () => {
    if (!collectionId || !(collectionId instanceof PublicKey) || !connection) {
      setNfts([]);
      setLoading(false);
      setError(new Error("Invalid or missing collection ID or connection to fetch NFTs."));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Find all NFTs that are owned by a *known* address.
      // This is a workaround if findAllByCollection is not working directly.
      // For this to be effective for "available" NFTs, you would need
      // to query an address that holds NFTs listed for sale (e.g., a marketplace escrow account,
      // or the original creator's wallet if they hold unsold inventory).
      // Since we don't have a specific marketplace wallet for 'available' NFTs,
      // and querying by a single owner is limited, this will fallback to a more
      // generic fetch that might not yield all "available" NFTs if they are spread
      // across many owners or held by a marketplace.
      // The ideal solution for 'available NFTs' would be the DAS API, which is more advanced.

      // For simplicity and to get *something* working, let's fetch NFTs owned by the creator's wallet
      // as a starting point. Replace this with a more suitable 'owner' if you have one
      // for listed NFTs (e.g., a marketplace program's PDA if you have one).
      // Since you mentioned LaunchMyNFT, the Collection ID itself is not an 'owner'.
      // If you are using LaunchMyNFT, the NFTs are minted to users or transferred to escrow.
      // Fetching all NFTs from a collection directly is not straightforward with findAllByOwner.

      // Let's reconsider. The direct `findAllByCollection` is the ideal.
      // If it's not working, it implies a fundamental version mismatch or API change.
      // Re-examining Metaplex docs, `findAllByCollection` *is* a valid method in recent versions.
      // The error "metaplex.nfts(...).findAllByCollection is not a function" points to the `nfts()`
      // module itself not having that method. This can happen if the Metaplex.make(connection)
      // isn't producing the expected object, or if it's an older build without the correct module.

      // Let's retry with the assumption that the `findAllByCollection` exists,
      // and the previous error was a transient build issue, or a very specific version problem.
      // The `console.log` statements are key here.

      // If it still fails, it could be that your Metaplex instance is missing the `candyMachineModule`
      // or `tokenMetadataModule` which are sometimes dynamically loaded.
      // Let's ensure our Metaplex setup is robust.

      // Re-making Metaplex with explicit modules in App.jsx's ConnectionProvider might help,
      // but for useCollectionNFTs.js, the connection passed should be sufficient.

      // Let's try a direct RPC call with the DAS API if Metaplex SDK functions are failing.
      // This is a more direct way to query the blockchain, bypassing some SDK layers.
      // However, it requires RPC provider support.

      // For now, I'll stick to re-confirming the Metaplex SDK usage as it's the intended path.
      // The only reason `findAllByCollection` would truly be "not a function" is if the version
      // of `@metaplex-foundation/js` is extremely old or corrupted.

      // Let's assume the Metaplex object itself might need its modules attached.
      // However, `Metaplex.make(connection)` usually sets up the default modules.
      // The error is very specific: `findAllByCollection is not a function`.

      // Let's try to get assets by the collection's metadata account using the DAS API if available.
      // This would involve making a direct RPC request.

      // Given the persistent nature of this specific error, and the fact that `findAllByCollection`
      // *should* exist in recent Metaplex JS SDK versions, the problem might be in the environment
      // where the SDK is loaded or its internal modules are initialized.

      // Since the request is to display *available* NFTs from a collection ID,
      // and `findAllByCollection` is the standard method for this, I will
      // re-present the code with the explicit check for `findAllByCollection`
      // and add a suggestion about trying different RPC providers for DAS API
      // if the problem persists.

      // The core issue remains: `findAllByCollection` is not being found.
      // The best solution is to ensure the latest `@metaplex-foundation/js` is installed.
      // If that doesn't work, we might need a fallback or a more direct DAS API call.

      // The previous debugging steps already included `console.log` for `metaplex.nfts()`.
      // If that output *still* doesn't show `findAllByCollection`, it's definitely a version/build issue.

      // Let's add a robust fallback for fetching the collection's NFTs.
      // A common alternative if `findAllByCollection` truly isn't working is to query
      // all NFTs in general (which is resource-intensive) and then filter them by collection.
      // This is not scalable but can confirm if the collection logic works.

      // Instead of `findAllByCollection`, Metaplex also has `searchAssets` (part of DAS API)
      // which allows filtering by collection. This is more efficient.

      // Let's implement the `searchAssets` method using the Metaplex DAS API,
      // as it's the more modern and recommended way for fetching by collection
      // without iterating through all owned NFTs. This requires the RPC node to support DAS.
      // I'll add a check for the DAS RPC method's availability.

      console.log("Attempting to fetch collection NFTs for ID:", collectionId.toBase58());

      // Use metaplex.rpc().searchAssets which leverages the Digital Asset Standard (DAS) API
      // This is the most efficient way to get all NFTs by collection ID if your RPC supports DAS.
      const response = await metaplex.rpc().searchAssets({
        ownership: {
          // This is not owner filter, but global search.
          // The 'grouping' parameter is key for collections.
          // This API method is available through the Metaplex `rpc()` method if the RPC supports it.
        },
        grouping: {
          groupKey: 'collection',
          groupValue: collectionId.toBase58(),
        },
        // pagination: { page: 1, limit: 1000 }, // Adjust limit as needed, default is 1000
        // sortBy: { field: 'createdAt', order: 'asc' }, // Example sorting
      });

      // The DAS API returns assets directly, which may not have `json` loaded.
      // We might need to load metadata for each asset if `response.items` don't contain it.
      const fetchedNFTs = [];
      for (const asset of response.items) {
        // DAS assets typically have the metadata embedded or directly accessible
        if (asset.content && asset.content.metadata) {
            fetchedNFTs.push({
                mintAddress: new PublicKey(asset.id),
                name: asset.content.metadata.name || 'Unknown NFT',
                symbol: asset.content.metadata.symbol || '',
                imageUrl: asset.content.files?.[0]?.uri || asset.content.links?.image || "https://placehold.co/300x300/312e81/ffffff?text=NFT+Error",
                description: asset.content.metadata.description || '',
            });
        } else if (asset.id) { // Fallback if metadata not immediately present
             // Attempt to fetch full metadata if not provided by searchAssets.
             // This can be slower for large collections.
             try {
                const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(asset.id) });
                if (nft.json && nft.json.name) {
                  fetchedNFTs.push({
                    mintAddress: new PublicKey(asset.id),
                    name: nft.json.name,
                    symbol: nft.json.symbol || '',
                    imageUrl: nft.json.image || '',
                    description: nft.json.description || '',
                  });
                }
             } catch (innerErr) {
                console.warn(`Could not load full metadata for asset ${asset.id}:`, innerErr);
                fetchedNFTs.push({
                    mintAddress: new PublicKey(asset.id),
                    name: asset.content?.metadata?.name || 'Unknown NFT',
                    symbol: asset.content?.metadata?.symbol || '???',
                    imageUrl: asset.content?.files?.[0]?.uri || asset.content?.links?.image || "https://placehold.co/300x300/312e81/ffffff?text=NFT+Error",
                    description: asset.content?.metadata?.description || 'Could not load full metadata.',
                });
             }
        }
      }
      setNfts(fetchedNFTs);
    } catch (err) {
      console.error("Failed to fetch collection NFTs via DAS API:", err);
      // Check if the error is due to RPC not supporting DAS API
      if (err.message.includes("Method not found") || err.message.includes("RPC method not supported")) {
        setError(new Error("Your RPC provider does not support the Metaplex DAS API's 'searchAssets' method. Please try a different RPC provider (e.g., Helius, QuickNode, Alchemy with DAS enabled)."));
      } else {
        setError(new Error(`Failed to load collection NFTs: ${err.message || 'Unknown error.'}`));
      }
    } finally {
      setLoading(false);
    }
  }, [collectionId, connection, metaplex]);

  useEffect(() => {
    if (collectionId && connection) {
      fetchCollectionNFTs();
    }
  }, [collectionId, connection, fetchCollectionNFTs]);

  const refreshCollectionNFTs = useCallback(() => {
    fetchCollectionNFTs();
  }, [fetchCollectionNFTs]);

  return { nfts, loading, error, refreshCollectionNFTs };
};
