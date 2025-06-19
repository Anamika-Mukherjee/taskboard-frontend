//API request for Sign Up
interface SignUpPayload{
    name: string;
    email: string;
    password: string;
}

export const signUpApi = async (payload: SignUpPayload) =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
            ...payload
        }),
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });
      
      return response;  
}