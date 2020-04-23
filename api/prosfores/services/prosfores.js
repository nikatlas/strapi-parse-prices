'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */
var path = require('path');

const ABS_PATH = __dirname + "/../../../public";

const csv = require('csv-parser')
const fs = require('fs')
// const results = [];
 
// fs.createReadStream('data.csv')
//   .pipe(csv())
//   .on('data', (data) => results.push(data))
//   .on('end', () => {
//     console.log(results);


module.exports = {
	parseFile: async (file) => {
		const {
			url
		} = file;

		const results = [];
 		
 		console.log(ABS_PATH + url);
		fs.createReadStream(ABS_PATH + url)
		  .pipe(csv())
		  .on('data', async(data) => {
		  	let {
		  		ItemID,
		  		Price,
		  		Company,
		  		Auction,
		  		Date
		  	} = data;

		  	const exists = await strapi.query('prosfores').findOne({ 
		  		ItemID,
		  		company: Company,
		  		auction: Auction
		  	});

		  	if(exists) { 
		  		console.log("exists");
		  		console.log(exists);
		  	} else {
		  		console.log(exists);
        		await strapi.query('prosfores').create({
        			ItemID,
			  		company: Company,
			  		auction: Auction,
			  		price: Price,
			  		date: Date
        		});
		  	}



		  })
		  .on('end', () => {
		    console.log("Finished");
		});

	},
	traverseFiles: async (callback) => {
		const perPage = 100;
	    const count = await strapi.plugins.upload.services.upload.count();
		const pages = count/perPage;
		let results = [];
	    for(var i = 0; i < pages; i++) {
	    	results = results.concat(
	    		await	strapi.plugins.upload.services.upload
	    		.fetchAll({_start: i*perPage, _limit: perPage})
	    	);
	    }
	    for(var j = 0; j < count; j++) {
	    	const image = results[j];
	    	await callback(image);
	    }	
	    return count;
	},

	deleteFile: async(image) => {
		const config = await strapi
	      .store({
	        environment: strapi.config.environment,
	        type: 'plugin',
	        name: 'upload',
	      })
	      .get({ key: 'provider' });
		return await strapi.plugins.upload.services.upload.remove(image, config);
	}
};
