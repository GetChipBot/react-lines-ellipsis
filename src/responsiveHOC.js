const React = require('react')
const debounce = require('lodash/debounce')
const isBrowser = typeof window !== 'undefined'

function responsiveHOC (wait = 150, debounceOptions, providedWindow) {
  const resolvedWindow = providedWindow || window;
  
  return Component => {
    class Responsive extends React.Component {
      constructor (props) {
        super(props)
        this.state = {
          winWidth: isBrowser ? resolvedWindow.innerWidth : 0
        }
        this.onResize = debounce(this.onResize.bind(this), wait, debounceOptions)
      }

      componentDidMount () {
        resolvedWindow.addEventListener('resize', this.onResize)
      }

      componentWillUnmount () {
        resolvedWindow.removeEventListener('resize', this.onResize)
        this.onResize.cancel()
      }

      onResize () {
        this.setState({
          winWidth: resolvedWindow.innerWidth
        })
      }

      render () {
        const {innerRef, ...rest} = this.props
        return <Component ref={innerRef} {...rest} {...this.state} />
      }
    }

    Responsive.displayName = `Responsive(${Component.displayName || Component.name})`
    Responsive.defaultProps = {
      innerRef () {}
    }
    return Responsive
  }
}

module.exports = responsiveHOC
