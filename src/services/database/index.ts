import { PassengerType } from './../api/api.types';
import { BasicInfoResponse } from '../api/endpoints/BasicInfo';
import { SQLite } from 'expo';
import PouchDB from 'pouchdb-react-native'
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite'

type StoredMyPassengers = { _id?: string, _rev?: string, myPassengers: PassengerType[] }

const SQLiteAdapter = SQLiteAdapterFactory(SQLite)
PouchDB.plugin(SQLiteAdapter)

class Db {
  db: PouchDB.Database

  basicInfo: BasicInfoResponse
  myPassengers: PassengerType[]

  constructor() {
    this.db = new PouchDB('melanie.db', {adapter: 'react-native-sqlite'})
  }

  async getBasicInfo() {
    try {
      const basicInfo = await this.db.get<BasicInfoResponse>('basicInfo')
      this.basicInfo = basicInfo
      return basicInfo
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  async saveBasicInfo(basicInfo: BasicInfoResponse) {
    this.basicInfo = basicInfo
    try {
      const toSave: BasicInfoResponse & { _id?: string, _rev?: string } = basicInfo
      toSave._id = 'basicInfo'
      console.log('Saving basicInfo')
      this.db.put<BasicInfoResponse>(toSave)
      console.log('Saved basicInfo')
    } catch (error) {
      console.log(error)
    }
  }

  async saveMyPassengers(myPassengers: PassengerType[]) {
    this.myPassengers = myPassengers
    try {
      const prevPassengers = await this.getMyPassengers()
      const toSave: StoredMyPassengers = {
        _id: 'myPassengers',
        _rev: prevPassengers ? prevPassengers._rev : undefined,
        myPassengers
      }
      console.log('Saving myPassengers')
      this.db.put(toSave)
      console.log('Saved myPassengers')
    } catch (error) {
      console.log(error)
    }
  }

  async getMyPassengers() {
    try {
      const res = await this.db.get<StoredMyPassengers>('myPassengers')
      this.myPassengers = res.myPassengers
      return res
    } catch (error) {
      console.log(error)
      return undefined
    }
  }
}

export const MavDb = new Db()
