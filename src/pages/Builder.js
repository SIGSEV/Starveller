import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import battleColors from 'helpers/battle-colors'

import RepoSearch from 'components/RepoSearch'
import StarsEvolution from 'components/graphs/StarsEvolution'

import { fetchAndSelectRepo, deselectRepo } from 'actions/repos'

if (process.env.BROWSER) {
  require('styles/Builder.scss')
}

@connect(
  state => ({
    current: state.repos.current.map(id => state.repos.all[id])
  })
)
class Builder extends Component {

  constructor (props) {
    super(props)

    this.state = {
      reposInProgress: []
    }
  }

  componentWillReceiveProps (nextProps) {
    const { reposInProgress } = this.state
    const currentNames = nextProps.current.map(r => r.name)

    // if a repo has finish fetch, removing it from reposInProgress
    if (_.intersection(reposInProgress, currentNames).length) {
      this.setState({
        reposInProgress: _.difference(reposInProgress, currentNames)
      })
    }
  }

  handleAddRepo (repoName) {
    const { current } = this.props
    const { reposInProgress } = this.state

    // dont add if already in list
    if (!_.find(current, r => r.name === repoName)) {

      // asking repo, then adding to list
      this.props.dispatch(fetchAndSelectRepo(repoName))

      // add a loader for repo being fetched
      this.setState({
        reposInProgress: [
          ...reposInProgress,
          repoName
        ]
      })

    }
  }

  removeRepo (repo) {
    this.props.dispatch(deselectRepo(repo))
  }

  render () {
    const { current } = this.props
    const { reposInProgress } = this.state

    return (
      <div className='Builder'>
        <div className='repos-graphs'>
          <div className='repos-graphs--list'>

            <RepoSearch
              onSelect={::this.handleAddRepo} />

            <div className='repos-selection'>
              {reposInProgress.map(name => (
                <div key={name} className='repos-selection-item is-fetching'>
                  {name}
                </div>
              ))}
              {current.map((r, i) => (
                <div
                  key={r._id}
                  className='repos-selection-item'
                  style={{ background: battleColors[i] }}
                  onClick={this.removeRepo.bind(this, r)}>
                  {r.name}
                </div>
              ))}
            </div>

          </div>
          <div className='repos-graphs--view'>

            <StarsEvolution repos={current} />

          </div>
        </div>
      </div>
    )
  }

}

export default Builder
