const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const URI = process.env.URI

const connectDb = async () =>{
    const Connection = await mongoose.connect(URI,{

    }).then(() =>{
        console.log(`mongo DB connection successful`.cyan.underline.bold)
    }).catch((err) => {
        console.log("an error occured: ", err.message);
      });
}

module.exports = connectDb