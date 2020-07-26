import React, { Component } from 'react'

const styles = {
  display: 'inline-block',
  height: '32px',
  width: '100px',
}

interface BoxDragPreviewProps {
  icon?: string
}
export default class BoxDragPreview extends Component<BoxDragPreviewProps> {
  constructor(props: BoxDragPreviewProps) {
    super(props)
  }

  render() {
    const { icon } = this.props
    return <div style={styles}>{icon ? <img width={30} height={25} src={icon} /> : 111}</div>
  }
}
