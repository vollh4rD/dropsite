function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function escapeHtml(str) {

    const div =
        document.createElement("div");

    div.innerText = str;

    return div.innerHTML;
}