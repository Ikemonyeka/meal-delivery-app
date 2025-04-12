const BASE_URL = "http://localhost:5000/users";

export const registerUser = async (userData: any) => {
    const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
    });
    return res.json();
};

export const loginUser = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}?email=${email}&password=${password}`);
    const data = await res.json();
    return data.length ? data[0] : null;
};

export function logoutUser() {
    localStorage.removeItem("user");
}  