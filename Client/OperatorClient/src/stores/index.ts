import type { Pinia } from 'pinia'

// import { useCounterStore } from './counter'
import { useclientStore } from './client'

export function ImportStores(pinia: Pinia): Pinia {

    useclientStore(pinia)
    useclientStore().Init()
    return pinia
}