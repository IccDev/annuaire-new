import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import prisma from "@/lib/prisma";
import { format, startOfMonth, subMonths } from "date-fns";
import { fr } from "date-fns/locale";

// Fonction pour vérifier si un utilisateur a une fiche professionnelle
async function hasProFiche(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `http://84.234.16.224:4042/annuaire/query/user_by_email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) return false;

    const result = await response.json();

    // Un utilisateur a une fiche pro s'il existe dans la base SurrealDB
    return result && result.data && result.data.length > 0;
  } catch (error) {
    console.error(
      `Erreur lors de la vérification de la fiche pro pour ${email}:`,
      error
    );
    return false;
  }
}

export async function GET() {
  try {
    const [users, totalUsers, roleStats] = await Promise.all([
      prisma.user.findMany({
        select: {
          name: true,
          email: true,
          emailVerified: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { name: "asc" },
      }),
      prisma.user.count(),
      prisma.user.groupBy({
        by: ["role"],
        _count: { role: true },
      }),
    ]);

    // Vérifier les fiches pro pour chaque utilisateur
    const usersWithProFiche = await Promise.all(
      users.map(async (user) => ({
        ...user,
        hasProfessionalProfile: await hasProFiche(user.email),
      }))
    );

    const usersWithFiche = usersWithProFiche.filter(
      (u) => u.hasProfessionalProfile
    ).length;
    const last30DaysUsers = usersWithProFiche.filter(
      (u) =>
        new Date(u.createdAt) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    // Calculer la croissance par mois (6 derniers mois)
    const monthlyData: Array<{
      month: string;
      newUsers: number;
      cumulative: number;
    }> = [];
    let cumulativeCount = 0;

    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = startOfMonth(subMonths(new Date(), i - 1));

      const count = usersWithProFiche.filter((u) => {
        const created = new Date(u.createdAt);
        return created >= monthStart && created < monthEnd;
      }).length;

      cumulativeCount += count;
      monthlyData.push({
        month: format(monthStart, "MMM yyyy", { locale: fr }),
        newUsers: count,
        cumulative: cumulativeCount,
      });
    }

    // Créer le classeur Excel
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Annuaire des compétences d'ICC";
    workbook.created = new Date();
    workbook.modified = new Date();

    // ===== FEUILLE 1: VUE D'ENSEMBLE =====
    const overviewSheet = workbook.addWorksheet("Vue d'ensemble", {
      views: [{ state: "frozen", xSplit: 0, ySplit: 3 }],
    });

    // Titre principal
    overviewSheet.mergeCells("A1:E1");
    const titleCell = overviewSheet.getCell("A1");
    titleCell.value = "RAPPORT STATISTIQUES - ANNUAIRE DES COMPETENCES D'ICC";
    titleCell.font = { size: 16, bold: true, color: { argb: "FFFFFFFF" } };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E40AF" },
    };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    overviewSheet.getRow(1).height = 30;

    // Date de génération
    overviewSheet.mergeCells("A2:E2");
    const dateCell = overviewSheet.getCell("A2");
    dateCell.value = `Date de génération: ${format(
      new Date(),
      "dd MMMM yyyy à HH:mm",
      { locale: fr }
    )}`;
    dateCell.font = { size: 10, italic: true };
    dateCell.alignment = { horizontal: "center" };
    overviewSheet.getRow(2).height = 20;

    // Ligne vide
    overviewSheet.addRow([]);

    // Section Statistiques Globales
    overviewSheet.mergeCells("A4:B4");
    const statsTitle = overviewSheet.getCell("A4");
    statsTitle.value = "STATISTIQUES GLOBALES";
    statsTitle.font = { size: 13, bold: true };
    statsTitle.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE5E7EB" },
    };

    const statsHeaders = overviewSheet.addRow(["Indicateur", "Valeur"]);
    statsHeaders.font = { bold: true, color: { argb: "FFFFFFFF" } };
    statsHeaders.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF6B7280" },
    };
    statsHeaders.alignment = { horizontal: "center" };

    const globalStats = [
      ["Total utilisateurs", totalUsers],
      ["Utilisateurs avec fiche pro", usersWithFiche],
      [
        "Taux de complétion fiche pro",
        `${((usersWithFiche / totalUsers) * 100).toFixed(1)}%`,
      ],
      ["Nouveaux utilisateurs (30 jours)", last30DaysUsers],
    ];

    globalStats.forEach(([label, value]) => {
      const row = overviewSheet.addRow([label, value]);
      row.getCell(2).font = { bold: true };
      row.getCell(2).alignment = { horizontal: "center" };
      if (typeof value === "number") {
        row.getCell(2).numFmt = "#,##0";
      }
    });

    // Ligne vide
    overviewSheet.addRow([]);

    // Section Distribution des Rôles
    const roleStartRow = overviewSheet.rowCount + 1;
    overviewSheet.mergeCells(`A${roleStartRow}:C${roleStartRow}`);
    const roleTitle = overviewSheet.getCell(`A${roleStartRow}`);
    roleTitle.value = "DISTRIBUTION DES ROLES";
    roleTitle.font = { size: 13, bold: true };
    roleTitle.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE5E7EB" },
    };

    const roleHeaders = overviewSheet.addRow([
      "Rôle",
      "Nombre",
      "Pourcentage",
    ]);
    roleHeaders.font = { bold: true, color: { argb: "FFFFFFFF" } };
    roleHeaders.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF6B7280" },
    };
    roleHeaders.alignment = { horizontal: "center" };

    const roleDataStartRow = overviewSheet.rowCount + 1;
    roleStats.forEach((stat) => {
      const percentage = ((stat._count.role / totalUsers) * 100).toFixed(1);
      const row = overviewSheet.addRow([
        stat.role,
        stat._count.role,
        `${percentage}%`,
      ]);
      row.getCell(2).numFmt = "#,##0";
      row.getCell(2).alignment = { horizontal: "center" };
      row.getCell(3).alignment = { horizontal: "center" };
    });
    const roleDataEndRow = overviewSheet.rowCount;

    // Formatage des colonnes
    overviewSheet.columns = [{ width: 35 }, { width: 20 }, { width: 15 }];

    // ===== FEUILLE 2: LISTE DES UTILISATEURS =====
    const usersSheet = workbook.addWorksheet("Utilisateurs", {
      views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
    });

    const userHeaders = [
      "Nom complet",
      "Email",
      "Rôle",
      "Fiche pro",
      "Date d'inscription",
      "Dernière mise à jour",
    ];

    const userHeaderRow = usersSheet.addRow(userHeaders);
    userHeaderRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    userHeaderRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E40AF" },
    };
    userHeaderRow.alignment = { vertical: "middle", horizontal: "center" };
    userHeaderRow.height = 25;

    usersWithProFiche.forEach((user) => {
      const row = usersSheet.addRow([
        user.name,
        user.email,
        user.role,
        user.hasProfessionalProfile ? "OUI" : "NON",
        format(new Date(user.createdAt), "dd/MM/yyyy HH:mm", { locale: fr }),
        format(new Date(user.updatedAt), "dd/MM/yyyy HH:mm", { locale: fr }),
      ]);

      // Mise en forme conditionnelle pour la fiche pro
      if (user.hasProfessionalProfile) {
        row.getCell(4).font = { color: { argb: "FF16A34A" }, bold: true };
        row.getCell(4).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF0FDF4" },
        };
      } else {
        row.getCell(4).font = { color: { argb: "FFDC2626" }, bold: true };
        row.getCell(4).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFEF2F2" },
        };
      }

      row.getCell(4).alignment = { horizontal: "center" };
    });

    usersSheet.columns = [
      { width: 30 },
      { width: 35 },
      { width: 12 },
      { width: 12 },
      { width: 20 },
      { width: 20 },
    ];

    usersSheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: usersWithProFiche.length + 1, column: userHeaders.length },
    };

    // ===== FEUILLE 3: EVOLUTION ET CROISSANCE =====
    const growthSheet = workbook.addWorksheet("Evolution", {
      views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
    });

    const growthHeaders = ["Mois", "Nouveaux utilisateurs", "Total cumulé"];
    const growthHeaderRow = growthSheet.addRow(growthHeaders);
    growthHeaderRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    growthHeaderRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E40AF" },
    };
    growthHeaderRow.alignment = { vertical: "middle", horizontal: "center" };
    growthHeaderRow.height = 25;

    const growthDataStartRow = 2;
    monthlyData.forEach((data) => {
      const row = growthSheet.addRow([
        data.month,
        data.newUsers,
        data.cumulative,
      ]);
      row.getCell(2).alignment = { horizontal: "center" };
      row.getCell(3).alignment = { horizontal: "center" };
      row.getCell(2).numFmt = "#,##0";
      row.getCell(3).numFmt = "#,##0";
    });
    const growthDataEndRow = growthSheet.rowCount;

    growthSheet.columns = [{ width: 15 }, { width: 25 }, { width: 25 }];

    // ===== FEUILLE 4: ANALYSE DES ROLES =====
    const roleAnalysisSheet = workbook.addWorksheet("Analyse Rôles", {
      views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
    });

    const roleAnalysisHeaders = [
      "Rôle",
      "Nombre total",
      "Pourcentage",
      "Avec fiche pro",
      "Taux fiche pro",
    ];
    const roleAnalysisHeaderRow =
      roleAnalysisSheet.addRow(roleAnalysisHeaders);
    roleAnalysisHeaderRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    roleAnalysisHeaderRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E40AF" },
    };
    roleAnalysisHeaderRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    roleAnalysisHeaderRow.height = 25;

    roleStats.forEach((stat) => {
      const roleUsers = usersWithProFiche.filter((u) => u.role === stat.role);
      const withProFiche = roleUsers.filter(
        (u) => u.hasProfessionalProfile
      ).length;
      const percentage = ((stat._count.role / totalUsers) * 100).toFixed(1);
      const proFicheRate = ((withProFiche / stat._count.role) * 100).toFixed(
        1
      );

      const row = roleAnalysisSheet.addRow([
        stat.role,
        stat._count.role,
        `${percentage}%`,
        withProFiche,
        `${proFicheRate}%`,
      ]);

      row.getCell(2).numFmt = "#,##0";
      row.getCell(4).numFmt = "#,##0";
      [2, 3, 4, 5].forEach((col) => {
        row.getCell(col).alignment = { horizontal: "center" };
      });
    });

    roleAnalysisSheet.columns = [
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
    ];

    // Générer le buffer
    const buffer = await workbook.xlsx.writeBuffer();

    const filename = `rapport_icc_${format(new Date(), "yyyy-MM-dd_HHmm")}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du rapport Excel:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du rapport" },
      { status: 500 }
    );
  }
}
