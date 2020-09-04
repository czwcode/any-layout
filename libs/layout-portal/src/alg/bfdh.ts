
export interface IBaseNode {
  w: number;
  h: number;
}
interface INode extends IBaseNode {
  x: number;
  y: number;
}
interface INodeWithX {
  x: number;
  data: IBaseNode;
}
interface ILevel {
  nodes: INodeWithX[];
  maxH: number;
}
export function rectanglePacking(nodes: IBaseNode[], relativeWidth: number = 12): INode[] {
  return toNodes();
  function toNodes() {
    const levels = getAllLevels();
    return levels.reduce(
      (nodes, level, index) =>
        nodes.concat(
          level.nodes.map((node) => ({
            ...node.data,
            x: node.x,
            y: getLevelHeight(levels.slice(0, index)),
          }))
        ),
      []
    );
  }
  function getLevelHeight(levels: ILevel[]) {
    return levels.reduce((sum, level) => sum + level.maxH, 0);
  }
  function getAllLevels() {
    let levels: ILevel[] = [];
    nodes.forEach((node, index) => {
      if(node.w > relativeWidth) {
        throw "最大宽度限制为" + relativeWidth + "第" + index + "节点越界";
      }
      if (levels.length === 0) {
        levels.push(createLevel(node));
      } else {
        const findLevel = findAppropriate(levels, node.w);
        if (findLevel === null) {
          levels.push(createLevel(node));
        } else {
          const targetLevel = levels[findLevel];

          targetLevel.nodes.push({
            data: node,
            x: targetLevel.nodes.reduce((sum, node) => sum + node.data.w, 0),
          });
          targetLevel.maxH = Math.max(targetLevel.maxH, node.h);
        }
      }
    });
    return levels;
  }
  /**
   * 如果找到合适的插入层级，则返回插入位置，否则返回null
   * @param width 当前要插入的矩形宽度
   */
  function findAppropriate(levels: ILevel[], width: number) {
    let minLevelIndex = null;
    let minLevelSpace = relativeWidth;
    levels.forEach((level, index) => {
      const { nodes } = level;
      const space = getSpace(nodes.map((item) => item.data));
      if (space > 0) {
        const remainingWidth = space - width;
        if (space >= width && remainingWidth < minLevelSpace) {
          minLevelIndex = index;
          minLevelSpace = remainingWidth;
        }
      }
    });
    return minLevelIndex;
  }
  function getSpace(nodes: IBaseNode[]) {
    return relativeWidth - nodes.reduce((sum, node) => node.w + sum, 0);
  }
  function createLevel(node: IBaseNode): ILevel {
    return {
      maxH: node.h,
      nodes: [{ x: 0, data: node }],
    };
  }
}
