// netlify/functions/preview2.mts
var preview2 = (text) => {
  return new Response(text, {
    headers: {
      "content-type": "text/html"
    }
  });
};
export {
  preview2
};
