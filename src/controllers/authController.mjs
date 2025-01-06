import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import { User } from '../models/userModel.mjs';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  try {
    const { id_token } = req.body; // ID Token received from Google OAuth flow

    if (!id_token) {
      return res.status(400).json({ error: 'ID Token is required' });
    }

    // Decode the ID Token manually for debugging
    const decodedToken = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString());
    console.log("Decoded Token Payload: ", decodedToken);

    // Verify the ID token using Google's OAuth2Client with the exact audience
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: decodedToken.aud, 
    });

    
    const { email, name, sub: googleId } = ticket.getPayload();

    
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
      });
    }

    res.status(200).json({ userId: user._id, name: user.name });
  } catch (err) {
    console.error("Error during registration/login: ", err);
    res.status(500).json({ error: 'Error during registration or login', message: err.message });
  }
};
