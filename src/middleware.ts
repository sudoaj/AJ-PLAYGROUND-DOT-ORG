import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    console.log("Protected route accessed:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Return true if the user is authenticated
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
