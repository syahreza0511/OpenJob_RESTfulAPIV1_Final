const express = require('express');

const app = express();


// Middleware JSON

app.use(express.json());


// Routes

const authenticationRoutes = require('./routes/authentications');

const usersRoutes = require('./routes/users');

const companiesRoutes = require('./routes/companies');

const jobsRoutes = require('./routes/jobs');

const applicationsRoutes = require('./routes/applications');

const bookmarksRoutes = require('./routes/bookmarks');

const categoriesRoutes = require('./routes/categories'); // Ditambahkan untuk rute kategori
const profileRoutes = require('./routes/profile');


// Error Handler

const errorHandler = require('./middleware/errorHandler');


// Authentication Route

app.use(
    '/authentications',
    authenticationRoutes
);


// Users Route

app.use(
    '/users',
    usersRoutes
);


// Companies Route

app.use(
    '/companies',
    companiesRoutes
);


// Categories Route

app.use(
    '/categories',
    categoriesRoutes
); // Ditambahkan agar rute /categories tidak 404


// Jobs Route

app.use(
    '/jobs',
    jobsRoutes
);


// Applications Route

app.use(
    '/applications',
    applicationsRoutes
);


// Bookmarks Route

app.use(
    '/bookmarks',
    bookmarksRoutes
);


// Profile Route

app.use('/profile', profileRoutes);


// Error Handler

app.use(errorHandler);


module.exports = app;