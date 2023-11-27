import { createContext, useContext } from "react"

import ChatStore from "./stores/chatStore"
import CycleStore from "./stores/cycleStore"
import dgsCycleStore from "./stores/dgsCycleStore"
import reverseCycleStore from "./stores/reverseCycleStore"
import semiCycleStore from "./stores/semiCycleStore"

const store = {
	ChatStore: ChatStore,
	CycleStore: CycleStore,
	SemiCycleStore: semiCycleStore,
	ReverseCycleStore: reverseCycleStore,
	DGSCycleStore: dgsCycleStore,
}

export const StoreContext = createContext(store)

export const useStore = () => {
	return useContext<typeof store>(StoreContext)
}

export default store
