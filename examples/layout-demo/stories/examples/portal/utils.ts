import { ILayout } from "@czwcode/dnd-layout-renderer";
import { linkTo } from "@storybook/addon-links";

const testKey = 'portal_layout'

export function createLayout(name, layout: ILayout[]) {
  const list = localStorage.getItem(testKey)
  if(!list) {
    localStorage.setItem(testKey, JSON.stringify([{ name, layout}]))
  } else {
    localStorage.setItem(testKey, JSON.stringify(JSON.parse(list).concat([{ name, layout}])))
  }
  return JSON.parse(list).length
}


export function getLatestLayout() {
  const list = localStorage.getItem(testKey)
  if(!list) {
    throw new Error('没有找到模式')
  }
  return getLayout(JSON.parse(list).length - 1)
}
export function getLayoutList() {
  const list = localStorage.getItem(testKey)
  if(!list) {
    throw new Error('未找到列表数据')
  }
  return JSON.parse(list)
}

export function getLayout(id: string | number): { name: string, layout: ILayout[]} {
  return getLayoutList()[id]
}
export function updateLayout(id: string | number, name: string, layout: ILayout) {
  const list = localStorage.getItem(testKey)
  if(!list) {
    throw new Error('未找到列表数据')
  }
}

export function linkToMockPage() {
  const name = '工作台首页生成--任务mock测试'
  // window.open(document.location.origin + '?path=/story/'+name, '_self' )
  const linkInstance = linkTo(name, "&a=2")
  linkInstance("a=2")
}