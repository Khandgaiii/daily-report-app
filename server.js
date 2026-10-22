require("dotenv").config();

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

/*
=================================
一覧取得
=================================
*/
app.get("/api/reports", async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const from = req.query.from || "";
        const to = req.query.to || "";
        const userName = req.query.userName || "";

        const page = Number(req.query.page) || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const whereClause = {};

        if (keyword) {
            whereClause.title = {
                contains: keyword,
                mode: "insensitive"
            };
        }

        if (userName) {
            whereClause.userName = {
                contains: userName,
                mode: "insensitive"
            };
        }

        if (from || to) {
            whereClause.reportDate = {};

            if (from) {
                whereClause.reportDate.gte = new Date(from);
            }

            if (to) {
                whereClause.reportDate.lte = new Date(to);
            }
        }

        const totalCount = await prisma.report.count({
            where: whereClause
        });

        const reports = await prisma.report.findMany({
            where: whereClause,
            orderBy: {
                reportDate: "desc"
            },
            skip,
            take: pageSize
        });

        res.json({
            reports,
            totalCount,
            currentPage: page,
            pageSize
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "一覧取得失敗"
        });
    }
});

/*
=================================
詳細取得
=================================
*/
app.get("/api/reports/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const report = await prisma.report.findUnique({
            where: {
                id
            }
        });

        if (!report) {
            return res.status(404).json({
                message: "日報が見つかりません"
            });
        }

        res.json(report);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "取得失敗"
        });
    }
});

/*
=================================
登録
=================================
*/
app.post("/api/reports", async (req, res) => {
    try {
        const {
            reportDate,
            userName,
            title,
            content,
            hours,
            status
        } = req.body;

        const duplicate = await prisma.report.findFirst({
            where: {
                reportDate: new Date(reportDate),
                userName,
                title
            }
        });

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "同じ日付・担当者・件名の日報は既に存在します"
            });
        }

        const report = await prisma.report.create({
            data: {
                userName,
                reportDate: new Date(reportDate),
                title,
                content,
                hours,
                status
            }
        });

        res.json({
            success: true,
            report
        });

    } catch (error) {
        console.error(error);

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "同じ日付・担当者・件名の日報は既に存在します"
            });
        }

        res.status(500).json({
            success: false,
            message: "登録失敗"
        });
    }
});

/*
=================================
更新
=================================
*/
app.put("/api/reports/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const {
            reportDate,
            userName,
            title,
            content,
            hours,
            status
        } = req.body;

        const duplicate = await prisma.report.findFirst({
            where: {
                reportDate: new Date(reportDate),
                userName,
                title,
                NOT: {
                    id
                }
            }
        });

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "同じ日付・担当者・件名の日報は既に存在します"
            });
        }

        const report = await prisma.report.update({
            where: {
                id
            },
            data: {
                userName,
                reportDate: new Date(reportDate),
                title,
                content,
                hours,
                status
            }
        });

        res.json({
            success: true,
            report
        });

    } catch (error) {
        console.error(error);

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "同じ日付・担当者・件名の日報は既に存在します"
            });
        }

        res.status(500).json({
            success: false,
            message: "更新失敗"
        });
    }
});

/*
=================================
削除
=================================
*/
app.delete("/api/reports/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.report.delete({
            where: {
                id
            }
        });

        res.json({
            success: true
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "削除失敗"
        });
    }
});
/*
=================================
ダッシュボード
=================================
*/

app.get("/api/dashboard", async (req, res) => {
    try{
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(),now.getMonth(),1);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 6);
        const monthlyCount = await prisma.report.count({
            where: {reportDate:{gte: firstDayOfMonth}}
        });

        const weeklyCount = await prisma.report.count({
            where: {reportDate:{gte:sevenDaysAgo}}
        });

        const recentReports = await prisma.report.findMany({
            orderBy: {reportDate:"desc"},take: 5
        });

        res.json({monthlyCount, weeklyCount, recentReports});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message:"ダッシュボード取得失敗"
        });
    }
});


app.listen(PORT, () => {
    console.log(`サーバー起動: http://localhost:${PORT}`);
});