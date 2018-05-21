import { Discount } from './api.types';
export type Passenger = {
  /** Don't know, default { false } */
  CsakFelarJel: boolean
  FogyatekkalElo: boolean
  Kedvezmenyek: Discount[]
  Mennyiseg: number
  UtasTipus: PassengerType
  /** Don't know, default 0 */
  f: 0
}

export type Ticket = {
  Nev: string
  Kedvezmeny: string
  Km: string
  EgysegAr: number
  KedvEgysegAr: number
  Darab: number
}

export type TravelOfferPackage = {
  Csomagnev: string
  CsomagAzon: string
  CsomagAr: number
  KedvCsomagAr: number
  Jegyek: Ticket[]
}

export type RoutePlanDetails = {
  Vonat: {
    ID: string
    Szam: string
    Nev: string
  }
  Viszonylat: {
    InduloAllomasKod: string
    CelAllomasKod: string
  }
  Szolgaltatasok: [{
    SzolgNev: string
  }]
  IndAllomasID: string
  ErkAllomasID: string
  Ido: {
    IndMDatum: string
    ErkMDatum: string
    IndTenyDatum: string
    ErkTenyDatum: string
  }
}

export type Station = {
  ID: string
  Nev: string
  GpsLon?: string
  GpsLat?: string
  Belfoldi?: boolean
  OldID: string
  Alias?: boolean
}

export type PassengerType = {
  UtasTipusId: number
  Kod: string
  Nev: string
  Leiras: string
  UtasTipusMin: number
  UtasTipusMax: number
  KapcsolodoKedvezmenyek: number[]
  Sorrend: number
  EletkorTol?: number
  EletkorIg?: number
  Alapertelmezett?: boolean
}

export type SoldService = {
  Azonosito: string
  Nev: string
  Leiras: string
  EngedelyezettUtasTipusKodok: string[]
  Sorrend: number
  ErtekesitettSzolgaltatasId: number
  GroupID: string
  Felar?: boolean
  Kocsiosztaly?: string
  Kocsiosztalyrol?: number
  UICkod?: string
  Helyszolgaltatas?: boolean
  Alapertelmezett?: boolean
}

export type Discount = {
  KedvezmenyId: number
  Azonosito: string
  Nev: string
  Leiras: string
  Sorrend: number
  Kerdes?: string
}

export type SearchCondition = {
  KeresesiFeltetelId: number
  FeltetelKod: string
  FeltetelErtek: string
  Nev: string
  TiltottErtekesitettSzolgaltatasok?: number[]
  Sorrend: number
}
