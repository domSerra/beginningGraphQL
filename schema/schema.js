const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString},
    firstname: {type: GraphQLString},
    age: {type: GraphQLInt}
  }
});
