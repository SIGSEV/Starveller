import { contains } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import RepoSearch from 'components/RepoSearch'
import StarsEvolution from 'components/graphs/StarsEvolution'

import { chosenChoose } from 'actions/repos'

if (process.env.BROWSER) {
  require('styles/Builder.scss')
}

@connect(
  state => ({
    chosen: state.repos.chosen
  })
)
class Builder extends Component {

  handleAddRepo ({ value: repo }) {
    const { chosen } = this.props
    if (!contains(chosen, repo)) {
      this.props.dispatch(chosenChoose(repo))
    }
  }

  render () {
    const { chosen } = this.props

    return (
      <div className='Builder'>
        <div className='repos-graphs'>
          <div className='repos-graphs--list'>
            <RepoSearch
              onRepoSelect={::this.handleRepoSelect} />
          </div>
          <div className='repos-graphs--view'>
            <StarsEvolution repos={chosen} />
          </div>
        </div>
      </div>
    )
  }

}

export default Builder
