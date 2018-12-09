const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;


const CarType = new GraphQLObjectType({
  name: 'Car',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    manufacturer: {type: GraphQLString},
    users: {
      type: new GraphQLList(UserType),
      resolve: (parentValue, args) => axios.get(`http://localhost:3000/cars/${parentValue.id}/users`).then(res => res.data)
    }
  })
})

//defines what will be returned by your query
//In this case, it is requrning a User (called UserType)
const UserType = new GraphQLObjectType({
  name: 'User',
  /*
    these are the fields that will be returned under the
    user -- id, firstName, & age
  */
  fields: () => ({
    /*
      GraphQLString, int are the data types that need to be
      fulfilled in order to allow the query to be successful
    */
    id: { type: GraphQLString},
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt},
    car: {
      type: CarType,
      resolve: (parentValue, args) => axios.get(`http://localhost:3000/cars/${parentValue.carId}`).then(res => res.data)
    }
  })
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

        resolve returns the data that represents a User Object

        parentValue is almost never used. It is needed to get to the
        args argument.

        This resolve is returning a javascript object currently.

        resolve can also return a promise and work in a asyncronous
        manner. Nearly all data being returned will be don in an
        asynchronous fashion. So all data responses WILL be handled
        with a returned promise.

        API/data calls will be made in here within the promise.
      */
      resolve: (parentValue, args) => axios.get(`http://localhost:3000/users/${args.id}`).then(res => res.data)
    },
    car: {
      type: CarType,
      args: {id: {type: GraphQLString}},
      resolve: (parentValue, args) => axios.get(`http://localhost:3000/cars/${args.id}`).then(res => res.data)
    }
  }
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
        carId: {type: GraphQLString}
      },
      resolve: (parentValue, {firstName, age}) => axios.post('http://localhost:3000/users', {firstName, age}).then(res => res.data)
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: (parentValue, {id}) => axios.delete(`http://localhost:3000/users/${id}`).then(res => res.data)
    },
    editUser: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        carId: {type: GraphQLString}
      },
      resolve: (parentValue, args) => axios.patch(`http://localhost:3000/users/${args.id}`, args).then(res => res.data)
    }
  }
})
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})
