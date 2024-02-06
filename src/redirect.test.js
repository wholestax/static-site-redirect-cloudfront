import { rewrite, handler } from "./redirect";

describe("redirect", () => {
  describe("rewrite", () => {
    it("should add index.html to a directory path", () => {
      expect(rewrite("/path/to/folder")).toBe("/path/to/folder/index.html");
    });

    it("should add index.html to a directory path that ends in a slash", () => {
      expect(rewrite("/path/to/folder/")).toBe("/path/to/folder/index.html");
    });

    it("should not modify the uri if it has a file extension", () => {
      expect(rewrite("/path/to/folder/image.png")).toBe(
        "/path/to/folder/image.png",
      );
    });
  });
  describe("handler", () => {
    let event, callback, request;
    beforeEach(() => {
      request = {
        uri: "/path/to/resource",
      };
      event = {
        Records: [
          {
            cf: {
              request,
            },
          },
        ],
      };
      callback = jest.fn();
    });
    it("should call callback with modified request", () => {
      event.Records[0].cf.request.uri = "/some/resource/path";
      handler(event, null, callback);
      expect(callback).toHaveBeenCalledWith(null, {
        uri: "/some/resource/path/index.html",
      });
    });
  });
});
