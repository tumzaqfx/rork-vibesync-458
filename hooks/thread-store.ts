import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback } from 'react';
import { Thread, ThreadPost, ThreadComment, CommentReply } from '@/types/thread';
import { mockThreads } from '@/mocks/threads';

export const [ThreadProvider, useThreads] = createContextHook(() => {
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [threadPosts, setThreadPosts] = useState<Record<string, ThreadPost[]>>({});
  const [comments, setComments] = useState<Record<string, ThreadComment[]>>({});

  const getThread = useCallback((threadId: string) => {
    return threads.find(t => t.id === threadId);
  }, [threads]);

  const getThreadByRootPost = useCallback((postId: string) => {
    return threads.find(t => t.rootPostId === postId);
  }, [threads]);

  const getThreadPosts = useCallback((threadId: string) => {
    return threadPosts[threadId] || [];
  }, [threadPosts]);

  const addToThread = useCallback((
    threadId: string,
    post: Omit<ThreadPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'revibes' | 'saves' | 'isLiked' | 'isRevibed' | 'isSaved'>
  ) => {
    const newPost: ThreadPost = {
      ...post,
      id: `thread-post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      revibes: 0,
      saves: 0,
      isLiked: false,
      isRevibed: false,
      isSaved: false,
    };

    setThreadPosts(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newPost],
    }));

    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          posts: [...thread.posts, newPost],
          totalEngagement: thread.totalEngagement + 1,
        };
      }
      return thread;
    }));

    console.log('Added post to thread:', threadId, newPost);
  }, []);

  const createThread = useCallback((rootPost: ThreadPost) => {
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      rootPostId: rootPost.id,
      posts: [rootPost],
      totalEngagement: 0,
      isCollaborative: false,
      isTrending: false,
      vibeScore: 0,
    };

    setThreads(prev => [...prev, newThread]);
    console.log('Created new thread:', newThread);
    return newThread;
  }, []);

  const toggleThreadPostLike = useCallback((threadId: string, postId: string) => {
    setThreadPosts(prev => ({
      ...prev,
      [threadId]: prev[threadId]?.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }) || [],
    }));

    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          posts: thread.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              };
            }
            return post;
          }),
        };
      }
      return thread;
    }));
  }, []);

  const getComments = useCallback((postId: string) => {
    return comments[postId] || [];
  }, [comments]);

  const addComment = useCallback((
    postId: string,
    comment: Omit<ThreadComment, 'id' | 'createdAt' | 'likes' | 'replies' | 'isLiked'>
  ) => {
    const newComment: ThreadComment = {
      ...comment,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      isLiked: false,
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    console.log('Added comment to post:', postId, newComment);
  }, []);

  const addReply = useCallback((
    postId: string,
    commentId: string,
    reply: Omit<CommentReply, 'id' | 'createdAt' | 'likes' | 'replies' | 'isLiked'>,
    parentReplyId?: string
  ) => {
    const newReply: CommentReply = {
      ...reply,
      id: `reply-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      isLiked: false,
      parentReplyId: parentReplyId || null,
    };

    setComments(prev => {
      const postComments = prev[postId] || [];
      
      const addReplyToComment = (comments: ThreadComment[]): ThreadComment[] => {
        return comments.map(comment => {
          if (comment.id === commentId && !parentReplyId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply],
            };
          }
          
          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToReply(comment.replies),
            };
          }
          
          return comment;
        });
      };

      const addReplyToReply = (replies: CommentReply[]): CommentReply[] => {
        return replies.map(r => {
          if (r.id === parentReplyId && newReply.depth <= 3) {
            return {
              ...r,
              replies: [...r.replies, newReply],
            };
          }
          
          if (r.replies.length > 0) {
            return {
              ...r,
              replies: addReplyToReply(r.replies),
            };
          }
          
          return r;
        });
      };

      return {
        ...prev,
        [postId]: addReplyToComment(postComments),
      };
    });

    console.log('Added reply to comment:', commentId, newReply);
  }, []);

  const toggleCommentLike = useCallback((postId: string, commentId: string) => {
    setComments(prev => ({
      ...prev,
      [postId]: prev[postId]?.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      }) || [],
    }));
  }, []);

  const toggleReplyLike = useCallback((postId: string, replyId: string) => {
    setComments(prev => {
      const postComments = prev[postId] || [];
      
      const toggleInReplies = (replies: CommentReply[]): CommentReply[] => {
        return replies.map(reply => {
          if (reply.id === replyId) {
            return {
              ...reply,
              isLiked: !reply.isLiked,
              likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
            };
          }
          
          if (reply.replies.length > 0) {
            return {
              ...reply,
              replies: toggleInReplies(reply.replies),
            };
          }
          
          return reply;
        });
      };

      return {
        ...prev,
        [postId]: postComments.map(comment => ({
          ...comment,
          replies: toggleInReplies(comment.replies),
        })),
      };
    });
  }, []);

  const makeCollaborative = useCallback((threadId: string, collaboratorId: string) => {
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          isCollaborative: true,
          collaborators: [...(thread.collaborators || []), collaboratorId],
        };
      }
      return thread;
    }));
  }, []);

  return {
    threads,
    getThread,
    getThreadByRootPost,
    getThreadPosts,
    addToThread,
    createThread,
    toggleThreadPostLike,
    getComments,
    addComment,
    addReply,
    toggleCommentLike,
    toggleReplyLike,
    makeCollaborative,
  };
});
