import { postRouter } from "./routers/post/post.procedure";
import { stripeRouter } from "./routers/stripe/stripe.procedure";
import { userRouter } from "./routers/user/user.procedure";
import { workspaceRouter } from "./routers/workspace/workspace.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  workspace: workspaceRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
