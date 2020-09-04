import { rectanglePacking } from '../bfdh';

test('平分用例', () => {
  expect(
    JSON.stringify(
      rectanglePacking([
        { w: 4, h: 2 },
        { w: 4, h: 2 },
        { w: 4, h: 2 },
        { w: 4, h: 2 },
        { w: 4, h: 2 },
      ])
    )
  ).toBe(
    '[{"w":4,"h":2,"x":0,"y":0},{"w":4,"h":2,"x":4,"y":0},{"w":4,"h":2,"x":8,"y":0},{"w":4,"h":2,"x":0,"y":2},{"w":4,"h":2,"x":4,"y":2}]'
  );
});

test('交错用例', () => {
  expect(
    JSON.stringify(
      rectanglePacking([
        { w: 8, h: 2 },
        { w: 4, h: 2 },
        { w: 4, h: 2 },
        { w: 8, h: 2 },
        { w: 4, h: 2 },
      ])
    )
  ).toBe(
    '[{"w":8,"h":2,"x":0,"y":0},{"w":4,"h":2,"x":8,"y":0},{"w":4,"h":2,"x":0,"y":2},{"w":8,"h":2,"x":4,"y":2},{"w":4,"h":2,"x":0,"y":4}]'
  );
});

test('越界检测', (done) => {
  try {
    rectanglePacking([
      { w: 14, h: 2 },
      { w: 4, h: 2 },
      { w: 4, h: 2 },
      { w: 8, h: 2 },
      { w: 4, h: 2 },
    ])  
  } catch (error) {
    done()
  }
  
});

