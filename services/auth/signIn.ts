//API request for Sign In
interface SignInPayload{
    email: string;
    password: string;
}

export const signInApi = async (payload: SignInPayload) =>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signin`, {
      method: "POST",
      body: JSON.stringify({
          ...payload
      }),
      credentials: "include",
      headers: {"Content-Type": "application/json"}
    });

    return response; 
}