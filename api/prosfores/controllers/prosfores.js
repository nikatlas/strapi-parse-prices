'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
	updateDB: async (ctx) => {
	    const count = await strapi.services.prosfores.traverseFiles(async(file) => {
	    	// console.log(file);
	    	if(file.ext === ".bin"){
	    		await strapi.services.prosfores.parseFile(file);
	    		await strapi.services.prosfores.deleteFile(file);
	    	}
		});
		console.log("UP? ");
		ctx.send('Up? ');
	}
};
