//API request to search a project
export const searchProjectApi = async (searchQuery: string) =>{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/project/search?query=${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {"Content-Type": "application/json"}
      });

      return response;
}