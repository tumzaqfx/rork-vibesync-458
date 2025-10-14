import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../src/db/connection';

export const createPostProcedure = protectedProcedure
  .input(
    z.object({
      content: z.string().min(1),
      imageUrl: z.string().optional(),
      videoUrl: z.string().optional(),
      audioUrl: z.string().optional(),
      voiceNoteUrl: z.string().optional(),
      voiceNoteDuration: z.number().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const result = await query(
      `INSERT INTO posts (user_id, content, image_url, video_url, audio_url, voice_note_url, voice_note_duration)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        ctx.userId,
        input.content,
        input.imageUrl || null,
        input.videoUrl || null,
        input.audioUrl || null,
        input.voiceNoteUrl || null,
        input.voiceNoteDuration || null,
      ]
    );

    await query(
      'UPDATE users SET posts_count = posts_count + 1 WHERE id = $1',
      [ctx.userId]
    );

    const post = result.rows[0];

    return {
      id: post.id,
      userId: post.user_id,
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
    };
  });

export default createPostProcedure;
