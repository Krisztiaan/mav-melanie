import { Discount } from './../services/api/api.types';
import { MavDb } from '@services/database'
import { GeneralApiProblem } from '@services/api/api-problem'
import { SearchCondition, Station, Passenger, SoldService, PassengerType } from '@services/api/api.types'
import { Moment } from 'moment'
import { MavApi } from '@services/api/api'
import { GetRoutePlanParams, GetRoutePlanResponse } from '@services/api/endpoints/RoutePlan'
import { observable, action, computed } from 'mobx'
import moment from 'moment'
import _ from 'lodash'

enum LoadingStatus {
  INIT,
  LOADING,
  SUCCESS,
  ERROR
}

export default class RoutePlanStore {

  @observable from?: Station
  @observable stops: Station[] = []
  @observable to?: Station
  @action setStation(value: Station, station: 'from' | 'to' | number) {
    switch (station) {
      case 'from':
        this.from = value
        break
      case 'to':
        this.to = value
        break
      default:
        this.stops[station] = value
    }
  }

  @observable date: Moment = moment()
  @observable dateType: 'departure' | 'arrival' = 'departure'
  @action setDate(date: Moment, dateType: 'departure' | 'arrival') {
    this.date = date
    this.dateType = dateType
  }

  @action async loadMyPassengers() {
    const data = await MavDb.getMyPassengers()
    this.myPassengers = data ? data.myPassengers : []
  }
  @observable myPassengers: PassengerType[] = []
  @action async setMyPassengers(myPassengers: PassengerType[]) {
    this.myPassengers = myPassengers
    MavDb.saveMyPassengers(myPassengers)
  }
  @computed get availableMyPassengers() {
    return this.myPassengers.filter(myPassenger => this.availablePassengerTypeCodes.includes(myPassenger.Kod))
  }

  @observable passengers: Passenger[] = []
  private getAvailablePassengerTypeCodesForServices(services: SoldService[]) {
    return services.reduce(
      (acc: string[], service) =>
        (service.EngedelyezettUtasTipusKodok ?
          acc.concat(service.EngedelyezettUtasTipusKodok) :
          acc
        ),
      []
    )
  }
  @computed get availablePassengerTypeCodes() {
    return this.getAvailablePassengerTypeCodesForServices(this.services)
  }
  @computed get totalPassengerCount() {
    return this.passengers.reduce((acc, passenger) => acc + passenger.Mennyiseg, 0)
  }
  @action addPassenger(
    qty: number,
    passenger: PassengerType,
    disabled: boolean,
    discounts: Discount[],
    justSurplusSign: boolean = false,
    f: number = 0
  ) {
    if (this.totalPassengerCount + qty > 9) {
      this.validationProblems.passengers = 'too-many-passengers'
      return
    }
    this.passengers.push({
      CsakFelarJel: justSurplusSign,
      FogyatekkalElo: disabled,
      Kedvezmenyek: discounts,
      Mennyiseg: qty,
      UtasTipus: passenger,
      f: 0
    })
  }
  @action modifyPassenger(
    index: number,
    qty?: number,
    discounts?: Discount[],
    justSurplusSign: boolean = false,
    f: number = 0
  ) {
    if (qty !== undefined && this.totalPassengerCount + qty > 9) {
      this.validationProblems.passengers = 'too-many-passengers'
      return
    }
    qty ? this.passengers[index].Mennyiseg = qty : null
    discounts ? this.passengers[index].Kedvezmenyek = discounts : null
  }

  @observable conditions?: SearchCondition[] = undefined
  @computed get availableConditions() {
    return MavDb.basicInfo.KeresesiFeltetelek.KeresesiFeltetelLista
  }
  @action setConditions(conditions: SearchCondition[]) {
    this.conditions = conditions
    this.services = this.services.filter(service => this.bannedServiceIds.includes(service.Azonosito))
  }

  @observable services: SoldService[] = []
  @computed get bannedServiceIds() {
    const services = MavDb.basicInfo.ErtekesitettSzolgaltatasok.ErtekesitettSzolgaltatasLista
    const conditionBannedIds = this.conditions ? this.conditions.reduce(
      (acc: number[], condition) =>
        (condition.TiltottErtekesitettSzolgaltatasok ?
          acc.concat(condition.TiltottErtekesitettSzolgaltatasok) :
          acc
        ),
      []
    ) : []
    const presentPassengerCodes = this.passengers.reduce((acc: string[], passenger) => acc.concat([passenger.UtasTipus.Kod]), [])
    return services
      .filter(service => (_.intersectionWith(service.EngedelyezettUtasTipusKodok, presentPassengerCodes).length))
      .filter(service => !conditionBannedIds.includes(Number(service.Azonosito)))
      .map(service => service.Azonosito)
  }
  @computed get availableServices() {
    const services = MavDb.basicInfo.ErtekesitettSzolgaltatasok.ErtekesitettSzolgaltatasLista
    return services
      .filter(service =>
        !this.bannedServiceIds.includes(service.Azonosito)
      )
  }
  @action setServices(services: SoldService[]) {
    this.services = services.filter(service => !this.bannedServiceIds.includes(service.Azonosito))
  }

  @observable resultsError?: GeneralApiProblem
  @observable resultsStatus = LoadingStatus.INIT
  @observable results?: GetRoutePlanResponse

  @observable searchStation: 'from' | 'to' | number = 'from'
  @observable stationSearchText: string = ''
  @computed get stationSuggestions(): Station[] {
    if(this.stationSearchText.length >= 3) {
      return MavDb.basicInfo.Allomasok.AllomasLista.filter(
        station => station.Nev.includes(this.stationSearchText)
      )
    }
    return []
  }

  @observable validationProblems: {
    from?: string,
    to?: string,
    services?: string,
    passengers?: string
  } = {}
  @action clearValidationProblem(field: 'from' | 'to' | 'services' | 'passengers') {
    this.validationProblems[field] = undefined
  }

  @action.bound
  async search() {
    this.validationProblems = {}
    if (!this.from) {
      this.validationProblems.from = 'no-station'
    }
    if (!this.to) {
      this.validationProblems.to = 'no-station'
    }
    if (!this.services.length) {
      this.validationProblems.services = 'no-services'
    }
    if (!this.passengers.length) {
      this.validationProblems.passengers = 'no-passengers'
    }
    if (this.totalPassengerCount > 9) {
      this.validationProblems.passengers = 'too-many-passengers'
    }

    if (Object.values(this.validationProblems).every(v => v === undefined)) {
      const params: GetRoutePlanParams = {
        from: this.from!,
        to: this.to!,
        stops: this.stops,
        services: this.services,
        passengers: this.passengers,
        date: this.date,
        dateType: this.dateType
      }
      this.resultsStatus = LoadingStatus.LOADING
      try {
        const result = await MavApi.getRoutePlan(params)
        if (result.kind === 'ok') {
          this.results = result.data
          this.resultsStatus = LoadingStatus.SUCCESS
        } else {
          this.resultsError = result
          this.resultsStatus = LoadingStatus.ERROR
        }
      } catch (error) {
        console.warn(error)
        this.resultsError = error
      }
    }

    throw this.validationProblems
  }
}