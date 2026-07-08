import React from 'react'

export async function productsAction(id : number) {
  try {
    const res = await fetch(
      `https://yangti.shop/searching/products/${id}/like`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    if (!res.ok) {
      throw new Error("Error");
    }

    const data = await res.json();

    return data;

  } catch(err) {
    console.error(err);
    throw err;
  }
}