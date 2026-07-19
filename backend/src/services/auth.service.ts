import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData: any) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return { id: user._id, name: user.name, email: user.email };
};

export const loginUser = async (loginData: any) => {
  const { email, password } = loginData;

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );

  return { token, user: { id: user._id, name: user.name, email: user.email } };
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
