export const preview2 = (text: string) => {
  return new Response(text, {
    headers: {
      "content-type": "text/html",
    }
  });
};
