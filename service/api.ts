import axios from "axios";

interface SearchAnimeParams {
  page?: number;
  query?: string;
  rating?: string;
  orderBy?: string;
  sort?: string;
  startDate?: string;
  type?: string;
  status?: string;
  sfw?: boolean;
  signal?: AbortSignal;
}

interface SearchCharactersParams {
  query?: string;
  orderBy?: string;
  sort?: string;
  page?: number;
  signal?: AbortSignal;
}

interface SearchMangaParams {
  page?: number;
  query?: string;
  type?: string;
  status?: string;
  orderBy?: string;
  sort?: string;
  startDate?: string;
  sfw?: boolean;
  signal?: AbortSignal;
}

export default function useAnimeAPI() {
  const getAnimeSeason = async (
    season: string,
    year: string,
    page: number,
    filter: string,
    sfw: boolean,
    options?: { signal?: AbortSignal },
  ) => {
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}&unapproved=true${sfw ? `&sfw` : ""}&filter=${filter}`,
        { signal: options?.signal },
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
        { signal: options?.signal },
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

  const getAnimeSearch = async (params: SearchAnimeParams) => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append("unapproved", "true");
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.query) queryParams.append("q", params.query);
      if (params.rating) queryParams.append("rating", params.rating);
      if (params.orderBy) queryParams.append("order_by", params.orderBy);
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.startDate) queryParams.append("start_date", params.startDate);
      if (params.type) queryParams.append("type", params.type);
      if (params.status) queryParams.append("status", params.status);
      if (params.sfw !== undefined)
        queryParams.append("sfw", params.sfw.toString());

      const response = await axios.get(
        `https://api.jikan.moe/v4/anime?${queryParams.toString()}`,
        { signal: params.signal },
      );
      return response.data;
    } catch (error: any) {
      if (
        axios.isCancel(error) ||
        error.name === "CanceledError" ||
        error.message === "canceled"
      ) {
        throw error;
      }
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

  const searchCharacters = async (params: SearchCharactersParams) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.append("q", params.query);
      if (params.orderBy) queryParams.append("order_by", params.orderBy);
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.page !== undefined) queryParams.append("page", params.page.toString());

      const response = await axios.get(
        `https://api.jikan.moe/v4/characters?${queryParams.toString()}`,
        { signal: params.signal },
      );
      return response.data;
    } catch (error: any) {
      if (
        axios.isCancel(error) ||
        error.name === "CanceledError" ||
        error.message === "canceled"
      ) {
        throw error;
      }
      console.error("Error fetching characters:", error);
      throw error;
    }
  };

  const getMangaSearch = async (params: SearchMangaParams) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.query) queryParams.append("q", params.query);
      if (params.type) queryParams.append("type", params.type);
      if (params.status) queryParams.append("status", params.status);
      if (params.orderBy) queryParams.append("order_by", params.orderBy);
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.startDate) queryParams.append("start_date", params.startDate);
      if (params.sfw !== undefined)
        queryParams.append("sfw", params.sfw.toString());

      const response = await axios.get(
        `https://api.jikan.moe/v4/manga?${queryParams.toString()}`,
        { signal: params.signal },
      );
      return response.data;
    } catch (error: any) {
      if (
        axios.isCancel(error) ||
        error.name === "CanceledError" ||
        error.message === "canceled"
      ) {
        throw error;
      }
      console.error("Error fetching manga data:", error);
      throw error;
    }
  };

  const getMangaById = async (id: string) => {
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/manga/${id}/full`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching manga data:", error);
      throw error;
    }
  };

  const getMangaCharacters = async (id: string) => {
    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/manga/${id}/characters`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching manga characters:", error);
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
    searchCharacters,
    getMangaSearch,
    getMangaById,
    getMangaCharacters,
  };
}
