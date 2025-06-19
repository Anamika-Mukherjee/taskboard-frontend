//API request to check if user is authenticated (token sent with authorization header)
export const checkTokenApi = async (accessToken: string, refreshToken: string) =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/checkauth`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
        },
        credentials: "include",
      });

      return response;

}
   
