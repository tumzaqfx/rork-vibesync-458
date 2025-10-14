import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { query } from '../../../../src/db/connection';

export const listPostsProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
      userId: z.string().optional(),
    })
  )
  .query(async ({ input, ctx }) => {
    const whereClause = input.userId ? 'WHERE p.user_id = $3' : '';
    const params = input.userId
      ? [input.limit, input.offset, input.userId]
      : [input.limit, input.offset];

    const result = await query(
      `SELECT p.*, 
              u.username, u.display_name as user_display_name, u.profile_image, u.is_verified,
              ${ctx.userId ? `EXISTS(SELECT 1 FROM likes WHERE user_id = '${ctx.userId}' AND post_id = p.id) as is_liked,` : 'false as is_liked,'}
              ${ctx.userId ? `EXISTS(SELECT 1 FROM saved_posts WHERE user_id = '${ctx.userId}' AND post_id = p.id) as is_saved` : 'false as is_saved'}
       FROM posts p
       JOIN users u ON p.user_id = u.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    );

    return result.rows.map((post) => ({
      id: post.id,
      userId: post.user_id,
      username: post.username,
      userDisplayName: post.user_display_name,
      profileImage: post.profile_image,
      isVerified: post.is_verified,
      content: post.content,
      image: post.image_url,
      video: post.video_url,
      audio: post.audio_url,
      voiceNote: post.voice_note_url
        ? {
            url: post.voice_note_url,
            duration: post.voice_note_duration,
          }
        : undefined,
      likes: post.likes_count,
      comments: post.comments_count,
      shares: post.shares_count,
      views: post.views_count,
      timestamp: post.created_at,
      isBoosted: post.is_boosted,
      isLiked: post.is_liked,
      isSaved: post.is_saved,
    }));
  });

export default listPostsProcedure;
