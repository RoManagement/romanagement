import { postRouter } from "./routers/post/post.procedure";
import { stripeRouter } from "./routers/stripe/stripe.procedure";
import { userRouter } from "./routers/user/user.procedure";
import { workspaceRouter } from "./routers/workspace/workspace.procedure";
import { documentRouter } from "./routers/document/document.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  document: documentRouter,
  workspace: workspaceRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
