import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { query } from '../../../../src/db/connection';

export const listCommentsProcedure = publicProcedure
  .input(
    z.object({
      postId: z.string(),
      limit: z.number().min(1).max(100).default(50),
    })
  )
  .query(async ({ input, ctx }) => {
    const result = await query(
      `SELECT c.*, 
              u.username, u.display_name as user_display_name, u.profile_image, u.is_verified,
              ${ctx.userId ? `EXISTS(SELECT 1 FROM likes WHERE user_id = '${ctx.userId}' AND comment_id = c.id) as is_liked` : 'false as is_liked'}
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1 AND c.parent_id IS NULL
       ORDER BY c.created_at DESC
       LIMIT $2`,
      [input.postId, input.limit]
    );

    return result.rows.map((comment) => ({
      id: comment.id,
      postId: comment.post_id,
      userId: comment.user_id,
      username: comment.username,
      userDisplayName: comment.user_display_name,
      profileImage: comment.profile_image,
      isVerified: comment.is_verified,
      content: comment.content,
      voiceNote: comment.voice_note_url
        ? {
            url: comment.voice_note_url,
            duration: comment.voice_note_duration,
          }
        : undefined,
      timestamp: comment.created_at,
      likes: comment.likes_count,
      isLiked: comment.is_liked,
      isAuthorLiked: comment.is_author_liked,
    }));
  });

export default listCommentsProcedure;
