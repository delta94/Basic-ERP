class APIFeatures {
  /**
   * This class enhance the FETCH controllers & API features,
   *  it allows you to
   *
   *  + filter - You can find all records with specified filter
   *    such as (name, location, address...)
   *
   *  E.g: Find all Places, which satisfy
   *
   *  {
   *    name: "Waterfall"
   *  }
   *  --------------
   *
   *  + sort - You can sort all records ascendingly or descendingly by specific key
   *
   *  E.g: Find all Places and sort by (name, date)
   *  --------------
   *
   *  + limit fields - You can find all records, but return only a few keys data
   *
   *  E.g: Find all Places but only return (name, email)
   *
   *  --------------
   *
   *  + pagination - When you have so many records, you only want to returns page 1 or page 2
   *
   *  --------------
   * @param {*} query - Instance of Query that interact with Moongoose using "await"
   * @param {Object} queryParams - The params go after ? on url. It is called query
   *
   * E.g:  /api/v1/place?name="Waterfall"&phone="0915216321"
   *
   *  --------------
   * @author Quang Van Tran (Lusanney)
   */
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }

  /**
   * Filter function that allow to search by specific filter,
   *  including Keys or Comparision ($gte, $gt, $lte, $lt)
   *
   * @returns {FetchAPIFeatures} return the same class for further features
   * @author Quang Van Tran (Lusanney)
   */
  filter() {
    // Create a copy of query Object
    const queryObj = { ...this.queryParams };

    /* ------   EXCLUDE FILTER -------- */
    // Exclude these params out of request
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    /* -------------------------------- */

    /* ------   ADVANCED FILTER ------- */
    /* TODO perform full text search for key "name" if exists in the query */
    /*
        {                          {
          name: "Water"     -->      $text: {$search: "Water"}
        }                          }
    */
    if (queryObj.name) {
      // save the value
      const nameQuery = queryObj.name;

      // delete the name object
      delete queryObj.name;

      // add a new one with newer format
      queryObj.$text = { $search: nameQuery };
    }
    // -------------------------------------

    /* ------   ADVANCED FILTER ------- */
    /* TODO transform ['gte','gt','lte','lt'] -> ['$gte','$gt','$lte','$lt'] */
    // 1st, stringify the object
    let advancedQuery = JSON.stringify(queryObj);

    // 2nd, replace with Regex
    advancedQuery = advancedQuery.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // -------------------------------------

    // Attach the query with the advancedQuery to the Query Instance
    this.query = this.query.find(JSON.parse(advancedQuery));

    // Return this class, for further features
    return this;
  }

  /**
   * Sorting function that will sort the records ascendingly & descendingly
   *  based on specific Key. If you want Descendingly, specify a minus sign "-"
   *
   * E.g Sort by (name, date)
   * @returns {FetchAPIFeatures} return the same class for further features
   * @author Quang Van Tran (Lusanney)
   */
  sort() {
    // If params Sort is specified
    if (this.queryParams.sort) {
      // Apply multiple sorting. Convert  "name,email,phone" --> "name email phone"
      const sortBy = this.queryParams.sort.split(',').join(' ');

      // attach the feature to the Query Instance
      this.query = this.query.sort(sortBy);
    }
    // Otherwise, sort by datetime created
    else {
      this.query = this.query.sort('-createdAt');
    }

    // Return the class for further features
    return this;
  }

  /**
   * Limit Fields function that will only return whatever KEY you specify
   *
   * E.g Limit Fields (name, email) only return (name, email)
   *
   * @returns {FetchAPIFeatures} return the same class for further features
   * @author Quang Van Tran (Lusanney)
   */
  limitFields() {
    // If QueryParams includes the limit fields
    if (this.queryParams.fields) {
      // Convert "email,name,phone" --> "email name phone"
      const fields = this.queryParams.fields.split(',').join(' ');

      // Attach the features to the Query Instance, only select the Keys specified
      this.query = this.query.select(fields);
    }

    return this;
  }

  /**
   * Pagination function that will only return the page you specified
   *  when the records are too large and too many records, server only
   *  return the 1st page (around 20 records), or the page you specified
   *
   * E.g Pagination and send back the Page 3
   *
   * @returns {FetchAPIFeatures} return the same class for further features
   * @author Quang Van Tran (Lusanney)
   */
  paginate() {
    // If QueryParams includes the page fields
    if (this.queryParams.page) {
      const page = this.queryParams.page * 1; // NOTE convert a string into a number
      const limit = this.queryParams.limit * 1 || 10;
      const skip = (page - 1) * limit;

      // pagination
      /* Mongoose 
          + query.skip(), will ignore the first N values 
          + query.limit(), will ignore the rest after N values
      */
      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }
}

module.exports = APIFeatures;
