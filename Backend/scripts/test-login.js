require("dotenv").config();
const http = require("http");

const body = JSON.stringify({
  email: "admin@shopcart.com",
  password: "Admin@123",
});

const req = http.request(
  {
    hostname: "localhost",
    port: process.env.PORT || 8000,
    path: "/auth/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  },
  (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      console.log("Status:", res.statusCode);
      console.log("Body:", data);
      console.log("Set-Cookie:", res.headers["set-cookie"]?.length ?? 0);
      process.exit(res.statusCode === 200 ? 0 : 1);
    });
  }
);

req.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.error("Login request timed out");
  req.destroy();
  process.exit(1);
});

req.write(body);
req.end();
