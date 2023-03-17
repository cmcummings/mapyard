import MongoStore from "connect-mongo";
import mongoose, { Schema } from "mongoose";
import { MONGO_CONN_STRING, MONGO_DB_NAME } from "./env";

export const MongoSessionStore = MongoStore.create({
  mongoUrl: MONGO_CONN_STRING,
  dbName: "mapyard"
})


mongoose.connect(MONGO_CONN_STRING, {
  dbName: "mapyard",
});


const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

export const User = mongoose.model("User", UserSchema);


const MapSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    default: "Untitled map"
  },
  public: {
    type: Boolean,
    default: false
  },
  objects: {
    type: {
      nodes: {
        type: [{ x: Number, y: Number }],
        default: [],
        required: true
      },
      roads: {
        type: [{ 
          start: Number, 
          end: Number, 
          direction: String, 
          label: String 
        }],
        default: [],
        required: true
      },
      buildings: {
        type: [Schema.Types.Mixed],
        default: [],
        required: true
      }
    },
    required: true,
  }
});

export const Map = mongoose.model("Map", MapSchema);

export const isObjectId = (val: any) => mongoose.Types.ObjectId.isValid(val);

