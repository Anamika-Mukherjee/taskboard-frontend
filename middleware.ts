//Middleware to protect User routes
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import { checkTokenApi } from "./services/auth/checkToken";

export async function middleware(req: NextRequest){
  const {pathname} = req.nextUrl;

  try{
    if(pathname.startsWith("/user")){
            const accessToken = req.cookies.get("accessToken")?.value;
            const refreshToken = req.cookies.get("refreshToken")?.value;

            if(accessToken && refreshToken){
                const response = await checkTokenApi(accessToken, refreshToken);
                const responseData = await response.json();

                if(!response.ok){
                  throw new Error(responseData.message);
                }
                if(responseData.userDetails){
                    return NextResponse.next();
                }
                else{
                  throw new Error("Could not authenticate user");
                }
            }
            else{
              throw new Error("Token not available");
            }
    }
    return NextResponse.next();
  }
  catch(err){
    console.log(err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL}`);
  }
}

export const config = {
    matcher: ["/user/:path*"]
}