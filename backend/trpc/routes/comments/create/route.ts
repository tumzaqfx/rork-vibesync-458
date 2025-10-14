import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../src/db/connection';

export const createCommentProcedure = protectedProcedure
  .input(
    z.object({
      postId: z.string(),
      content: z.string().min(1),
      parentId: z.string().optional(),
      voiceNoteUrl: z.string().optional(),
      voiceNoteDuration: z.number().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const result = await query(
      `INSERT INTO comments (post_id, user_id, parent_id, content, voice_note_url, voice_note_duration)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        input.postId,
        ctx.userId,
        input.parentId || null,
        input.content,
        input.voiceNoteUrl || null,
        input.voiceNoteDuration || null,
      ]
    );

    await query(
      'UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1',
      [input.postId]
    );

    const comment = result.rows[0];

    return {
      id: comment.id,
      postId: comment.post_id,
      userId: comment.user_id,
      content: comment.content,
      voiceNote: comment.voice_note_url
        ? {
            url: comment.voice_note_url,
            duration: comment.voice_note_duration,
          }
        : undefined,
      timestamp: comment.created_at,
      likes: comment.likes_count,
    };
  });

export default createCommentProcedure;
