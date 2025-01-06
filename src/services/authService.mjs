import { User } from '../models/userModel.mjs';
import { verifyGoogleToken } from '../utils/googleAuth.mjs';

/**
 * Handle user registration with Google
 * @param {string} token - Google ID token
 * @returns {Promise<object>} - Registered user details
 */
export const registerUser = async (token) => {
  try {
    // Verify the Google token
    const { googleId, email, name } = await verifyGoogleToken(token);

    // Check if the user already exists
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create a new user if not found
      user = await User.create({ googleId, email, name });
    }

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw new Error('User registration failed.');
  }
};
