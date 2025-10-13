import { z } from 'zod';
import { protectedProcedure } from '../../../create-context';
import { query } from '../../../../db/connection';

export const updateProfileProcedure = protectedProcedure
  .input(
    z.object({
      displayName: z.string().min(1).max(100).optional(),
      bio: z.string().max(500).optional(),
      location: z.string().max(100).optional(),
      profileImage: z.string().optional(),
      coverImage: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (input.displayName !== undefined) {
      updates.push(`display_name = $${paramIndex++}`);
      values.push(input.displayName);
    }
    if (input.bio !== undefined) {
      updates.push(`bio = $${paramIndex++}`);
      values.push(input.bio);
    }
    if (input.location !== undefined) {
      updates.push(`location = $${paramIndex++}`);
      values.push(input.location);
    }
    if (input.profileImage !== undefined) {
      updates.push(`profile_image = $${paramIndex++}`);
      values.push(input.profileImage);
    }
    if (input.coverImage !== undefined) {
      updates.push(`cover_image = $${paramIndex++}`);
      values.push(input.coverImage);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push(`updated_at = NOW()`);
    values.push(ctx.userId);

    const result = await query(
      `UPDATE users 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, username, display_name, bio, location, profile_image, cover_image, is_verified`,
      values
    );

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
    };
  });

export default updateProfileProcedure;
