# react-native-swipe-container

React Native component for handling swipe gestures in up, down, left and right direction.

This is based on the great work from [glepur is react-native-swipe-gestures](https://github.com/glepur/react-native-swipe-gestures)

## Installation

`npm i -S react-native-swipe-container`

## Usage

```javascript
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
```

## Config

Can be passed within optional `config` property.

| Params                     | Type          | Default | Description  |
| -------------------------- |:-------------:| ------- | ------------ |
| velocityThreshold          | Number        | 0.3     | Velocity that has to be breached in order for swipe to be triggered |
| distanceThreshold          | Number        | 40      | Minimum swipe distance for the swipe to be triggered |
| angleThreshold             | Number        | 15      | Angle range to match non diagonal swipes (15 -> from -15deg to 15deg is considered horizontal) |
| diagonalSwipe              | Boolean       | True    | Enables diagonal swipes |

## Methods

#### onSwipe(gestureName, gestureState)

| Params        | Type          | Description  |
| ------------- |:-------------:| ------------ |
| gestureName   | String        | Name of the gesture (look example above) |
| gestureState  | Object        | gestureState received from PanResponder  |
