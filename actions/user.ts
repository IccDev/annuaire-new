"use server";

export async function checkProfessionalProfile(email: string) {
  try {
    const res = await fetch(
      `http://84.234.16.224:4042/annuaire/query/user_by_email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email })
      }
    );

    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    return data.data.length > 0;
  } catch (error) {
    console.error("Error checking professional profile:", error);
    return false;
  }
}