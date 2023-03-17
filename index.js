const express = require("express");
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require("dotenv").config;
app.use(cors())
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const port = process.env.PORT || 5000;

// console.log(process.env)

app.get("/", (req, res) => {
    res.send({ "name": "Hasan" })
});



// const uri = `mongodb+srv://${process.env.SECRET_USER_ID}:${process.env.SECRET_PASS}@cluster0.di4ojvf.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const uri = "mongodb+srv://Practice-gQL:cKrPm0nkc7QEtyDP@cluster0.mj4ed9j.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Practice-gQL
// cKrPm0nkc7QEtyDP
var somthing = {}
const run = async () => {
    const serviceCollection = client.db("gQL-first").collection('product');

    app.get('/short', async (req, res) => {
        const query = {};
        const services = serviceCollection.find(query);
        const result = await services.toArray();
        res.send(result)
    })


    var schema = buildSchema(`
type Query {
  hello: String,
  name: String,
  dat: [product]
}
type product{
    _id: String,
    description: String,
    img: String,
    price: String,
    title: String,
}
type Mutation{
  upProduct(
      title: String,
      price: String,
      img: String
  ): products
}

type products{
  title: String,
  price: String,
  img: String
}
`);

    const root = {
        hello: () => {
            return "Hello GraphQL, your are rock"
        },
        name: () => {
            const ct = "Hello Hasan Bhai"
            return ct
        },
        upProduct: (args) => {
            
            const res = {
                title: args.title,
                price: args.price,
                img: args.img
            }
            // console.log(res)
            somthing = res
            return somthing
        },
        dat: async () => {
            const query = {};
            const services = serviceCollection.find(query);
            const result = await services.toArray();
            return result
        }

    }

    // setting Graphql
    app.use("/graphql", graphqlHTTP({
        schema,
        rootValue: root,
        graphiql: true
    }))
}



run().catch(err => console.log(err))

app.listen(port, () => {
    console.log("GraphQL server is running")
})