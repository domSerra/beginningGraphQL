const expr = require('express');
const exprGQL = require('express-graphql');

const app = expr();

app.use('/graphql', exprGQL({graphiql: true}))

app.listen(4000, () => {
  console.log('listening on 4000');
})
