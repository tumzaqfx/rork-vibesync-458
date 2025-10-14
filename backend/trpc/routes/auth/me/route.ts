import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../src/db/connection';

export const meProcedure = protectedProcedure.query(async ({ ctx }) => {
  const result = await query(
    `SELECT id, username, email, display_name, bio, location, profile_image, 
            cover_image, is_verified, vibe_score, followers_count, following_count, posts_count
     FROM users 
     WHERE id = $1`,
    [ctx.userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  const user = result.rows[0];

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.display_name,
    bio: user.bio,
    location: user.location,
    profileImage: user.profile_image,
    coverImage: user.cover_image,
    isVerified: user.is_verified,
    vibeScore: user.vibe_score,
    followersCount: user.followers_count,
    followingCount: user.following_count,
    postsCount: user.posts_count,
  };
});

export default meProcedure;