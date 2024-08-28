import path from "path";

export const handler = (event, __context, callback) => {
  const request = event.Records[0].cf.request;
  request.uri = rewrite(request.uri);
  return callback(null, request);
};

export const rewrite = (uri) => {
  const parsedPath = path.parse(uri);
  if (parsedPath.ext === "") {
    return path.join(parsedPath.dir, parsedPath.base, "index.html");
  }
  return uri;
};
