let currentPage = 1;

function showFlashMessage() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const flash =
        params.get("flash");

    const box =
        document.getElementById(
            "flashMessage"
        );

    if (!flash || !box) {
        return;
    }

    box.style.display = "block";

    if (flash === "created") {

        box.textContent =
            "✅ 日報を登録しました";

    }

    if (flash === "updated") {

        box.textContent =
            "✅ 日報を更新しました";

    }

    if (flash === "deleted") {

        box.textContent =
            "✅ 日報を削除しました";

    }

}

async function loadReports(page = 1) {

    currentPage = page;

    try {

        const from =
            document
                .getElementById("fromDate")
                .value;

        const to =
            document
                .getElementById("toDate")
                .value;

        const userName =
            document
                .getElementById("userName")
                .value;

        const keyword =
            document
                .getElementById("keyword")
                .value;

        const response =
            await fetch(

                `/api/reports?from=${from}&to=${to}&userName=${encodeURIComponent(userName)}&keyword=${encodeURIComponent(keyword)}&page=${page}`

            );

        if (!response.ok) {

            throw new Error(
                "一覧取得失敗"
            );

        }

        const data =
            await response.json();

        const reports =
            data.reports;

        const table =
            document.getElementById(
                "reportTable"
            );

        table.innerHTML = "";

        if (reports.length === 0) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        style="
                            text-align:center;
                            padding:30px;
                        ">

                        データがありません

                    </td>

                </tr>

            `;

        }

        reports.forEach(report => {

            let statusClass =
                "status-waiting";

            if (
                report.status ===
                "進行中"
            ) {

                statusClass =
                    "status-progress";

            }

            if (
                report.status ===
                "完了"
            ) {

                statusClass =
                    "status-completed";

            }

            table.innerHTML += `

                <tr>

                    <td>

                        ${new Date(
                            report.reportDate
                        ).toLocaleDateString("ja-JP")}

                    </td>

                    <td>

                        ${report.userName}

                    </td>

                    <td>

                        ${report.title}

                    </td>

                    <td>

                        ${report.content}

                    </td>

                    <td>

                        ${report.hours}

                    </td>

                    <td>

                        <span
                            class="${statusClass}">

                            ${report.status}

                        </span>

                    </td>

                    <td>

                        <div class="action-buttons">

                            <button
                                class="btn-primary"
                                onclick="window.location.href='detail.html?id=${report.id}'">

                                詳細

                            </button>

                            <button
                                class="btn-edit"
                                onclick="window.location.href='edit.html?id=${report.id}'">

                                編集

                            </button>

                        </div>

                    </td>

                </tr>

            `;

        });

        renderPagination(

            data.totalCount,

            data.currentPage,

            data.pageSize

        );

    } catch (error) {

        console.error(error);

    }

}

function renderPagination(

    totalCount,

    currentPage,

    pageSize

) {

    const totalPages =
        Math.ceil(
            totalCount /
            pageSize
        );

    const container =
        document.getElementById(
            "pagination"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (totalPages <= 1) {
        return;
    }

    // Previous Button

    if (currentPage > 1) {

        const prevButton =
            document.createElement(
                "button"
            );

        prevButton.innerText =
            "←";

        prevButton.className =
            "page-btn";

        prevButton.onclick =
            () =>
                loadReports(
                    currentPage - 1
                );

        container.appendChild(
            prevButton
        );

    }

    // Page Numbers

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        const button =
            document.createElement(
                "button"
            );

        button.innerText = i;

        button.className =

            i === currentPage

                ? "page-btn active"

                : "page-btn";

        button.onclick =
            () =>
                loadReports(i);

        container.appendChild(
            button
        );

    }

    // Next Button

    if (
        currentPage < totalPages
    ) {

        const nextButton =
            document.createElement(
                "button"
            );

        nextButton.innerText =
            "→";

        nextButton.className =
            "page-btn";

        nextButton.onclick =
            () =>
                loadReports(
                    currentPage + 1
                );

        container.appendChild(
            nextButton
        );

    }

}

function clearFilters() {

    document
        .getElementById("fromDate")
        .value = "";

    document
        .getElementById("toDate")
        .value = "";

    document
        .getElementById("userName")
        .value = "";

    document
        .getElementById("keyword")
        .value = "";

    loadReports(1);

}

showFlashMessage();
loadReports(1);