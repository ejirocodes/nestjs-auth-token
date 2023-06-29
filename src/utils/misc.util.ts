import * as bcrypt from 'bcrypt';

export function hashData(data: string) {
  return bcrypt.hash(data, 10);
}
