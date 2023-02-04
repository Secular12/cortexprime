export default class PlotPoint extends Die {
  constructor(termData) {
    termData.faces = 2
    super(termData)
  }
}

PlotPoint.DENOMINATION = 'p'
