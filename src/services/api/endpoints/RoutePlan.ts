import { RoutePlanDetails, TravelOfferPackage, SearchCondition, SoldService, Station } from './../api.types';
import { Passenger } from '../api.types';
import { Moment } from 'moment'

export type GetRoutePlanParams = {
  from: Station,
  stops?: Station[],
  to: Station,
  date: Moment,
  dateType: 'departure' | 'arrival',
  conditions?: SearchCondition[],
  services: SoldService[],
  passengers: Passenger[],
}

export type GetRoutePlanResponse = [{
  IndDatum: number
  ErkDatum: number
  Idotartam: string
  Km: number
  Ar: number
  Szin: string
  HelyjegyesDb: number
  Reszletek: RoutePlanDetails[]
  UtazasiAjanlatCsomagok: TravelOfferPackage[]
  Potjegyek: [{
    SzolgNev: string
  }]
}]
