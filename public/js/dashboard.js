async function loadDashboard() {
    try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        document.getElementById("monthlyCount").textContent = data.monthlyCount;
        document.getElementById("weeklyCount").textContent = data.weeklyCount;
        const container = document.getElementById("recentReports");
        
        container.innerHTML = "";
        if (data.recentReports === 0) {
            container.innerHTML = "<p>日報がありません</p>";
            return;
        }

        data.recentReports.forEach(report => {
            container.innerHTML += 
            `<div class="recent-card">
                <strong>${report.title}</strong>
                <br>
                ${new Date(report.reportDate).toLocaleDateString("ja-JP")}
            </div>`;
        });
    }
    catch(error){
        console.error(error);
        document.getElementById("recentReports").innerHTML = `<p>ダッシュボードの取得に失敗しました</p>`;
    }
}

loadDashboard();
