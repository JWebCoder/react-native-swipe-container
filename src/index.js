// @flow

import React from 'react'
import {View, PanResponder} from 'react-native'

type GestureState = {
  stateID: string,
  x0: number,
  y0: number,
  dx: number,
  dy: number,
  vx: number,
  vy: number,
  moveX: number,
  moveY: number
}

export type SwipeConfig = {
  velocityThreshold: number,
  directionalOffsetThreshold: number
}

export type Props = {
  config: SwipeConfig,
  onSwipe: (swipeDirection: string, gestureState: GestureState) => mixed,
  onSwipeUp: (gestureState: GestureState) => mixed,
  onSwipeDown: (gestureState: GestureState) => mixed,
  onSwipeLeft: (gestureState: GestureState) => mixed,
  onSwipeRight: (gestureState: GestureState) => mixed
}

type EventLike = {
  nativeEvent: {
    changedTouches: [],
    identifier: string,
    locationX: number,
    locationY: number,
    pageX: number,
    pageY: number,
    target: string,
    timestamp: number,
    touches: []
  }
}

export const swipeDirections = {
  SWIPE_UP: 'SWIPE_UP',
  SWIPE_DOWN: 'SWIPE_DOWN',
  SWIPE_LEFT: 'SWIPE_LEFT',
  SWIPE_RIGHT: 'SWIPE_RIGHT'
}

const swipeConfig: SwipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
}

function isValidSwipe (velocity: number, velocityThreshold: number, directionalOffset: number, directionalOffsetThreshold: number): boolean {
  return Math.abs(velocity) > velocityThreshold && Math.abs(directionalOffset) < directionalOffsetThreshold
}

class GestureRecognizer extends React.Component<Props> {
  swipeConfig: SwipeConfig

  constructor (props: Props) {
    super(props)
    this.swipeConfig = {
      ...swipeConfig,
      ...props.config
    }
  }

  componentWillReceiveProps (props: Props) {
    this.swipeConfig = {
      ...swipeConfig,
      ...props.config
    }
  }

  componentWillMount () {
    const responderEnd = this._handlePanResponderEnd.bind(this)
    const shouldSetResponder = this._handleShouldSetPanResponder.bind(this)

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: shouldSetResponder,
      onMoveShouldSetPanResponder: shouldSetResponder,
      onPanResponderRelease: responderEnd,
      onPanResponderTerminate: responderEnd
    })
  }

  _handleShouldSetPanResponder (evt: EventLike, gestureState: GestureState) {
    return evt.nativeEvent.touches.length === 1 && !this._gestureIsClick(gestureState)
  }

  _gestureIsClick (gestureState: GestureState) {
    return Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5
  }

  _handlePanResponderEnd (evt: EventLike, gestureState: GestureState) {
    const swipeDirection = this._getSwipeDirection(gestureState)
    this._triggerSwipeHandlers(swipeDirection, gestureState)
  }

  _triggerSwipeHandlers (swipeDirection: string, gestureState: GestureState) {
    const {onSwipe, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight} = this.props
    const {SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN} = swipeDirections
    onSwipe && onSwipe(swipeDirection, gestureState)
    switch (swipeDirection) {
      case SWIPE_LEFT:
        onSwipeLeft && onSwipeLeft(gestureState)
        break
      case SWIPE_RIGHT:
        onSwipeRight && onSwipeRight(gestureState)
        break
      case SWIPE_UP:
        onSwipeUp && onSwipeUp(gestureState)
        break
      case SWIPE_DOWN:
        onSwipeDown && onSwipeDown(gestureState)
        break
    }
  }

  _getSwipeDirection (gestureState: GestureState): string {
    const {SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN} = swipeDirections
    const {dx, dy} = gestureState
    if (this._isValidHorizontalSwipe(gestureState)) {
      return (dx > 0)
        ? SWIPE_RIGHT
        : SWIPE_LEFT
    } else if (this._isValidVerticalSwipe(gestureState)) {
      return (dy > 0)
        ? SWIPE_DOWN
        : SWIPE_UP
    }
    return null
  }

  _isValidHorizontalSwipe (gestureState: GestureState) {
    const {vx, dy} = gestureState
    const {velocityThreshold, directionalOffsetThreshold} = this.swipeConfig
    return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold)
  }

  _isValidVerticalSwipe (gestureState) {
    const {vy, dx} = gestureState
    const {velocityThreshold, directionalOffsetThreshold} = this.swipeConfig
    return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold)
  }

  render () {
    return (
      <View {...this.props} {...this._panResponder.panHandlers}/>
    )
  }
}

export default GestureRecognizer
