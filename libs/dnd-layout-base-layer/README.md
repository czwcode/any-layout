### feature
- 外部 
  - 新拖入图表
  - 新拖入容器
- 内部
  - 组件拖拽
  - 容器拖拽
  - 组件 | 容器拖出
- 拖入的方向
  - 上
  - 下
  - 左
  - 右
  - 上一行
  - 下一行


### 拖拽实现功能
- 拖动的时候，要修改布局
- 拖拽结束，再次改变布局
- 拖拽的时候，修改样式

### issue
- ~~内部拖表拖动到外部，区域颜色展示异常，切图表被移除了~~
- ~~tab 没有展示title~~
- ~~tab拖入内容不生效~~
- ~~tab 无法点中~~
- ~~支持DragFrame高度配置(筛选项配置要用)~~
- 
- 支持tab的拖拽


### grid布局(规则)
- xMin 和 xMax重叠时， 判断y + height > dropY + dropHeight



### 需求描述
- 布局类型支持图层
- 支持 嵌套布局， grid布局， 绝对定位布局
- 三种布局方式响应式同步
- 组件拖拽
- 组件大小变更
- 布局数据受控
- 响应式布局


### 布局方式整理
#### 布局方式属性罗列
- grid布局
  id, x, y, w, h
- nest
  id, children, w, h
- 绝对布局
  id, x, y, w, h

#### 数据结构抽象
- 基础数据结构
  id, w, h
- grid 和 绝对布局
  x, y
- nest
  children

由于需要支持嵌套布局， 布局结构统一定义为树结构。

 - container 容器层（ page, tab, collapse）
 - cotainerPanel 容器分层( pagePanel, tabPanel, collapsePanel)
 - layer ( NestLayer, AbsoluteLayer, GridLayer)
 - layout( Row Layout, Column Layout)
 - atom

### 修改宽度
action: onSizeChange
- 方向 
- 大小

### 拖拽布局组件
action: onSizeChange onDrag onDrop onMove
- 树形布局
  - 方向
- 绝对布局
  - x, y  
- grid布局(只有上下的通道)(需要增加一个onMove的状态, 虚拟节点的状态)
  - 虚拟节点
  - 拖拽的位置，计算要通知的节点
    - 移走的位置通知原来位置下方节点
    - 移入的位置通知现在下方的节点

### 拖拽事件
- 拖拽到外部(onDragEnd)
- 拖拽到组件上(onDropEnd)
  - 嵌套组件
    - 指定位置，按照方向插入
    - 指定位置行插入
- 开始拖拽 (onDrag)
- 作用域(可能同时渲染编辑态和预览态)

### 特殊问题解决
1. 当拖拽时，是移除原来的组件，还是通过标记的方式呢？
  - 移除
    带来的问题是，
    
### 布局方式

#### 绝对布局（https://zhuanlan.zhihu.com/p/92469406）
 - 辅助线类型(参考地址： https://github.com/think2011/ref-line)
  对齐（与哪些组件边框线对齐）
  吸附（多少距离内时吸附）
  距离（与哪些组件边框线考虑展示距离）
  冲突检测
