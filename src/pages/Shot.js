import React, { Component } from 'react'
import { connect } from 'react-redux'

import StarsEvolution from 'components/graphs/StarsEvolution'

@connect(
  state => ({
    repo: state.repos.current
  })
)
class Shot extends Component {

  render () {
    return <StarsEvolution repo={this.props.repo} lightGraph />
  }

}

export default Shot
