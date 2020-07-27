const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('../models/ordersModel');
const Product = require('../models/productsModel');
const Customer = require('../models/customersModel');
const { path } = require('../app');

dotenv.config({ path: '../config.env' });

/**
 * Make connection to MongoDB
 *
 *
 */
let DB = process.env.DATABASE;

// Fill username
DB = DB.replace('<DATABASE_USERNAME>', process.env.DATABASE_USERNAME);

// Fill password
DB = DB.replace('<DATABASE_PASSWORD>', process.env.DATABASE_PASSWORD);

// Some option dealing with Deprecation
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connection successful');
  });

// Read JSON FILE

// const reviews = JSON.parse(
// 	fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

// IMPORT DATA INTO DB
// const importData = async () => {
// 	try {
// 		await Tour.create(tours);
// 		await User.create(users, { validateBeforeSave: false });
// 		await Review.create(reviews);
// 		console.log('Data successfully loaded!');
// 		process.exit();
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

// DELETE ALL DATA FROM DB
// const deleteData = async () => {
// 	try {
// 		await Tour.deleteMany({});
// 		await Review.deleteMany({});
// 		await User.deleteMany({});

// 		console.log('Data successfully deleted!');
// 		process.exit();
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

// if (process.argv[2] === '--import') {
// 	importData();
// } else if (process.argv[2] === '--delete') {
// 	deleteData();
// }

// console.log(process.argv);
const scripting = async () => {
  const aggregate = await Order.aggregate([
    {
      // Find all orders that are pending
      $match: {
        status: 'pending'
      }
    },
    {
      // Destructuring the Array Element into separate Object
      $unwind: '$products'
    },
    {
      // Group item based on "products._id"
      $group: {
        _id: '$products._id',
        tobuy: { /* Each product, we increase 1 */ $sum: '$products.quantity' },
        customers: {
          $push: {
            _id: '$customer',
            quantity: '$products.quantity'
          }
        }
      }
    }
  ]).exec(async function (err, results) {
    // let data = await Product.populate(results, {path: '_id'});
    // data = await Customer.populate(data, {path: 'customer._id'})
    console.log(results);
    process.exit();
  });
};

scripting();
