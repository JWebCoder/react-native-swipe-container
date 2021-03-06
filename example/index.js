// @flow

import * as React from 'react'
import { Text, StyleSheet } from 'react-native'

// react-native-swipe-container
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-container'
import type { GestureState } from 'react-native-swipe-container'

type Props = {}

type State = {
  gestureName: string,
  backgroundColor: string
}

const styles = StyleSheet.create({
  swiper: {
    flex: 1
  }
})

class SomeComponent extends React.Component<Props, State> {
  state = {
    gestureName: 'none',
    backgroundColor: '#fff'
  }

  onSwipe (gestureName: string, gestureState: GestureState) {
    const {
      SWIPE_UP,
      SWIPE_DOWN,
      SWIPE_LEFT,
      SWIPE_RIGHT,
      SWIPE_UP_LEFT,
      SWIPE_UP_RIGHT,
      SWIPE_DOWN_LEFT,
      SWIPE_DOWN_RIGHT
    } = swipeDirections

    this.setState({gestureName: gestureName})

    switch (gestureName) {
      case SWIPE_UP:
        this.setState({backgroundColor: 'red'})
        break
      case SWIPE_DOWN:
        this.setState({backgroundColor: 'green'})
        break
      case SWIPE_LEFT:
        this.setState({backgroundColor: 'blue'})
        break
      case SWIPE_RIGHT:
        this.setState({backgroundColor: 'yellow'})
        break
      case SWIPE_UP_LEFT:
        this.setState({backgroundColor: 'mistyrose'})
        break
      case SWIPE_UP_RIGHT:
        this.setState({backgroundColor: 'aquamarine'})
        break
      case SWIPE_DOWN_LEFT:
        this.setState({backgroundColor: 'pink'})
        break
      case SWIPE_DOWN_RIGHT:
        this.setState({backgroundColor: 'burlywood'})
        break
    }
  }

  render () {
    return (
      <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        velocityThreshold={0.3}
        distanceThreshold={40}
        angleThreshold={15}
        style={[styles.swiper, {backgroundColor: this.state.backgroundColor}]}
      >
        <Text>I am ready to get swiped!</Text>
        <Text>onSwipe callback received gesture: {this.state.gestureName}</Text>
      </GestureRecognizer>
    )
  }
}

export default SomeComponent
