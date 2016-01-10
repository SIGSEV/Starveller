import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { askRepo, goToRepo } from 'actions/repos'

@connect()
class RepoLink extends Component {

  handleClick () {
    const { repo } = this.props
    this.props.dispatch(askRepo(repo))
    this.props.dispatch(goToRepo(repo))
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
