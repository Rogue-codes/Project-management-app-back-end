const express = require("express")
const cors = require("cors")
const colors = require("colors")
const dotenv = require("dotenv");
const connect = require("./config/db");
const { graphqlHTTP  } = require("express-graphql");
const schema = require("./schema/schema")
const app = express();

app.use(express.json());
app.use(cors());
dotenv.config()
// connect to databases
connect()
const port = process.env.PORT || 5000;

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV = "development"
}))
app.listen(port, console.log(`app is running on port ${port}`));
