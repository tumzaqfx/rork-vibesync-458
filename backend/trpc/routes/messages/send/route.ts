import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../db/connection';

export const sendMessageProcedure = protectedProcedure
  .input(
    z.object({
      conversationId: z.string(),
      content: z.string().min(1),
      type: z.enum(['text', 'image', 'video', 'voice', 'gif', 'sticker', 'file']).default('text'),
      mediaUrl: z.string().optional(),
      thumbnailUrl: z.string().optional(),
      duration: z.number().optional(),
      fileName: z.string().optional(),
      fileSize: z.number().optional(),
      replyTo: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const result = await query(
      `INSERT INTO messages (conversation_id, sender_id, type, content, media_url, thumbnail_url, duration, file_name, file_size, reply_to)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        input.conversationId,
        ctx.userId,
        input.type,
        input.content,
        input.mediaUrl || null,
        input.thumbnailUrl || null,
        input.duration || null,
        input.fileName || null,
        input.fileSize || null,
        input.replyTo || null,
      ]
    );

    await query(
      'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
      [input.conversationId]
    );

    await query(
      `UPDATE conversation_participants 
       SET unread_count = unread_count + 1 
       WHERE conversation_id = $1 AND user_id != $2`,
      [input.conversationId, ctx.userId]
    );

    const message = result.rows[0];

    return {
      id: message.id,
      conversationId: message.conversation_id,
      senderId: message.sender_id,
      type: message.type,
      content: message.content,
      mediaUrl: message.media_url,
      thumbnailUrl: message.thumbnail_url,
      duration: message.duration,
      fileName: message.file_name,
      fileSize: message.file_size,
      replyTo: message.reply_to,
      status: message.status,
      createdAt: message.created_at,
    };
  });

export default sendMessageProcedure;
