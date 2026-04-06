import axios from "axios";

// 1. Define an interface for the search parameters
interface SearchAnimeParams {
  page?: number;
  query?: string;
  rating?: string;
  orderBy?: string; // Note: component uses orderBy, Jikan uses order_by
  sort?: string;
  startDate?: string;
  type?: string;
  status?: string;
  sfw?: boolean;
  signal?: AbortSignal; // For canceling requests
}

export default function useAnimeAPI() {
  // 2. Added options object to accept the AbortSignal
  const getAnimeSeason = async (
    season: string,
    year: string,
    page: number,
    sfw?: boolean,
    filter: string,
    options?: { signal?: AbortSignal },
  ) => {
    try {
      console.log(
        `Fetching season ${season} ${year}, page ${page}, sfw: ${sfw}, filter: ${filter}`,
      );
      const response = await axios.get(
        `https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}&unapproved=true${sfw ? `&sfw` : ""}&filter=${filter}`,
        { signal: options?.signal }, // Pass signal to axios
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching anime data:", error);
      throw error;
    }
  };

  const getAnimeSeasonNow = async (
    page: number,
    sfw: boolean,
    filter: string,
    options?: { signal?: AbortSignal },
  ) => {
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/seasons/now?page=${page}&unapproved=true&sfw=${sfw}&filter=${filter}`,
        { signal: options?.signal }, // Pass signal to axios
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching anime data:", error);
      throw error;
    }
  };

  const getAnimeById = async (id: string) => {
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime/${id}/full`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching anime data:", error);
      throw error;
    }
  };

  // 3. Renamed to getAnimeSearch and updated to accept the single params object
  const getAnimeSearch = async (params: SearchAnimeParams) => {
    try {
      // URLSearchParams is much cleaner than massive template literals!
      const queryParams = new URLSearchParams();

      queryParams.append("unapproved", "true");
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.query) queryParams.append("q", params.query);
      if (params.rating) queryParams.append("rating", params.rating);
      if (params.orderBy) queryParams.append("order_by", params.orderBy); // Maps to Jikan's expected key
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.startDate) queryParams.append("start_date", params.startDate);
      if (params.type) queryParams.append("type", params.type);
      if (params.status) queryParams.append("status", params.status);
      if (params.sfw !== undefined)
        queryParams.append("sfw", params.sfw.toString());

      // console.log("Constructed query params:", queryParams.toString()); // Debug log to verify params
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime?${queryParams.toString()}`,
        { signal: params.signal }, // Pass signal to axios
      );
      return response.data;
    } catch (error) {
      // Bulletproof check for Axios cancellation
      if (
        axios.isCancel(error) ||
        error.name === "CanceledError" ||
        error.message === "canceled"
      ) {
        // Silently throw the error forward so the component knows it stopped,
        // but DO NOT console.error it here.
        throw error;
      }

      // Only log REAL errors
      console.error("Error fetching anime data:", error);
      throw error;
    }
  };

  const getAnimeCharacters = async (id: string) => {
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime/${id}/characters`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching anime characters:", error);
      throw error;
    }
  };

  const getCharacterFullById = async (id: string) => {
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/characters/${id}/full`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching character data:", error);
      throw error;
    }
  };

  return {
    getAnimeSeason,
    getAnimeSeasonNow,
    getAnimeById,
    getAnimeSearch,
    getAnimeCharacters,
    getCharacterFullById,
  };
}
