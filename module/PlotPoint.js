export default class PlotPoint extends foundry.dice.terms.Die {
  constructor(termData) {
    termData.faces = 2
    super(termData)
  }
}

PlotPoint.DENOMINATION = 'p'
