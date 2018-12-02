const graphql = require('graphql');
const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema
} = graphql;

const users = [
  {id: '23', firstName: 'tooley', age: 45},
  {id: '65', firstName: 'rew', age: 09876},
]

//defines what will be returned by your query
//In this case, it is requrning a User (called UserType)
const UserType = new GraphQLObjectType({
  name: 'User',
  /*
    these are the fields that will be returned under the
    user -- id, firstName, & age
  */
  fields: {
    /*
      GraphQLString, int are the data types that need to be
      fulfilled in order to allow the query to be successful
    */
    id: { type: GraphQLString},
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt}
  }
});

//the root query is the 'entry point' for GraphQL
//It provides an entry into the graph of data
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  /*

  */
  fields: {
    //name of the returning object (user)
    user: {
      /*
        what data is being returned. it returns the data
        defined in UserType
      */
      type: UserType,
      //args is where the search terms will be formed.
      /*
        specifies what arguments the query will use as an argument
        to find the user.

        In this case it will be id. we also let GQl
        know its data type.

        The query must use id as the key and a string as its value
        to find the user.
      */
      args: {id: {type: GraphQLString}},
      /*
        the resolve is what actually does the fetching from which-
        ever data source it is connected to.

        parentValue is almost never used. It is needed to get to the
        args argument.

        This resolve is returning a javascript object.
      */
      resolve(parentValue, args) {
        return _.find(users, {id: args.id})
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
