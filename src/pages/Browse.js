import _ from 'lodash'
import { connect } from 'react-redux'
import { values } from 'lodash'
import React, { Component } from 'react'
import { prefetch } from 'react-fetcher'
import { bindActionCreators } from 'redux'

import RepoItem from 'components/RepoItem'

import { fetchAllRepos, askAndGo } from 'actions/repos'

if (process.env.BROWSER) {
  require('styles/Browse.scss')
}

@prefetch(({ dispatch }) => dispatch(fetchAllRepos()))
@connect(
  state => ({
    list: values(state.repos.all),
    loading: state.loader.repos
  }),
  dispatch => bindActionCreators({ askAndGo }, dispatch)
)
class Browse extends Component {

  render () {
    const { list, loading } = this.props

    const sortedList = _.sortByOrder(list, 'summary.starsCount', 'desc')

    return (
      <div className='container'>

        <h1>{'Browse all repos'}</h1>

        <div className='repos-list-container'>
          <div className='repos-list-filter'>
            <h3>{'Languages'}</h3>
            <ul className='languages'>
              <li>{'Javascript'}</li>
              <li>{'Ruby'}</li>
              <li>{'Python'}</li>
              <li>{'HTML'}</li>
              <li>{'PHP'}</li>
              <li>{'Go'}</li>
            </ul>
          </div>
          <div className='repos-list-list'>
            {!loading && sortedList.map(repo => (
              <RepoItem onSelect={this.props.askAndGo} key={repo._id} repo={repo} />
            ))}
            {loading && Array.apply(null, { length: Math.ceil(window.innerHeight / 166) }).map((e, i) => (
                <RepoItem key={i} blank />
              )
            )}
          </div>
        </div>

      </div>
    )
  }

}

export default Browse
