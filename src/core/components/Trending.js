import React from 'react'

import RepoLink from 'core/components/RepoLink'

export default ({ repo }) => {

  if (!repo) { return (<div className='Trending'></div>) }

  return (
    <RepoLink repo={repo} className='Trending'>
      <div className='Pic'>
        <img src={repo.summary.picture} />
      </div>
      <div className='fc'>
        <span className='Title'>{repo.name}</span>
        <span className='Desc'>{repo.summary.description}</span>
        <span className='Infos'>{repo.summary.language || 'Unspecified'} - {repo.summary.starsCount} {'stars'}</span>
      </div>
    </RepoLink>
  )

}
