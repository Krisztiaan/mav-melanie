import RoutePlanStore from "@stores/RoutePlanStore"

export default function() {
	const routePlanStore = new RoutePlanStore()
  console.log(routePlanStore)
	return {
		routePlanStore
	}
}
