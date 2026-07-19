import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export const googleLoginUser = async (credential: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('Invalid Google token');
  }

  const { email, name } = payload;
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: name || 'Google User',
      email,
      authProvider: 'google',
    });
  }

  const jwtToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );

  return { token: jwtToken, user: { id: user._id, name: user.name, email: user.email } };
};
