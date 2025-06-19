//API request to check if user is authenticated (token sent with httpOnly cookie)
export const checkAuthApi = async () =>{
   
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/checkauth`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
      });

      return response;

}
   
