export const hello = (text: string) => {
  return new Response(text, {
    headers: {
      "content-type": "text/html",
    }
  });
};
