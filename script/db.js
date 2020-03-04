const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('../models/customersModel');
dotenv.config({ path: '../config.env' });

const DB = process.env.DATABASE.replace(
	'<DATABASE_PASSWORD>',
	process.env.DATABASE_PASSWORD
);

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
const createIndex = async () => {
  let indexList = await Customer.listIndexes();
  await Customer.createIndexes({name: 'text'});
  console.log(indexList);
  console.log('Index Created!');
  process.exit();
}

createIndex();

