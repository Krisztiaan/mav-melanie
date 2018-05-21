import { Discount, SearchCondition } from './../api.types';
import { Station, PassengerType, SoldService } from '../api.types';

export type BasicInfoResponse = {
  Allomasok: {
      Idobelyeg: string
      AllomasLista: Station[]
  }
  UtasTipusok: {
      Idobelyeg: string
      UtasTipusLista: PassengerType[]
  }
  ErtekesitettSzolgaltatasok: {
      Idobelyeg: string
      ErtekesitettSzolgaltatasLista: SoldService[]
  }
  Kedvezmenyek: {
      Idobelyeg: string
      KedvezmenyLista: Discount[]
  }
  KeresesiFeltetelek: {
      Idobelyeg: string
      KeresesiFeltetelLista: SearchCondition[]
  }
  // ErtekelesiAdatok: {
  //     Idobelyeg: string
  //     Ertekelesek: [{
  //         ID: number
  //         Nev: string
  //     }]
  // }
  // KozteruletJellegeAdatok: {
  //     Idobelyeg: string
  //     KozteruletJellegek: [{
  //         Azonosito: string
  //         Nev: string
  //     }]
  // }
  // KeretRendszerAdatok: {
  //     Idobelyeg: string
  //     KeretRendszerAdatok: [{
  //         Azonosito: string
  //         Ertek: string
  //     }]
  // }
}
