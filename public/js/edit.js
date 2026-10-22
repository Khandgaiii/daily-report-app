const params =
    new URLSearchParams(
        window.location.search
    );

const id =
    params.get("id");

const today =
    new Date()
        .toISOString()
        .split("T")[0];

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .getElementById("reportDate")
            .max = today;

        loadReport();

    }
);

async function loadReport() {

    try {

        const response =
            await fetch(
                `/api/reports/${id}`
            );

        if (!response.ok) {

            throw new Error(
                "読込失敗"
            );

        }

        const report =
            await response.json();

        document
            .getElementById("reportDate")
            .value =
            report.reportDate
                .split("T")[0];

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

        showError(
            "日報の読込に失敗しました"
        );

    }

}

function showError(message) {

    const errorBox =
        document.getElementById(
            "errorBox"
        );

    errorBox.style.display =
        "block";

    errorBox.innerHTML =
        message;

}

function clearError() {

    const errorBox =
        document.getElementById(
            "errorBox"
        );

    errorBox.style.display =
        "none";

    errorBox.innerHTML = "";

}

async function updateReport() {

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

    if (!report.reportDate) {

        errors.push(
            "日付を入力してください"
        );

    }

    const selectedDate =
        new Date(
            report.reportDate
        );

    const currentDate =
        new Date(today);

    if (
        selectedDate >
        currentDate
    ) {

        errors.push(
            "未来の日付は入力できません"
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

    const validStatuses = [

        "未着手",
        "進行中",
        "完了"

    ];

    if (
        !validStatuses.includes(
            report.status
        )
    ) {

        errors.push(
            "ステータスが不正です"
        );

    }

    if (errors.length > 0) {

        showError(
            errors.join("<br>")
        );

        return;

    }

    clearError();

    try {

        const response =
            await fetch(

                `/api/reports/${id}`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            report
                        )

                }

            );

        if (!response.ok) {

            throw new Error(
                "更新失敗"
            );

        }

        window.location.href =
            "index.html?flash=updated";

    } catch (error) {

        console.error(error);

        showError(
            "更新に失敗しました"
        );

    }

}

async function deleteReport() {

    const confirmed =
        confirm(
            "この日報を削除しますか？"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(

                `/api/reports/${id}`,

                {
                    method: "DELETE"
                }

            );

        if (!response.ok) {

            throw new Error(
                "削除失敗"
            );

        }

        window.location.href =
            "index.html?flash=deleted";

    } catch (error) {

        console.error(error);

        showError(
            "削除に失敗しました"
        );

    }

}