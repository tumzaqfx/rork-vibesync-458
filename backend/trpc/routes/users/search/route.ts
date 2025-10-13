import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { query } from '../../../../db/connection';

export const searchUsersProcedure = publicProcedure
  .input(
    z.object({
      query: z.string().min(1),
      limit: z.number().min(1).max(50).default(20),
    })
  )
  .query(async ({ input }) => {
    const result = await query(
      `SELECT id, username, display_name, profile_image, is_verified, 
              followers_count, bio
       FROM users
       WHERE username ILIKE $1 OR display_name ILIKE $1
       ORDER BY followers_count DESC
       LIMIT $2`,
      [`%${input.query}%`, input.limit]
    );

    return result.rows.map((user) => ({
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      profileImage: user.profile_image,
      isVerified: user.is_verified,
      followersCount: user.followers_count,
      bio: user.bio,
    }));
  });

export default searchUsersProcedure;
