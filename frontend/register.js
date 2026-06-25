document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await axios.post(
            "http://localhost:5000/api/auth/register",
            { email, password }
        );

        alert("Registration successful! Now you can log in.");
        window.location.href = "login.html";
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Registration failed.");
    }
});