// In-memory database for development
// No external dependencies required

interface User {
  id: number;
  email: string;
  password: string;
  username: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface Post {
  id: number;
  user_id: number;
  content: string;
  media_url: string | null;
  media_type: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

interface Follow {
  follower_id: number;
  following_id: number;
  created_at: string;
}

interface Like {
  user_id: number;
  post_id: number;
  created_at: string;
}

interface Notification {
  id: number;
  user_id: number;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Vibe {
  id: number;
  user_id: number;
  content: string;
  media_url: string | null;
  likes_count: number;
  created_at: string;
  expires_at: string;
}

interface Live {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: 'scheduled' | 'live' | 'ended';
  viewers_count: number;
  scheduled_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

// In-memory storage
const db = {
  users: [] as User[],
  posts: [] as Post[],
  comments: [] as Comment[],
  follows: [] as Follow[],
  likes: [] as Like[],
  notifications: [] as Notification[],
  messages: [] as Message[],
  vibes: [] as Vibe[],
  lives: [] as Live[],
  
  // Auto-increment counters
  counters: {
    users: 1,
    posts: 1,
    comments: 1,
    notifications: 1,
    messages: 1,
    vibes: 1,
    lives: 1,
  }
};

console.log('[Database] Initializing in-memory database...');

export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('[Database] ✅ Connection test successful (in-memory)');
    return true;
  } catch (error: any) {
    console.error('[Database] ❌ Connection test failed:', error.message);
    return false;
  }
};

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  
  try {
    // Simple query parser for common operations
    const queryUpper = text.trim().toUpperCase();
    let rows: any[] = [];
    let lastInsertRowid: number | undefined;
    
    // Handle SELECT queries
    if (queryUpper.startsWith('SELECT')) {
      if (queryUpper.includes('FROM USERS')) {
        if (queryUpper.includes('WHERE EMAIL')) {
          const email = params?.[0];
          rows = db.users.filter(u => u.email === email);
        } else if (queryUpper.includes('WHERE ID')) {
          const id = params?.[0];
          rows = db.users.filter(u => u.id === id);
        } else if (queryUpper.includes('WHERE USERNAME')) {
          const username = params?.[0];
          rows = db.users.filter(u => u.username.toLowerCase().includes(username?.toLowerCase() || ''));
        } else {
          rows = db.users;
        }
      } else if (queryUpper.includes('FROM POSTS')) {
        if (queryUpper.includes('WHERE USER_ID')) {
          const userId = params?.[0];
          rows = db.posts.filter(p => p.user_id === userId);
        } else {
          rows = db.posts.slice().sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
      } else if (queryUpper.includes('FROM COMMENTS')) {
        const postId = params?.[0];
        rows = db.comments.filter(c => c.post_id === postId);
      } else if (queryUpper.includes('FROM VIBES')) {
        rows = db.vibes.slice().sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (queryUpper.includes('FROM LIVES')) {
        rows = db.lives.filter(l => l.status === 'live' || l.status === 'scheduled');
      } else if (queryUpper.includes('FROM NOTIFICATIONS')) {
        const userId = params?.[0];
        rows = db.notifications.filter(n => n.user_id === userId);
      } else if (queryUpper.includes('FROM MESSAGES')) {
        rows = db.messages;
      }
    }
    // Handle INSERT queries
    else if (queryUpper.startsWith('INSERT INTO')) {
      if (queryUpper.includes('USERS')) {
        const user: User = {
          id: db.counters.users++,
          email: params?.[0] || '',
          password: params?.[1] || '',
          username: params?.[2] || '',
          full_name: params?.[3] || '',
          bio: params?.[4] || null,
          avatar_url: params?.[5] || null,
          is_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        db.users.push(user);
        lastInsertRowid = user.id;
      } else if (queryUpper.includes('POSTS')) {
        const post: Post = {
          id: db.counters.posts++,
          user_id: params?.[0] || 0,
          content: params?.[1] || '',
          media_url: params?.[2] || null,
          media_type: params?.[3] || null,
          likes_count: 0,
          comments_count: 0,
          created_at: new Date().toISOString(),
        };
        db.posts.push(post);
        lastInsertRowid = post.id;
      } else if (queryUpper.includes('COMMENTS')) {
        const comment: Comment = {
          id: db.counters.comments++,
          post_id: params?.[0] || 0,
          user_id: params?.[1] || 0,
          content: params?.[2] || '',
          created_at: new Date().toISOString(),
        };
        db.comments.push(comment);
        lastInsertRowid = comment.id;
      } else if (queryUpper.includes('VIBES')) {
        const vibe: Vibe = {
          id: db.counters.vibes++,
          user_id: params?.[0] || 0,
          content: params?.[1] || '',
          media_url: params?.[2] || null,
          likes_count: 0,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };
        db.vibes.push(vibe);
        lastInsertRowid = vibe.id;
      } else if (queryUpper.includes('LIVES')) {
        const live: Live = {
          id: db.counters.lives++,
          user_id: params?.[0] || 0,
          title: params?.[1] || '',
          description: params?.[2] || null,
          status: 'scheduled',
          viewers_count: 0,
          scheduled_at: params?.[3] || null,
          started_at: null,
          ended_at: null,
          created_at: new Date().toISOString(),
        };
        db.lives.push(live);
        lastInsertRowid = live.id;
      } else if (queryUpper.includes('FOLLOWS')) {
        const follow: Follow = {
          follower_id: params?.[0] || 0,
          following_id: params?.[1] || 0,
          created_at: new Date().toISOString(),
        };
        db.follows.push(follow);
      } else if (queryUpper.includes('LIKES')) {
        const like: Like = {
          user_id: params?.[0] || 0,
          post_id: params?.[1] || 0,
          created_at: new Date().toISOString(),
        };
        db.likes.push(like);
      }
    }
    // Handle UPDATE queries
    else if (queryUpper.startsWith('UPDATE')) {
      if (queryUpper.includes('USERS')) {
        const userId = params?.[params.length - 1];
        const user = db.users.find(u => u.id === userId);
        if (user) {
          user.updated_at = new Date().toISOString();
        }
      } else if (queryUpper.includes('NOTIFICATIONS')) {
        const notifId = params?.[0];
        const notif = db.notifications.find(n => n.id === notifId);
        if (notif) {
          notif.is_read = true;
        }
      } else if (queryUpper.includes('LIVES')) {
        const liveId = params?.[params.length - 1];
        const live = db.lives.find(l => l.id === liveId);
        if (live && queryUpper.includes('STATUS')) {
          live.status = params?.[0] as any;
          if (params?.[0] === 'live') {
            live.started_at = new Date().toISOString();
          } else if (params?.[0] === 'ended') {
            live.ended_at = new Date().toISOString();
          }
        }
      }
    }
    // Handle DELETE queries
    else if (queryUpper.startsWith('DELETE')) {
      if (queryUpper.includes('FROM FOLLOWS')) {
        const followerId = params?.[0];
        const followingId = params?.[1];
        const index = db.follows.findIndex(f => 
          f.follower_id === followerId && f.following_id === followingId
        );
        if (index !== -1) {
          db.follows.splice(index, 1);
        }
      }
    }
    
    const duration = Date.now() - start;
    
    console.log('[Database] Query executed:', {
      query: text.substring(0, 100),
      duration: `${duration}ms`,
      rows: rows.length,
    });
    
    return {
      rows,
      rowCount: rows.length,
      lastInsertRowid,
    };
  } catch (error: any) {
    const duration = Date.now() - start;
    console.error('[Database] ❌ Query error:', {
      query: text.substring(0, 100),
      duration: `${duration}ms`,
      error: error.message,
    });
    throw error;
  }
};

export const isHealthy = (): boolean => {
  return true;
};

export const closePool = async (): Promise<void> => {
  console.log('[Database] 👋 Closing in-memory database');
};

console.log('[Database] ✅ In-memory database initialized successfully');
