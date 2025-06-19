//API request to edit user profile
interface EditProfilePayload{
    name: string;
    contactNumber: string;
    company: string;     
}

export const editProfileApi = async (payload: EditProfilePayload) =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/editprofile`, {
        method: "PATCH",
        body: JSON.stringify({
            ...payload
        }),
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });
      
      return response;
}