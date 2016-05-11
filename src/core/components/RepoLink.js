import _ from 'lodash'
import React, { Component } from 'react'
import { Link } from 'react-router'

class RepoLink extends Component {

  render () {
    const { repo } = this.props
    const { name } = repo

    const props = _.omit(this.props, ['repo', 'children'])

    return (
      <Link to={`/${name}`} {...props}>
        {this.props.children}
      </Link>
    )
  }

}

export default RepoLink
