const express = require('express');
const path = require('path');
const app = express();
const Sentry = require('@sentry/node');
const { faker } = require('@faker-js/faker');

Sentry.init({
    dsn: "https://005cd7c891fcdbd722d0a84302352d46@o4506854488932352.ingest.us.sentry.io/4506855684440064",
    integrations: [
      new Sentry.Integrations.Express({app}),
    ],
    tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use((req, res, next) => {
    setTimeout(next, 5000); // Delay by 5000 milliseconds, or 5 seconds
});


app.use(express.static(path.join(__dirname, './dist')));
app.get("/user", (req, res) => {
    res.json({
        id: faker.string.uuid(),
        email: faker.internet.email(),
    });
});
app.get("/debug-sentry", (req, res) => {
    throw new Error("My first Sentry error!");
  });

app.use(Sentry.Handlers.errorHandler());

app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(3001, () => console.log('Server listening on port 3001'));
