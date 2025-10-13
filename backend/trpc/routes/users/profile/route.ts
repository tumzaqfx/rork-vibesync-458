import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { query } from '../../../../db/connection';

export const profileProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input, ctx }) => {
    const result = await query(
      `SELECT u.id, u.username, u.display_name, u.bio, u.location, u.profile_image, 
              u.cover_image, u.is_verified, u.vibe_score, u.followers_count, 
              u.following_count, u.posts_count, u.created_at,
              ${ctx.userId ? `EXISTS(SELECT 1 FROM follows WHERE follower_id = $2 AND following_id = u.id) as is_following` : 'false as is_following'}
       FROM users u
       WHERE u.id = $1`,
      ctx.userId ? [input.userId, ctx.userId] : [input.userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];

    return {
      id: user.id,
      username: user.username,
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
      isFollowing: user.is_following,
      createdAt: user.created_at,
    };
  });

export default profileProcedure;
