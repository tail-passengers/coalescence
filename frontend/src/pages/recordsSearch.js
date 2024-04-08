import { getCurrentLanguage } from "../utils/languageUtils.js";
import locales from "../utils/locales/locales.js";
import { $ } from "../utils/querySelector.js";

function RecordsSearch({ initialState }) {
    this.state = initialState;
    this.$element = document.createElement("div");
    this.$element.className = "content";

    this.setState = (content) => {
        this.state = content;
        this.render();
    };

    const formatDateTime = (isoDateTimeString) => {
        const date = new Date(isoDateTimeString);
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = date.getUTCDate().toString().padStart(2, "0");
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");

        return `${year} ${month} ${day} ${hours}:${minutes}`;
    };

    window.addEventListener("resize", function () {
        const windowWidth = window.innerWidth;
        const fontSize = windowWidth * 0.08;

        document.documentElement.style.setProperty(
            "--font-size",
            `${fontSize}px`
        );
    });

    window.dispatchEvent(new Event("resize"));

    const fetchGameLogs = async () => {
        try {
            const response = await fetch(`${process.env.BASE_IP}/api/v1/general_game_logs/all`);
            const data = await response.json();
            return data;
        } catch {
            console.error("no data");
            return [{
                winner: "Winner",
                loser: "Loser",
                start_time: new Date().toISOString()
            }];
        }
    }

    this.render = async () => {
        const language = getCurrentLanguage();
        const locale = locales[language] || locales.en;

        const gameLogs = await fetchGameLogs();

        const gameElements = gameLogs
            .map(
                (log) => `
          <div class="record-row tp-btn-primary">
              <div class="record-user-box">
                  <div class="record-user-box-section record-win" data-text="WIN">
                      <div class="h2">${log.winner}</div>
                  </div>
                  <img src="/public/assets/img/tmpProfile.png" />
              </div>
              <div class="sized-box">
                  <div class="h2">VS</div>
                  <div class="fs-6 tp-color-primary text-border">${formatDateTime(
                      log.start_time
                  )}</div>
              </div>
              <div class="record-user-box">
                <img src="/public/assets/img/tmpProfile.png" />
                  <div class="record-user-box-section record-lose" data-text="LOSE">
                      <div class="h2">${log.loser}</div>
                  </div>
              </div>
          </div>
          <div class="sized-box"></div>
      `
            )
            .join("");

        this.$element.innerHTML = `
          <div class="content default-container">
              <div class="h1" style="color:white;">${locale.records.mainText}</div>
              <div class="sized-box"></div>
              <div class="record-container">
				${gameElements}
			  </div>
          </div>
      `;
    };

    this.init = () => {
        let parent = $("#app");
        const child = $(".content");
        if (child) {
            parent.removeChild(child);
            parent.appendChild(this.$element);
        }
        let body = $("body");
        const canvas = $("canvas");
        if (canvas) {
            body.removeChild(canvas);
        }
        this.render();
    };

    window.addEventListener("languageChange", () => {
        this.render();
    });
      
    this.init();
}

export default RecordsSearch;
