import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { fetchRepo } from 'actions/repos'

@connect()
class RepoLink extends Component {

  handleClick () {
    this.props.dispatch(fetchRepo(this.props.repo))
  }

  render () {
    const { repo } = this.props
    const { name } = repo

    return (
      <Link to={name} onClick={::this.handleClick}>
        {name}
      </Link>
    )
  }

}

export default RepoLink
