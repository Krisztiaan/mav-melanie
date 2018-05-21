// tslint:disable:ban-types
// tslint:disable:interface-over-type-literal
// tslint:disable:max-classes-per-file
// tslint:disable:member-access

declare module 'react-native-floating-action' {
	import { Component } from 'react'
	import { ImageURISource } from 'react-native'

	export type Action = {
		color?: string
		icon: ImageURISource
		name: string
		text?: string
		textBackground?: string
		textColor?: string
		textElevation?: number
	}
	export type FloatingActionProps = {
		ref?: (ref: FloatingAction) => void
		actions?: Action[]
		color?: string
		distanceToEdge?: number
		visible?: boolean
		overlayColor?: string
		position?: 'right' | 'left' | 'center'
		overrideWithAction?: boolean // replace mainAction with first action from actions
		floatingIcon?: any
		showBackground?: boolean
		openOnMount?: boolean
		actionsPaddingTopBottom?: number
		onPressMain?: () => boolean
		onPressItem?: (name: string) => void
	}
	class FloatingAction extends Component<FloatingActionProps> {
		reset: () => void
		animateButton: () => void
	}
}
