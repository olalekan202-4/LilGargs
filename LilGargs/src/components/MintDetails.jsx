// src/components/MintDetails.jsx
import { motion } from "framer-motion";

const MintDetails = ({ launchpadInfo, collectionNfts, loading, error }) => {
  // Show a loading state while data is being fetched.
  if (loading && !launchpadInfo) {
    return (
      <div className="text-center p-10 min-h-[300px] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-500 mx-auto"></div>
      </div>
    );
  }

  // Show an error message if the API call failed.
  if (error) {
    return (
      <div className="text-center p-10 bg-red-900/20 rounded-lg">
        <p className="text-sm text-gray-400 mt-2">Reload your Browser</p>
      </div>
    );
  }

  const {
    projectName,
    projectImageUrl,
    projectDescription,
    supply,
    publicPhaseStart,
  } = launchpadInfo || {};

  const mintedCount = Array.isArray(collectionNfts) ? collectionNfts.length : 0;
  const availableSupply = supply ? supply - mintedCount : "N/A";

  // UPDATED FUNCTION TO CORRECTLY HANDLE THE DATE
  const formatDate = (dateInSeconds) => {
    if (!dateInSeconds || dateInSeconds === 0) return "TBA";
    // Multiply by 1000 to convert seconds to milliseconds
    const date = new Date(dateInSeconds * 1000);
    return date.toLocaleString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="container mx-auto p-4 sm:p-6 lg:p-8 my-12 bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700/50"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-1 flex justify-center"
        >
          <img
            src={projectImageUrl}
            alt={`${projectName || "Project"} cover`}
            className="w-64 h-64 rounded-xl object-cover shadow-lg border-2 border-purple-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/300x300/312e81/ffffff?text=Image";
            }}
          />
        </motion.div>
        <div className="md:col-span-2 text-center md:text-left">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {projectName || "NFT Project"}
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            {projectDescription || "No description available."}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-lg mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700/50 p-4 rounded-lg transition-transform"
            >
              <span className="font-bold text-cyan-400">Available:</span>
              <span className="ml-2 text-white font-mono">
                {availableSupply}
              </span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700/50 p-4 rounded-lg transition-transform"
            >
              <span className="font-bold text-purple-400">Total Supply:</span>
              <span className="ml-2 text-white font-mono">
                {supply || "N/A"}
              </span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700/50 p-4 rounded-lg transition-transform"
            >
              <span className="font-bold text-emerald-400">Public Mint:</span>
              <span className="ml-2 text-white">
                {formatDate(publicPhaseStart)}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MintDetails;
