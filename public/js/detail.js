const params =
    new URLSearchParams(
        window.location.search
    );

const id =
    params.get("id");

async function loadDetail() {

    try {

        const response =
            await fetch(
                `/api/reports/${id}`
            );

        const report =
            await response.json();

        document.getElementById("id")
            .textContent = report.id;

        document.getElementById("reportDate")
            .textContent =
            new Date(
                report.reportDate
            ).toLocaleDateString("ja-JP");

        document.getElementById("userName")
            .textContent =
            report.userName;

        document.getElementById("title")
            .textContent =
            report.title;

        document.getElementById("content")
            .textContent =
            report.content;

        document.getElementById("hours")
            .textContent =
            report.hours;

        document.getElementById("status")
            .textContent =
            report.status;

        document.getElementById("createdAt")
            .textContent =
            new Date(
                report.createdAt
            ).toLocaleString("ja-JP");

        document.getElementById("updatedAt")
            .textContent =
            new Date(
                report.updatedAt
            ).toLocaleString("ja-JP");

    } catch (error) {

        console.error(error);

        alert("読込失敗");

    }

}

function goEdit() {

    window.location.href =
        `edit.html?id=${id}`;

}

function copyReport() {

    window.location.href =
        `create.html?copy=${id}`;

}

loadDetail();