/* eslint-env mocha */

import { expect } from 'chai'

import { reduceStars } from 'helpers/repos'

describe('Reduce stars', () => {

  it('should do nothing if more requested slices than stars', () => {
    const stars = [
      ['2016-01-01', 5],
      ['2016-01-02', 7],
      ['2016-01-03', 8],
      ['2016-02-01', 10],
      ['2016-02-02', 11]
    ]
    const res = reduceStars(stars)
    expect(res).to.eql(stars)
  })

  it('should group stars in very simple cases', () => {
    const stars = [
      ['2000-01-01', 1],
      ['2000-01-02', 1],
      ['2000-01-03', 1],
      ['2000-01-04', 1],
      ['2000-01-05', 1],
      ['2000-01-06', 1]
    ]
    const res = reduceStars(stars, 3)
    expect(res).to.eql([
      ['2000-01-01', 1],
      ['2000-01-04', 4],
      ['2000-01-06', 6]
    ])
  })

})
