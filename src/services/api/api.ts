import { BasicInfoResponse } from './endpoints/BasicInfo';
import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem, GeneralApiProblem } from "./api-problem"
import { GetRoutePlanResponse, GetRoutePlanParams } from './endpoints/RoutePlan'

// const nmfrCallbackUrl = 'https://vimpay.mav-start.hu/internet/app/nmfrBackref?vimpaysuccess'
// const otpSimpleUrl = 'https://vimpay.mav-start.hu/internet/app/simplepayFizetes?'

export type Call<P, R> = (params: P) => Promise<{ kind: 'ok', data: R } | GeneralApiProblem>

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  static baseParams = {
    Nyelv:"HU",
    UAID: "1k5wML1tHYcH1akR8d036iTv791h",
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  constructor() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: 'http://vim.mav-start.hu/VIM/PR/20180410/MobileService.svc/rest/',
      headers: {
        "accept": "gzip",
        "accept-encoding": "gzip",
        "content-type": "application/json; charset=utf-8",
      }
    })
  }

  getRoutePlan = async (params: GetRoutePlanParams) => {
    const queryParams = {
      CacheNelkul: false,
      CelAllomasID: params.to.ID,
      IndulasiIdo: params.dateType === 'departure',
      Datum: params.date.unix(), // todo set offset to '+2' ? 😢
      IndAllomasID: params.from.ID,
      ErintettAllomasok: params.stops && params.stops.map(stop => ({ AllomasUIC: stop.ID })),
      KeresesiFeltetelek: params.conditions && params.conditions.map(condition => ({
        Ertek: condition.FeltetelErtek,
        Kod: condition.FeltetelKod
      })),
      Szolgaltatasok: params.services.map(service => service.Azonosito),
      Utasok: params.passengers.map(passenger => ({
        ...passenger,
        Kedvezmenyek: passenger.Kedvezmenyek.map(kedvezmeny => kedvezmeny.Azonosito),
        UtasTipus: passenger.UtasTipus.Kod
      })),
    }

    const response = await this.apisauce.post<{ UtazasiAjanlatok: GetRoutePlanResponse }>('/GetUtazasiAjanlat', { ...Api.baseParams, ...queryParams })

    const error = this.getError(response)
    if (error) return error
    return { kind: "ok" as "ok", data: response.data!.UtazasiAjanlatok }
  }

  getBasicInfo = async () => {
    const queryParams = {
      "AllomasIdoBelyeg": "1000",
      "ErtekelesIdoBelyeg": "1000",
      "KedvezmenyIdoBelyeg": "1000",
      "KeresesiFeltetelIdoBelyeg": "1000",
      "KozteruletJellegIdoBelyeg": "1000",
      "ParameterIdoBelyeg": "1000",
      "SzolgaltatasokIdoBelyeg": "1000",
      "UtasTipusIdobelyeg": "1000",
      "KliensVerzio": "ANDROID_180504",
      "KeretRendszerAdatokIdoBelyeg": "1000"
    }

    const response = await this.apisauce.post<BasicInfoResponse>('/GetAlapadatok', { ...Api.baseParams, ...queryParams })

    const error = this.getError(response)
    if (error) return error
    return { kind: "ok" as "ok", data: response.data! }
  }

  private getError(
    response: ApiResponse<any>,
    validate?: (response: ApiResponse<any>) => boolean): GeneralApiProblem | undefined {
      console.log(response)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    } else {
      if (validate && !validate(response)) {
        return { kind: "bad-data" }
      }
    }
    return undefined
  }
}

export const MavApi = new Api()
