import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../db/connection';

export const conversationsProcedure = protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(50),
    })
  )
  .query(async ({ input, ctx }) => {
    const result = await query(
      `SELECT DISTINCT c.*, 
              cp.unread_count,
              (SELECT json_agg(json_build_object(
                'id', u.id,
                'username', u.username,
                'displayName', u.display_name,
                'profileImage', u.profile_image,
                'isVerified', u.is_verified
              ))
              FROM conversation_participants cp2
              JOIN users u ON cp2.user_id = u.id
              WHERE cp2.conversation_id = c.id AND cp2.user_id != $1
              ) as participants
       FROM conversations c
       JOIN conversation_participants cp ON c.id = cp.conversation_id
       WHERE cp.user_id = $1 AND c.is_archived = false
       ORDER BY c.updated_at DESC
       LIMIT $2`,
      [ctx.userId, input.limit]
    );

    return result.rows.map((conv) => ({
      id: conv.id,
      type: conv.type,
      name: conv.name,
      image: conv.image,
      description: conv.description,
      participants: conv.participants || [],
      unreadCount: conv.unread_count,
      isPinned: conv.is_pinned,
      isMuted: conv.is_muted,
      isRequest: conv.is_request,
      updatedAt: conv.updated_at,
    }));
  });

export default conversationsProcedure;
