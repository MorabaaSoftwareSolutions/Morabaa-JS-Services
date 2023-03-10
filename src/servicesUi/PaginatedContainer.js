import React from 'react'
const postions = {}
const defaultRefresh = (
  <svg className='refresher-svg' viewBox='0 0 512 512'>
    <path
      fill='#A5EB78'
      d='M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z'
    />
    <path
      className='fill-throne'
      d='M256,431.967c-97.03,0-175.967-78.939-175.967-175.967c0-28.668,7.013-56.655,20.156-81.677l-25.144-16.639l107.282-54.228l-7.974,119.943l-26.111-17.279c-7.203,15.517-11.041,32.51-11.041,49.879c0,65.507,53.294,118.801,118.801,118.801s118.801-53.294,118.801-118.801s-53.295-118.8-118.802-118.8V80.033c97.028,0,175.967,78.938,175.967,175.967S353.028,431.967,256,431.967z'
    />
  </svg>
)
const defaultRefresherProps = {
  id: 'refresher',
  reloadingClass: 'reloading',
  disappearingClass: 'disappearing',
  pullingClass: 'pulling',
  onPull: ({ diff, diffPersent, refresher }) => {
    let rotateAngle = 720 - diffPersent * 360
    refresher.style.transform = `rotate(${rotateAngle}deg)`
  }
}
const PaginatedContainer = ({
  service,
  onRefresh,
  useRefresh,
  className,
  children,
  id,
  refresher = defaultRefresh,
  refresherProps = defaultRefresherProps
}) => {
  return (
    <PaginatedContainerClass
      {...{
        service,
        onRefresh,
        useRefresh,
        className,
        children,
        id,
        refresher,
        refresherProps
      }}
    />
  )
}
export default PaginatedContainer

class PaginatedContainerClass extends React.Component {
  constructor(props) {
    super(props)
    this.id = window.location.pathname.replace(/\//g, '')
    this.refresh = props.useRefresh
      ? props.onRefresh || props.service.reload
      : props.onRefresh
  }
  refresherProps = defaultRefresherProps
  componentDidMount() {
    this.container = document.getElementById(this.id)
    const top = postions[this.id]
    console.log({ postions }, { id: this.id })
    top && this.container.scrollTo({ top, left: 0, behavior: 'auto' })
    if (this.refresh) {
      Object.entries(this.props.refresherProps).forEach(([key, value]) => {
        this.refresherProps[key] = value
      })
      pullToRefreshEvent(
        this.container,
        this.props.service,
        this.refresh,
        this.refresherProps
      )
    }
  }
  render() {
    const {
      service,
      children,
      className = 'local-wrapper scroller'
    } = this.props
    return (
      <div
        id={this.id}
        className={className}
        onScroll={({ target }) => {
          if (
            service.canFetch &&
            target.scrollHeight - target.scrollTop < target.clientHeight + 400
          ) {
            service.canFetch = false
            service.loadMore()
          }
          postions[service.scrollerId] = target.scrollTop
        }}
      >
        {children}
        {this.refresh && <div id='refresher'>{this.props.refresher}</div>}
        {/* <ServiceStateBuilder service={service} /> */}
      </div>
    )
  }
}

const pullToRefreshEvent = (container, service, refresh, refresherProps) => {
  if (!container) return
  let reloader = container.querySelector('#refresher')
  reloader.remove = () => {
    let defaultClass = `${refresherProps.reloadingClass} ${refresherProps.disappearingClass}`
    reloader.style = ''
    reloader.className = defaultClass
    setTimeout(() => {
      reloader.className === defaultClass &&
        (reloader.className = refresherProps.disappearingClass)
    }, 1000)
  }
  reloader.remove()

  let diff = 0
  const onSwipeDown = (e) => {
    diff = e.touches[0].clientY - service.startY
    if (diff > 20) {
      if (diff > 200) diff = 200
      let diffPersent = diff / 100
      let offset = (1 - diffPersent) * reloader.offsetHeight
      reloader.style.marginTop = -offset + 'px'
      reloader.style.opacity = diffPersent
      refresherProps.onPull({ diff, diffPersent, refresher: reloader })
    }
  }

  const touchEnd = () => {
    container.removeEventListener('touchend', touchEnd, { passive: true })
    container.removeEventListener('touchmove', onSwipeDown, { passive: true })

    if (diff < 100) {
      reloader?.remove()
      service.pulling = false
      return
    }
    reloader.className = refresherProps.reloadingClass
    setTimeout(async () => {
      await refresh()
      reloader?.remove()
      service.pulling = false
    }, 200)
  }

  setTimeout(() => {
    if (container.childElementCount > 1) {
      container.insertBefore(reloader, container.childNodes[1])
    } else container.insertBefore(reloader, container.firstChild)
  }, 300)

  container.addEventListener('touchstart', (e) => {
    if (container.scrollTop > 5 || service.pulling || service.state !== 'none')
      return
    service.pulling = true
    reloader.style.opacity = '0'
    reloader.style.marginTop = '-80px'
    reloader.className = refresherProps.pullingClass
    diff = 0

    container.addEventListener('touchmove', onSwipeDown, { passive: true })
    container.addEventListener('touchend', touchEnd, { passive: true })
    service.startY = e.touches[0].clientY
  })
}
