// tslint:disable:ban-types
// tslint:disable:interface-over-type-literal
// tslint:disable:max-classes-per-file
// tslint:disable:member-access

declare module 'react-native-collapsible-header' {
	import { Component } from 'react'
	import { ImageURISource, FlatListProperties } from 'react-native'

	type CollapsibleProps<ItemT> = {
		backgroundColor?: string
		flatList?: boolean
		max?: number
		min?: number
		renderContent?: JSX.Element
		renderHeader: JSX.Element
	} & FlatListProperties<ItemT>

	export default class Collapsible<ItemT> extends Component<
		CollapsibleProps<ItemT>
	> {}
}
