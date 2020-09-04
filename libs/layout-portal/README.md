### 布局的延展性

1. 为了布局的延展性支持，需要支持嵌套布局

- 根据内容撑开容器大小
- 定义最大高度，超出 overflow: auto

2. 为了支持容器内装箱填充，需要支持绝对布局
3. 支持响应式
4. 支持根据 UA 切换组件展示形式

### 所有布局渲染，统一通过 layout-core 支持

- model 格式

```js
[
  {
    type: 'container',
    children: [{
      type: 'containerPanel',
      children: [{
        type: 'nestLayer'
        children: [
          {
            type: 'row',
            children: [
              {
                type: 'col',
                w: 4,
                children: [
                  {
                    type: 'container',
                    children: [
                      {
                        type: 'containerPanel',
                        children: [
                          { 
                            type: 'gridLayer',
                            children: [
                              {
                                type: 'gridAtom',
                                x,
                                y,
                                w,
                                h
                              },
                               {
                                type: 'gridAtom',
                                x,
                                y,
                                w,
                                h
                              },
                               {
                                type: 'gridAtom',
                                x,
                                y,
                                w,
                                h
                              }
                            ]
                          }
                        ]
                      }
                    ],

                  }
                ]
              },
               {
                type: 'col',
                w: 8,
                children: [
                  {
                    type: 'container',
                    children: [
                      {
                        type: 'containerPanel',
                        children: [
                          { 
                            type: 'gridLayer',
                            children: [
                              {
                                type: 'gridAtom',
                                x,
                                y,
                                w,
                                h
                              },
                               {
                                type: 'gridAtom',
                                x,
                                y,
                                w,
                                h
                              },
                               {
                                type: 'gridAtom',
                                x,
                                y,
                                w,
                                h
                              }
                            ]
                          }
                        ]
                      }
                    ],

                  }
                ]
              }
            ]
          }
        ]
      }]
    }]
  }
]
```
