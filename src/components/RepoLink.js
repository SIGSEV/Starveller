import _ from 'lodash'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { askAndSetCurrent, resetCurrent } from 'actions/repos'

@connect()
class RepoLink extends Component {

  handleClick () {
    const { repo } = this.props
    this.props.dispatch(resetCurrent())
    this.props.dispatch(askAndSetCurrent(repo))
  }

  render () {
    const { repo } = this.props
    const { name } = repo

    const propsToPass = _.omit(this.props, ['repo'])

    return (
      <Link to={name} onClick={::this.handleClick} {...propsToPass}>
        {this.props.children}
      </Link>
    )
  }

}

export default RepoLink
