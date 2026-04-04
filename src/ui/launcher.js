import { openPanel } from "./panel.js";

const MENU_ITEM_ID = "cc-extension-menu-item";

export async function registerLauncher() {
    const menu = document.getElementById("extensionsMenu");
    if (menu && !document.getElementById(MENU_ITEM_ID)) {
        const item = document.createElement("div");
        item.id = MENU_ITEM_ID;
        item.className = "list-group-item flex-container flexGap5";
        item.title = "Memoir";
        item.innerHTML = `
            <div class="fa-fw fa-solid fa-box-archive extensionsMenuExtensionButton"></div>
            <span>Memoir</span>
        `;
        item.addEventListener("click", () => openPanel());
        menu.appendChild(item);
    }
}
