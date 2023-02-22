module.exports = {
	images: {
		unoptimized: true,
	},
	env: {
		GH_TOKEN: "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",
		DOMAIN_NAME: "https://beta.imageproof.ai",
	},

	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.target = "electron-renderer";
		}

		return config;
	},
};
