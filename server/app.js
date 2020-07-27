const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const AppError = require('./utils/appError');
const indexRouter = require('./routes/index');
const customersRoute = require('./routes/customersRoute');
const crawlersRoute = require('./routes/crawlersRoute');
const productsRoute = require('./routes/productsRoute');
const fxRoute = require('./routes/fxRoute');
const ordersRoute = require('./routes/ordersRoute');
const stockingRoute = require('./routes/stockingRoute');
const globalErrorHandler = require('./controllers/errorController');
const financeRoute = require('./routes/financesRoute');
const adminRoute = require('./routes/adminRoute');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
console.log('checked');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/customer', customersRoute);
app.use('/api/v1/crawler', crawlersRoute);
app.use('/api/v1/product', productsRoute);
app.use('/api/v1/fx', fxRoute);
app.use('/api/v1/order', ordersRoute);
app.use('/api/v1/stock', stockingRoute);
app.use('/api/v1/finance', financeRoute);
app.use('/api/v1/admin', adminRoute);

/* -------------ERROR HANDLERS MIDDLEWARE---------------*/
// If not handle by other router, implement 404 Router
app.all('*', (req, res, next) => {
  /* NOTE Express will assume anything inside next() as an error
	it will skip all middlewares in middleware statck, and Handling with
	global error handler */
  if (!res.headersSent) {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  }

  // Additional middleware can put here
  res.end();
});

// Error Middleware Handler
app.use(globalErrorHandler);
/* -----------------------------------------------------*/

module.exports = app;
