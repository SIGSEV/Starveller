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
    repos: state.repos.list,
    chosen: state.repos.chosen
  })
)
class Builder extends Component {

  constructor (props) {
    super(props)

    this.state = {
    }
  }

  handleAddRepo ({ value: repo }) {
    const { chosen } = this.props
    if (!contains(chosen, repo)) {
      this.props.dispatch(chosenChoose(repo))
    }
  }

  render () {
    const { chosen } = this.props

    // TODO:
    //
    // const options = repos
    //   .filter(repo => !contains(chosen, repo))
    //   .map(r => ({ value: r, label: r.name }))

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
