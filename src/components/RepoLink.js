import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchAndGo } from 'actions/repos'

@connect()
class RepoLink extends Component {

  handleClick (e) {
    e.preventDefault()
    this.props.dispatch(fetchAndGo(this.props.to))
  }

  render () {
    return (
      <a onClick={::this.handleClick}>
        {this.props.children}
      </a>
    )
  }

}

export default RepoLink
