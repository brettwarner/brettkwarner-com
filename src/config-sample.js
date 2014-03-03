module.exports = {
	siteName: "Brett Warner",
	siteAuthor: "Brett Warner",
	DBurl : "mongodb://USERNAME:PASSWORD@mongo.onmodulus.net:12345/XYXAH",
	hashSecret: 'hashsecret',

	// You shouldn't need to change anything below here

	monOptions : {
		server:{
			auto_reconnect: true,
			poolSize: 10,
			socketOptions:{
				keepAlive: 1
			}
		},
		db: {
			numberOfRetries: 10,
			retryMiliSeconds: 1000
		}
	}
}
