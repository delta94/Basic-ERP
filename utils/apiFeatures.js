class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

  /** Search
   * 
   * /api/v1/user?name=Tran&price[gte]=10
   * 
   * Aims -->
   * {
   *    name: "Tran",
   *    price: {
   *      $gte: 10
   *    }
   * }
   * 
   */
	filter() {
		// Create a copy of query Object
		const queryObj = Object.assign({}, this.queryString);
		/* ------   EXCLUDE FILTER -------- */
		// Exclude these params out of request
		const excludeFields = ['page', 'sort', 'limit', 'fields'];
		excludeFields.forEach(el => delete queryObj[el]);
		/* -------------------------------- */

		/* ------   ADVANCED FILTER ------- */
		/*TODO transform ['gte','gt','lte','lt'] -> ['$gte','$gt','$lte','$lt']*/
		// 1st, stringify the object

		let advancedQuery = JSON.stringify(queryObj);

		// 2nd, replace with Regex
		advancedQuery = advancedQuery.replace(
			/\b(gte|gt|lte|lt)\b/g,
			match => `$${match}`
		);

		this.query = this.query.find(JSON.parse(advancedQuery));

		return this;
	}

	sort() {
		if (this.queryString.sort) {
			//apply multiple sorting
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		}
		//Otherwise, sort by datetime created
		else {
			this.query = this.query.sort('-createdAt');
		}

		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(',').join('-');
			this.query = this.query.select(fields);
		}
		// By default, don't send back the __v to the client
		else {
			this.query = this.query.select('-__v');
		}

		return this;
	}

	paginate() {
		const page = this.queryString.page * 1; //NOTE convert a string into a number
		const limit = this.queryString.limit * 1 || 100;
		const skip = (page - 1) * limit;

		// pagination
		/* Mongoose 
				+ query.skip(), will ignore the first N values 
				+ query.limit(), will ignore the rest after N values
		*/
		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

module.exports = APIFeatures;
