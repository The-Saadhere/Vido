import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function proxy() {
return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({token , req}) =>{
            const {pathname} = req.nextUrl
                if(
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/signIn") ||
                    pathname.startsWith("/signUp")
                    || pathname.startsWith("/upload-video")
                    || pathname.startsWith("/api/upload-auth") ||
                     pathname.startsWith("/api/videos")
                ){
                    return true;
                }
                if(pathname === "/" || pathname.startsWith("/api/videos")){
                    return true;
                }
                return !!token
            }
        }
    }
)

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};


