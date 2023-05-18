const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Person = require('./models/person')
const { GraphQLError } = require('graphql')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB', error.message)
  })

const typeDefs = `
    type User {
      username: String!
      friends: [Person!]!
      id: ID!
    }

    type Token {
      value: String!
    }

    type Mutation {
      addPerson(
        name: String!
        phone: String
        street: String!
        city: String!
      ): Person
      editNumber(
        name: String!
        phone: String!
      ): Person
      createUser(
        username: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
    }

    type Address {
      city: String! 
      street: String!
    }
    type Person {

      name: String!
      phone: String
      address: Address!
      id: ID!
    }

    enum YesNo {
      YES
      NO
    }

    type Query {
      personCount: Int!
      allPersons(phone: YesNo): [Person!]!
      findPerson(name: String!): Person
      me: User
    }
`

const resolvers = {
  Query: {
    personCount: () => async () => Person.collection.countDocuments(),
    allPersons: (root, args) => {
      if (!args.phone) {
        return Person.find({})
      }

      return Person.find({ phone: { $exists: args.phone === 'YES' } })
    },
    findPerson: (root, args) => Person.findOne({ name: args.name }),
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      }
    },
  },
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args })

      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Saving person failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      return person
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone

      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Saving number failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      return person
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
