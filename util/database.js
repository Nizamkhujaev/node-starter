const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "imagine_somelink";

let _db; 

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const mongoConnect = async (cb) => {
  try {
    await client.connect();
    _db = client.db();
    await client.db("admin").command({ ping: 1 });
    cb()
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err)
    throw err;
  }
}

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw "No database found!"; 
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;