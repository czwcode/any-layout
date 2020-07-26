### [Demos](https://chenzhiwei199.github.io/static-pages/?path=/story/demos-%E5%B5%8C%E5%A5%97%E5%B8%83%E5%B1%80--%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8B%96%E6%8B%BD%E5%B1%95%E7%A4%BA)

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
