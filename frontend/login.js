document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await axios.post(
            "http://localhost:5000/api/auth/login",
            {
                email,
                password
            }
        );

        localStorage.setItem("token", res.data.token);

        alert("Login successful!");

        window.location.href = "index.html";

    } catch (err) {
    console.log(err.response.data);
    alert(err.response.data.message || err.response.data.error);
}
});