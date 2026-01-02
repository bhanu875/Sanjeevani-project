const BASE_URL = "http://localhost:5000/api/auth";

export const signupUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    
    if (!res.ok) {
      return { success: false, message: result.message || "Signup failed" };
    }
    
    return result;
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

export const loginUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    
    if (!res.ok) {
      return { success: false, message: result.message || "Login failed" };
    }
    
    return result;
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};
