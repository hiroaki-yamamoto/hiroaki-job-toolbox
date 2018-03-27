import { Adder } from '../test_js/add';
import { Subtractor } from '../test_js/sub';

export default (value) => {
  const add = new Adder();
  add.add(value);
  const sub = new Subtractor(add.number());
  sub.sub(value);
  return sub.number();
};
