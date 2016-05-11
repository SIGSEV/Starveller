import React from 'react'

import DaysBars from 'core/components/graphs/DaysBars'
import RepoLink from 'core/components/RepoLink'

export const Feat1 = ({ repo }) => {
  if (!repo) { return <FeatFake /> }
  return (
    <div className='feat feat-1'>
      <div className='feat-color' style={{ backgroundColor: repo.summary.mainColor }} />
      <div className='feat-front'>
        <FeatTitle repo={repo} />
        <div className='feat--lang'>{'Javascript'}</div>
      </div>
      <DaysBars stars={repo.bars} />
    </div>
  )
}

export const Feat2 = ({ repo }) => {
  if (!repo) { return <FeatFake /> }
  return (
    <div className='feat feat-2'>
      <FeatTitle repo={repo} />
      <div className='feat--lang'>{'Javascript'}</div>
      <div className='feat--desc'>{repo.summary.description}</div>
    </div>
  )
}

const FeatTitle = ({ repo }) => {
  const [author, name] = repo.name.split('/')
  return (
    <RepoLink repo={repo} className='feat--title mb02'>
      <img src={repo.summary.picture} />
      {`${author}/`}
      <strong>{name}</strong>
    </RepoLink>
  )
}

const FeatFake = () => (
  <div className='feat feat-fake'/>
)
