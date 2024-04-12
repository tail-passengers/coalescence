import { navigate } from "./navigate.js";
import { fetchUser, fetchLogoutRequest } from "./fetches.js";

export function addLoginEventListener(loginContainer) {
    fetchUser().then((myInfo) => {
        if (myInfo !== false && myInfo.detail === undefined) {
            closeLoginModal(loginContainer);
        }
    });

    const closeLoginModal = (loginContainer) => {
        loginContainer.style.display = "none";
    };
}

export function addNavBarClickListener(navBarContainer) {
    navBarContainer.addEventListener("click", (e) => {
        const target = e.target.closest("a");
        if (!(target instanceof HTMLAnchorElement)) return;

        e.preventDefault();
        const targetURL = target.href.replace(
            `https://${process.env.BASE_IP}`,
            ""
        );
        navigate(targetURL);
    });

    const logoutBtn = navBarContainer.querySelector("#logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            fetchLogoutRequest();
        });
    }
}
window.addEventListener("beforeunload", async (event) => {
    if (!window.refreshing) {
        try {
            await fetch(`https://${process.env.BASE_IP}/api/v1/logout/`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "F5") {
        window.refreshing = true;
    }

    if (event.key === "r" && event.metaKey) {
        window.refreshing = true;
    }
});
