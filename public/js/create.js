const today =
    new Date()
        .toISOString()
        .split("T")[0];

const params =
    new URLSearchParams(
        window.location.search
    );

const copyId =
    params.get("copy");

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        document
            .getElementById("reportDate")
            .max = today;

        document
            .getElementById("reportDate")
            .value = today;

        if (copyId) {

            try {

                const response =
                    await fetch(
                        `/api/reports/${copyId}`
                    );

                if (!response.ok) {
                    throw new Error();
                }

                const report =
                    await response.json();

                document
                    .getElementById("userName")
                    .value =
                    report.userName;

                document
                    .getElementById("title")
                    .value =
                    report.title;

                document
                    .getElementById("content")
                    .value =
                    report.content;

                document
                    .getElementById("hours")
                    .value =
                    report.hours;

                document
                    .getElementById("status")
                    .value =
                    report.status;

            } catch (error) {

                console.error(error);

                alert("複製元の日報読み込みに失敗しました");

            }

        }

    }
);

async function saveReport() {

    const report = {

        reportDate:
            document
                .getElementById("reportDate")
                .value,

        userName:
            document
                .getElementById("userName")
                .value
                .trim(),

        title:
            document
                .getElementById("title")
                .value
                .trim(),

        content:
            document
                .getElementById("content")
                .value
                .trim(),

        hours:
            document
                .getElementById("hours")
                .value,

        status:
            document
                .getElementById("status")
                .value

    };

    const errors = [];

    if (
        report.userName.length < 1 ||
        report.userName.length > 50
    ) {

        errors.push(
            "担当者名は1～50文字で入力してください"
        );

    }

    if (
        report.title.length < 1 ||
        report.title.length > 100
    ) {

        errors.push(
            "件名は1～100文字で入力してください"
        );

    }

    if (
        report.content.length < 1 ||
        report.content.length > 1000
    ) {

        errors.push(
            "作業内容は1～1000文字で入力してください"
        );

    }

    const hours =
        Number(report.hours);

    if (
        isNaN(hours) ||
        hours < 0.5 ||
        hours > 24
    ) {

        errors.push(
            "工数は0.5～24時間で入力してください"
        );

    }

    if (!report.reportDate) {

        errors.push(
            "日付を入力してください"
        );

    }

    const errorBox =
        document.getElementById("errorBox");

    if (errors.length > 0) {

        errorBox.style.display =
            "block";

        errorBox.innerHTML =
            errors.join("<br>");

        return;

    }

    errorBox.style.display =
        "none";

    const response =
        await fetch(
            "/api/reports",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body:
                    JSON.stringify(report)
            }
        );

    if (!response.ok) {
        const errorData =
            await response.json();
            
        errorBox.style.display =
            "block";

        errorBox.innerHTML =
            "登録失敗";

        return;

    }

    window.location.href =
        "index.html?flash=created";

}