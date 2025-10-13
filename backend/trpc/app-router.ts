import { createTRPCRouter } from "./create-context";

import registerProcedure from "./routes/auth/register/route";
import loginProcedure from "./routes/auth/login/route";
import meProcedure from "./routes/auth/me/route";

import profileProcedure from "./routes/users/profile/route";
import updateProfileProcedure from "./routes/users/update/route";
import followProcedure from "./routes/users/follow/route";
import unfollowProcedure from "./routes/users/unfollow/route";
import searchUsersProcedure from "./routes/users/search/route";

import listPostsProcedure from "./routes/posts/list/route";
import createPostProcedure from "./routes/posts/create/route";
import likePostProcedure from "./routes/posts/like/route";

import listCommentsProcedure from "./routes/comments/list/route";
import createCommentProcedure from "./routes/comments/create/route";

import listLiveProcedure from "./routes/live/list/route";
import createLiveProcedure from "./routes/live/create/route";
import startLiveProcedure from "./routes/live/start/route";
import endLiveProcedure from "./routes/live/end/route";

import listVibesProcedure from "./routes/vibes/list/route";
import createVibeProcedure from "./routes/vibes/create/route";

import listNotificationsProcedure from "./routes/notifications/list/route";
import markReadProcedure from "./routes/notifications/markRead/route";

import conversationsProcedure from "./routes/messages/conversations/route";
import sendMessageProcedure from "./routes/messages/send/route";

export const appRouter = createTRPCRouter({
  auth: createTRPCRouter({
    register: registerProcedure,
    login: loginProcedure,
    me: meProcedure,
  }),
  users: createTRPCRouter({
    profile: profileProcedure,
    update: updateProfileProcedure,
    follow: followProcedure,
    unfollow: unfollowProcedure,
    search: searchUsersProcedure,
  }),
  posts: createTRPCRouter({
    list: listPostsProcedure,
    create: createPostProcedure,
    like: likePostProcedure,
  }),
  comments: createTRPCRouter({
    list: listCommentsProcedure,
    create: createCommentProcedure,
  }),
  live: createTRPCRouter({
    list: listLiveProcedure,
    create: createLiveProcedure,
    start: startLiveProcedure,
    end: endLiveProcedure,
  }),
  vibes: createTRPCRouter({
    list: listVibesProcedure,
    create: createVibeProcedure,
  }),
  notifications: createTRPCRouter({
    list: listNotificationsProcedure,
    markRead: markReadProcedure,
  }),
  messages: createTRPCRouter({
    conversations: conversationsProcedure,
    send: sendMessageProcedure,
  }),
});

export type AppRouter = typeof appRouter;
