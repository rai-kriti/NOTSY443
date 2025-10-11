import fetch from "node-fetch"; // optional in Node 22, native fetch works without this

const url = "https://notsy443.onrender.com/api/auth/send-otp";
const body = { email: "raikriti628@gmail.com" };

try {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  console.log("Response:", data);
} catch (err) {
  console.error("Error:", err);
}
