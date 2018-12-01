const expr = require('express');
const exprGQL = require('express-graphql');

const schema = require('./schema/schema');

const app = expr();

app.use('/graphql', exprGQL({
  schema,
  graphiql: true
}))

app.listen(4000, () => {
  console.log('Listening on 4000');
})
