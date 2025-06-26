// src/hooks/useSolanaNFTs.js
import { useState, useEffect, useCallback } from 'react';
import { PublicKey, Connection } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { Metaplex } from '@metaplex-foundation/js';

// This hook fetches all NFTs owned by a given public key on Solana
export const useSolanaNFTs = (ownerPublicKey, connection) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Metaplex instance only once
  const metaplex = Metaplex.make(connection);

  const fetchNFTs = useCallback(async () => {
    // This internal check prevents attempting to fetch if ownerPublicKey or connection is invalid
    if (!ownerPublicKey || !(ownerPublicKey instanceof PublicKey) || !connection) {
      setNfts([]);
      setLoading(false);
      // Set a user-friendly error message indicating wallet connection is needed
      setError(new Error("Please connect your wallet to view NFTs."));
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // Find all token accounts owned by the public key
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        ownerPublicKey,
        { programId: new PublicKey('H5KHCaQj619M8VxBh1aFkTMQ9yfCrkaF9Db581UREHJ6') } // SPL Token Program ID
      );

      const mintAddresses = [];
      for (const account of tokenAccounts.value) {
        const tokenAmount = account.account.data.parsed.info.tokenAmount;
        // Filter for tokens with a supply of 1 and decimals of 0, typically indicating an NFT
        if (tokenAmount.uiAmount === 1 && tokenAmount.decimals === 0) {
          mintAddresses.push(new PublicKey(tokenAmount.mint));
        }
      }

      // Fetch metadata for each identified NFT mint address
      const fetchedNFTs = [];
      for (const mintAddress of mintAddresses) {
        try {
          const nft = await metaplex.nfts().findByMint({ mintAddress });
          // Ensure it's an NFT or SFT and has valid URI/name
          if ((nft.model === 'nft' || nft.model === 'sft') && nft.json && nft.json.name) {
            fetchedNFTs.push({
              mintAddress: mintAddress,
              name: nft.json.name,
              symbol: nft.json.symbol || '',
              imageUrl: nft.json.image || '', // Use the image from JSON metadata
              description: nft.json.description || '',
              // Add more fields from nft.json if needed
            });
          }
        } catch (nftError) {
          console.warn(`Could not fetch metadata for NFT ${mintAddress.toBase58()}:`, nftError);
          // Optionally add a placeholder for failed metadata fetches
          fetchedNFTs.push({
            mintAddress: mintAddress,
            name: 'Unknown NFT',
            symbol: '???',
            imageUrl: "https://placehold.co/300x300/312e81/ffffff?text=NFT+Error",
            description: 'Could not load metadata.',
          });
        }
      }
      setNfts(fetchedNFTs);
    } catch (err) {
      console.error("Failed to fetch NFTs:", err);
      // Set a generic error for actual network/fetching failures
      setError(new Error(`Failed to fetch NFTs: ${err.message || 'Unknown error.'}`));
    } finally {
      setLoading(false);
    }
  }, [ownerPublicKey, connection, metaplex]); // Dependencies for useCallback

  useEffect(() => {
    // This useEffect will re-run when ownerPublicKey or connection changes.
    // It will trigger fetchNFTs only when ownerPublicKey is valid.
    fetchNFTs();
  }, [ownerPublicKey, connection, fetchNFTs]); // Depend on fetchNFTs (which is memoized with useCallback)

  // Provide a way to refresh NFTs manually (e.g., after a mint)
  const refreshNFTs = useCallback(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return { nfts, loading, error, refreshNFTs };
};
