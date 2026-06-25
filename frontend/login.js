document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // FIXED: Changed from localhost to your absolute live Render backend URL
        const res = await axios.post(
           "http://localhost:5000/api/auth/login" ,
            {
                email,
                password
            }
        );

        localStorage.setItem("token", res.data.token);

        alert("Login successful!");

        window.location.href = "index.html";

    } catch (err) {
        // FIXED: Added a fallback check in case the server is down or network fails completely
        console.error(err);
        if (err.response && err.response.data) {
            alert(err.response.data.message || err.response.data.error);
        } else {
            alert("Something went wrong. Please try again later.");
        }
    }
});