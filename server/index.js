const express = require('express');
const {ApolloServer} = require('@apollo/server')
const { expressMiddleware } = require("@apollo/server/express4")
const cors = require('cors')
const { default: axios } = require("axios");

// const {USERS} = require ("./user")
// const {TODOS} = require("./todo")

let TODOS = [
  { id: '1', title: 'Learn GraphQL', completed: false, userId: '1' },
  { id: '2', title: 'Build Apollo App', completed: false, userId: '2' },
];

const USERS = [
  { id: '1', name: 'Alice', username: 'alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', username: 'bob', email: 'bob@example.com' },
];

async function startServer(){
    const app = express();
    const server = new ApolloServer({
          typeDefs: `

          type User{
            id: ID!
            name: String!
            username: String!
            email: String!
           }

           type Todo{
            id: ID!
            title: String!
            completed: Boolean
            user: User
           }

           input TodoInput {
              userId: ID!
              title: String!
              completed: Boolean
           }

           input TodoInput2 {
            
            title: String!
           
         }

           type Query {
               getToDos : [Todo]
               getUsers:[User]
               getUser(id: ID!):User
           }

           type Mutation {
            addTodo(input : TodoInput!) : Todo
            updateTodo(id: ID!, input : TodoInput2!) : Boolean
            deleteTodo(id:ID!): Boolean
           }
          `,
          resolvers: {
            Todo:{
                user: (todo)=>
                USERS.find((e) => e.id == todo.userId)
            },
            Query: {
              getToDos: () => TODOS,
              getUsers: () => USERS,
              getUser: (perent,{id}) => USERS.find((e) => e.id == id),
            },
            Mutation:{
              addTodo: (_,{input}) =>{
                const newTodo = {
                  id: String(TODOS.length+1),
                  ...input
                };
                TODOS.push(newTodo);
                return newTodo;
              },
          

            updateTodo: (_,{id,input}) =>{
              const index = TODOS.findIndex((todo)=> id==todo.id);
              TODOS[index] = { ...TODOS[index], ...input };
              return true;
            },
          

          deleteTodo: (_,{id}) =>{
            const index = TODOS.findIndex((todo)=> id==todo.id);
            TODOS.splice(index,1);
            return true;
          }
        
            },
          }
    });

    

    await server.start();

    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server)
      );

    app.listen(8000,() => console.log("server started at port 8000"))
}


startServer()