// function to upsert the announcement bar data in prisma backend
export const upsertDataInBackend = async ({
  dataToSend,
}: {
  dataToSend: any;
}) => {
  try {
    const url = new URL(`PUT_THE_URL_HERE`);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    console.log("API RESPONSE", response.ok);

    if (!response.ok) {
      console.error("API call failed", response);
      throw new Error("API call failed");
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error: any) {
    console.log("JAYANT ERROR 2");

    throw new Error(error);
  }
};
