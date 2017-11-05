// @flow

import * as React from 'react'
import {View, PanResponder} from 'react-native'

export type GestureState = {
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

export type Props = {
  velocityThreshold: number,
  distanceThreshold: number,
  angleThreshold: number,
  diagonalSwipe: boolean,
  onSwipe?: (swipeDirection: string, gestureState: GestureState) => mixed
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
  SWIPE_RIGHT: 'SWIPE_RIGHT',
  SWIPE_UP_LEFT: 'SWIPE_UP_LEFT',
  SWIPE_UP_RIGHT: 'SWIPE_UP_RIGHT',
  SWIPE_DOWN_LEFT: 'SWIPE_DOWN_LEFT',
  SWIPE_DOWN_RIGHT: 'SWIPE_DOWN_RIGHT'
}

function isValidSwipe (velocity: number, velocityThreshold: number, distance: number, distanceThreshold: number): boolean {
  return Math.abs(velocity) > velocityThreshold && Math.abs(distance) > distanceThreshold
}

function getAngle (x: number, y: number): number {
  return Math.atan((-y) / x) * 180 / Math.PI
}

function getMaxVelocity (x: number, y:number): number {
  return Math.max(Math.abs(x), Math.abs(y))
}

function getDistance (x: number, y:number): number {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

class GestureRecognizer extends React.Component<Props> {
  _panResponder: any

  static defaultProps = {
    velocityThreshold: 0.3,
    distanceThreshold: 40,
    angleThreshold: 15,
    diagonalSwipe: true
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
    this._triggerSwipeHandlers(swipeDirection || '', gestureState)
  }

  _triggerSwipeHandlers (swipeDirection: string, gestureState: GestureState) {
    const { onSwipe } = this.props
    onSwipe && onSwipe(swipeDirection, gestureState)
  }

  _getSwipeDirection (gestureState: GestureState): string | null {
    const {
      SWIPE_LEFT,
      SWIPE_RIGHT,
      SWIPE_UP,
      SWIPE_DOWN,
      SWIPE_UP_LEFT,
      SWIPE_UP_RIGHT,
      SWIPE_DOWN_LEFT,
      SWIPE_DOWN_RIGHT
    } = swipeDirections
    const { dx, dy, vx, vy } = gestureState
    const {velocityThreshold, distanceThreshold, angleThreshold, diagonalSwipe} = this.props
    const distance = getDistance(dx, dy)

    if (!isValidSwipe(getMaxVelocity(vx, vy), velocityThreshold, distance, distanceThreshold)) {
      return null
    }

    const angle = getAngle(dx, dy)
    const angleAbs = Math.abs(angle)
    if (angleAbs < angleThreshold) {
      return (dx > 0)
        ? SWIPE_RIGHT
        : SWIPE_LEFT
    } else if (angleAbs > (90 - angleThreshold)) {
      return (dy > 0)
        ? SWIPE_DOWN
        : SWIPE_UP
    } else if (diagonalSwipe) {
      return (dx > 0)
        ? (dy > 0)
          ? SWIPE_DOWN_RIGHT
          : SWIPE_UP_RIGHT
        : (dy > 0)
          ? SWIPE_DOWN_LEFT
          : SWIPE_UP_LEFT
    }

    return null
  }

  render () {
    return (
      <View {...this.props} {...this._panResponder.panHandlers}/>
    )
  }
}

export default GestureRecognizer
