const button =
    document.getElementById(
        "translateButton"
    );

button.addEventListener(
    "click",
    translate
);

async function translate() {

    const input =
        document.getElementById(
            "input"
        ).value;

    const status =
        document.getElementById(
            "status"
        );

    const result =
        document.getElementById(
            "result"
        );

    result.innerText = "";

    status.innerText =
        "翻訳中...";

    try {

        const response =
            await fetch(
                "https://YOUR-WORKER.workers.dev/translate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        text: input
                    })
                }
            );

        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );
        }

        const data =
            await response.json();

        result.innerText =
            data.translated;

        status.innerText =
            "翻訳完了";

    } catch (error) {

        status.innerText =
            "エラー";

        result.innerText =
            error.message;
    }
}
