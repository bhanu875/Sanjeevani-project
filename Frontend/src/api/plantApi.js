import axios from "axios";

const API = "http://localhost:5000/api/plants";

/* GET SINGLE PLANT BY ID */
export const getPlantById = async (plantId) => {
  try {
    if (!plantId) {
      throw new Error("Plant ID is required");
    }
    const res = await axios.get(`${API}/${plantId}`);
    return res;
  } catch (error) {
    console.error("Error fetching plant:", error);
    throw error;
  }
};
