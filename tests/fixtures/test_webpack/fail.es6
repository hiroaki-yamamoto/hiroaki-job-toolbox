import { Adder } from './add';
import { Subtractor } from './sub';

export default (value) => {
  const add = new Adder();
  add.add(value);
  const sub = new Subtractor(add.number());
  sub.sub(value);
  return sub.number();
};
