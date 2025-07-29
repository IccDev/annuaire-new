"use server";

export async function checkProfessionalProfile(email: string) {
  try {
    const res = await fetch(
      `http://84.234.16.224:4042/annuaire/query/get_user_email/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return res.ok;
  } catch (error) {
    console.error("Error checking professional profile:", error);
    return false;
  }
}